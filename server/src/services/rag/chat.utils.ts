// server/src/services/rag/chat.utils.ts
// Fonctions utilitaires pour le service de chat
// Copie de cgi-engine adaptée (sans .js)

import { SearchResult } from './hybrid-search.service';

export interface Citation {
  articleNumber: string;
  titre?: string;
  excerpt: string;
  score: number;
}

/**
 * Détecte si la requête est une simple salutation
 */
export function isSimpleGreeting(query: string): boolean {
  const lowerQuery = query.toLowerCase().trim();
  const greetings = ['bonjour', 'salut', 'hello', 'hi', 'bonsoir', 'coucou', 'hey', 'merci', 'au revoir', 'bye'];

  if (lowerQuery.length < 20) {
    return greetings.some(g => lowerQuery.startsWith(g));
  }

  return false;
}

/**
 * Détecte si la requête nécessite une recherche dans le CGI
 */
export function isFiscalQuery(query: string): boolean {
  return !isSimpleGreeting(query);
}

/**
 * Construit le contexte à partir des résultats de recherche
 */
export function buildContext(results: SearchResult[]): string {
  return results
    .map(r => {
      const { numero, titre, contenu, tome, chapitre } = r.payload;
      let header = `${numero}`;
      if (titre) header += ` - ${titre}`;
      if (tome) header += ` (${tome}`;
      if (chapitre) header += `, ${chapitre}`;
      if (tome) header += ')';

      return `${header}\n${contenu.substring(0, 2000)}`;
    })
    .join('\n\n---\n\n');
}

/**
 * Extrait les numéros d'articles mentionnés dans la réponse de Claude
 */
export function extractArticlesFromResponse(response: string, searchResults: SearchResult[]): Citation[] {
  const articleRegex = /(?:l')?article\s*(\d+\s*[A-Z]?(?:\s*(?:,|et)\s*\d+\s*[A-Z]?)*)|art\.\s*(\d+\s*[A-Z]?)/gi;

  const mentionedArticles = new Set<string>();
  let match;

  while ((match = articleRegex.exec(response)) !== null) {
    const articleNumbers = (match[1] || match[2]).match(/\d+\s*[A-Z]?/gi);
    if (articleNumbers) {
      articleNumbers.forEach(num => {
        const normalized = num.replace(/\s+/g, ' ').trim().toUpperCase();
        mentionedArticles.add(normalized);
      });
    }
  }

  if (mentionedArticles.size === 0) {
    return [];
  }

  const citations: Citation[] = [];

  mentionedArticles.forEach(articleNum => {
    const found = searchResults.find(r =>
      r.payload.numero.includes(articleNum) ||
      r.payload.numero === `Art. ${articleNum}` ||
      r.payload.numero === `Article ${articleNum}`
    );

    if (found) {
      citations.push({
        articleNumber: `Art. ${articleNum}`,
        titre: found.payload.titre,
        excerpt: found.payload.contenu.substring(0, 200) + '...',
        score: found.score,
      });
    } else {
      citations.push({
        articleNumber: `Art. ${articleNum}`,
        excerpt: '',
        score: 0,
      });
    }
  });

  return citations.sort((a, b) => {
    const numA = parseInt(a.articleNumber.replace(/\D/g, ''));
    const numB = parseInt(b.articleNumber.replace(/\D/g, ''));
    return numA - numB;
  });
}
