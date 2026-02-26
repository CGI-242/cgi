// server/src/scripts/ingest-articles.ts
// Script d'ingestion: lit les JSON de mobile/data/, génère embeddings Voyage, insère dans PostgreSQL + Qdrant
// Usage: npx tsx src/scripts/ingest-articles.ts ../mobile/data/

import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { ingestFromSource, SourceFile } from '../services/rag/ingestion.service';
import { createLogger } from '../utils/logger';

const logger = createLogger('IngestScript');

function isSourceFormat(data: unknown): data is SourceFile | SourceFile[] {
  if (Array.isArray(data)) {
    const first = data[0];
    if (!first) return false;
    return 'meta' in first && ('articles' in first || 'sous_sections' in first || 'sections' in first);
  }
  if (typeof data === 'object' && data !== null) {
    return 'meta' in data && ('articles' in data || 'sous_sections' in data || 'sections' in data);
  }
  return false;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: npx tsx src/scripts/ingest-articles.ts <dossier_json>');
    console.log('Exemple: npx tsx src/scripts/ingest-articles.ts ../mobile/data/');
    process.exit(1);
  }

  const inputPath = path.resolve(args[0]);

  if (!fs.existsSync(inputPath)) {
    logger.error(`Chemin non trouvé: ${inputPath}`);
    process.exit(1);
  }

  try {
    const stat = fs.statSync(inputPath);

    if (!stat.isDirectory()) {
      logger.error('Le chemin doit être un dossier contenant des fichiers JSON');
      process.exit(1);
    }

    const files = fs.readdirSync(inputPath).filter(f => f.endsWith('.json') && f !== 'index.json');
    logger.info(`Trouvé ${files.length} fichiers JSON dans ${inputPath}`);

    const sources: SourceFile[] = [];
    let skipped = 0;

    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(inputPath, file), 'utf-8');
        const data = JSON.parse(content);

        if (isSourceFormat(data)) {
          if (Array.isArray(data)) {
            sources.push(...data);
          } else {
            sources.push(data as SourceFile);
          }
        } else {
          skipped++;
          logger.warn(`Format non reconnu, ignoré: ${file}`);
        }
      } catch (err) {
        skipped++;
        logger.error(`Erreur lecture ${file}:`, err);
      }
    }

    logger.info(`Chargé ${sources.length} sections (${skipped} fichiers ignorés)`);

    if (sources.length === 0) {
      logger.error('Aucune source valide trouvée');
      process.exit(1);
    }

    const result = await ingestFromSource(sources);

    console.log('\n=== RÉSULTAT INGESTION ===');
    console.log(`Total articles:  ${result.total}`);
    console.log(`Insérés:         ${result.inserted}`);
    console.log(`Mis à jour:      ${result.updated}`);
    console.log(`Erreurs:         ${result.errors}`);
    console.log(`Tokens utilisés: ${result.tokensUsed}`);

    process.exit(result.errors > 0 ? 1 : 0);
  } catch (err) {
    logger.error('Erreur fatale:', err);
    process.exit(1);
  }
}

main();
