import { z } from 'zod';

export const createManualInvoiceBody = z.object({
  customerName: z.string().min(1, 'Nom du client requis'),
  customerEmail: z.string().email('Email invalide'),
  customerAddress: z.string().optional(),
  customerPhone: z.string().optional(),
  description: z.string().min(1, 'Description requise'),
  plan: z.string().min(1, 'Plan requis'),
  amountHT: z.number().positive('Montant HT doit être positif'),
  userId: z.string().uuid().optional(),
  organizationId: z.string().uuid().optional(),
  periodStart: z.string().datetime().optional(),
  periodEnd: z.string().datetime().optional(),
});

export const updateInvoiceStatusBody = z.object({
  status: z.enum(['DRAFT', 'GENERATED', 'SENT', 'PAID', 'CANCELLED']),
});

export const invoiceListQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['DRAFT', 'GENERATED', 'SENT', 'PAID', 'CANCELLED']).optional(),
  type: z.enum(['AUTOMATIC', 'MANUAL']).optional(),
  search: z.string().optional(),
});

export const invoiceIdParam = z.object({
  invoiceId: z.string().uuid(),
});
