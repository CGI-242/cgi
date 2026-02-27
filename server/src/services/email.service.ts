import nodemailer from 'nodemailer';
import { createLogger } from '../utils/logger';

const logger = createLogger('EmailService');

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || 'CGI-242 <noreply@cgi242.com>';

const isSmtpConfigured = !!(SMTP_HOST && SMTP_USER && SMTP_PASS);

let transporter: nodemailer.Transporter | null = null;

if (isSmtpConfigured) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
  logger.info(`SMTP configuré : ${SMTP_HOST}:${SMTP_PORT}`);
} else {
  logger.warn('SMTP non configuré — les emails seront affichés en console');
}

async function sendMail(to: string, subject: string, html: string): Promise<void> {
  if (transporter) {
    await transporter.sendMail({ from: SMTP_FROM, to, subject, html });
    logger.info(`Email envoyé à ${to} : ${subject}`);
  } else {
    logger.info(`[EMAIL FALLBACK] À: ${to} | Sujet: ${subject}`);
    logger.info(`[EMAIL FALLBACK] Contenu:\n${html}`);
  }
}

export class EmailService {
  static async sendOtp(email: string, otp: string): Promise<void> {
    const subject = 'CGI-242 — Votre code de vérification';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1a56db;">CGI-242 — Intelligence Fiscale</h2>
        <p>Votre code de vérification :</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1a56db;">${otp}</span>
        </div>
        <p style="color: #6b7280; font-size: 14px;">Ce code expire dans 15 minutes. Ne le partagez avec personne.</p>
      </div>
    `;
    await sendMail(email, subject, html);
  }

  static async sendPasswordReset(email: string, code: string): Promise<void> {
    const subject = 'CGI-242 — Réinitialisation de mot de passe';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1a56db;">CGI-242 — Intelligence Fiscale</h2>
        <p>Vous avez demandé une réinitialisation de mot de passe.</p>
        <p>Votre code de réinitialisation :</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1a56db;">${code}</span>
        </div>
        <p style="color: #6b7280; font-size: 14px;">Ce code expire dans 15 minutes. Si vous n'avez pas fait cette demande, ignorez cet email.</p>
      </div>
    `;
    await sendMail(email, subject, html);
  }

  static async sendInvitation(email: string, organizationName: string, inviterName: string): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3004';
    const subject = `CGI-242 — Invitation à rejoindre ${organizationName}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1a56db;">CGI-242 — Intelligence Fiscale</h2>
        <p><strong>${inviterName}</strong> vous invite à rejoindre <strong>${organizationName}</strong> sur CGI-242.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${frontendUrl}/register" style="background: #1a56db; color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: bold;">
            Rejoindre l'équipe
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">Si vous n'attendiez pas cette invitation, ignorez cet email.</p>
      </div>
    `;
    await sendMail(email, subject, html);
  }

  static async sendMfaEnabled(email: string): Promise<void> {
    const subject = 'CGI-242 — Authentification à deux facteurs activée';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1a56db;">CGI-242 — Intelligence Fiscale</h2>
        <p>L'authentification à deux facteurs (2FA) a été activée sur votre compte.</p>
        <p>Vous devrez désormais saisir un code depuis votre application d'authentification lors de chaque connexion.</p>
        <p style="color: #6b7280; font-size: 14px;">Si vous n'avez pas fait cette action, changez immédiatement votre mot de passe.</p>
      </div>
    `;
    await sendMail(email, subject, html);
  }
}
