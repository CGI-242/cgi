// server/src/services/orchestrator/agents.ts
// Agents spécialisés par domaine fiscal — chacun avec son prompt et ses règles RAG

export interface FiscalAgent {
  id: string;
  name: string;
  description: string;
  /** Mots-clés pour le routage rapide */
  keywords: string[];
  /** Patterns regex pour la détection */
  patterns: RegExp[];
  /** Chapitres/tomes prioritaires pour la recherche RAG */
  ragPriority: { tomes?: string[]; chapitres?: string[]; keywords?: string[] };
  /** Instruction supplémentaire injectée dans le prompt système */
  systemInstruction: string;
}

export const FISCAL_AGENTS: FiscalAgent[] = [
  {
    id: 'agent-is',
    name: 'Agent IS',
    description: 'Spécialisé Impôt sur les Sociétés (IS)',
    keywords: ['is', 'impôt sur les sociétés', 'impot sur les societes', 'taux is', 'société', 'societe', 'bénéfice', 'benefice', 'acompte is', '86a', '86b', '86c', 'minimum de perception', 'report déficitaire', 'report deficitaire'],
    patterns: [
      /\b(impot|impôt)\s+(sur\s+les\s+)?soci[eé]t[eé]s?\b/i,
      /\bIS\b(?!\s*[a-z])/,
      /\b(taux|acompte|minimum).*(soci[eé]t[eé]|IS)\b/i,
      /\bart\.?\s*86[A-C]?\b/i,
      /\b(report|d[eé]ficit)\s*(fiscal|d[eé]ficitaire)?\b/i,
    ],
    ragPriority: { tomes: ['1'], chapitres: ['Chapitre 1'], keywords: ['IS', 'sociétés', 'bénéfice'] },
    systemInstruction: `Tu es spécialisé dans l'Impôt sur les Sociétés (IS) — Chapitre 1, Livre 1, Tome 1 du CGI 2026 (Art. 1 à 92K).
Focus sur : Art. 86A (taux), Art. 86B (minimum de perception), Art. 86C (retenue source non-résidents), Art. 3 (exonérations), Art. 75 (report déficitaire 5 ans).
Taux principal : 28%. Taux microfinance/enseignement : 25%. Taux non-résidents CEMAC : 33%.
Minimum de perception (Art. 86B) : se substitue aux anciens acomptes IS. Versé en 4 acomptes trimestriels : 15 mars, 15 juin, 15 septembre, 15 décembre. En fin d'exercice, si l'IS définitif > minimum de perception, l'entreprise paie le solde. Si IS < minimum, le minimum reste acquis au Trésor. Il n'existe pas de système d'acomptes IS séparé.
TOUJOURS citer : "Chapitre 1 (Impôt sur les sociétés), Livre 1, Tome 1" dans la référence.`,
  },
  {
    id: 'agent-its',
    name: 'Agent ITS',
    description: 'Spécialisé Impôt sur les Traitements et Salaires (ITS)',
    keywords: ['its', 'impôt sur les salaires', 'impot sur les salaires', 'traitements et salaires', 'salaire', 'bareme', 'barème', 'retenue', 'employeur', 'avantage en nature'],
    patterns: [
      /\b(impot|impôt)\s+(sur\s+les\s+)?(traitements|salaires)\b/i,
      /\bITS\b/,
      /\bbar[eè]me\b.*\b(its|salaire|impot|impôt)\b/i,
      /\bavantage[s]?\s+en\s+nature\b/i,
      /\bart\.?\s*(115|116)\b/i,
    ],
    ragPriority: { tomes: ['1'], keywords: ['ITS', 'salaires', 'barème', 'retenue'] },
    systemInstruction: `Tu es spécialisé dans l'Impôt sur les Traitements et Salaires (ITS) — Chapitre 2, Section 4, Livre 1, Tome 1 du CGI 2026 (Art. 114 à 116I).
Focus sur : Art. 116G (barème ITS), Art. 116H (retenue), Art. 115 (avantages en nature).
Barème : 0-615 000 = forfait 1 200 ; 615 001-1 500 000 = 10% ; 1 500 001-3 500 000 = 15% ; 3 500 001-5 000 000 = 20% ; >5 000 001 = 30%.
Retenue mensuelle à la source par l'employeur (Art. 116H).
TOUJOURS citer : "Chapitre 2 (Impôts sur les revenus), Section 4 (ITS), Livre 1, Tome 1" dans la référence.`,
  },
  {
    id: 'agent-tva',
    name: 'Agent TVA',
    description: 'Spécialisé Taxe sur la Valeur Ajoutée (TVA)',
    keywords: ['tva', 'taxe sur la valeur ajoutée', 'taxe sur la valeur ajoutee', 'valeur ajoutee', 'exonération tva', 'exoneration tva', 'crédit de tva', 'credit de tva', 'fait générateur'],
    patterns: [
      /\bTVA\b/,
      /\btaxe\s+sur\s+la\s+valeur\s+ajout[eé]e\b/i,
      /\b(fait\s+g[eé]n[eé]rateur|exigibilit[eé])\b/i,
      /\b(cr[eé]dit|remboursement)\s+(de\s+)?TVA\b/i,
    ],
    ragPriority: { tomes: ['2'], chapitres: ['TVA'], keywords: ['TVA', 'valeur ajoutée', 'taxe'] },
    systemInstruction: `Tu es spécialisé dans la Taxe sur la Valeur Ajoutée (TVA) — Textes Fiscaux Non Codifiés (TFNC6) du CGI 2026.
Structure TVA (TFNC6) — 5 chapitres :
- Chapitre 1 : Champ d'application et assujettis (Art. 1-13) ;
- Chapitre 2 : Fait générateur et exigibilité (Art. 14-15) ;
- Chapitre 3 : Base d'imposition et taux (Art. 16-22) ;
- Chapitre 4 : Régime des déductions (Art. 23-29) ;
- Chapitre 5 : Modalités pratiques (Art. 30-40).
TOUJOURS citer : "TFNC6 (TVA), Chapitre X (titre)" dans la référence. Ne PAS dire "Tome 2".`,
  },
  {
    id: 'agent-iba',
    name: 'Agent IBA',
    description: 'Spécialisé Impôt sur les Bénéfices d\'Affaires (IBA)',
    keywords: ['iba', 'bénéfices d\'affaires', 'benefices d affaires', 'forfait', 'regime forfaitaire', 'régime forfaitaire', 'patente'],
    patterns: [
      /\bIBA\b/,
      /\b(impot|impôt)\s+(sur\s+les\s+)?b[eé]n[eé]fices?\s+d.affaires?\b/i,
      /\b(r[eé]gime\s+)?forfaitaire\b/i,
      /\bpatente\b/i,
      /\bart\.?\s*(93|94|95|96|97|98|99|100|101|102)\b/i,
    ],
    ragPriority: { tomes: ['1'], keywords: ['IBA', 'bénéfices', 'forfait', 'patente'] },
    systemInstruction: `Tu es spécialisé dans l'Impôt sur les Bénéfices d'Affaires (IBA) — Chapitre 2, Section 1, Livre 1, Tome 1 du CGI 2026 (Art. 93 à 102).
Focus sur : Art. 95 (taux 30%), Art. 96 (régime forfaitaire). Minimum de perception : 1,5% des produits.
Régime forfaitaire : CA inférieur au seuil TVA (Art. 96). Amortissement linéaire uniquement, report déficitaire 3 ans max.
TOUJOURS citer : "Chapitre 2 (Impôts sur les revenus), Section 1 (IBA), Livre 1, Tome 1" dans la référence.`,
  },
  {
    id: 'agent-ircm',
    name: 'Agent IRCM/IRF',
    description: 'Spécialisé revenus de capitaux mobiliers et revenus fonciers',
    keywords: ['ircm', 'irf', 'capitaux mobiliers', 'revenus fonciers', 'dividendes', 'intérêts', 'interets', 'loyer', 'loyers', 'foncier', 'plus-value'],
    patterns: [
      /\bIRCM\b/,
      /\bIRF\b/,
      /\bcapitaux\s+mobiliers\b/i,
      /\brevenu[s]?\s+fonciers?\b/i,
      /\bdividende[s]?\b/i,
      /\bplus[- ]value[s]?\b/i,
      /\bloyer[s]?\b/i,
    ],
    ragPriority: { tomes: ['1'], keywords: ['IRCM', 'IRF', 'dividendes', 'foncier', 'loyer'] },
    systemInstruction: `Tu es spécialisé dans l'IRCM et l'IRF — Chapitre 2, Livre 1, Tome 1 du CGI 2026.
IRCM (Section 2, Art. 103-110A) : taux 15% (35% revenus occultes). Dividendes, intérêts, plus-values mobilières.
IRF (Section 3, Art. 111-113A) : taux loyers 9%, taux plus-values immobilières 15%. Retenue à la source par locataire (personnes morales).
IMPORTANT : L'IRF est au Chapitre 2 (Impôts sur les revenus), Section 3. Il n'existe PAS de Chapitre 3 dans le Livre 1, Tome 1.
TOUJOURS citer : "Chapitre 2 (Impôts sur les revenus), Section 2 (IRCM) ou Section 3 (IRF), Livre 1, Tome 1" dans la référence.`,
  },
  {
    id: 'agent-conventions',
    name: 'Agent Conventions',
    description: 'Spécialisé conventions fiscales internationales et CEMAC',
    keywords: ['convention', 'cemac', 'double imposition', 'non-résident', 'non-resident', 'international', 'france', 'chine', 'italie', 'maurice', 'rwanda'],
    patterns: [
      /\bconvention[s]?\s+(fiscal|cemac|international)\b/i,
      /\bdouble\s+imposition\b/i,
      /\bnon[- ]?r[eé]sident\b/i,
      /\bCEMAC\b/i,
    ],
    ragPriority: { chapitres: ['convention', 'CEMAC'], keywords: ['convention', 'CEMAC', 'non-résident'] },
    systemInstruction: `Tu es spécialisé dans les conventions fiscales internationales du CGI 2026.
Convention CEMAC (CONV-CEMAC) — 6 chapitres :
- Chapitre 1 : Champ d'application de la convention ;
- Chapitre 2 : Définitions générales ;
- Chapitre 3 : Imposition des revenus ;
- Chapitre 4 : Élimination de la double imposition ;
- Chapitre 5 : Dispositions spéciales ;
- Chapitre 6 : Dispositions finales.
Conventions bilatérales : France, Chine, Italie (6 chapitres + protocole), Maurice (6 chapitres), Rwanda.
Focus : double imposition, retenues à la source, établissement stable, échange de renseignements.
TOUJOURS citer : "Convention CEMAC, Chapitre X" ou "Convention bilatérale Congo-[Pays]" dans la référence.`,
  },
  {
    id: 'agent-enregistrement',
    name: 'Agent Enregistrement/Timbre',
    description: 'Spécialisé droits d\'enregistrement, timbre et taxes indirectes',
    keywords: ['enregistrement', 'timbre', 'droit d\'enregistrement', 'droits d\'enregistrement', 'mutation', 'cession', 'acte notarié', 'acte notarie', 'donation', 'succession', 'taxe foncière', 'taxe fonciere', 'contribution foncière', 'contribution fonciere', 'droit de mutation', 'taxe indirecte'],
    patterns: [
      /\bdroit[s]?\s+(d.)?enregistrement\b/i,
      /\btimbre\s*(fiscal)?\b/i,
      /\b(mutation|cession)\s+(immobili[eè]re|fonds?\s+de\s+commerce)\b/i,
      /\bdonation\b/i,
      /\bsuccession\b/i,
      /\b(taxe|contribution)\s+fonci[eè]re\b/i,
      /\bacte[s]?\s+notari[eé][s]?\b/i,
    ],
    ragPriority: { tomes: ['2'], chapitres: ['enregistrement', 'timbre'], keywords: ['enregistrement', 'timbre', 'mutation', 'donation', 'succession'] },
    systemInstruction: `Tu es spécialisé dans les droits d'enregistrement et le timbre — Tome 2 du CGI 2026.
Structure Tome 2 — 8 livres :
- Livre 1 (Enregistrement) : 16 chapitres — De l'enregistrement, assiette, délais, bureaux, paiement, pénalités, insuffisances, obligations, prescriptions, poursuites, fixation des droits, enregistrement en débit/gratis, taxe assurances, actes hors Congo, prescription, formalité unique ;
- Livre 2 (Timbre) : 6 chapitres — dispositions générales, timbre de dimension, passeports/cartes, visa spécial, effets de commerce, timbre véhicules ;
- Livre 3 (Impôt sur les mutations) : 4 chapitres ;
- Livre 4 (Contribution foncière) : 2 chapitres ;
- Livre 5 (Successions et biens vacants) : 14 chapitres ;
- Livres 6-8 : Taxe kilowatt/heure, droits domaines État.
TOUJOURS citer : "Tome 2, Livre X, Chapitre Y (titre)" dans la référence.`,
  },
  {
    id: 'agent-petrole-mines',
    name: 'Agent Pétrole/Mines',
    description: 'Spécialisé fiscalité pétrolière et minière',
    keywords: ['pétrole', 'petrole', 'minier', 'minière', 'miniere', 'hydrocarbure', 'hydrocarbures', 'gaz', 'exploitation pétrolière', 'exploitation petroliere', 'redevance minière', 'redevance miniere', 'permis minier', 'cpsc', 'partage de production', 'tfnc3'],
    patterns: [
      /\bp[eé]trol(e|ier|i[eè]re)\b/i,
      /\bhydrocarbure[s]?\b/i,
      /\b(exploitation|fiscalit[eé])\s+(mini[eè]re|p[eé]troli[eè]re)\b/i,
      /\bredevance\s+(mini[eè]re|p[eé]troli[eè]re)\b/i,
      /\bpartage\s+de\s+production\b/i,
      /\bpermis\s+minier\b/i,
      /\btfnc3\b/i,
      /\b(gaz\s+naturel|forage|exploration)\b/i,
    ],
    ragPriority: { tomes: ['3'], chapitres: ['tfnc3', 'pétrole', 'mines'], keywords: ['pétrole', 'minier', 'hydrocarbure', 'redevance', 'production'] },
    systemInstruction: `Tu es spécialisé dans la fiscalité pétrolière et minière — Textes Fiscaux Non Codifiés (TFNC3) du CGI 2026.
Structure TFNC3 (Pétrole) — 7 chapitres :
- Chapitre 1 : Dispositions générales ;
- Chapitre 2 : Bonus et redevances ;
- Chapitre 3 : Contributions spécifiques ;
- Chapitre 4 : Fiscalité de droit commun ;
- Chapitre 5 : Autres impôts et retenues ;
- Chapitre 6 : Exonérations et coûts pétroliers ;
- Chapitre 7 : Dispositions finales.
Fiscalité minière (TFNC3-MINES, titre 3.5) : redevance minière proportionnelle, permis minier, régimes dérogatoires.
TOUJOURS citer : "TFNC3 (Pétrole), Chapitre X" ou "TFNC3-MINES (Fiscalité minière)" dans la référence.`,
  },
  {
    id: 'agent-procedures',
    name: 'Agent Procédures',
    description: 'Spécialisé procédures fiscales, recouvrement et contentieux',
    keywords: ['procédure', 'procedure', 'recouvrement', 'contentieux', 'réclamation', 'reclamation', 'contrôle fiscal', 'controle fiscal', 'vérification', 'verification', 'redressement', 'sursis', 'avis de mise en recouvrement', 'droit de communication', 'notification', 'mise en demeure', 'saisie', 'opposition', 'garanties contribuable'],
    patterns: [
      /\b(proc[eé]dure|contentieux)\s+fiscal[e]?\b/i,
      /\brecouvrement\b/i,
      /\br[eé]clamation\b/i,
      /\b(contr[oô]le|v[eé]rification)\s+fiscal[e]?\b/i,
      /\bredressement\b/i,
      /\bavis\s+de\s+mise\s+en\s+recouvrement\b/i,
      /\bsursis\s+de\s+paiement\b/i,
      /\bdroit\s+de\s+communication\b/i,
      /\bmise\s+en\s+demeure\b/i,
    ],
    ragPriority: { tomes: ['1'], chapitres: ['Partie 2', 'procédures', 'recouvrement', 'contentieux'], keywords: ['procédure', 'recouvrement', 'contrôle', 'vérification', 'contentieux'] },
    systemInstruction: `Tu es spécialisé dans les procédures fiscales — Tome 1, Partie 2 du CGI 2026.
Couvre : contrôle fiscal, droit de communication, vérification de comptabilité, notification de redressement, avis de mise en recouvrement, recouvrement forcé (saisie, opposition), contentieux fiscal (réclamation préalable, commission de recours, tribunal administratif), sursis de paiement, garanties du contribuable.
Note : les sanctions et pénalités (Parties 3 et 4) sont gérées par l'Agent Sanctions dédié.
TOUJOURS citer : "Tome 1, Partie 2, Titre X, Chapitre Y" dans la référence.`,
  },
  {
    id: 'agent-douanes',
    name: 'Agent Douanes/Commerce',
    description: 'Spécialisé droits de douane et fiscalité du commerce extérieur',
    keywords: ['douane', 'douanes', 'droit de douane', 'importation', 'exportation', 'tarif douanier', 'tarif extérieur commun', 'tec', 'valeur en douane', 'transit', 'entrepôt', 'entrepot', 'zone franche', 'franchise douanière', 'franchise douaniere'],
    patterns: [
      /\bdouane[s]?\b/i,
      /\b(droit[s]?\s+de\s+)?douane\b/i,
      /\b(import|export)(ation)?\b/i,
      /\btarif\s+(douanier|ext[eé]rieur\s+commun)\b/i,
      /\bTEC\b/,
      /\bvaleur\s+en\s+douane\b/i,
      /\bzone[s]?\s+franche[s]?\b/i,
      /\bfranchise\s+douani[eè]re\b/i,
    ],
    ragPriority: { tomes: ['2'], chapitres: ['douane', 'commerce'], keywords: ['douane', 'importation', 'exportation', 'tarif', 'TEC'] },
    systemInstruction: `Tu es spécialisé dans les droits de douane et la fiscalité du commerce extérieur — Textes Fiscaux Non Codifiés (TFNC-DOUANES) du CGI 2026.
Source : Dispositions douanières de la Loi de Finances 2026.
Couvre : Tarif Extérieur Commun CEMAC (TEC), droits d'importation, droits d'accises (TFNC4-ACCISES, titre 4.3), régimes économiques (transit, entrepôt, admission temporaire), zones franches, exonérations.
Focus : catégories tarifaires CEMAC (0%, 5%, 10%, 20%, 30%), valeur en douane, règles d'origine, régimes suspensifs.
TOUJOURS citer : "TFNC-DOUANES (Dispositions douanières LF 2026)" ou "TFNC4-ACCISES (Droits d'accises)" dans la référence.`,
  },
  {
    id: 'agent-taxes-speciales',
    name: 'Agent Taxes Spéciales',
    description: 'Spécialisé taxes spéciales, communales et contributions diverses',
    keywords: ['taxe spéciale', 'taxe speciale', 'taxe communale', 'contribution', 'redevance audiovisuelle', 'redevance informatique', 'taxe sur les jeux', 'taxe de séjour', 'taxe de sejour', 'taxe d\'habitation', 'centimes additionnels', 'taxe sur les spectacles', 'taxe sur la publicité', 'taxe sur la publicite'],
    patterns: [
      /\btaxe[s]?\s+(sp[eé]ciale|communale|locale)\b/i,
      /\btaxe\s+(de\s+s[eé]jour|d.habitation|sur\s+les\s+jeux)\b/i,
      /\bredevance\s+(audiovisuelle|informatique)\b/i,
      /\bcentimes\s+additionnels\b/i,
      /\btaxe\s+sur\s+(les\s+spectacles|la\s+publicit[eé])\b/i,
      /\bcontribution[s]?\s+(sp[eé]ciale|diverse)\b/i,
    ],
    ragPriority: { tomes: ['2', '3'], chapitres: ['taxes spéciales', 'communal'], keywords: ['taxe spéciale', 'communale', 'redevance', 'contribution'] },
    systemInstruction: `Tu es spécialisé dans les taxes spéciales et contributions diverses — TFNC4 (Impôts, taxes et retenues divers) du CGI 2026.
Structure TFNC4 :
- 4.1 : ASDI (Aide sociale à la distribution de l'eau) ;
- 4.2 : CAMU (Couverture assurance maladie universelle) ;
- 4.3 : Droits d'accises et taxes assimilées ;
- 4.4 : Droits fonciers exceptionnels ;
- 4.5 : Impôt forfaitaire sur les pylônes télécom ;
- 4.6 : Impôt global forfaitaire (IGF) ;
- 4.7 : Redevance audiovisuelle et d'électrification rurale ;
- 4.9 : Taxe d'abonnement télévisuelle ;
- 4.10 : Taxe d'occupation des locaux ;
- 4.11 : Taxe sur le trafic des communications électroniques ;
- 4.12 : Taxe sur les billets d'avion internationaux ;
- 4.13 : Taxe sur les jeux de hasard ;
- 4.14 : Taxe sur les transferts de fonds ;
- 4.15 : Taxe unique sur les salaires ;
- 4.16 : Taxe sur les emballages non récupérables ;
- 4.17 : Taxe sur les terminaux numériques à carte SIM ;
- 4.18 : Redevance de crédits carbone (RCC) ;
- 4.19 : Taxe sur les activités polluantes.
TOUJOURS citer : "TFNC4 (titre X.Y — nom de la taxe)" dans la référence.`,
  },
  {
    id: 'agent-sanctions',
    name: 'Agent Sanctions',
    description: 'Spécialisé sanctions fiscales, pénalités, amendes et sanctions pénales',
    keywords: ['sanction', 'sanctions', 'pénalité', 'penalite', 'pénalités', 'penalites', 'amende', 'amendes', 'majoration', 'majorations', 'intérêt de retard', 'interet de retard', 'retard déclaration', 'retard declaration', 'défaut déclaration', 'defaut declaration', 'fraude fiscale', 'mauvaise foi', 'bonne foi', 'manoeuvres frauduleuses', 'taxation d\'office', 'insuffisance', 'omission', 'infraction', 'sanctions pénales', 'sanctions penales', 'emprisonnement', 'prison', 'quitus fiscal'],
    patterns: [
      /\b(sanction|p[eé]nalit[eé]|amende|majoration)[s]?\s*(fiscal|fiscale|de\s+retard)?\b/i,
      /\b(d[eé]faut|retard|absence)\s+(de\s+)?d[eé]claration\b/i,
      /\bint[eé]r[eê]t[s]?\s+de\s+retard\b/i,
      /\b(fraude|mauvaise\s+foi|man[oœ]uvres?\s+frauduleuse)\b/i,
      /\btaxation\s+d.office\b/i,
      /\b(insuffisance|omission|inexactitude)\s+(d[eé]clarative|fiscale)?\b/i,
      /\bart\.?\s*(37[2-9]|38[0-9]|39[0-9]|4[0-6][0-9]|5[12][0-6])\b/i,
      /\b(100|50|200)\s*%\s*(majoration|p[eé]nalit[eé])\b/i,
      /\bvente[s]?\s+sans\s+facture\b/i,
      /\b(prescription|r[eé]clamation)\s*(fiscal[e]?)?\b/i,
    ],
    ragPriority: { tomes: ['1'], chapitres: ['Partie 3', 'Partie 4', 'sanctions', 'pénalités'], keywords: ['sanction', 'pénalité', 'amende', 'majoration', 'fraude', 'infraction'] },
    systemInstruction: `Tu es spécialisé dans les sanctions et pénalités fiscales — Tome 1, Parties 3 et 4 du CGI 2026 (Art. 372 à 526).

PARTIE 3 — SANCTIONS ADMINISTRATIVES (Art. 372-520E) :

Titre 1 — Sanctions pour infractions déclaratives (Art. 372-381 quinquies) :
- Art. 372 : Taxation d'office → majoration 100%
- Art. 373 : Non-production déclaration → majoration 50% ; retard → 15 000 F/jour (max 500 000 F) ; aucun droit dû → amende 500 000 F
- Art. 373 : TVA/accises retard → intérêt 5%/mois ou pénalité 15%/mois (max 50%)
- Art. 373 bis : Non-respect conventions → perte avantages + amende 500 000 F ou 10 000 000 F
- Art. 373 ter : Documents en langue étrangère → amende 2 000 000 F/document
- Art. 374 : Inexactitude bonne foi → 50% ; mauvaise foi → 100% ; TVA fraude → 200%
- Art. 374 : Ventes sans facture TVA → 2x droits (récidive 4x) ; factures incorrectes → 200%
- Art. 374 ter : Déclaration spontanée → intérêt 0,5%/jour (max 20%)
- Art. 376 : Revenus étrangers dissimulés → 100% + sanctions pénales Art. 521
- Art. 377 : Défaut renseignements → 100 000 F/omission
- Art. 378 : Défaut déclaration d'existence → 200 000 F
- Art. 379 : Infractions documentaires → perte droit déduction + 200 000 F + 100%
- Art. 381 bis : Défaut justification taxe véhicules → 100%

Titre 2 — Émission des rôles et recouvrement (Art. 407-421)
Titre 3 — Contentieux fiscal (Art. 422-458 bis) : réclamation, transaction (Art. 422 bis), recours hiérarchique 30j (Art. 422 ter)
Titre 4 — Dispositions générales recouvrement (Art. 459-520E) : droit de communication, quitus fiscal

PARTIE 4 — SANCTIONS PÉNALES (Art. 521-526) :
- Art. 521 : Avoirs étrangers dissimulés → amende = moitié avoir + affichage nom
- Art. 521 bis : Utilisation frauduleuse NIU → 500 000 à 10 000 000 F + 3 mois à 3 ans prison
- Art. 522 : Fraude fiscale → 250 000 à 5 000 000 F + 2 à 5 ans prison + publication jugement
- Art. 523-524 : Déclarations inexactes stocks, écritures fictives → peines Art. 522
- Art. 525 : Dirigeants personnes morales → responsables (PDG, DG, gérant)
- Art. 526 : Contravention droit de communication → peines Art. 522-525

Prescription : 4 ans (droit commun), 6 ans (fraude — Art. 382).
TOUJOURS citer : "Tome 1, Partie 3, Titre X, Art. Y" ou "Tome 1, Partie 4, Art. Y" dans la référence.`,
  },
  {
    id: 'agent-incitations',
    name: 'Agent Incitations/Exonérations',
    description: 'Spécialisé régimes incitatifs, exonérations fiscales, zones économiques spéciales',
    keywords: ['exonération', 'exoneration', 'exonérations', 'exonerations', 'incitation', 'incitations', 'zone franche', 'zone économique spéciale', 'zone economique speciale', 'zes', 'convention d\'investissement', 'agrément', 'agrement', 'régime privilégié', 'regime privilegie', 'entreprise nouvelle', 'startup', 'crédit d\'impôt', 'credit d impot', 'avantage fiscal', 'avantages fiscaux', 'code des investissements', 'exonéré', 'exonere'],
    patterns: [
      /\bexon[eé]ration[s]?\b/i,
      /\bincitation[s]?\s+fiscal[es]?\b/i,
      /\bzone[s]?\s+([eé]conomique[s]?\s+sp[eé]ciale[s]?|franche[s]?)\b/i,
      /\bZES\b/,
      /\bconvention\s+d.investissement\b/i,
      /\bagr[eé]ment\s+(fiscal|investissement)\b/i,
      /\br[eé]gime\s+privil[eé]gi[eé]\b/i,
      /\bentreprise[s]?\s+nouvelle[s]?\b/i,
      /\bcr[eé]dit\s+d.imp[oô]t\b/i,
      /\bcode\s+des\s+investissements\b/i,
    ],
    ragPriority: { tomes: ['1', '2'], keywords: ['exonération', 'incitation', 'zone franche', 'agrément', 'investissement', 'crédit d\'impôt'] },
    systemInstruction: `Tu es spécialisé dans les incitations fiscales et exonérations — domaine transversal du CGI 2026.

EXONÉRATIONS IS (Chapitre 1, Livre 1, Tome 1) :
- Art. 3 : Exonérations permanentes (BEAC, BDEAC, coopératives agricoles, associations sans but lucratif, collectivités locales, GIE, sociétés civiles professionnelles, centres de gestion agréés, entreprises agricoles) ;
- Art. 3A : Crédit d'impôt investissement (max 15%, reportable 5 ans, non remboursable) ;
- Art. 3B-3H : Régimes spéciaux entreprises nouvelles, zones franches, zones économiques spéciales ;
- IMPORTANT : À compter du 1er janvier 2026, les exonérations conventionnelles d'IS ne peuvent être octroyées ni renouvelées (Art. 3).

EXONÉRATIONS IS — CHAPITRE SPÉCIAL :
- Art. 107-A : Personnes morales exonérées (coopératives, GIE, BEAC).

EXONÉRATIONS ITS (Chapitre 2, Section 4) :
- Art. 114A-114D : Agents diplomatiques, organisations internationales.

EXONÉRATIONS TVA (TFNC6) :
- Art. 5-13 : Produits de première nécessité, médicaments, exportations, opérations bancaires.

CODE DES INVESTISSEMENTS (TFNC5) :
- Conventions d'établissement, régimes privilégiés, avantages fiscaux.

TOUJOURS citer la source précise de l'exonération (Tome, Chapitre, Article).`,
  },
  {
    id: 'agent-immobilier',
    name: 'Agent Fiscalité Immobilière',
    description: 'Spécialisé fiscalité immobilière complète (acquisition, détention, cession, location)',
    keywords: ['immobilier', 'immobilière', 'immobiliere', 'terrain', 'immeuble', 'propriété', 'propriete', 'propriétaire', 'proprietaire', 'locataire', 'bail immobilier', 'mutation immobilière', 'mutation immobiliere', 'contribution foncière', 'contribution fonciere', 'cfpb', 'cfpnb', 'plus-value immobilière', 'plus-value immobiliere', 'promotion immobilière', 'promotion immobiliere', 'taxe foncière', 'taxe fonciere', 'droit de mutation'],
    patterns: [
      /\b(fiscalit[eé]|taxe[s]?|imp[oô]t[s]?)\s+immobili[eè]re?s?\b/i,
      /\bmutation[s]?\s+immobili[eè]re?s?\b/i,
      /\bcontribution\s+fonci[eè]re\b/i,
      /\bCFPB\b/,
      /\bCFPNB\b/,
      /\bplus[- ]value[s]?\s+immobili[eè]re?s?\b/i,
      /\bpromotion\s+immobili[eè]re\b/i,
      /\b(achat|vente|cession)\s+(d['\s]?)?(un\s+)?(terrain|immeuble|propri[eé]t[eé])\b/i,
    ],
    ragPriority: { tomes: ['1', '2'], keywords: ['immobilier', 'foncier', 'mutation', 'loyer', 'CFPB', 'CFPNB', 'propriété'] },
    systemInstruction: `Tu es spécialisé dans la fiscalité immobilière — domaine transversal du CGI 2026.

Le cycle fiscal immobilier couvre 4 phases :

1. ACQUISITION — Droits d'enregistrement (Tome 2, Livre 1) :
- Art. 263 : Mutations immobilières = 8% (droit commun) ;
- Art. 261-262 : Mutations avec immatriculation = 2% (urbain/rural) ou 3% (centre-ville) ;
- Centimes additionnels : 5% des droits (Art. 216 bis).

2. DÉTENTION — Contribution foncière (Tome 2, Livre 4) :
- CFPB (Art. 257-262) : Propriétés bâties. Abattement 75% sur valeur locative. Taux communal max 20% ;
- CFPNB urbain (Art. 270-275) : Abattement 50%. Prix/m² par zone (125/75/12,5/6,25 F). Taux max 40% ;
- CFPNB rural (Art. 272) : Forfait/ha par culture (2000/1000/600/500 F). Taux max 40%.

3. LOCATION — IRF (Tome 1, Chapitre 2, Section 3) :
- Art. 111-113A : Loyers bruts taxés à 9% ;
- Retenue à la source par locataires personnes morales (IS, IBA, État) ;
- Personnes physiques : déclaration 15 mai, paiement 3 échéances (15 mai, 20 août, 15 novembre).

4. CESSION — Plus-values :
- Plus-values immobilières (Art. 111 IRF) : 15% ;
- TVA sur opérations immobilières (TFNC6) si professionnel.

TOUJOURS préciser la phase du cycle immobilier et citer : "Tome X, Livre Y, Chapitre Z, Art. W" dans la référence.`,
  },
  {
    id: 'agent-prix-transfert',
    name: 'Agent Prix de Transfert',
    description: 'Spécialisé transactions intragroupe, documentation, méthodes de prix de transfert',
    keywords: ['prix de transfert', 'transfer pricing', 'entreprises liées', 'entreprises liees', 'parties liées', 'parties liees', 'pleine concurrence', 'documentation', 'cbcr', 'pays par pays', 'méthode comparable', 'methode comparable', 'pcml', 'prm', 'mtmn', 'accord préalable', 'accord prealable', 'app', 'benchmark', 'intragroupe'],
    patterns: [
      /\bprix\s+de\s+transfert\b/i,
      /\btransfer\s+pricing\b/i,
      /\b(entreprises?|parties?)\s+li[eé]e?s?\b/i,
      /\bpleine\s+concurrence\b/i,
      /\bCBCR\b/,
      /\bpays\s+par\s+pays\b/i,
      /\b(PCML|PRM|MTMN|TNMM)\b/,
      /\baccord\s+pr[eé]alable\s+de\s+prix\b/i,
      /\bart\.?\s*(75|76|77|78|79|80|81|82)[A-H]?\b/i,
      /\bdocumentation\s+(prix\s+de\s+transfert|obligatoire)\b/i,
    ],
    ragPriority: { tomes: ['1'], chapitres: ['Chapitre 1'], keywords: ['prix de transfert', 'entreprises liées', 'pleine concurrence', 'CBCR', 'documentation'] },
    systemInstruction: `Tu es spécialisé dans les prix de transfert — Chapitre 1, Livre 1, Tome 1 du CGI 2026 (Art. 75 à 82H).

PRINCIPES ET DÉFINITIONS (Art. 75-75C) :
- Art. 75 : Principe de pleine concurrence (arm's length) pour transactions entre entreprises liées ;
- Art. 75A : Définition des entreprises liées (participation directe/indirecte, contrôle de fait) ;
- Art. 75B-75C : Bénéfices transférés à l'étranger — réintégration.

DOCUMENTATION OBLIGATOIRE (Art. 76-76B) :
- Seuil : 500 millions FCFA de CA ou d'actif brut ;
- Contenu : analyse fonctionnelle, description transactions, méthode retenue, comparables ;
- Délai : mise à disposition dans les 15 jours d'une demande de l'administration.

MÉTHODES (Art. 77) :
- PCML : Prix Comparable sur le Marché Libre ;
- PRM : Prix de Revente Minoré ;
- MTMN : Méthode Transactionnelle de la Marge Nette (TNMM) ;
- Partage de bénéfices ;
- Le contribuable choisit la méthode la plus appropriée.

ACCORD PRÉALABLE DE PRIX — APP (Art. 78) :
- Demande unilatérale ou bilatérale ;
- Durée maximale : 5 exercices ;
- L'administration peut le révoquer si les conditions changent.

SANCTIONS SPÉCIFIQUES (Art. 79-81) :
- Non-production documentation : 5 000 000 FCFA par exercice ;
- Insuffisance documentation : 10 000 000 FCFA ;
- Défaut CBCR : 25 000 000 FCFA.

DÉCLARATION PAYS PAR PAYS — CBCR (Art. 82-82H) :
- Seuil groupe : 49,19 milliards FCFA de CA consolidé ;
- Dépôt : 12 mois après clôture exercice ;
- Contenu : revenus, bénéfices, impôts payés, effectifs par juridiction.

TOUJOURS citer : "Chapitre 1 (IS), Livre 1, Tome 1, Art. X" dans la référence.`,
  },
  {
    id: 'agent-entites-etrangeres',
    name: 'Agent Entités Étrangères',
    description: 'Spécialisé régimes fiscaux des personnes morales étrangères, succursales, holdings',
    keywords: ['non-résident', 'non-resident', 'non résident', 'entité étrangère', 'entite etrangere', 'succursale', 'agence', 'quartier général', 'quartier general', 'qg', 'holding', 'intégration fiscale', 'integration fiscale', 'groupe fiscal', 'ate', 'autorisation temporaire', 'quitus fiscal', 'sous-traitant pétrolier', 'sous-traitant petrolier', 'zone angola', 'forfait 22%', 'retenue source', 'établissement stable', 'etablissement stable'],
    patterns: [
      /\b(personne[s]?\s+morale[s]?\s+[eé]trang[eè]re[s]?|entit[eé][s]?\s+[eé]trang[eè]re[s]?)\b/i,
      /\bsuccursale[s]?\b/i,
      /\bquartier[s]?\s+g[eé]n[eé]ra(l|ux)\b/i,
      /\bholding[s]?\b/i,
      /\bint[eé]gration\s+fiscale\b/i,
      /\bgroupe\s+fiscal\b/i,
      /\b(ATE|quitus\s+fiscal)\b/i,
      /\bsous[- ]traitant[s]?\s+p[eé]trolier[s]?\b/i,
      /\bzone\s+angola\b/i,
      /\b[eé]tablissement\s+stable\b/i,
      /\bart\.?\s*(86C|87|88|89|90|91|92)[A-K]?\b/i,
      /\bforfait\s+22\s*%\b/i,
    ],
    ragPriority: { tomes: ['1'], chapitres: ['Chapitre 1'], keywords: ['non-résident', 'étranger', 'succursale', 'holding', 'intégration', 'ATE', 'quitus'] },
    systemInstruction: `Tu es spécialisé dans la fiscalité des personnes morales étrangères — Chapitre 1, Livre 1, Tome 1 du CGI 2026 (Art. 86C à 92K).

RETENUE À LA SOURCE NON-RÉSIDENTS (Art. 86C) :
- 20% sur prestations de services et redevances versées à des non-résidents ;
- 33% pour les personnes morales CEMAC non-résidentes (IS).

SUCCURSALES ET AGENCES (Art. 87-87B) :
- Imposables à l'IS comme les sociétés de droit congolais ;
- Obligation déclarative identique ;
- Retenue 20% sur rapatriement de bénéfices.

QUARTIERS GÉNÉRAUX CEMAC (Art. 88-88C) :
- Régime fiscal spécial pour QG de groupes CEMAC ;
- IS réduit sur certaines activités de coordination ;
- Conditions : emploi minimum, investissement.

HOLDINGS (Art. 89-89D) :
- Régime spécial : détention au moins 2/3 de l'actif en participations ;
- Exonération dividendes reçus (régime mère-fille) sous conditions ;
- Durée détention minimale.

INTÉGRATION FISCALE (Art. 90-90E) :
- Participation minimale : 95% ;
- Durée : 5 exercices minimum ;
- Résultat d'ensemble : somme algébrique des résultats du groupe.

PERSONNES MORALES ÉTRANGÈRES (Art. 91-91E) :
- Forfait 22% du CA pour sous-traitants pétroliers ;
- Obligations déclaratives spécifiques.

ATE ET QUITUS FISCAL (Art. 92-92K) :
- Autorisation Temporaire d'Exercer (ATE) obligatoire ;
- Quitus fiscal : seuil 100 milliards FCFA ;
- Zone Angola : taux spécifique 5,75%.

TOUJOURS citer : "Chapitre 1 (IS), Livre 1, Tome 1, Art. X" dans la référence.`,
  },
  {
    id: 'agent-calendrier',
    name: 'Agent Calendrier Fiscal',
    description: 'Spécialisé échéances fiscales, obligations déclaratives, calendrier fiscal',
    keywords: ['date limite', 'échéance', 'echeance', 'échéances', 'echeances', 'déclaration', 'declaration', 'formulaire', 'calendrier fiscal', 'calendrier', 'délai', 'delai', 'quand déclarer', 'quand declarer', 'obligation déclarative', 'obligation declarative', 'das', 'déclaration annuelle', 'declaration annuelle', 'déclaration mensuelle', 'declaration mensuelle', 'date de dépôt', 'date de depot', 'paiement impôt', 'paiement impot', 'acompte', 'versement'],
    patterns: [
      /\b(date\s+limite|[eé]ch[eé]ance|d[eé]lai)\s*(de\s+)?(d[eé]claration|paiement|d[eé]p[oô]t)?\b/i,
      /\bquand\s+(d[eé]clarer|payer|d[eé]poser|verser)\b/i,
      /\bcalendrier\s+fiscal\b/i,
      /\bobligation[s]?\s+d[eé]clarative[s]?\b/i,
      /\bDAS\b/,
      /\bd[eé]claration\s+(annuelle|mensuelle|trimestrielle)\b/i,
      /\bdate\s+de\s+(d[eé]p[oô]t|paiement|versement)\b/i,
      /\b(15|20)\s+(janvier|f[eé]vrier|mars|avril|mai|juin|juillet|ao[uû]t|septembre|octobre|novembre|d[eé]cembre)\b/i,
      /\bart\.?\s*461\s*bis\b/i,
    ],
    ragPriority: { tomes: ['1'], keywords: ['échéance', 'déclaration', 'délai', 'calendrier', 'paiement', 'acompte', 'DAS'] },
    systemInstruction: `Tu es spécialisé dans les obligations déclaratives et le calendrier fiscal — CGI 2026.

RÈGLE GÉNÉRALE LF 2026 (Art. 461 bis nouveau) :
Les délais d'accomplissement des obligations déclaratives et des échéances de paiement sont fixés au plus tard le 15 de chaque mois, sauf pour le mois d'août où le délai est avancé au 20 du mois.

CALENDRIER FISCAL 2026 (délais vérifiés dans le CGI) :

JANVIER :
- 15 janvier : DAS (Déclaration Annuelle des Salaires) — Art. 176 + Art. 461 bis.

FÉVRIER :
- 15 février : Déclaration IBA forfait (n°294) — Art. 98.

MARS :
- 15 mars : Déclaration minimum de perception IS — Art. 86C ;
- 15 mars : 1er acompte minimum de perception IS — Art. 86C ;
- 15 mars : IRF loyers (locataire personne morale) — Art. 113A.

AVRIL :
- Du 1er au 20 avril : Patente — Art. 310 (expressément "20 avril" malgré Art. 461 bis).

MAI :
- 15 mai : IRF personnes physiques (déclaration + 1ère échéance paiement) — Art. 113A.

JUIN :
- 15 juin : 2ème acompte minimum de perception IS — Art. 86C.

AOÛT :
- 20 août : 2ème échéance IRF personnes physiques — Art. 113A ;
- EXCEPTION : tous les délais mensuels du mois d'août passent au 20 (Art. 461 bis).

SEPTEMBRE :
- 15 septembre : 3ème acompte minimum de perception IS — Art. 86C.

NOVEMBRE :
- 15 novembre : 3ème échéance IRF personnes physiques — Art. 113A.

DÉCEMBRE :
- 15 décembre : 4ème acompte minimum de perception IS — Art. 86C.

OBLIGATIONS MENSUELLES (chaque mois) :
- 15 du mois : TVA (TFNC6 Art. 35 + Art. 461 bis) — était le 20, désormais le 15 ;
- 15 du mois : Retenue ITS employeur (Art. 173 + Art. 461 bis) — était 20 jours, désormais le 15 ;
- 15 du mois : TUS (TFNC4 4.15 + Art. 461 bis) — était le 20, désormais le 15.

DÉLAIS SPÉCIAUX :
- Déclaration IS : 4 mois après clôture exercice — Art. 86F ;
- Paiement IS : dès remise déclaration — Art. 86G ;
- Déclaration d'existence : 15 jours du commencement (3 mois après constitution) — Art. 86E ;
- IRCM plus-values : 60 jours du mois suivant la réalisation — Art. 110A ;
- Cessation/cession activité : 10 jours de l'événement — Art. 181 ;
- Cessation patente : avant le 1er octobre — Art. 305 ;
- Décès employeur (DAS) : 6 mois du décès (max 31 janvier) — Art. 181.

TOUJOURS citer l'article de référence et préciser si le délai est modifié par l'Art. 461 bis (LF 2026).`,
  },
  {
    id: 'agent-general',
    name: 'Agent Général',
    description: 'Agent par défaut pour les questions fiscales générales',
    keywords: [],
    patterns: [],
    ragPriority: {},
    systemInstruction: '',
  },
];

/**
 * Trouve l'agent le plus pertinent pour une question donnée.
 */
export function routeToAgent(query: string): FiscalAgent {
  const queryLower = query.toLowerCase();

  // 1. Vérifier les patterns regex (plus précis)
  for (const agent of FISCAL_AGENTS) {
    if (agent.id === 'agent-general') continue;
    for (const pattern of agent.patterns) {
      if (pattern.test(query)) {
        return agent;
      }
    }
  }

  // 2. Vérifier les mots-clés (plus large)
  let bestAgent: FiscalAgent | null = null;
  let bestScore = 0;

  for (const agent of FISCAL_AGENTS) {
    if (agent.id === 'agent-general') continue;
    let score = 0;
    for (const kw of agent.keywords) {
      if (queryLower.includes(kw.toLowerCase())) {
        score += kw.length; // Mots-clés plus longs = plus spécifiques = plus de poids
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestAgent = agent;
    }
  }

  if (bestAgent && bestScore > 0) {
    return bestAgent;
  }

  // 3. Fallback : agent général
  return FISCAL_AGENTS.find(a => a.id === 'agent-general')!;
}
