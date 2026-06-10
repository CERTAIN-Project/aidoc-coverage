/**
 * Build-time script: runs coverage analysis for all three example ontologies
 * and writes pre-generated results to static/data/ so the static adapter can
 * serve them without a server.
 *
 * Run via: tsx scripts/pregenerate.ts
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { analyzeCoverage } from '../src/lib/server/coverage/engine.ts';
import { loadOntologyFromContent } from '../src/lib/server/coverage/loaders.ts';
import { coverageQueryManifest } from '../src/lib/server/coverage/query-set/manifest.ts';
import type { QueryDefinition } from '../src/lib/server/coverage/types.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const ORIGINATING_PATH = 'src/lib/server/coverage/inputs/aidoc-ap.ttl';
const SPARQL_ASSETS_DIR = 'src/lib/server/coverage/query-set/assets';

const EXAMPLES: Record<string, string> = {
  encom: 'src/lib/server/coverage/inputs/examples/encom.ttl',
  bank: 'src/lib/server/coverage/inputs/examples/bank.ttl',
  civicvoice: 'src/lib/server/coverage/inputs/examples/civicvoice.ttl',
  'hr-ai': 'src/lib/server/coverage/inputs/examples/hr-ai.ttl',
  biometrics: 'src/lib/server/coverage/inputs/examples/biometrics.ttl'
};

async function buildQuerySet(): Promise<QueryDefinition[]> {
  const queries = await Promise.all(
    coverageQueryManifest.map(async (entry) => {
      const filename = entry.sourcePath.split('/').at(-1)!;
      const queryText = await readFile(
        path.resolve(root, SPARQL_ASSETS_DIR, filename),
        'utf8'
      );
      return { ...entry, queryText } satisfies QueryDefinition;
    })
  );

  if (!queries.length) {
    throw new Error('Coverage query set is empty.');
  }

  const version = createHash('sha256')
    .update(queries.map((q) => `${q.id}:${q.queryText}`).join('\n'))
    .digest('hex');

  console.log(`  Query set: ${queries.length} queries (version ${version.slice(0, 8)})`);
  return queries;
}

async function main() {
  const outputDir = path.resolve(root, 'static/data');
  await mkdir(outputDir, { recursive: true });

  console.log('Building query set...');
  const [queries, originatingContent] = await Promise.all([
    buildQuerySet(),
    readFile(path.resolve(root, ORIGINATING_PATH), 'utf8')
  ]);

  const originating = loadOntologyFromContent(originatingContent, 'aidoc-ap.ttl', 'originating');

  for (const [key, ttlPath] of Object.entries(EXAMPLES)) {
    process.stdout.write(`Analyzing ${key}...`);
    const instantiatedContent = await readFile(path.resolve(root, ttlPath), 'utf8');
    const instantiated = loadOntologyFromContent(instantiatedContent, `${key}.ttl`, 'instantiated');

    const result = await analyzeCoverage([originating, instantiated], queries);

    const outPath = path.resolve(outputDir, `coverage-${key}.json`);
    await writeFile(outPath, JSON.stringify(result), 'utf8');
    console.log(` done (${result.summary.totalQueries} queries)`);
  }

  console.log(`Pre-generated coverage data written to static/data/`);
}

main().catch((err) => {
  console.error('Pre-generation failed:', err);
  process.exit(1);
});
