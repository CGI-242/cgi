// server/src/config/keyword-mappings-dd.ts
// Mappings mots-clés → articles pour Chapitre 6 - Dispositions diverses (CGI 2025)

/**
 * Map de mots-clés vers les articles pertinents du chapitre 6
 * Structure: mot-clé/expression → liste d'articles avec poids
 */
export const KEYWORD_ARTICLE_MAP_DD: Record<string, Array<{ article: string; weight: number }>> = {
  // ==================== SECTION 1: OBLIGATIONS EMPLOYEURS (Art. 172-182) ====================

  // Art. 172 - Retenue à la source employeurs
  'retenue source': [
    { article: 'Art. 172', weight: 1.0 },
    { article: 'Art. 183', weight: 0.8 },
    { article: 'Art. 185 ter-A', weight: 0.7 },
  ],
  'retenue à la source': [
    { article: 'Art. 172', weight: 1.0 },
    { article: 'Art. 183', weight: 0.8 },
    { article: 'Art. 185 ter-A', weight: 0.7 },
  ],
  'ras': [
    { article: 'Art. 172', weight: 0.9 },
    { article: 'Art. 183', weight: 0.8 },
    { article: 'Art. 185 ter-A', weight: 0.8 },
  ],
  'withholding': [
    { article: 'Art. 172', weight: 0.8 },
    { article: 'Art. 185 ter-A', weight: 0.9 },
  ],
  'employeur': [
    { article: 'Art. 172', weight: 1.0 },
    { article: 'Art. 173', weight: 0.9 },
    { article: 'Art. 174', weight: 0.8 },
    { article: 'Art. 176', weight: 0.8 },
  ],
  'employeurs': [
    { article: 'Art. 172', weight: 1.0 },
    { article: 'Art. 173', weight: 0.9 },
    { article: 'Art. 174', weight: 0.8 },
  ],
  'débirentier': [
    { article: 'Art. 172', weight: 1.0 },
    { article: 'Art. 173', weight: 0.9 },
  ],
  'débirentiers': [
    { article: 'Art. 172', weight: 1.0 },
    { article: 'Art. 173', weight: 0.9 },
  ],
  'prélèvement irpp': [
    { article: 'Art. 172', weight: 1.0 },
  ],
  'prélèvement salarié': [
    { article: 'Art. 172', weight: 1.0 },
  ],
  'salaires': [
    { article: 'Art. 172', weight: 0.9 },
    { article: 'Art. 176', weight: 1.0 },
    { article: 'Art. 185', weight: 0.7 },
  ],
  'traitements': [
    { article: 'Art. 172', weight: 0.9 },
    { article: 'Art. 176', weight: 0.9 },
  ],
  'pensions': [
    { article: 'Art. 172', weight: 0.8 },
    { article: 'Art. 176', weight: 0.8 },
    { article: 'Art. 185', weight: 0.8 },
  ],
  'rentes': [
    { article: 'Art. 172', weight: 0.9 },
    { article: 'Art. 176', weight: 0.8 },
  ],
  'rentes viagères': [
    { article: 'Art. 172', weight: 1.0 },
  ],

  // Art. 173 - Versement des retenues
  'versement retenue': [
    { article: 'Art. 173', weight: 1.0 },
  ],
  'versement retenues': [
    { article: 'Art. 173', weight: 1.0 },
  ],
  'versement mensuel': [
    { article: 'Art. 173', weight: 1.0 },
  ],
  'versement trimestriel': [
    { article: 'Art. 173', weight: 1.0 },
  ],
  '20 jours': [
    { article: 'Art. 173', weight: 1.0 },
    { article: 'Art. 183', weight: 0.7 },
  ],
  'vingt jours': [
    { article: 'Art. 173', weight: 1.0 },
  ],
  'mois suivant': [
    { article: 'Art. 173', weight: 0.9 },
    { article: 'Art. 183', weight: 0.8 },
    { article: 'Art. 183 bis', weight: 0.8 },
  ],
  '5 personnes': [
    { article: 'Art. 173', weight: 1.0 },
  ],
  'cinq personnes': [
    { article: 'Art. 173', weight: 1.0 },
  ],
  'trimestre': [
    { article: 'Art. 173', weight: 0.9 },
  ],
  'recette impôts': [
    { article: 'Art. 173', weight: 0.9 },
  ],

  // Art. 174 - Livre de paie
  'livre paie': [
    { article: 'Art. 174', weight: 1.0 },
  ],
  'livre de paie': [
    { article: 'Art. 174', weight: 1.0 },
  ],
  'registre paie': [
    { article: 'Art. 174', weight: 0.9 },
  ],
  'avantages nature': [
    { article: 'Art. 174', weight: 0.9 },
    { article: 'Art. 176', weight: 0.8 },
  ],
  'avantages en nature': [
    { article: 'Art. 174', weight: 0.9 },
    { article: 'Art. 176', weight: 0.8 },
  ],
  'bordereau versement': [
    { article: 'Art. 174', weight: 1.0 },
  ],
  'enfants charge': [
    { article: 'Art. 174', weight: 0.8 },
    { article: 'Art. 176', weight: 0.8 },
  ],
  'conservation documents': [
    { article: 'Art. 174', weight: 0.9 },
  ],
  '4 ans': [
    { article: 'Art. 174', weight: 0.9 },
  ],
  'quatre ans': [
    { article: 'Art. 174', weight: 0.9 },
  ],

  // Art. 175 - Décès employeur
  'décès employeur': [
    { article: 'Art. 175', weight: 1.0 },
  ],
  'cessation employeur': [
    { article: 'Art. 175', weight: 0.9 },
    { article: 'Art. 181', weight: 0.8 },
  ],
  '15 jours': [
    { article: 'Art. 175', weight: 0.9 },
    { article: 'Art. 183 ter', weight: 0.8 },
  ],

  // Art. 176 - État annuel des salaires
  'état annuel': [
    { article: 'Art. 176', weight: 1.0 },
    { article: 'Art. 180', weight: 0.8 },
  ],
  'état annuel salaires': [
    { article: 'Art. 176', weight: 1.0 },
  ],
  'déclaration annuelle salaires': [
    { article: 'Art. 176', weight: 1.0 },
  ],
  'janvier': [
    { article: 'Art. 176', weight: 0.9 },
    { article: 'Art. 180', weight: 0.8 },
  ],
  '120000': [
    { article: 'Art. 176', weight: 1.0 },
  ],
  '120 000': [
    { article: 'Art. 176', weight: 1.0 },
  ],
  'déclaration nominative': [
    { article: 'Art. 176', weight: 1.0 },
  ],
  'récapitulatif annuel': [
    { article: 'Art. 176', weight: 0.9 },
  ],
  'niu': [
    { article: 'Art. 176', weight: 0.8 },
  ],
  'numéro identification': [
    { article: 'Art. 176', weight: 0.8 },
  ],

  // Art. 177 - Plus de 3 personnes
  '3 personnes': [
    { article: 'Art. 177', weight: 1.0 },
  ],
  'trois personnes': [
    { article: 'Art. 177', weight: 1.0 },
  ],
  'plus 3 personnes': [
    { article: 'Art. 177', weight: 1.0 },
  ],
  'déclaration mensuelle': [
    { article: 'Art. 177', weight: 1.0 },
  ],

  // Art. 177 bis - Fiche individuelle
  'fiche individuelle': [
    { article: 'Art. 177 bis', weight: 1.0 },
  ],
  'fiche salarié': [
    { article: 'Art. 177 bis', weight: 0.9 },
  ],

  // Art. 178 - Cessation cession décès état annuel
  'cession': [
    { article: 'Art. 178', weight: 0.8 },
    { article: 'Art. 181', weight: 0.9 },
  ],
  'cessation': [
    { article: 'Art. 178', weight: 0.8 },
    { article: 'Art. 181', weight: 0.9 },
  ],
  '6 mois': [
    { article: 'Art. 178', weight: 1.0 },
  ],
  'six mois': [
    { article: 'Art. 178', weight: 1.0 },
  ],
  '31 janvier': [
    { article: 'Art. 178', weight: 0.9 },
  ],

  // Art. 179 - Rémunérations diverses
  'rémunérations diverses': [
    { article: 'Art. 179', weight: 1.0 },
  ],
  'jetons présence': [
    { article: 'Art. 179', weight: 1.0 },
  ],
  'tantièmes': [
    { article: 'Art. 179', weight: 1.0 },
  ],
  'allocations forfaitaires': [
    { article: 'Art. 179', weight: 0.9 },
  ],
  'remboursement frais': [
    { article: 'Art. 179', weight: 0.9 },
  ],
  '5000': [
    { article: 'Art. 179', weight: 0.8 },
    { article: 'Art. 183 bis', weight: 0.8 },
  ],
  '5 000': [
    { article: 'Art. 179', weight: 0.8 },
    { article: 'Art. 183 bis', weight: 0.8 },
  ],

  // Art. 180 - État global
  'état global': [
    { article: 'Art. 180', weight: 1.0 },
  ],
  'montant global': [
    { article: 'Art. 180', weight: 0.9 },
  ],

  // Art. 181 - Régularisation
  'régularisation': [
    { article: 'Art. 181', weight: 1.0 },
  ],
  '10 jours': [
    { article: 'Art. 181', weight: 1.0 },
  ],
  'dix jours': [
    { article: 'Art. 181', weight: 1.0 },
  ],
  'trop perçu': [
    { article: 'Art. 181', weight: 0.9 },
    { article: 'Art. 182', weight: 0.9 },
  ],

  // Art. 182 - Réclamation
  'réclamation': [
    { article: 'Art. 182', weight: 1.0 },
  ],
  '1er avril': [
    { article: 'Art. 182', weight: 1.0 },
  ],
  'premier avril': [
    { article: 'Art. 182', weight: 1.0 },
  ],
  'restitution': [
    { article: 'Art. 182', weight: 0.9 },
  ],

  // ==================== SECTION 2: COMMISSIONS 10% (Art. 183-183 ter) ====================

  // Art. 183 - Retenue 10%
  'retenue 10': [
    { article: 'Art. 183', weight: 1.0 },
    { article: 'Art. 185 ter-C', weight: 0.7 },
  ],
  'retenue 10%': [
    { article: 'Art. 183', weight: 1.0 },
  ],
  '10%': [
    { article: 'Art. 183', weight: 0.9 },
    { article: 'Art. 185 ter-C', weight: 0.8 },
  ],
  '10 pourcent': [
    { article: 'Art. 183', weight: 0.9 },
  ],
  'commissions': [
    { article: 'Art. 183', weight: 1.0 },
    { article: 'Art. 185 ter-C', weight: 0.6 },
  ],
  'courtages': [
    { article: 'Art. 183', weight: 1.0 },
  ],
  'ristournes': [
    { article: 'Art. 183', weight: 1.0 },
  ],
  'honoraires': [
    { article: 'Art. 183', weight: 1.0 },
  ],
  'droits auteur': [
    { article: 'Art. 183', weight: 1.0 },
    { article: 'Art. 183 bis', weight: 0.9 },
  ],
  "droits d'auteur": [
    { article: 'Art. 183', weight: 1.0 },
    { article: 'Art. 183 bis', weight: 0.9 },
  ],
  'vacations': [
    { article: 'Art. 183', weight: 1.0 },
  ],
  'gratifications': [
    { article: 'Art. 183', weight: 0.9 },
  ],
  'rémunérations occasionnelles': [
    { article: 'Art. 183', weight: 1.0 },
  ],
  'prestations occasionnelles': [
    { article: 'Art. 183', weight: 0.9 },
  ],
  'défaut retenue': [
    { article: 'Art. 183', weight: 1.0 },
  ],
  'défaut reversement': [
    { article: 'Art. 183', weight: 1.0 },
  ],
  'amende retenue': [
    { article: 'Art. 183', weight: 1.0 },
  ],
  'intérêt 5%': [
    { article: 'Art. 183', weight: 1.0 },
  ],
  '5% mois': [
    { article: 'Art. 183', weight: 1.0 },
  ],

  // Art. 183 bis - Droits d'auteur spectacles
  'spectacles': [
    { article: 'Art. 183 bis', weight: 1.0 },
  ],
  'manifestations': [
    { article: 'Art. 183 bis', weight: 1.0 },
  ],
  'représentations': [
    { article: 'Art. 183 bis', weight: 1.0 },
  ],
  'artistes': [
    { article: 'Art. 183 bis', weight: 1.0 },
  ],
  'auteurs': [
    { article: 'Art. 183 bis', weight: 0.9 },
    { article: 'Art. 183', weight: 0.8 },
  ],
  'compositeurs': [
    { article: 'Art. 183 bis', weight: 1.0 },
  ],

  // Art. 183 ter - Commissionnaires en douane
  'commissionnaires douanes': [
    { article: 'Art. 183 ter', weight: 1.0 },
  ],
  'commissionnaire douane': [
    { article: 'Art. 183 ter', weight: 1.0 },
  ],
  'transitaires': [
    { article: 'Art. 183 ter', weight: 0.9 },
  ],
  'déclarant douane': [
    { article: 'Art. 183 ter', weight: 0.9 },
  ],
  'avant 15': [
    { article: 'Art. 183 ter', weight: 0.9 },
  ],
  '500000': [
    { article: 'Art. 183 ter', weight: 1.0 },
  ],
  '500 000': [
    { article: 'Art. 183 ter', weight: 1.0 },
  ],
  'amende 500000': [
    { article: 'Art. 183 ter', weight: 1.0 },
  ],

  // ==================== SECTION 3: SNC (Art. 184) ====================

  // Art. 184 - Répartition bénéfices SNC
  'snc': [
    { article: 'Art. 184', weight: 1.0 },
  ],
  'société nom collectif': [
    { article: 'Art. 184', weight: 1.0 },
  ],
  'commandite simple': [
    { article: 'Art. 184', weight: 1.0 },
  ],
  'associés gérants': [
    { article: 'Art. 184', weight: 1.0 },
  ],
  'répartition bénéfices': [
    { article: 'Art. 184', weight: 1.0 },
  ],
  'parts bénéfices': [
    { article: 'Art. 184', weight: 0.9 },
  ],
  'résultat fiscal': [
    { article: 'Art. 184', weight: 0.8 },
  ],

  // ==================== SECTION 4: SOURCE ÉTRANGÈRE (Art. 185) ====================

  // Art. 185 - Revenus source étrangère
  'source étrangère': [
    { article: 'Art. 185', weight: 1.0 },
  ],
  'revenus étrangers': [
    { article: 'Art. 185', weight: 1.0 },
  ],
  'revenus étranger': [
    { article: 'Art. 185', weight: 1.0 },
  ],
  'pensions étrangères': [
    { article: 'Art. 185', weight: 1.0 },
  ],
  'salaires étrangers': [
    { article: 'Art. 185', weight: 1.0 },
  ],
  'renseignements source': [
    { article: 'Art. 185', weight: 0.9 },
  ],

  // ==================== SECTION 5: SOCIÉTÉS 126 TER (Art. 185 bis) ====================

  // Art. 185 bis - Sociétés étrangères pétrolières
  '126 ter': [
    { article: 'Art. 185 bis', weight: 1.0 },
  ],
  'article 126 ter': [
    { article: 'Art. 185 bis', weight: 1.0 },
  ],
  'sociétés étrangères pétrolières': [
    { article: 'Art. 185 bis', weight: 1.0 },
  ],
  'sous-traitants pétroliers': [
    { article: 'Art. 185 bis', weight: 1.0 },
  ],
  'sous-traitant pétrolier': [
    { article: 'Art. 185 bis', weight: 1.0 },
  ],
  'prestataires pétroliers': [
    { article: 'Art. 185 bis', weight: 0.9 },
  ],
  'régime 126 ter': [
    { article: 'Art. 185 bis', weight: 1.0 },
  ],
  'liste salariés': [
    { article: 'Art. 185 bis', weight: 0.9 },
  ],

  // ==================== SECTION 6: NON-RÉSIDENTS (Art. 185 ter) ====================

  // Art. 185 ter-A - Champ d'application
  'non-résidents': [
    { article: 'Art. 185 ter-A', weight: 1.0 },
    { article: 'Art. 185 ter-B', weight: 0.8 },
    { article: 'Art. 185 ter-C', weight: 0.9 },
  ],
  'non résidents': [
    { article: 'Art. 185 ter-A', weight: 1.0 },
    { article: 'Art. 185 ter-B', weight: 0.8 },
    { article: 'Art. 185 ter-C', weight: 0.9 },
  ],
  'non-résident': [
    { article: 'Art. 185 ter-A', weight: 1.0 },
    { article: 'Art. 185 ter-C', weight: 0.9 },
  ],
  'sans domicile fiscal': [
    { article: 'Art. 185 ter-A', weight: 1.0 },
  ],
  'personnes étrangères': [
    { article: 'Art. 185 ter-A', weight: 0.9 },
  ],
  'redevances': [
    { article: 'Art. 185 ter-A', weight: 0.9 },
    { article: 'Art. 185 ter-C', weight: 0.9 },
  ],
  'royalties': [
    { article: 'Art. 185 ter-A', weight: 0.9 },
    { article: 'Art. 185 ter-C', weight: 0.8 },
  ],
  'brevets': [
    { article: 'Art. 185 ter-A', weight: 0.9 },
  ],
  'marques': [
    { article: 'Art. 185 ter-A', weight: 0.9 },
  ],
  'procédés secrets': [
    { article: 'Art. 185 ter-A', weight: 1.0 },
  ],
  'know-how': [
    { article: 'Art. 185 ter-A', weight: 0.9 },
  ],
  'assistance technique': [
    { article: 'Art. 185 ter-A', weight: 1.0 },
  ],
  'assistance financière': [
    { article: 'Art. 185 ter-A', weight: 1.0 },
  ],
  'assistance comptable': [
    { article: 'Art. 185 ter-A', weight: 1.0 },
  ],
  'location équipements': [
    { article: 'Art. 185 ter-A', weight: 0.9 },
  ],
  'location matériel': [
    { article: 'Art. 185 ter-A', weight: 0.9 },
  ],
  'trading': [
    { article: 'Art. 185 ter-A', weight: 0.9 },
  ],
  'commercialisation hydrocarbures': [
    { article: 'Art. 185 ter-A', weight: 1.0 },
  ],
  'frais commercialisation': [
    { article: 'Art. 185 ter-A', weight: 0.9 },
  ],
  'propriété intellectuelle': [
    { article: 'Art. 185 ter-A', weight: 0.9 },
  ],

  // Art. 185 ter-B - Débiteur résident
  'débiteur résident': [
    { article: 'Art. 185 ter-B', weight: 1.0 },
  ],
  'payeur résident': [
    { article: 'Art. 185 ter-B', weight: 0.9 },
  ],
  'obligation retenue non-résident': [
    { article: 'Art. 185 ter-B', weight: 1.0 },
  ],

  // Art. 185 ter-C - Taux retenue non-résidents
  'taux non-résidents': [
    { article: 'Art. 185 ter-C', weight: 1.0 },
  ],
  'taux retenue non-résidents': [
    { article: 'Art. 185 ter-C', weight: 1.0 },
  ],
  '20%': [
    { article: 'Art. 185 ter-C', weight: 1.0 },
  ],
  '20 pourcent': [
    { article: 'Art. 185 ter-C', weight: 1.0 },
  ],
  'vingt pourcent': [
    { article: 'Art. 185 ter-C', weight: 1.0 },
  ],
  'taux général': [
    { article: 'Art. 185 ter-C', weight: 0.9 },
  ],
  'prestations ponctuelles': [
    { article: 'Art. 185 ter-C', weight: 0.9 },
  ],
  'redevances audiovisuelles': [
    { article: 'Art. 185 ter-C', weight: 1.0 },
  ],
  'streaming': [
    { article: 'Art. 185 ter-C', weight: 0.9 },
  ],
  'cemac': [
    { article: 'Art. 185 ter-C', weight: 0.9 },
  ],
  'résidents cemac': [
    { article: 'Art. 185 ter-C', weight: 1.0 },
  ],
  '5,75%': [
    { article: 'Art. 185 ter-C', weight: 1.0 },
  ],
  '5.75%': [
    { article: 'Art. 185 ter-C', weight: 1.0 },
  ],
  'zone angola': [
    { article: 'Art. 185 ter-C', weight: 1.0 },
  ],
  'angola': [
    { article: 'Art. 185 ter-C', weight: 0.9 },
  ],
  'affrètement': [
    { article: 'Art. 185 ter-C', weight: 1.0 },
  ],
  'location navires': [
    { article: 'Art. 185 ter-C', weight: 1.0 },
  ],
  'location aéronefs': [
    { article: 'Art. 185 ter-C', weight: 1.0 },
  ],
  'transport maritime': [
    { article: 'Art. 185 ter-C', weight: 0.9 },
  ],
  'transport aérien': [
    { article: 'Art. 185 ter-C', weight: 0.9 },
  ],
  'agents portuaires': [
    { article: 'Art. 185 ter-C', weight: 1.0 },
  ],
  '5%': [
    { article: 'Art. 185 ter-C', weight: 0.9 },
    { article: 'Art. 183', weight: 0.7 },
  ],
  'cinq pourcent': [
    { article: 'Art. 185 ter-C', weight: 0.9 },
  ],
  'intérêts emprunts': [
    { article: 'Art. 185 ter-C', weight: 1.0 },
  ],
  'emprunts pétroliers': [
    { article: 'Art. 185 ter-C', weight: 1.0 },
  ],
  'exploration pétrolière': [
    { article: 'Art. 185 ter-C', weight: 0.9 },
  ],
  'exploitation pétrolière': [
    { article: 'Art. 185 ter-C', weight: 0.9 },
  ],

  // Art. 185 ter-D - Imputation
  'imputation retenue': [
    { article: 'Art. 185 ter-D', weight: 1.0 },
  ],
  'crédit impôt': [
    { article: 'Art. 185 ter-D', weight: 0.9 },
  ],
  'déduction retenue': [
    { article: 'Art. 185 ter-D', weight: 0.9 },
  ],

  // Art. 185 ter-E - Procédure versement
  'procédure versement': [
    { article: 'Art. 185 ter-E', weight: 1.0 },
  ],
  'modalités versement': [
    { article: 'Art. 185 ter-E', weight: 1.0 },
  ],

  // Art. 185 ter-F - Exclusions
  'exclusions non-résidents': [
    { article: 'Art. 185 ter-F', weight: 1.0 },
  ],
  'exonération non-résidents': [
    { article: 'Art. 185 ter-F', weight: 0.9 },
  ],
  'dérogation retenue': [
    { article: 'Art. 185 ter-F', weight: 0.9 },
  ],
};

