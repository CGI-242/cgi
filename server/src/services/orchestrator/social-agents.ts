// server/src/services/orchestrator/social-agents.ts
// Agents spécialisés par domaine social — Code du travail, sécurité sociale, conventions

export interface SocialAgent {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  patterns: RegExp[];
  ragPriority: { livres?: string[]; chapitres?: string[]; keywords?: string[] };
  systemInstruction: string;
}

export const SOCIAL_AGENTS: SocialAgent[] = [
  // ==================== AGENT CODE DU TRAVAIL ====================
  {
    id: 'social-agent-code-travail',
    name: 'Agent Code du Travail',
    description: 'Spécialisé Code du travail congolais (Loi n°45-75, Titres 1-10)',
    keywords: [
      'code du travail', 'contrat de travail', 'contrat individuel', 'cdd', 'cdi',
      'licenciement', 'préavis', 'preavis', 'faute lourde', 'faute grave',
      'période d\'essai', 'periode d\'essai', 'essai',
      'démission', 'demission', 'rupture du contrat',
      'congé', 'conge', 'congés payés', 'conges payes', 'congé annuel',
      'durée du travail', 'duree du travail', 'heures supplémentaires', 'heures supplementaires',
      'travail de nuit', 'repos hebdomadaire',
      'salaire', 'rémunération', 'remuneration', 'bulletin de paie',
      'apprentissage', 'apprenti', 'contrat d\'apprentissage',
      'sous-entreprise', 'travail temporaire', 'intérim', 'interim',
      'règlement intérieur', 'reglement interieur',
      'cautionnement',
      'hygiène', 'hygiene', 'sécurité au travail', 'securite au travail',
      'inspection du travail', 'inspecteur du travail',
      'comité d\'entreprise', 'comite d\'entreprise', 'délégué du personnel', 'delegue du personnel',
      'syndicat', 'liberté syndicale', 'liberte syndicale', 'grève', 'greve',
      'différend', 'differend', 'tribunal du travail', 'conciliation', 'arbitrage',
    ],
    patterns: [
      /\bcode\s+du\s+travail\b/i,
      /\b(licenciement|pr[eé]avis|d[eé]mission)\b/i,
      /\b(contrat\s+de\s+travail|cdd|cdi)\b/i,
      /\bcong[eé]s?\s*(pay[eé]s?|annuel|maladie|maternit[eé])?\b/i,
      /\b(dur[eé]e|heures?)\s+(du\s+)?travail\b/i,
      /\bapprentissage\b/i,
      /\binspect(eur|ion)\s+du\s+travail\b/i,
      /\bsyndicat|gr[eè]ve\b/i,
      /\btribunal\s+du\s+travail\b/i,
      /\bd[eé]l[eé]gu[eé]\s+du\s+personnel\b/i,
    ],
    ragPriority: { livres: ['1'], keywords: ['travail', 'contrat', 'licenciement', 'congé', 'salaire'] },
    systemInstruction: `Tu es specialise dans le Code du travail congolais (Loi n45-75 du 15 mars 1975, modifiee par la Loi n6-96 du 6 mars 1996).

Structure du Code du travail :
- Titre 1 : Dispositions generales
- Titre 2 : Du contrat de travail (apprentissage, contrat individuel, conventions collectives, sous-entreprise, travail temporaire, reglement interieur, cautionnement)
- Titre 3 : Du salaire (determination, paiement, retenues, economats)
- Titre 4 : Des conditions du travail (duree, nuit, femmes/enfants, repos, conges)
- Titre 5 : Hygiene et securite
- Titre 6 : Organismes et moyens d'execution (administration, comites, delegues, controle)
- Titre 7 : Syndicats professionnels
- Titre 8 : Reglement des differends (individuel, collectif)
- Titre 9 : Penalites
- Titre 10 : Dispositions transitoires

Regles cles :
- Preavis de licenciement : selon convention collective applicable (generalement 1 a 3 mois selon categorie)
- Indemnite de licenciement : selon anciennete et convention collective
- Duree legale du travail : 40 heures/semaine
- Heures supplementaires : majorations de 10%, 25%, 50%, 100% selon les cas
- Conges payes : 2,16 jours ouvrables par mois (26 jours/an)
- Periode d'essai : variable selon categorie et convention collective
- Age minimum de travail : 16 ans (Art. 116)

TOUJOURS citer : "Titre X, Code du travail" dans la reference.`,
  },

  // ==================== AGENT SECURITE SOCIALE ====================
  {
    id: 'social-agent-securite-sociale',
    name: 'Agent Sécurité Sociale',
    description: 'Spécialisé Code de la sécurité sociale (Loi n°004-86) - Organisation, cotisations, affiliation',
    keywords: [
      'sécurité sociale', 'securite sociale', 'cnss', 'caisse nationale',
      'cotisation', 'cotisations sociales', 'cotisation cnss',
      'affiliation', 'immatriculation', 'assujetti',
      'branche', 'branches',
      'taux de cotisation', 'plafond cotisation',
      'déclaration annuelle', 'declaration annuelle',
      'majoration de retard', 'mise en demeure',
      'contrôle', 'controle', 'inspecteur sécurité sociale',
    ],
    patterns: [
      /\b(s[eé]curit[eé]\s+sociale|cnss|caisse\s+nationale)\b/i,
      /\bcotisation[s]?\s*(sociale|cnss|patronale|salariale)?\b/i,
      /\b(affiliation|immatriculation)\b/i,
      /\bmajoration\s+de\s+retard\b/i,
    ],
    ragPriority: { livres: ['2'], keywords: ['sécurité sociale', 'CNSS', 'cotisation', 'affiliation'] },
    systemInstruction: `Tu es specialise dans le Code de la securite sociale congolais (Loi n004-86 du 25 fevrier 1986).

Taux de cotisations CNSS (a la charge de l'employeur sauf mention contraire) :
- Prestations familiales (PF) : 10,03%  — plafond 600.000 FCFA/mois
- Risques professionnels (RP) : 2,25% — plafond 600.000 FCFA/mois
- Pensions (vieillesse/invalidite/deces) : 12% (8% employeur + 4% salarie) — plafond 1.200.000 FCFA/mois
- Taxe unique sur salaires (TUS/ACPE) : 1% — sans plafond
- CAMU : 1,5% — sans plafond
- Total employeur : ~22,78%
- Total salarie : 4%

Decret 1999-284 : plafonds des remunerations soumises a cotisations.
Decret 1999-279 : taux pension porte a 12% (8% employeur + 4% salarie).

Versement : mensuel si >20 salaries, trimestriel sinon (Art. 22 CSS).
Sanctions : 500 FCFA par salarie non declare (Art. 179 CSS).
Prescription recouvrement : 30 ans (Art. 184 CSS).

TOUJOURS citer : "Art. X, Code de la securite sociale" dans la reference.`,
  },

  // ==================== AGENT PRESTATIONS FAMILIALES ====================
  {
    id: 'social-agent-prestations-familiales',
    name: 'Agent Prestations Familiales',
    description: 'Spécialisé prestations familiales et maternité (Art. 38-58 CSS)',
    keywords: [
      'prestations familiales', 'allocation familiale', 'allocations familiales',
      'allocation prénatale', 'allocation prenatale',
      'prime à la naissance', 'prime naissance', 'jeunes ménages',
      'maternité', 'maternite', 'congé maternité', 'conge maternite',
      'indemnité journalière maternité', 'indemnite journaliere maternite',
      'accouchement', 'grossesse',
      'enfant à charge', 'enfants a charge',
    ],
    patterns: [
      /\b(allocation|prestation)[s]?\s*(familiale|pr[eé]natale|maternit[eé])\b/i,
      /\bmaternit[eé]\b/i,
      /\b(prime|allocation)\s*(naissance|jeunes?\s*m[eé]nage)\b/i,
      /\baccouchement\b/i,
      /\bgrossesse\b/i,
    ],
    ragPriority: { keywords: ['prestations familiales', 'maternité', 'allocation', 'naissance'] },
    systemInstruction: `Tu es specialise dans les prestations familiales et de maternite (Art. 38-58 du Code de la securite sociale).

Prestations familiales (Art. 38) :
- Allocations prenatales (9 mois precedant la naissance)
- Allocation jeunes menages / prime a la naissance (3 premiers enfants)
- Allocations familiales (de la naissance a 20 ans)
- Indemnite journaliere de maternite
- Prestations en nature

Conditions d'ouverture (Art. 39) : 6 mois d'activite salariee + 20 jours ou 133 heures de travail.
Age limite enfants (Art. 48-50) : 20 ans revolus (17 ans apprenti, 20 ans etudes/infirmite).
Indemnite maternite (Art. 55) : 50% du salaire journalier effectif.
Duree maternite (Art. 54) : duree du conge maternite + 3 semaines supplementaires si maladie.
Taux uniformes (Art. 58) : identiques pour tous les salaries quel que soit le montant de leur remuneration.

TOUJOURS citer : "Art. X du Code de la securite sociale" dans la reference.`,
  },

  // ==================== AGENT RISQUES PROFESSIONNELS ====================
  {
    id: 'social-agent-risques-pro',
    name: 'Agent Risques Professionnels',
    description: 'Spécialisé accidents du travail et maladies professionnelles (Art. 59-143 CSS + Loi 2012-18)',
    keywords: [
      'accident du travail', 'accident de travail', 'accident de trajet',
      'maladie professionnelle', 'risques professionnels', 'risque professionnel',
      'incapacité temporaire', 'incapacite temporaire',
      'incapacité permanente', 'incapacite permanente',
      'rente', 'rente d\'incapacité', 'rente incapacite',
      'indemnité journalière', 'indemnite journaliere',
      'frais funéraires', 'frais funeraires',
      'rééducation', 'reeducation', 'réadaptation', 'readaptation',
      'déclaration accident', 'declaration accident',
      'faute inexcusable',
      'prévention', 'prevention',
    ],
    patterns: [
      /\baccident\s+(du|de)\s+(travail|trajet)\b/i,
      /\bmaladie\s+professionnelle\b/i,
      /\brisques?\s+professionnel/i,
      /\b(incapacit[eé]|rente)\s*(temporaire|permanente|d'incapacit)?\b/i,
      /\bfaute\s+inexcusable\b/i,
      /\br[eé][eé]ducation|r[eé]adaptation\b/i,
    ],
    ragPriority: { keywords: ['accident travail', 'maladie professionnelle', 'rente', 'incapacité'] },
    systemInstruction: `Tu es specialise dans les risques professionnels (Art. 59-143 du Code de la securite sociale + Loi 2012-18).

Accident du travail (Art. 59/Art. 6 Loi 2012-18) : accident survenu par le fait ou a l'occasion du travail, y compris trajet domicile-travail.
Maladie professionnelle (Art. 60/Art. 7 Loi 2012-18) : maladie contractee par le fait et a l'occasion du travail.

Declaration : 48 heures par l'employeur (Art. 61 CSS / Art. 9 Loi 2012-18). Carence employeur : victime a 2 ans pour declarer.

Prestations (Art. 67/Art. 21 Loi 2012-18) :
- Soins medicaux (frais medicaux, hospitalisation, prothese, transport)
- Indemnite journaliere : 100% du salaire (29 premiers jours), 2/3 du salaire (jour 30-90), 1/3 au-dela (Loi 2012-18 Art. 43)
- Rente incapacite permanente : a partir de 10% (Art. 100 CSS)
- Frais funeraires + rente de survivants en cas de deces

Rente de survivants (Art. 101 CSS) : conjoint 30%, enfants 50%, ascendants 20%. Plafond total : 80%.
Faute inexcusable employeur (Art. 97) : majoration des indemnites.
Tierce personne (Art. 143) : majoration 50% si incapacite totale.

TOUJOURS citer : "Art. X du Code de la securite sociale" ou "Art. X de la Loi 2012-18" dans la reference.`,
  },

  // ==================== AGENT PENSIONS ====================
  {
    id: 'social-agent-pensions',
    name: 'Agent Pensions',
    description: 'Spécialisé pensions de vieillesse, invalidité, survivants (Art. 144-168 CSS)',
    keywords: [
      'pension', 'pension de vieillesse', 'pension vieillesse',
      'retraite', 'âge de retraite', 'age de retraite', 'admission retraite',
      'pension anticipée', 'pension anticipee',
      'pension proportionnelle',
      'pension d\'invalidité', 'pension invalidite', 'invalidité', 'invalidite',
      'pension de survivant', 'pension survivant', 'survivant',
      'allocation de vieillesse', 'allocation vieillesse',
      'allocation de décès', 'allocation deces',
      'réversion', 'reversion',
    ],
    patterns: [
      /\b(pension|retraite)\s*(de\s+)?(vieillesse|invalidit[eé]|survivant|anticip[eé]e|proportionnelle)?\b/i,
      /\b[aâ]ge\s+(de\s+)?(la\s+)?retraite\b/i,
      /\br[eé]version\b/i,
      /\ballocation\s+(de\s+)?(vieillesse|d[eé]c[eè]s|survivant)\b/i,
    ],
    ragPriority: { keywords: ['pension', 'retraite', 'vieillesse', 'invalidité', 'survivant'] },
    systemInstruction: `Tu es specialise dans les pensions (Art. 144-168 CSS + Loi 48-2024 age retraite).

Types de pensions (Art. 144 CSS) :
- Pension de vieillesse
- Pension anticipee
- Pension proportionnelle
- Pension de survivant
- Pension d'invalidite
- Allocation de vieillesse et de survivant

Age de retraite (Loi 48-2024) :
- 60 ans : manoeuvres, ouvriers et assimiles
- 63 ans : agents de maitrise
- 65 ans : cadres
- 70 ans : cadres hors categorie
Retraite anticipee : 57 / 60 / 63 / 65 ans selon categorie (si duree d'assurance suffisante).

Conditions pension vieillesse (Art. 145 CSS) :
- 55 ans minimum (ancien texte, mis a jour par Loi 48-2024)
- Immatricule a la CNSS depuis 20 ans
- 60 mois d'assurance dans les 10 dernieres annees (ou 240 mois total)
- Avoir cesse toute activite salariee

Calcul pension (Art. 150 CSS) :
- 40% de la remuneration mensuelle moyenne (36 ou 60 meilleurs mois sur 10 dernieres annees)
- +2% par annee au-dela de 240 mois d'assurance
- Minimum : 60% du SMIG
- Maximum : 80% de la remuneration moyenne

Pension de survivant (Art. 151 CSS) :
- Conjoint : 30%
- Enfants : 50%
- Ascendants : 20%
- Plafond total : 80% de la pension du defunt

Pension d'invalidite (Art. 146) : avant 55 ans, 5 ans immatriculation, 6 mois assurance sur 12 derniers mois.
Invalidite = incapable de gagner plus d'1/3 de la remuneration d'un travailleur de meme formation.

TOUJOURS citer : "Art. X du Code de la securite sociale" ou "Art. X de la Loi 48-2024" dans la reference.`,
  },

  // ==================== AGENT CONVENTIONS COLLECTIVES ====================
  {
    id: 'social-agent-conventions',
    name: 'Agent Conventions Collectives',
    description: 'Spécialisé dans les 16 conventions collectives sectorielles',
    keywords: [
      'convention collective', 'conventions collectives',
      'grille salariale', 'grille de salaire', 'classification',
      'btp', 'bâtiment', 'batiment', 'travaux publics',
      'commerce', 'industrie', 'pétrole', 'petrole', 'para-pétrole',
      'mines', 'minière', 'miniere', 'exploitation minière',
      'forêt', 'foret', 'forestière', 'forestiere', 'agriculture',
      'hôtellerie', 'hotellerie', 'restauration', 'catering',
      'banque', 'assurance', 'bam',
      'ntic', 'informatique', 'numérique', 'numerique',
      'transport', 'auxiliaire', 'aérien', 'aerien',
      'pêche', 'peche', 'maritime',
      'information', 'communication', 'média', 'media',
      'personnel domestique', 'employé de maison',
    ],
    patterns: [
      /\bconvention[s]?\s+collective[s]?\b/i,
      /\bgrille\s+(salariale|de\s+salaire|des\s+salaires)\b/i,
      /\b(btp|b[aâ]timent|travaux\s+publics)\b/i,
      /\b(p[eé]trole|para.p[eé]trole|mines?|mini[eè]re)\b/i,
      /\b(for[eê]t|foresti[eè]re|agriculture)\b/i,
      /\b(h[oô]tellerie|restauration|catering)\b/i,
      /\b(banque|assurance|bam)\b/i,
      /\bntic\b/i,
    ],
    ragPriority: { livres: ['3'], keywords: ['convention collective', 'grille', 'classification'] },
    systemInstruction: `Tu es specialise dans les 16 conventions collectives sectorielles du Congo-Brazzaville.

Conventions collectives disponibles :
- Agriculture et Foret
- Aerien
- Auxiliaires de transport
- Banques et assurances (BAM)
- BTP (Batiment et Travaux Publics)
- Commerce
- Exploitation miniere
- Forestiere
- Hotellerie et restauration (Catering)
- Industrie
- Information et communication
- NTIC
- Para-petrole
- Peche maritime
- Personnel domestique
- Petrole

Chaque convention definit :
- Classification professionnelle (categories, echelons)
- Grille salariale (salaire de base par categorie)
- Prime d'anciennete
- Indemnites (transport, logement, panier, etc.)
- Duree du preavis selon categorie
- Indemnite de licenciement
- Conges supplementaires pour anciennete

TOUJOURS preciser le nom de la convention collective dans la reference : "Art. X de la Convention collective [secteur]".`,
  },

  // ==================== AGENT CAMU ====================
  {
    id: 'social-agent-camu',
    name: 'Agent CAMU',
    description: 'Spécialisé Couverture Assurance Maladie Universelle',
    keywords: [
      'camu', 'couverture maladie', 'assurance maladie', 'maladie universelle',
      'couverture universelle',
    ],
    patterns: [
      /\bcamu\b/i,
      /\b(couverture|assurance)\s+maladie\s*(universelle)?\b/i,
    ],
    ragPriority: { keywords: ['CAMU', 'maladie universelle', 'couverture'] },
    systemInstruction: `Tu es specialise dans la CAMU (Couverture Assurance Maladie Universelle).

Textes de reference :
- Loi 19-2023 portant creation de la CAMU
- Decret 2023-1761 portant statuts de la CAMU
- Decret 2024-131 sur les cotisations CAMU
- Decret 2024-133 sur les taux de cotisations CAMU

Cotisation CAMU : 1,5% a la charge de l'employeur (sans plafond).

TOUJOURS citer le texte de reference (Loi ou Decret).`,
  },

  // ==================== AGENT EMPLOI / FORMATION ====================
  {
    id: 'social-agent-emploi',
    name: 'Agent Emploi & Formation',
    description: 'Spécialisé ACPE, FONEA, ONEMO, INTS, emploi, formation',
    keywords: [
      'acpe', 'agence congolaise pour l\'emploi', 'agence emploi',
      'fonea', 'employabilité', 'employabilite',
      'onemo', 'office national de l\'emploi',
      'ints', 'institut national du travail social', 'travail social',
      'carte de travail', 'autorisation d\'emploi',
      'travailleur étranger', 'travailleur etranger', 'emploi étranger',
      'formation professionnelle',
      'jours fériés', 'jours feries', 'jour férié', 'fête nationale', 'fete nationale',
      'saisie-arrêt', 'saisie arret', 'saisie sur salaire',
    ],
    patterns: [
      /\b(acpe|fonea|onemo|ints)\b/i,
      /\bcarte\s+de\s+travail\b/i,
      /\btravailleur[s]?\s+[eé]tranger/i,
      /\bjours?\s+f[eé]ri[eé]/i,
      /\bf[eê]te\s+nationale\b/i,
      /\bsaisie[\s-]arr[eê]t/i,
      /\bformation\s+professionnelle\b/i,
    ],
    ragPriority: { keywords: ['ACPE', 'FONEA', 'ONEMO', 'emploi', 'jours fériés', 'formation'] },
    systemInstruction: `Tu es specialise dans l'emploi, la formation et les textes non codifies du droit du travail.

Organismes :
- ACPE (Loi 2019-7) : Agence Congolaise pour l'Emploi, remplace l'ONEMO. Missions : placement, statistiques, cartes de travail, controle emploi etrangers.
- FONEA (Loi 2019-8) : Fonds National d'appui a l'Employabilite et a l'Apprentissage. Financement par taxe d'apprentissage.
- ONEMO (Loi 1988-22) : ancien Office National de l'Emploi, abroge par les lois ACPE/FONEA.
- INTS (Loi 2015-06) : Institut National du Travail Social, siege a Ignie.

Jours feries (Loi 1994-02) :
- 1er janvier (jour de l'An)
- Lundi de Paques
- 1er mai (fete du travail)
- Jeudi de l'Ascension
- Lundi de Pentecote
- 10 juin (Conference Nationale Souveraine)
- 15 aout (fete nationale — Loi 2010-19)
- 1er novembre (Toussaint)
- 28 novembre (journee de la Republique — Loi 2010-18)
- 25 decembre (Noel)

Saisie-arret salaires (Decret 1984-209) :
- Quotites saisissables progressives : 1/10 (0-50.000), 1/5 (50-100.000), 1/4 (100-150.000), 1/3 (150-250.000), 1/2 (>250.000).
- Pension alimentaire : preleve integralement sur portion insaisissable.

Personnel domestique (Arrete 1868/1995) :
- Grille salariale : 40.370 FCFA (cat. 1 ech. 1) a 55.870 FCFA (cat. 5 ech. 2)
- Duree travail : 60 heures/semaine = 40 heures effectives
- Retraite : 55 ans

TOUJOURS citer le texte de reference (Loi, Decret ou Arrete).`,
  },

  // ==================== AGENT GENERAL SOCIAL ====================
  {
    id: 'social-agent-general',
    name: 'Agent Social Général',
    description: 'Agent par défaut pour les questions sociales générales',
    keywords: [],
    patterns: [],
    ragPriority: {},
    systemInstruction: '',
  },
];

/**
 * Trouve l'agent social le plus pertinent pour une question donnée.
 */
export function routeToSocialAgent(query: string): SocialAgent {
  const queryLower = query.toLowerCase();

  // 1. Vérifier les patterns regex (plus précis)
  for (const agent of SOCIAL_AGENTS) {
    if (agent.id === 'social-agent-general') continue;
    for (const pattern of agent.patterns) {
      if (pattern.test(query)) {
        return agent;
      }
    }
  }

  // 2. Vérifier les mots-clés (plus large)
  let bestAgent: SocialAgent | null = null;
  let bestScore = 0;

  for (const agent of SOCIAL_AGENTS) {
    if (agent.id === 'social-agent-general') continue;
    let score = 0;
    for (const kw of agent.keywords) {
      if (queryLower.includes(kw.toLowerCase())) {
        score += kw.length;
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

  // 3. Fallback : agent social général
  return SOCIAL_AGENTS.find(a => a.id === 'social-agent-general')!;
}
