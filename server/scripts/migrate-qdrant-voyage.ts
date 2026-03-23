// scripts/migrate-qdrant-voyage.ts
// Migration: fichiers JSON CGI → Qdrant cgi_2026 (Voyage AI 1024d)
// Rate limiting: 3 RPM / 10K TPM (plan gratuit Voyage AI)

import { QdrantClient } from '@qdrant/js-client-rest';
import { VoyageAIClient } from 'voyageai';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config();

const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY!;
const VOYAGE_MODEL = 'voyage-multilingual-2';
const VECTOR_SIZE = 1024;
const TARGET_COLLECTION = 'cgi_2026';

// Rate limiting: 300 RPM avec paiement
const EMBED_BATCH_SIZE = 128;
const DELAY_BETWEEN_BATCHES_MS = 2_000; // 2s entre batches
const MAX_RETRIES = 5;
const RESUME_FROM = 256; // Reprendre après les 256 premiers articles

interface Article {
  numero: string;
  titre: string;
  contenu: string;
  tome: string;
  chapitre: string;
  keywords: string[];
  source: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function embedWithRetry(
  voyage: VoyageAIClient,
  texts: string[],
  retries = MAX_RETRIES
): Promise<{ embeddings: number[][]; tokens: number }> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await voyage.embed({
        input: texts,
        model: VOYAGE_MODEL,
      });
      return {
        embeddings: response.data!.map((d) => d.embedding!),
        tokens: response.usage?.totalTokens || 0,
      };
    } catch (err: any) {
      if (err?.statusCode === 429 && attempt < retries) {
        const waitMs = Math.min(120_000, 30_000 * attempt);
        console.log(`  ⏳ Rate limited, attente ${waitMs / 1000}s (tentative ${attempt}/${retries})...`);
        await sleep(waitMs);
      } else {
        throw err;
      }
    }
  }
  throw new Error('Max retries exceeded');
}