/**
 * Synonymes fiscaux pour l'expansion des requêtes
 */
export const SYNONYMS_DD: Record<string, string[]> = {
  'retenue à la source': ['ras', 'prélèvement', 'withholding', 'retenue'],
  'employeur': ['débirentier', 'payeur'],
  'non-résident': ['étranger', 'sans domicile fiscal', 'personne étrangère'],
  'commissions': ['courtages', 'ristournes'],
  'honoraires': ['vacations', 'rémunérations occasionnelles'],
  'redevances': ['royalties', 'licences', 'droits usage'],
  'assistance technique': ['consulting', 'conseil technique'],
  'snc': ['société en nom collectif'],
  'cemac': ['communauté économique afrique centrale'],
  'affrètement': ['location navires', 'charter'],
};

/**
 * Trouve les articles pertinents pour une requête DD
 */
export function findArticlesForQueryDD(query: string): string[] {
  const normalizedQuery = query.toLowerCase();
  const articlesFound = new Map<string, number>();

  // Recherche directe dans les mots-clés
  for (const [keyword, articles] of Object.entries(KEYWORD_ARTICLE_MAP_DD)) {
    if (normalizedQuery.includes(keyword.toLowerCase())) {
      for (const { article, weight } of articles) {
        const current = articlesFound.get(article) || 0;
        articlesFound.set(article, Math.max(current, weight));
      }
    }
  }

  // Expansion par synonymes
  for (const [term, synonyms] of Object.entries(SYNONYMS_DD)) {
    if (normalizedQuery.includes(term) || synonyms.some(s => normalizedQuery.includes(s))) {
      const articles = KEYWORD_ARTICLE_MAP_DD[term];
      if (articles) {
        for (const { article, weight } of articles) {
          const current = articlesFound.get(article) || 0;
          articlesFound.set(article, Math.max(current, weight * 0.9));
        }
      }
    }
  }

  // Tri par poids décroissant et retour
  return [...articlesFound.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([article]) => article);
}
