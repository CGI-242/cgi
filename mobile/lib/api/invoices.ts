import { api } from "./client";

export interface Invoice {
  id: string;
  type: "AUTOMATIC" | "MANUAL";
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerAddress?: string | null;
  customerPhone?: string | null;
  description: string;
  plan: string;
  amountHT: string;
  tvaRate: string;
  tvaAmount: string;
  amountTTC: string;
  currency: string;
  status: "DRAFT" | "GENERATED" | "SENT" | "PAID" | "CANCELLED";
  paidAt?: string | null;
  sentAt?: string | null;
  periodStart?: string | null;
  periodEnd?: string | null;
  createdAt: string;
}

export interface InvoiceListResponse {
  invoices: Invoice[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const invoiceApi = {
  /** Liste des factures de l'utilisateur */
  list: async (page = 1, limit = 20): Promise<InvoiceListResponse> => {
    const { data } = await api.get<InvoiceListResponse>("/invoices", {
      params: { page, limit },
    });
    return data;
  },

  /** Détail d'une facture */
  getById: async (invoiceId: string): Promise<Invoice> => {
    const { data } = await api.get<Invoice>(`/invoices/${invoiceId}`);
    return data;
  },

  /** URL de téléchargement du PDF */
  getPdfUrl: (invoiceId: string): string => {
    return `/invoices/${invoiceId}/pdf`;
  },

  /** Télécharger le PDF (retourne un blob) */
  downloadPdf: async (invoiceId: string): Promise<Blob> => {
    const { data } = await api.get(`/invoices/${invoiceId}/pdf`, {
      responseType: "blob",
    });
    return data;
  },
};
