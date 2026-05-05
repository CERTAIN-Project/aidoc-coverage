import { json } from '@sveltejs/kit';

// This route is server-side only and is excluded from the static build.
// It remains available during `vite dev` for local development.
export const prerender = false;

import { analyzeCoverage } from '$lib/server/coverage/engine';
import { toAnalysisError, AnalysisError } from '$lib/server/coverage/errors';
import { loadOntologyFromContent } from '$lib/server/coverage/loaders';
import { loadCoverageQuerySet } from '$lib/server/coverage/query-set';

import aidocContent from '$lib/server/coverage/inputs/aidoc-ap.ttl?raw';
import encomContent from '$lib/server/coverage/inputs/examples/encom.ttl?raw';
import hrAiContent from '$lib/server/coverage/inputs/examples/hr-ai.ttl?raw';
import biometricsContent from '$lib/server/coverage/inputs/examples/biometrics.ttl?raw';

const EXAMPLE_ONTOLOGIES: Record<string, { content: string; filename: string }> = {
  encom: { content: encomContent, filename: 'encom.ttl' },
  'hr-ai': { content: hrAiContent, filename: 'hr-ai.ttl' },
  biometrics: { content: biometricsContent, filename: 'biometrics.ttl' }
};

export async function POST({ request }) {
  try {
    const formData = await request.formData();
    const exampleKey = formData.get('instantiatedExample');

    if (typeof exampleKey !== 'string' || !EXAMPLE_ONTOLOGIES[exampleKey]) {
      throw new AnalysisError('A valid example selection is required.', 422, [
        'Select one of the available example ontologies before starting analysis.'
      ]);
    }

    const example = EXAMPLE_ONTOLOGIES[exampleKey];

    const [originating, instantiated, querySet] = await Promise.all([
      Promise.resolve(loadOntologyFromContent(aidocContent, 'aidoc-ap.ttl', 'originating')),
      Promise.resolve(loadOntologyFromContent(example.content, example.filename, 'instantiated')),
      loadCoverageQuerySet()
    ]);

    const response = await analyzeCoverage([originating, instantiated], querySet.queries);

    return json(response);
  } catch (error) {
    const analysisError = toAnalysisError(error);

    return json(
      {
        message: analysisError.message,
        issues: analysisError.issues
      },
      { status: analysisError.status }
    );
  }
}
