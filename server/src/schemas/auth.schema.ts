import { z } from 'zod';
import { emailField, passwordField, requiredString } from './common.schema';

export const registerBody = z.object({
  entrepriseNom: z.string().optional(),
  nom: requiredString('nom'),
  prenom: requiredString('prenom'),
  email: emailField,
  password: passwordField,
  telephone: z.string().optional(),
  invitationToken: z.string().uuid().optional(),
}).refine(
  (data) => data.invitationToken || (data.entrepriseNom && data.entrepriseNom.trim().length > 0),
  { message: 'entrepriseNom est requis sans invitation', path: ['entrepriseNom'] },
);

export const loginBody = z.object({
  email: emailField,
  password: requiredString('password'),
  rememberMe: z.boolean().optional().default(false),
});

export const verifyOtpBody = z.object({
  email: emailField,
  otp: requiredString('otp'),
  rememberMe: z.boolean().optional().default(false),
});

export const sendOtpEmailBody = z.object({
  email: emailField,
});

export const forgotPasswordBody = z.object({
  email: emailField,
});

export const resetPasswordBody = z.object({
  email: emailField,
  code: requiredString('code'),
  newPassword: passwordField,
});

export const refreshTokenBody = z.object({
  refreshToken: z.string().optional(),
});

export const checkEmailBody = z.object({
  email: emailField,
});
