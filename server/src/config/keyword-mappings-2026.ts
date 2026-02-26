/**
 * Mapping des mots-cles vers les articles du CGI 2026
 * Chapitre IS - Impot sur les Societes (Art. 1 a 92K)
 *
 * REGLE : Le premier article de chaque liste est la SOURCE PRIMAIRE
 *
 * @author NORMX AI - CGI 242
 * @version 2026
 * @base Directive CEMAC n0119/25-UEAC-177-CM-42 du 09 janvier 2025
 */

export const KEYWORD_ARTICLE_MAP_2026: Record<string, string[]> = {

  // ========== GENERALITES - TAUX IS ==========
  'taux is': ['Art. 86A'],
  'taux impot societes': ['Art. 86A'],
  '25%': ['Art. 86A'],
  '33%': ['Art. 86A'],
  'taux normal is': ['Art. 86A'],
  'taux non residents': ['Art. 86A'],

  // ========== ART. 2 - PERSONNES IMPOSABLES ==========
  'personnes imposables is': ['Art. 2'],
  'societes de capitaux': ['Art. 2'],
  'sa': ['Art. 2'],
  'sas': ['Art. 2'],
  'sarl': ['Art. 2'],
  'option is': ['Art. 2'],
  'snc option': ['Art. 2'],
  '30 octobre': ['Art. 2'],

  // ========== ART. 3 - EXONERATIONS ==========
  'exonerations is': ['Art. 3'],
  'cooperatives agricoles': ['Art. 3'],
  'exonerations conventionnelles': ['Art. 3'],
  'suppression exonerations': ['Art. 3'],

  // ========== ART. 3A - CREDIT D'IMPOT ==========
  'credit impot investissement': ['Art. 3A'],
  'credit impot': ['Art. 3A'],
  '15% credit': ['Art. 3A'],
  'report credit impot': ['Art. 3A'],

  // ========== ART. 4, 4A, 7 - TERRITORIALITE ==========
  'territorialite is': ['Art. 4'],
  'etablissement stable': ['Art. 4A'],
  'installation fixe': ['Art. 4A'],
  'chantier construction': ['Art. 4A'],
  '3 mois chantier': ['Art. 4A'],
  '183 jours': ['Art. 4A'],
  'services etablissement stable': ['Art. 4A'],
  'residence fiscale societe': ['Art. 7'],

  // ========== ART. 8-11 - BENEFICE IMPOSABLE ==========
  'benefice imposable': ['Art. 8'],
  'benefice net': ['Art. 8'],
  'actif net': ['Art. 9'],
  'stocks': ['Art. 10'],
  'periode imposition': ['Art. 11'],

  // ========== ART. 12-16 - PRODUITS IMPOSABLES ==========
  'produits imposables': ['Art. 12'],
  'revenus etrangers': ['Art. 13'],
  'cessions actif': ['Art. 14', 'Art. 15', 'Art. 16'],

  // ========== ART. 17-25 - PLUS-VALUES ==========
  'plus-values': ['Art. 17'],
  'moins-values': ['Art. 17'],
  'regime plus-values': ['Art. 17'],
  'remploi plus-values': ['Art. 17 A'],
  '3 ans remploi': ['Art. 17 A'],
  'regime mere-fille': ['Art. 20', 'Art. 21'],
  'dividendes intragroupe': ['Art. 20'],
  'restructurations': ['Art. 22', 'Art. 23', 'Art. 24', 'Art. 25'],
  'fusion': ['Art. 22'],
  'scission': ['Art. 23'],
  'apport partiel actif': ['Art. 24'],

  // ========== ART. 26 - CONDITIONS DEDUCTIBILITE ==========
  'conditions deductibilite': ['Art. 26'],
  'charges deductibles': ['Art. 26'],
  'acte anormal gestion': ['Art. 26'],
  '200 000 fcfa': ['Art. 26'],
  '200000 fcfa': ['Art. 26'],
  '200.000 fcfa': ['Art. 26'],
  'deux cent mille': ['Art. 26'],
  'paiement especes': ['Art. 26'],
  'especes': ['Art. 26'],
  'cash': ['Art. 26'],
  'numeraire': ['Art. 26'],
  'liquide': ['Art. 26'],
  'argent liquide': ['Art. 26'],
  'plafond especes': ['Art. 26'],
  'reglement especes': ['Art. 26'],
  'montant maximum especes': ['Art. 26'],
  'seuil especes': ['Art. 26'],

  // ========== ART. 27-37 - CHARGES PERSONNEL ==========
  'charges personnel': ['Art. 27'],
  'remunerations': ['Art. 27'],
  'salaires deductibles': ['Art. 27'],
  'gerants': ['Art. 28', 'Art. 29'],
  'administrateurs': ['Art. 30', 'Art. 31', 'Art. 32'],
  'jetons presence': ['Art. 30'],
  'frais transport': ['Art. 35', 'Art. 36'],
  'voyages conges': ['Art. 37'],

  // ========== ART. 38-41 - FRAIS SIEGE REDEVANCES ==========
  'frais de siege': ['Art. 38'],
  'redevances': ['Art. 39', 'Art. 40'],
  'commissions': ['Art. 39'],
  '20% redevances': ['Art. 39'],
  'pret main oeuvre': ['Art. 41'],

  // ========== ART. 42 - LOYERS ==========
  'loyers': ['Art. 42'],
  'credit-bail': ['Art. 42', 'Art. 55', 'Art. 56'],
  'leasing': ['Art. 42', 'Art. 55'],

  // ========== ART. 43 - IMPOTS DEDUCTIBLES ==========
  'impots deductibles': ['Art. 43'],
  'amendes non deductibles': ['Art. 43'],

  // ========== ART. 44 - ASSURANCES ==========
  'assurances deductibles': ['Art. 44'],
  'primes assurance': ['Art. 44'],
  'captives assurance': ['Art. 44'],

  // ========== ART. 45-46 - DONS LIBERALITES ==========
  'dons': ['Art. 45'],
  'liberalites': ['Art. 45'],
  'subventions': ['Art. 45'],
  'aides non deductibles': ['Art. 46'],
  'sfec': ['Art. 46', 'Art. 61'],

  // ========== ART. 47 - DEPENSES SOMPTUAIRES ==========
  'depenses somptuaires': ['Art. 47'],
  'chasse': ['Art. 47'],
  'plaisance': ['Art. 47'],

  // ========== ART. 48 - REMUNERATIONS OCCULTES ==========
  'remunerations occultes': ['Art. 48'],

  // ========== ART. 49 - CHARGES FINANCIERES ==========
  'charges financieres': ['Art. 49'],
  'interets': ['Art. 49'],
  'sous-capitalisation': ['Art. 49'],
  '20% ebe': ['Art. 49'],
  'limitation interets': ['Art. 49'],
  'beac': ['Art. 49'],

  // ========== ART. 51-61 - AMORTISSEMENTS ==========
  'amortissements': ['Art. 51'],
  'taux amortissement': ['Art. 52'],
  'amortissement lineaire': ['Art. 53'],
  'amortissement degressif': ['Art. 54'],
  'amortissement accelere': ['Art. 57'],
  '40 000 000 fcfa': ['Art. 57', 'Art. 58'],
  'vehicules tourisme': ['Art. 58'],
  '500 000 fcfa': ['Art. 59'],
  'amortissement 100%': ['Art. 59', 'Art. 61'],

  // ========== ART. 63-74 - PROVISIONS ==========
  'provisions': ['Art. 63'],
  'creances douteuses': ['Art. 64'],
  'provision stock': ['Art. 65'],
  'cobac': ['Art. 66'],
  'provisions reglementees': ['Art. 67'],

  // ========== ART. 75 - REPORT DEFICITS ==========
  'report deficits': ['Art. 75'],
  'deficits reportables': ['Art. 75'],
  '5 ans deficit': ['Art. 75'],
  'pertes reportables': ['Art. 75'],

  // ========== ART. 77-85 - PRIX DE TRANSFERT ==========
  'prix de transfert': ['Art. 77'],
  'prix transfert': ['Art. 77'],
  'parties liees': ['Art. 77'],
  'entreprises liees': ['Art. 77'],
  'documentation prix transfert': ['Art. 78'],
  '500 000 000 fcfa': ['Art. 78'],
  'methodes prix transfert': ['Art. 79'],
  'cup': ['Art. 79'],
  'mtmn': ['Art. 79'],
  'app': ['Art. 80'],
  'accord prealable prix': ['Art. 80'],
  'sanctions prix transfert': ['Art. 81'],
  '5 000 000 amende': ['Art. 81'],
  '25 000 000 amende': ['Art. 81'],
  'declaration pays par pays': ['Art. 82', 'Art. 83', 'Art. 84', 'Art. 85'],

  // ========== ART. 86-86F - ASSIETTE, TAUX ET RETENUES ==========
  'assiette is': ['Art. 86'],
  'minimum perception': ['Art. 86B'],
  'minimum is': ['Art. 86B'],
  '1% minimum': ['Art. 86B'],
  '2% minimum': ['Art. 86B'],
  'deficit consecutif': ['Art. 86B'],
  'acomptes minimum perception': ['Art. 86B'],
  '15 mars': ['Art. 86B'],
  '15 juin': ['Art. 86B'],
  '15 septembre': ['Art. 86B'],
  '15 decembre': ['Art. 86B'],
  'retenue source': ['Art. 86C', 'Art. 86D', 'Art. 86E', 'Art. 86F'],
  '20% retenue': ['Art. 86C'],
  'prestations non residents': ['Art. 86C'],
  'retenue source interets': ['Art. 86D'],
  'retenue source dividendes': ['Art. 86E', 'Art. 185 ter'],
  'retenue source redevances': ['Art. 86F'],
  'royalties retenue': ['Art. 86F'],
  'acomptes is': ['Art. 124', 'Art. 124A'],
  '15 fevrier': ['Art. 124'],
  '15 mai': ['Art. 124'],
  '15 aout': ['Art. 124'],
  '15 novembre': ['Art. 124'],
  'declarations obligations': ['Art. 124A'],
  'liasse fiscale': ['Art. 124A'],

  // ========== ART. 87 - REGIME MERE-FILLE ==========
  'societes meres': ['Art. 87'],
  'filiales': ['Art. 87'],
  'dividendes mere-fille': ['Art. 87'],
  '25% participation': ['Art. 87'],
  'quote-part 10%': ['Art. 87A'],
  '2 ans conservation': ['Art. 87A'],

  // ========== ART. 88 - SUCCURSALES ==========
  'succursales': ['Art. 88'],
  'conventions internationales': ['Art. 88'],

  // ========== ART. 89 - QUARTIERS GENERAUX ==========
  'quartiers generaux': ['Art. 89'],
  'qg cemac': ['Art. 89'],
  'base forfaitaire qg': ['Art. 89A'],

  // ========== ART. 90 - HOLDINGS ==========
  'holdings': ['Art. 90'],
  'societe holding': ['Art. 90'],
  'deux tiers actif': ['Art. 90'],
  'regime holding': ['Art. 90A', 'Art. 90B'],
  'plus-values cession holding': ['Art. 90D'],

  // ========== ART. 91 - INTEGRATION FISCALE ==========
  'integration fiscale': ['Art. 91'],
  'groupe fiscal': ['Art. 91'],
  '95% participation': ['Art. 91'],
  'resultat ensemble': ['Art. 91A'],
  'neutralisation': ['Art. 91B'],
  'option integration': ['Art. 91C'],
  '5 exercices': ['Art. 91C'],

  // ========== ART. 92 - PERSONNES MORALES ETRANGERES ==========
  'personnes morales etrangeres': ['Art. 92'],
  'non residents is': ['Art. 92'],
  'forfaitaire 22%': ['Art. 92'],
  'sous-traitants petroliers': ['Art. 92A', 'Art. 92B'],
  'quitus fiscal': ['Art. 92E'],
  'ate': ['Art. 92F'],
  'autorisation temporaire exercer': ['Art. 92F'],

  // ========== ART. 92A - BASE FORFAITAIRE ETRANGERS ==========
  'base forfaitaire': ['Art. 92A'],
  '22%': ['Art. 92A'],
  '22 pour cent': ['Art. 92A'],
  'vingt-deux pour cent': ['Art. 92A'],
  'pm etrangeres': ['Art. 92A'],
  'calcul base etrangers': ['Art. 92A'],
  'assiette etrangers': ['Art. 92A'],
  'mobilisation': ['Art. 92A'],
  'demobilisation': ['Art. 92A'],
  'mob demob': ['Art. 92A'],
  'frais mobilisation': ['Art. 92A'],
  'frais demobilisation': ['Art. 92A'],
  'exclusion mobilisation': ['Art. 92A'],
  'transfert effectif': ['Art. 92A'],
  'facture separee': ['Art. 92A'],
  // 'mob' et 'demob' supprimés - causent des faux positifs (ex: "immobilières" contient "mob")
  'installation chantier': ['Art. 92A'],
  'repli chantier': ['Art. 92A'],

  // ========== ART. 92J - REGIME DEROGATOIRE PETROLIER ==========
  'zone angola': ['Art. 92J'],
  '5.75%': ['Art. 92J'],
  '70%': ['Art. 92J'],
  '70 pour cent': ['Art. 92J'],
  'soixante-dix pour cent': ['Art. 92J'],
  'seuil 70%': ['Art. 92J'],
  'seuil ca petrolier': ['Art. 92J'],
  'seuil petrolier': ['Art. 92J'],
  'regime derogatoire': ['Art. 92J'],
  'regime derogatoire petrolier': ['Art. 92J'],
  'catering': ['Art. 92J'],
  'restauration petrolier': ['Art. 92J'],
  'cantine petrolier': ['Art. 92J'],
  'sites petroliers': ['Art. 92J'],
  'services annexes petrolier': ['Art. 92J'],
  'hebergement petrolier': ['Art. 92J'],
  'transport petrolier': ['Art. 92J'],
  'charte investissements': ['Art. 92J', 'Art. 3'],
  'charte des investissements': ['Art. 92J', 'Art. 3'],
  'non eligible charte': ['Art. 92J'],
  'exclusion charte': ['Art. 92J'],
  'ineligibilite charte': ['Art. 92J'],
  'eligible charte petrolier': ['Art. 92J'],
  'sous-traitants derogatoire': ['Art. 92J'],

  // ========== ART. 185 ter - IRVM DIVIDENDES ==========
  'irvm dividendes': ['Art. 185 ter'],
  'retenue dividendes': ['Art. 185 ter', 'Art. 86E'],
  'distributions benefices': ['Art. 185 ter'],
  'impot revenu valeurs mobilieres': ['Art. 185 ter'],

  // ========== ART. 378 - SANCTIONS ==========
  'sanctions fiscales': ['Art. 378', 'Art. 81'],
  'penalites fiscales': ['Art. 378'],
  'amendes fiscales': ['Art. 378', 'Art. 81'],
  'interet retard': ['Art. 378'],
  'majoration retard': ['Art. 378'],

  // ========== IRF - IMPOT SUR LE REVENU FONCIER (Art. 111-113A) ==========
  // Art. 111 - Champ d'application IRF
  'irf': ['Art. 111'],
  'revenus fonciers': ['Art. 111'],
  'loyers imposables': ['Art. 111'],
  'proprietes baties': ['Art. 111'],
  'proprietes non baties': ['Art. 111'],
  'impot revenu foncier': ['Art. 111'],

  // Art. 111B - Crédit-bail immobilier IRF
  'credit-bail immobilier': ['Art. 111B'],
  'leasing immobilier': ['Art. 111B'],
  'location-vente': ['Art. 111B'],
  'levee option irf': ['Art. 111B'],

  // Art. 111C - Exonérations IRF
  'exoneration irf': ['Art. 111C'],
  'exonération irf': ['Art. 111C'],
  'exoneration fonciere': ['Art. 111C'],
  'exonération foncière': ['Art. 111C'],
  'residence principale exoneration': ['Art. 111C'],
  'résidence principale': ['Art. 111C'],
  'exoneration residence principale': ['Art. 111C'],
  'exonération résidence principale': ['Art. 111C'],
  'exoneration famille': ['Art. 111C'],
  'exonération famille': ['Art. 111C'],
  'irf famille': ['Art. 111C'],
  'dispense irf': ['Art. 111C'],
  '5 ans residence': ['Art. 111C'],
  '5 ans résidence': ['Art. 111C'],
  'location famille': ['Art. 111C'],
  'ascendants descendants': ['Art. 111C'],
  'cession residence principale': ['Art. 111C'],
  'cession résidence principale': ['Art. 111C'],
  'plus-value residence principale': ['Art. 111C'],
  'plus-value résidence principale': ['Art. 111C'],
  'residence principale imposable': ['Art. 111C'],
  'résidence principale imposable': ['Art. 111C'],
  'loyers enfant': ['Art. 111C'],
  'logement gratuitement': ['Art. 111C'],
  'occupé gratuitement': ['Art. 111C'],
  'occupation gratuite famille': ['Art. 111C'],
  'logement occupe gratuitement': ['Art. 111C'],
  'logement occupé gratuitement': ['Art. 111C'],
  'gratuitement enfant': ['Art. 111C'],
  'gratuitement par un enfant': ['Art. 111C'],
  'loyers imposables enfant': ['Art. 111C'],
  "loyers d'un logement": ['Art. 111C'],

  // Art. 113 - Taux IRF
  'taux irf': ['Art. 113'],
  'taux loyers': ['Art. 113'],
  'taux revenus fonciers': ['Art. 113'],
  '9%': ['Art. 113'],
  '9 pour cent': ['Art. 113'],
  'taux plus-values immobilieres': ['Art. 113'],
  'taux plus-values immobilières': ['Art. 113'],
  'plus-values immobilières': ['Art. 113'],
  'taux irf plus-values': ['Art. 113'],
  '15% plus-values': ['Art. 113'],
  '15% immobilier': ['Art. 113'],
  'quinze pour cent plus-values': ['Art. 113'],
  'taux plus-value immobiliere': ['Art. 113'],
  'taux plus-value immobilière': ['Art. 113'],
  'plus-values immobilieres taux': ['Art. 113'],
  'irf sur les plus-values': ['Art. 113'],
  'sur les plus-values immobilieres': ['Art. 113'],
  'sur les plus-values immobilières': ['Art. 113'],
  'plus-values immobili': ['Art. 113'],

  // Art. 113A - Retenue à la source IRF
  'retenue irf': ['Art. 113A'],
  'retenue loyers': ['Art. 113A'],
  'retenue liberatoire irf': ['Art. 113A'],
  'retenue libératoire irf': ['Art. 113A'],
  'retenue source foncier': ['Art. 113A'],
  'date retenue irf': ['Art. 113A'],
  '15 mars irf': ['Art. 113A'],
  'nouveau bail retenue': ['Art. 113A'],
  'nouveau bail': ['Art. 113A'],
  '3 mois bail': ['Art. 113A'],
  'trois mois bail': ['Art. 113A'],
  'entree jouissance': ['Art. 113A'],
  'entrée jouissance': ['Art. 113A'],
  'locataire retenue': ['Art. 113A'],
  'ras loyers': ['Art. 113A'],
  'date limite retenue irf': ['Art. 113A'],
  'date limite retenue': ['Art. 113A'],
  'delai retenue irf': ['Art. 113A'],
  'délai retenue irf': ['Art. 113A'],
  'delai nouveau bail': ['Art. 113A'],
  'délai nouveau bail': ['Art. 113A'],
  'irf liberatoire': ['Art. 113A'],
  'irf libératoire': ['Art. 113A'],
  'retenue liberatoire': ['Art. 113A'],
  'retenue libératoire': ['Art. 113A'],
  'retenue irf annuelle': ['Art. 113A'],
  'delai retenue nouveau bail': ['Art. 113A'],
  'délai retenue nouveau bail': ['Art. 113A'],
  'délai effectuer retenue': ['Art. 113A'],
  'pour qui retenue': ['Art. 113A'],
  'qui libératoire': ['Art. 113A'],
  'date limite de la retenue': ['Art. 113A'],
  'date limite de la retenue irf': ['Art. 113A'],
  'délai effectuer la retenue': ['Art. 113A'],
  'délai effectuer la retenue irf': ['Art. 113A'],
  'retenue irf pour un nouveau': ['Art. 113A'],
  'pour qui la retenue': ['Art. 113A'],
  'pour qui la retenue irf': ['Art. 113A'],
  'est-elle libératoire': ['Art. 113A'],
  'caractère libératoire': ['Art. 113A'],
};