async function main() {
  console.log('=== Migration Qdrant: JSON → Voyage AI 1024d ===\n');

  const qdrant = new QdrantClient({ url: QDRANT_URL, checkCompatibility: false });
  const voyage = new VoyageAIClient({ apiKey: VOYAGE_API_KEY });

  // ── ÉTAPE 1 : Charger les articles ──
  console.log('📖 Étape 1: Chargement des articles...');
  const dataDir = path.join(__dirname, '..', 'data');
  const articleFiles = [
    'articles-2026-tome1.json',
    'articles-2026-tome2.json',
    'articles-2026-tfnc.json',
    'articles-2026-conventions.json',
    'articles-2026-annexes.json',
  ];
  const articles: Article[] = articleFiles.flatMap(f =>
    JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf-8'))
  );
  console.log(`  ✅ ${articles.length} articles chargés (${articleFiles.length} fichiers)\n`);

  // ── ÉTAPE 2 : Vérifier/créer la collection ──
  console.log('🗑️  Étape 2: Préparation Qdrant...');

  const collections = await qdrant.getCollections();
  const exists = collections.collections.some(c => c.name === TARGET_COLLECTION);

  if (RESUME_FROM > 0 && exists) {
    const info = await qdrant.getCollection(TARGET_COLLECTION);
    console.log(`  ↪ Reprise: collection existante avec ${info.points_count} points`);
  } else {
    // Nettoyer tout
    for (const col of collections.collections) {
      try {
        await qdrant.deleteCollection(col.name);
        console.log(`  ✅ ${col.name} supprimée`);
      } catch { /* ignore */ }
    }

    await qdrant.createCollection(TARGET_COLLECTION, {
      vectors: { size: VECTOR_SIZE, distance: 'Cosine' },
      optimizers_config: { indexing_threshold: 10000 },
    });

    await qdrant.createPayloadIndex(TARGET_COLLECTION, { field_name: 'numero', field_schema: 'keyword' });
    await qdrant.createPayloadIndex(TARGET_COLLECTION, { field_name: 'tome', field_schema: 'keyword' });
    await qdrant.createPayloadIndex(TARGET_COLLECTION, { field_name: 'version', field_schema: 'keyword' });

    console.log(`  ✅ ${TARGET_COLLECTION} créée (${VECTOR_SIZE} dims, Cosine)`);
  }
  console.log('');

  // ── ÉTAPE 3 : Embedder et insérer ──
  const remainingArticles = articles.slice(RESUME_FROM);
  const totalBatches = Math.ceil(remainingArticles.length / EMBED_BATCH_SIZE);
  const estimatedMinutes = Math.ceil((totalBatches * DELAY_BETWEEN_BATCHES_MS) / 60_000);
  console.log(`🚀 Étape 3: Embedding Voyage AI (${totalBatches} batches, ~${estimatedMinutes} min)...`);
  if (RESUME_FROM > 0) console.log(`  ↪ Reprise depuis l'article ${RESUME_FROM}`);

  let inserted = RESUME_FROM;
  let totalTokens = 0;
  const startTime = Date.now();

  for (let i = 0; i < remainingArticles.length; i += EMBED_BATCH_SIZE) {
    const batch = remainingArticles.slice(i, i + EMBED_BATCH_SIZE);
    const batchNum = Math.floor(i / EMBED_BATCH_SIZE) + 1;

    // Préparer les textes
    const texts = batch.map((art) => {
      const prefix = `Article ${art.numero}${art.titre ? ` - ${art.titre}` : ''}`;
      const meta = [art.chapitre, `Tome ${art.tome}`].filter(Boolean).join(' | ');
      return `${prefix}\n${meta}\n\n${art.contenu}`.slice(0, 16000);
    });

    // Embed avec retry
    const { embeddings, tokens } = await embedWithRetry(voyage, texts);
    totalTokens += tokens;

    // Insérer dans Qdrant
    const points = batch.map((art, j) => ({
      id: randomUUID(),
      vector: embeddings[j],
      payload: {
        numero: art.numero,
        titre: art.titre,
        contenu: art.contenu,
        tome: art.tome,
        chapitre: art.chapitre,
        keywords: art.keywords || [],
        version: '2026',
      },
    }));

    await qdrant.upsert(TARGET_COLLECTION, { points });

    inserted += batch.length;
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    const percent = ((inserted / articles.length) * 100).toFixed(1);
    const remaining = Math.ceil(((RESUME_FROM + remainingArticles.length - inserted) / EMBED_BATCH_SIZE) * DELAY_BETWEEN_BATCHES_MS / 60_000);
    console.log(
      `  [${batchNum}/${totalBatches}] ${percent}% | ${inserted}/${articles.length} | ` +
      `${tokens} tokens | ${elapsed}s | ~${remaining} min restant`
    );

    // Rate limiting delay (sauf dernier batch)
    if (i + EMBED_BATCH_SIZE < remainingArticles.length) {
      await sleep(DELAY_BETWEEN_BATCHES_MS);
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(0);
  console.log(`\n✅ Migration terminée !`);
  console.log(`  Articles: ${inserted}`);
  console.log(`  Tokens Voyage AI: ${totalTokens.toLocaleString()}`);
  console.log(`  Temps: ${totalTime}s (~${Math.ceil(Number(totalTime) / 60)} min)`);

  // ── ÉTAPE 4 : Vérification ──
  console.log(`\n🔍 Vérification...`);

  const collInfo = await qdrant.getCollection(TARGET_COLLECTION);
  console.log(`  Points: ${collInfo.points_count}`);

  // Test TVA
  const testText = 'Quel est le taux de TVA au Congo ?';
  const testResult = await embedWithRetry(voyage, [testText]);
  const searchResults = await qdrant.search(TARGET_COLLECTION, {
    vector: testResult.embeddings[0],
    limit: 5,
    with_payload: true,
  });

  console.log(`\n  Test: "${testText}"`);
  for (const r of searchResults) {
    const pay = r.payload as Record<string, any>;
    console.log(`    → Art. ${pay.numero} (Tome ${pay.tome}) score=${r.score.toFixed(3)} | ${pay.titre}`);
  }

  console.log('\n🎉 Done !');
}

main().catch((err) => {
  console.error('❌ Erreur:', err.message || err);
  process.exit(1);
});
