import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

// This route is server-side only and requires a runtime adapter.
export const prerender = false;

import { sparqlEndpointConfigSchema } from '$lib/schemas/coverage';
import { analyzeCoverage } from '$lib/server/coverage/engine';
import { toAnalysisError, AnalysisError } from '$lib/server/coverage/errors';
import { loadOntologyFromContent } from '$lib/server/coverage/loaders';
import { loadCoverageQuerySet } from '$lib/server/coverage/query-set';
import { analyzeCompleteness } from '$lib/server/completeness/usage';

import aidocContent from '$lib/server/coverage/inputs/aidoc-ap.ttl?raw';
import encomContent from '$lib/server/coverage/inputs/examples/encom.ttl?raw';
import bankContent from '$lib/server/coverage/inputs/examples/bank.ttl?raw';
import civicvoiceContent from '$lib/server/coverage/inputs/examples/civicvoice.ttl?raw';
import hrAiContent from '$lib/server/coverage/inputs/examples/hr-ai.ttl?raw';
import biometricsContent from '$lib/server/coverage/inputs/examples/biometrics.ttl?raw';

const EXAMPLE_ONTOLOGIES: Record<string, { content: string; filename: string }> = {
  encom: { content: encomContent, filename: 'encom.ttl' },
  bank: { content: bankContent, filename: 'bank.ttl' },
  civicvoice: { content: civicvoiceContent, filename: 'civicvoice.ttl' },
  'hr-ai': { content: hrAiContent, filename: 'hr-ai.ttl' },
  biometrics: { content: biometricsContent, filename: 'biometrics.ttl' }
};

function resolveSparqlEndpointUrl(): string | undefined {
  const configuredEndpointUrl = (env.SPARQL_ENDPOINT_URL ?? process.env.SPARQL_ENDPOINT_URL)?.trim();

  if (!configuredEndpointUrl) {
    return undefined;
  }

  const parsed = sparqlEndpointConfigSchema.safeParse({
    sparqlEndpointUrl: configuredEndpointUrl
  });

  if (!parsed.success) {
    throw new AnalysisError('The configured SPARQL endpoint URL is invalid.', 422, [
      'Set SPARQL_ENDPOINT_URL to a valid absolute URL (for example http://ontop:8080/sparql).'
    ]);
  }

  return parsed.data.sparqlEndpointUrl;
}

export async function POST({ request }) {
  try {
    const sparqlEndpointUrl = resolveSparqlEndpointUrl();

    const [originating, querySet] = await Promise.all([
      Promise.resolve(loadOntologyFromContent(aidocContent, 'aidoc-ap.ttl', 'originating')),
      loadCoverageQuerySet()
    ]);

    if (sparqlEndpointUrl) {
      const [response, completeness] = await Promise.all([
        analyzeCoverage([originating], querySet.queries, { sparqlEndpointUrl }),
        analyzeCompleteness([originating], { sparqlEndpointUrl })
      ]);
      return json({ ...response, completeness });
    }

    let exampleKey: unknown = null;

    try {
      const contentType = request.headers.get('content-type') ?? '';

      if (contentType.includes('application/json')) {
        const payload = await request.json();
        exampleKey = payload?.instantiatedExample;
      } else {
        const formData = await request.formData();
        exampleKey = formData.get('instantiatedExample');
      }
    } catch {
      exampleKey = null;
    }

    if (typeof exampleKey !== 'string' || !EXAMPLE_ONTOLOGIES[exampleKey]) {
      throw new AnalysisError('A valid example selection is required when SPARQL_ENDPOINT_URL is not configured.', 422, [
        'Select one of the available example ontologies before starting analysis.'
      ]);
    }

    const example = EXAMPLE_ONTOLOGIES[exampleKey];
    const instantiated = loadOntologyFromContent(example.content, example.filename, 'instantiated');

    const [response, completeness] = await Promise.all([
      analyzeCoverage([originating, instantiated], querySet.queries),
      analyzeCompleteness([originating, instantiated])
    ]);

    return json({ ...response, completeness });
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
