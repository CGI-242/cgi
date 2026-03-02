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
  /**
   * Template email générique avec le style CGI-242
   */
  private static emailLayout(content: string): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8" /></head>
<body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f5f7; padding: 32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%;">

        <!-- Header -->
        <tr>
          <td style="background-color: #00815d; padding: 24px 32px; text-align: center;">
            <span style="color: #ffffff; font-size: 22px; font-weight: bold; letter-spacing: 1px;">CGI 242</span>
            <br/>
            <span style="color: #ffffffcc; font-size: 12px;">Code Général des Impôts du Congo — Intelligence Fiscale</span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background-color: #ffffff; padding: 32px;">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color: #f9fafb; padding: 20px 32px; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 8px 0; font-size: 11px; color: #9ca3af; font-weight: bold;">POUR VOTRE SÉCURITÉ :</p>
            <p style="margin: 0; font-size: 11px; color: #9ca3af; line-height: 18px;">
              Vérifiez toujours le nom et l'adresse de l'expéditeur des messages avant de les ouvrir.<br/>
              Ne communiquez jamais votre code de vérification à un tiers.<br/>
              CGI 242 ne vous demandera jamais votre mot de passe par email.
            </p>
          </td>
        </tr>

        <!-- Copyright -->
        <tr>
          <td style="padding: 16px 32px; text-align: center;">
            <p style="margin: 0; font-size: 11px; color: #9ca3af;">
              © ${new Date().getFullYear()} CGI 242 — NormX AI · contact@normx-ai.com
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
  }

  static async sendOtp(email: string, otp: string): Promise<void> {
    const subject = 'CGI 242 — Votre code de vérification';
    const html = EmailService.emailLayout(`
      <p style="margin: 0 0 16px 0; font-size: 15px; color: #374151;">Bonjour,</p>

      <p style="margin: 0 0 24px 0; font-size: 15px; color: #374151; line-height: 24px;">
        Pour sécuriser votre connexion à votre espace CGI 242, voici votre code de vérification :
      </p>

      <div style="background-color: #f0fdf4; border: 2px solid #00815d; padding: 24px; text-align: center; margin: 0 0 24px 0;">
        <span style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #00815d;">${otp}</span>
      </div>

      <p style="margin: 0 0 20px 0; font-size: 14px; color: #dc2626; font-weight: 600;">
        ⏱ Attention : ce code est valable pendant 10 minutes.
      </p>

      <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280; line-height: 22px;">
        Si vous n'êtes pas à l'origine de cette connexion, nous vous invitons à :
      </p>
      <ul style="margin: 0 0 24px 0; padding-left: 20px; font-size: 14px; color: #6b7280; line-height: 22px;">
        <li>Changer votre mot de passe immédiatement</li>
        <li>Vérifier l'activité récente de votre compte</li>
      </ul>

      <p style="margin: 0; font-size: 15px; color: #374151; line-height: 24px;">
        À bientôt sur CGI 242,<br/>
        <strong>L'équipe NormX AI</strong>
      </p>
    `);
    await sendMail(email, subject, html);
  }

  static async sendPasswordReset(email: string, code: string): Promise<void> {
    const subject = 'CGI 242 — Réinitialisation de mot de passe';
    const html = EmailService.emailLayout(`
      <p style="margin: 0 0 16px 0; font-size: 15px; color: #374151;">Bonjour,</p>

      <p style="margin: 0 0 24px 0; font-size: 15px; color: #374151; line-height: 24px;">
        Vous avez demandé une réinitialisation de mot de passe pour votre compte CGI 242. Voici votre code :
      </p>

      <div style="background-color: #f0fdf4; border: 2px solid #00815d; padding: 24px; text-align: center; margin: 0 0 24px 0;">
        <span style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #00815d;">${code}</span>
      </div>

      <p style="margin: 0 0 20px 0; font-size: 14px; color: #dc2626; font-weight: 600;">
        ⏱ Attention : ce code est valable pendant 15 minutes.
      </p>

      <p style="margin: 0 0 24px 0; font-size: 14px; color: #6b7280; line-height: 22px;">
        Si vous n'avez pas fait cette demande, ignorez simplement cet email. Votre mot de passe restera inchangé.
      </p>

      <p style="margin: 0; font-size: 15px; color: #374151; line-height: 24px;">
        À bientôt sur CGI 242,<br/>
        <strong>L'équipe NormX AI</strong>
      </p>
    `);
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

  static async sendSubscriptionReminder(
    email: string,
    organizationName: string,
    plan: string,
    expiryDate: string,
    daysLeft: number,
  ): Promise<void> {
    const urgency = daysLeft <= 1 ? '#dc2626' : daysLeft <= 7 ? '#d97706' : '#3b82f6';
    const urgencyLabel = daysLeft === 0 ? "aujourd'hui" : `dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''}`;
    const subject = `CGI-242 — Votre abonnement ${plan} expire ${urgencyLabel}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1a56db;">CGI-242 — Intelligence Fiscale</h2>
        <div style="background: ${urgency}10; border-left: 4px solid ${urgency}; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: ${urgency}; font-weight: bold;">
            Votre abonnement ${plan} pour ${organizationName} expire ${urgencyLabel}.
          </p>
        </div>
        <p>Date d'expiration : <strong>${expiryDate}</strong></p>
        <p>Sans renouvellement, votre organisation sera basculée sur le plan Gratuit avec un accès limité.</p>
        <p>Contactez votre administrateur pour procéder au renouvellement.</p>
        <p style="color: #6b7280; font-size: 14px;">CGI-242 — Code Général des Impôts du Congo</p>
      </div>
    `;
    await sendMail(email, subject, html);
  }

  static async sendFiscalDeadlineReminder(
    email: string,
    deadlines: string[],
  ): Promise<void> {
    const subject = `CGI-242 — Échéances fiscales à venir (${deadlines.length})`;
    const deadlineList = deadlines.map(d => `<li style="padding: 4px 0;">${d}</li>`).join('');
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1a56db;">CGI-242 — Intelligence Fiscale</h2>
        <p>Les échéances fiscales suivantes arrivent dans les <strong>7 prochains jours</strong> :</p>
        <div style="background: #fffbeb; border-left: 4px solid #d97706; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <ul style="margin: 0; padding-left: 20px; color: #374151;">
            ${deadlineList}
          </ul>
        </div>
        <p>Assurez-vous que vos déclarations et paiements sont prêts.</p>
        <p style="color: #6b7280; font-size: 14px;">Consultez l'application CGI-242 pour plus de détails sur les articles correspondants.</p>
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
