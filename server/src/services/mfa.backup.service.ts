import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { createLogger } from '../utils/logger';

const logger = createLogger('MFABackup');

const BACKUP_CODE_COUNT = 10;

/**
 * Génère un code au format XXXX-XXXX
 */
function generateCode(): string {
  const bytes = crypto.randomBytes(4);
  const hex = bytes.toString('hex').toUpperCase();
  return `${hex.slice(0, 4)}-${hex.slice(4, 8)}`;
}

export class MFABackupService {
  /**
   * Génère 10 codes de secours, les hashe et les stocke en DB.
   * Retourne les codes en clair (à montrer une seule fois à l'utilisateur).
   */
  static async generateBackupCodes(userId: string): Promise<string[]> {
    const plainCodes: string[] = [];
    const hashedCodes: string[] = [];

    for (let i = 0; i < BACKUP_CODE_COUNT; i++) {
      const code = generateCode();
      plainCodes.push(code);
      hashedCodes.push(await bcrypt.hash(code, 10));
    }

    await prisma.user.update({
      where: { id: userId },
      data: { mfaBackupCodes: hashedCodes },
    });

    logger.info(`${BACKUP_CODE_COUNT} codes de secours générés pour user ${userId}`);
    return plainCodes;
  }

  /**
   * Vérifie un code de secours. Si valide, le consomme (supprime du tableau).
   */
  static async verifyAndConsume(userId: string, code: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { mfaBackupCodes: true },
    });

    if (!user || user.mfaBackupCodes.length === 0) return false;

    // Chercher quel code hashé correspond
    for (let i = 0; i < user.mfaBackupCodes.length; i++) {
      const match = await bcrypt.compare(code.toUpperCase(), user.mfaBackupCodes[i]);
      if (match) {
        // Supprimer le code consommé
        const remaining = [...user.mfaBackupCodes];
        remaining.splice(i, 1);
        await prisma.user.update({
          where: { id: userId },
          data: { mfaBackupCodes: remaining },
        });
        logger.info(`Code de secours consommé pour user ${userId} (${remaining.length} restants)`);
        return true;
      }
    }

    return false;
  }

  /**
   * Retourne le nombre de codes restants
   */
  static async remainingCount(userId: string): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { mfaBackupCodes: true },
    });
    return user?.mfaBackupCodes.length ?? 0;
  }
}
