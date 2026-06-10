import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { analyzeCoverage } from '$lib/server/coverage/engine';
import { loadOntologyFromContent } from '$lib/server/coverage/loaders';
import { loadCoverageQuerySet } from '$lib/server/coverage/query-set';

import aidocContent from '$lib/server/coverage/inputs/aidoc-ap.ttl?raw';
import encomContent from '$lib/server/coverage/inputs/examples/encom.ttl?raw';
import bankContent from '$lib/server/coverage/inputs/examples/bank.ttl?raw';
import civicvoiceContent from '$lib/server/coverage/inputs/examples/civicvoice.ttl?raw';
import hrAiContent from '$lib/server/coverage/inputs/examples/hr-ai.ttl?raw';
import biometricsContent from '$lib/server/coverage/inputs/examples/biometrics.ttl?raw';

export const prerender = true;

const EXAMPLES: Record<string, { content: string; filename: string }> = {
  encom: { content: encomContent, filename: 'encom.ttl' },
  bank: { content: bankContent, filename: 'bank.ttl' },
  civicvoice: { content: civicvoiceContent, filename: 'civicvoice.ttl' },
  'hr-ai': { content: hrAiContent, filename: 'hr-ai.ttl' },
  biometrics: { content: biometricsContent, filename: 'biometrics.ttl' }
};

export function entries() {
  return Object.keys(EXAMPLES).map((example) => ({ example }));
}

export const GET: RequestHandler = async ({ params }) => {
  const example = EXAMPLES[params.example];

  if (!example) {
    return error(404, 'Unknown example');
  }

  const [originating, instantiated, querySet] = await Promise.all([
    Promise.resolve(loadOntologyFromContent(aidocContent, 'aidoc-ap.ttl', 'originating')),
    Promise.resolve(loadOntologyFromContent(example.content, example.filename, 'instantiated')),
    loadCoverageQuerySet()
  ]);

  const result = await analyzeCoverage([originating, instantiated], querySet.queries);
  return json(result);
};
