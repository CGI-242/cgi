import { api } from "./client";

export interface MentionResult {
  nom: string;
  present: boolean;
  valeur: string | null;
}

export interface AuditFactureResult {
  score: { found: number; total: number };
  langue: { conforme: boolean; details: string };
  tva: {
    conforme: boolean;
    tauxApplique: string | null;
    tauxAttendu: string | null;
    details: string;
  };
  mentions: MentionResult[];
  risques: { type: string; description: string; montant?: string }[];
  recommandations: string[];
  donneesExtraites: Record<string, string>;
}

export async function analyzeFacture(file: Blob, filename: string): Promise<AuditFactureResult> {
  const formData = new FormData();
  formData.append("file", file, filename);
  const { data } = await api.post<AuditFactureResult>("/audit-facture", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60_000,
  });
  return data;
}
