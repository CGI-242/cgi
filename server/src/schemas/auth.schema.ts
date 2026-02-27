import { z } from 'zod';
import { emailField, passwordField, requiredString } from './common.schema';

export const registerBody = z.object({
  entrepriseNom: requiredString('entrepriseNom'),
  nom: requiredString('nom'),
  prenom: requiredString('prenom'),
  email: emailField,
  password: passwordField,
  telephone: z.string().optional(),
});

export const loginBody = z.object({
  email: emailField,
  password: requiredString('password'),
});

export const verifyOtpBody = z.object({
  email: emailField,
  otp: requiredString('otp'),
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
