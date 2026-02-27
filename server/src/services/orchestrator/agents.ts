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
    systemInstruction: `Tu es spécialisé dans l'Impôt sur les Sociétés (IS) du CGI 2026.
Focus sur : Art. 86A (taux), Art. 86B (minimum de perception), Art. 86C (retenue source non-résidents), Art. 3 (exonérations), Art. 75 (report déficitaire 5 ans).
Taux principal : 28%. Taux microfinance/enseignement : 25%. Taux non-résidents CEMAC : 35%.
Acomptes IS : 15 février, 15 mai, 15 août, 15 novembre.`,
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
    systemInstruction: `Tu es spécialisé dans l'Impôt sur les Traitements et Salaires (ITS) du CGI 2026.
Focus sur : Art. 116 (barème ITS), Art. 115 (avantages en nature).
Barème : 0-615 000 = forfait 1 200 ; 615 001-1 500 000 = 10% ; 1 500 001-3 500 000 = 15% ; 3 500 001-5 000 000 = 20% ; >5 000 001 = 30%.
Retenue mensuelle à la source par l'employeur.`,
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
    systemInstruction: `Tu es spécialisé dans la Taxe sur la Valeur Ajoutée (TVA) du CGI 2026.
Focus sur : le Tome 2 du CGI, les chapitres TVA (tfnc6-tva).
Couvre : fait générateur, exigibilité, taux, exonérations, crédit de TVA, remboursement, obligations déclaratives.`,
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
      /\bart\.?\s*(93|94|95|96|97|98|99|100|101|102|103|104)\b/i,
    ],
    ragPriority: { tomes: ['1'], keywords: ['IBA', 'bénéfices', 'forfait', 'patente'] },
    systemInstruction: `Tu es spécialisé dans l'Impôt sur les Bénéfices d'Affaires (IBA) du CGI 2026.
Focus sur : Art. 93-104. Taux : 30% (Art. 95). Minimum de perception : 1,5% des produits.
Régime forfaitaire : CA inférieur au seuil TVA (Art. 96). Amortissement linéaire uniquement, report déficitaire 3 ans max.`,
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
    systemInstruction: `Tu es spécialisé dans l'IRCM et l'IRF du CGI 2026.
IRCM (Art. 105-110A) : taux 15% (35% revenus occultes). Dividendes, intérêts, plus-values mobilières.
IRF (Art. 111-113A) : taux loyers 9%, taux plus-values immobilières 15%. Retenue à la source par locataire (personnes morales).`,
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
Couvre : Convention CEMAC (6 chapitres), conventions bilatérales (France, Chine, Italie, Maurice, Rwanda).
Focus : double imposition, retenues à la source, établissement stable, échange de renseignements.`,
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
