import * as OTPAuth from 'otpauth';
import QRCode from 'qrcode';
import crypto from 'crypto';
import prisma from '../utils/prisma';
import { createLogger } from '../utils/logger';
import { MFABackupService } from './mfa.backup.service';

const logger = createLogger('MFAService');

const MFA_ISSUER = 'CGI-242';

if (!process.env.MFA_ENCRYPTION_KEY) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error("FATAL: MFA_ENCRYPTION_KEY est obligatoire en production. Générez-la avec : node -e \"console.log(require('crypto').randomBytes(48).toString('base64url'))\"");
  }
  if (!process.env.JWT_SECRET) {
    throw new Error("FATAL: MFA_ENCRYPTION_KEY ou JWT_SECRET doit être définie.");
  }
  logger.warn("MFA_ENCRYPTION_KEY non définie, fallback sur JWT_SECRET (dev uniquement).");
}
const ENCRYPTION_KEY = process.env.MFA_ENCRYPTION_KEY || process.env.JWT_SECRET!;

/**
 * Chiffrement AES-256-GCM du secret TOTP
 * Format: salt_hex:iv_hex:authTag_hex:encrypted_hex
 */
function encrypt(text: string): string {
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(ENCRYPTION_KEY, salt, 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${salt.toString('hex')}:${iv.toString('hex')}:${authTag}:${encrypted}`;
}

function decrypt(data: string): string {
  const parts = data.split(':');
  let salt: Buffer, ivHex: string, authTagHex: string, encrypted: string;

  if (parts.length === 4) {
    // New format: salt:iv:authTag:encrypted
    salt = Buffer.from(parts[0], 'hex');
    ivHex = parts[1];
    authTagHex = parts[2];
    encrypted = parts[3];
  } else {
    // Legacy format: iv:authTag:encrypted (static salt)
    salt = Buffer.from('salt');
    ivHex = parts[0];
    authTagHex = parts[1];
    encrypted = parts[2];
  }

  const key = crypto.scryptSync(ENCRYPTION_KEY, salt, 32);
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export class MFAService {
  /**
   * Génère un secret TOTP + QR code pour le setup
   */
  static async generateSetup(userId: string): Promise<{ qrCode: string; otpauthUrl: string }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, mfaEnabled: true },
    });

    if (!user) throw new Error('Utilisateur introuvable');
    if (user.mfaEnabled) throw new Error('MFA déjà activé');

    const secret = new OTPAuth.Secret();
    const totp = new OTPAuth.TOTP({
      issuer: MFA_ISSUER,
      label: user.email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret,
    });

    const otpauthUrl = totp.toString();
    const qrCode = await QRCode.toDataURL(otpauthUrl);

    // Stocker le secret chiffré temporairement (pas encore activé)
    await prisma.user.update({
      where: { id: userId },
      data: { mfaSecret: encrypt(secret.base32) },
    });

    logger.info(`MFA setup généré pour user ${userId}`);

    // M2 : ne plus retourner le secret en clair — le QR code suffit pour le setup
    return {
      qrCode,
      otpauthUrl,
    };
  }

  /**
   * Active le MFA après vérification d'un code TOTP
   */
  static async enable(userId: string, code: string): Promise<{ backupCodes: string[] }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { mfaSecret: true, mfaEnabled: true, email: true },
    });

    if (!user) throw new Error('Utilisateur introuvable');
    if (user.mfaEnabled) throw new Error('MFA déjà activé');
    if (!user.mfaSecret) throw new Error('Veuillez d\'abord appeler /api/mfa/setup');

    const secret = decrypt(user.mfaSecret);
    const isValid = this.verifyCode(secret, code);
    if (!isValid) throw new Error('Code TOTP invalide');

    // Générer les codes de secours
    const backupCodes = await MFABackupService.generateBackupCodes(userId);

    await prisma.user.update({
      where: { id: userId },
      data: {
        mfaEnabled: true,
        mfaVerifiedAt: new Date(),
      },
    });

    logger.info(`MFA activé pour user ${userId}`);
    return { backupCodes };
  }

  /**
   * Désactive le MFA (nécessite le mot de passe)
   */
  static async disable(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        mfaEnabled: false,
        mfaSecret: null,
        mfaBackupCodes: [],
        mfaVerifiedAt: null,
      },
    });

    logger.info(`MFA désactivé pour user ${userId}`);
  }

  /**
   * Vérifie un code TOTP pendant le login
   */
  static async verifyLogin(userId: string, code: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { mfaSecret: true, mfaEnabled: true },
    });

    if (!user?.mfaEnabled || !user.mfaSecret) return false;

    const secret = decrypt(user.mfaSecret);

    // D'abord essayer comme code TOTP
    if (this.verifyCode(secret, code)) return true;

    // Sinon essayer comme code de secours
    return MFABackupService.verifyAndConsume(userId, code);
  }

  /**
   * Retourne le statut MFA d'un utilisateur
   */
  static async getStatus(userId: string): Promise<{
    mfaEnabled: boolean;
    mfaVerifiedAt: Date | null;
    backupCodesRemaining: number;
  }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { mfaEnabled: true, mfaVerifiedAt: true, mfaBackupCodes: true },
    });

    if (!user) throw new Error('Utilisateur introuvable');

    return {
      mfaEnabled: user.mfaEnabled,
      mfaVerifiedAt: user.mfaVerifiedAt,
      backupCodesRemaining: user.mfaBackupCodes.length,
    };
  }

  /**
   * Vérifie un code TOTP avec une fenêtre de 1 step
   */
  private static verifyCode(secretBase32: string, code: string): boolean {
    const totp = new OTPAuth.TOTP({
      issuer: MFA_ISSUER,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secretBase32),
    });

    const delta = totp.validate({ token: code, window: 1 });
    return delta !== null;
  }
}
