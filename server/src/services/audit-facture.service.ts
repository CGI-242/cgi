import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();
const CLAUDE_MODEL = "claude-sonnet-4-20250514";

// --- Types ---

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

// --- Prompt ---

const SYSTEM_PROMPT = `Tu es un auditeur fiscal expert du Code General des Impots du Congo (CGI 2026).
Tu analyses des factures pour verifier leur conformite reglementaire.

REGLES A VERIFIER :

1) LANGUE (Art. 32 CGI) : la facture doit etre redigee en francais.

2) MENTIONS OBLIGATOIRES (Art. 32 CGI) — 12 mentions :
   M1. Date de la facture
   M2. Numero de facture dans une serie continue
   M3. Nom, adresse, NIU et RCCM de l'emetteur
   M4. Regime d'imposition de l'emetteur
   M5. Nom, adresse et NIU du client
   M6. Designation et quantite des biens ou prestations
   M7. Prix unitaire hors taxe
   M8. Taux de TVA applique
   M9. Montant de la TVA
   M10. Montant total TTC
   M11. References bancaires
   M12. Service des impots dont depend l'emetteur

3) TAUX DE TVA (Art. 22 CGI) :
   - Taux general : 18% (toutes operations taxables sauf exceptions)
   - Taux zero : 0% (exportations, transports internationaux, bois debite)
   - Taux reduit : 5% (lait, riz, farine froment, boulangerie, tomate, sucre, sel, zones economiques speciales)
   - Exonerations (Art. 7, Annexe 3) : produits pharmaceutiques, viandes, poisson, huile vegetale, cahiers, livres scolaires, engrais, insecticides, appareils medicaux, etc.

INSTRUCTIONS :
- Examine attentivement la facture fournie (image ou PDF)
- Verifie chaque mention obligatoire
- Verifie le taux de TVA par rapport aux produits/services factures
- Verifie la langue
- Retourne UNIQUEMENT un JSON valide (pas de texte avant/apres) avec cette structure exacte :

{
  "score": { "found": <nombre de mentions presentes>, "total": 12 },
  "langue": { "conforme": true/false, "details": "..." },
  "tva": {
    "conforme": true/false,
    "tauxApplique": "18%" ou null,
    "tauxAttendu": "18%" ou null,
    "details": "..."
  },
  "mentions": [
    { "nom": "Date de facture", "present": true/false, "valeur": "..." },
    { "nom": "Numero de facture", "present": true/false, "valeur": "..." },
    { "nom": "NIU emetteur", "present": true/false, "valeur": "..." },
    { "nom": "RCCM emetteur", "present": true/false, "valeur": "..." },
    { "nom": "Regime imposition", "present": true/false, "valeur": "..." },
    { "nom": "NIU client", "present": true/false, "valeur": "..." },
    { "nom": "Designation et quantite", "present": true/false, "valeur": "..." },
    { "nom": "Prix unitaire HT", "present": true/false, "valeur": "..." },
    { "nom": "Taux TVA", "present": true/false, "valeur": "..." },
    { "nom": "Montant TVA", "present": true/false, "valeur": "..." },
    { "nom": "Total TTC", "present": true/false, "valeur": "..." },
    { "nom": "References bancaires", "present": true/false, "valeur": "..." },
    { "nom": "Service des impots", "present": true/false, "valeur": "..." }
  ],
  "risques": [
    { "type": "amende", "description": "...", "montant": "10 000 FCFA par mention manquante" },
    { "type": "deduction_tva", "description": "..." }
  ],
  "recommandations": ["...", "..."],
  "donneesExtraites": { "emetteur": "...", "client": "...", "montantHT": "...", "montantTVA": "...", "montantTTC": "..." }
}`;

// --- Analyse ---

export async function analyzeInvoice(
  fileBuffer: Buffer,
  mimeType: string
): Promise<AuditFactureResult> {
  const base64 = fileBuffer.toString("base64");

  const isPdf = mimeType === "application/pdf";
  const content: Anthropic.Messages.ContentBlockParam[] = [
    isPdf
      ? {
          type: "document" as const,
          source: { type: "base64" as const, media_type: "application/pdf", data: base64 },
        }
      : {
          type: "image" as const,
          source: {
            type: "base64" as const,
            media_type: mimeType as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
            data: base64,
          },
        },
    { type: "text" as const, text: "Analyse cette facture et retourne le JSON d'audit de conformite." },
  ];

  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Extraire le JSON de la reponse
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Impossible d'extraire le JSON de la reponse IA");
  }

  return JSON.parse(jsonMatch[0]) as AuditFactureResult;
}
