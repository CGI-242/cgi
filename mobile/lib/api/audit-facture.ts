import { api } from "./client";

export type DocumentType = "facture" | "releve_bancaire" | "bon_commande" | "das2" | "note_frais";

export const DOC_TYPE_LABELS: Record<DocumentType, string> = {
  facture: "Facture",
  releve_bancaire: "Relevé bancaire",
  bon_commande: "Bon de commande / Contrat",
  das2: "DAS II",
  note_frais: "Note de frais / Pièce justificative",
};

export interface MentionResult {
  nom: string;
  present: boolean;
  valeur: string | null;
}

export interface AuditFactureResult {
  typeDocument: DocumentType;
  score: { found: number; total: number };
  langue: { conforme: boolean; details: string };
  tva: {
    assujetti: boolean;
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

export async function analyzeDocument(file: Blob, filename: string, type: DocumentType = "facture"): Promise<AuditFactureResult> {
  const formData = new FormData();
  formData.append("file", file, filename);
  formData.append("type", type);
  const { data } = await api.post<AuditFactureResult>("/audit-facture", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60_000,
  });
  return data;
}