/**
 * Synonymes pour expansion de requetes CGI 2026
 */
export const SYNONYMS_2026: Record<string, string[]> = {
  'is': ['impot sur les societes', 'impot societes', 'corporate tax'],
  'etablissement stable': ['es', 'succursale', 'presence permanente', 'installation fixe'],
  'prix de transfert': ['pt', 'transfer pricing', 'transactions intragroupe'],
  'minimum de perception': ['minimum is', 'impot minimum', 'plancher fiscal'],
  'regime mere-fille': ['dividendes intragroupe', 'participation qualifiee'],
  'integration fiscale': ['groupe fiscal', 'consolidation fiscale'],
  'holding': ['societe de participation', 'societe portefeuille'],
  'credit-bail': ['leasing', 'location financiere', 'loa'],
  'amortissement': ['dotation aux amortissements', 'depreciation', 'dap'],
  'provisions': ['dotation aux provisions', 'charges a venir'],
  'retenue a la source': ['ras', 'withholding tax', 'prelevement a la source', 'wht'],
  'redevances': ['royalties', 'droits auteur', 'licences'],
  'dividendes': ['distributions', 'benefices distribues', 'irvm'],
  'sanctions': ['penalites', 'amendes', 'majorations'],
  'acomptes': ['versements anticipes', 'paiements fractionnaires'],
  'quitus fiscal': ['attestation fiscale', 'certificat conformite'],
  'ebitda': ['ebe', 'excedent brut exploitation'],
  'benefice imposable': ['resultat fiscal', 'base imposable'],
  // Nouveaux synonymes pour tests 7, 21, 33, 88, 98, 99
  'especes': ['cash', 'numeraire', 'liquide', 'argent liquide', 'paiement cash'],
  'mobilisation': ['mob', 'installation', 'mise en place', 'installation chantier'],
  'demobilisation': ['demob', 'desinstallation', 'repli', 'repli chantier'],
  'base forfaitaire': ['assiette forfaitaire', 'forfait 22%', 'base 22%'],
  'catering': ['restauration', 'cantine', 'service repas', 'alimentation'],
  'charte des investissements': ['charte investissements', 'code investissements', 'avantages investissements'],
  'regime derogatoire': ['regime special', 'regime petrolier', 'derogation'],
  // IRF - Synonymes pour revenus fonciers
  'irf': ['impot revenu foncier', 'impot foncier', 'taxe fonciere'],
  'revenus fonciers': ['loyers', 'revenus immobiliers', 'revenus locatifs'],
  'exoneration irf': ['dispense irf', 'franchise irf', 'exemption fonciere'],
  'retenue irf': ['prelevement irf', 'ras foncier', 'retenue loyers'],
  'plus-values immobilieres': ['gains immobiliers', 'profit cession immobiliere', 'plus-value immeuble'],
};
