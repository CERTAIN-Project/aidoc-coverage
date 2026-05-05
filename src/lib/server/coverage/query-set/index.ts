import { createHash } from 'node:crypto';

import { coverageQueryManifest } from './manifest';
import type { QueryDefinition, QuerySet } from '../types';

const queryTextByRelativeAssetPath = import.meta.glob('./assets/*.sparql', {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>;

function getQueryTextFromSourcePath(sourcePath: string): string {
  const filename = sourcePath.split('/').at(-1);

  if (!filename) {
    throw new Error(`Coverage query source path is invalid: ${sourcePath}`);
  }

  const relativeAssetPath = `./assets/${filename}`;
  const queryText = queryTextByRelativeAssetPath[relativeAssetPath];

  if (!queryText) {
    throw new Error(`Coverage query source is missing from assets: ${sourcePath}`);
  }

  return queryText;
}

export async function loadCoverageQuerySet(): Promise<QuerySet> {
  if (process.env.COVERAGE_QUERYSET_MODE === 'missing') {
    throw new Error('Coverage query set is unavailable.');
  }

  const queries = coverageQueryManifest.map(
    (entry) =>
      ({
        ...entry,
        queryText: getQueryTextFromSourcePath(entry.sourcePath)
      }) satisfies QueryDefinition
  );

  if (!queries.length) {
    throw new Error('Coverage query set is empty.');
  }

  const version = createHash('sha256')
    .update(queries.map((query) => `${query.id}:${query.queryText}`).join('\n'))
    .digest('hex');

  return { version, queries };
}
