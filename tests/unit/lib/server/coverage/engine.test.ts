// @vitest-environment node

import { describe, expect, it } from 'vitest';

import { parseTurtle } from '$lib/server/coverage/loaders';
import { analyzeCoverage } from '$lib/server/coverage/engine';
import type { ParsedOntologyInput, QueryDefinition } from '$lib/server/coverage/types';

describe('engine evidence preview formatting', () => {
  it('givenQueryBindings_whenMappedToPreview_thenRendersReadableVariableAndTermValues', async () => {
    const ttl = `
      @prefix aidoc: <https://w3id.org/aidoc-ap#> .
      @prefix ex: <https://example.com/> .
      ex:system a aidoc:AISystem .
    `;

    const input: ParsedOntologyInput = {
      role: 'originating',
      filename: 'originating.ttl',
      mediaType: 'text/turtle',
      content: ttl,
      sizeBytes: ttl.length,
      checksum: 'test-checksum',
      store: parseTurtle(ttl)
    };

    const query: QueryDefinition = {
      id: 'cq-test',
      title: 'Test query',
      sourcePath: 'src/lib/server/coverage/query-set/assets/cq-test.sparql',
      queryText: `
        PREFIX aidoc: <https://w3id.org/aidoc-ap#>
        SELECT ?system WHERE {
          ?system a aidoc:AISystem .
        }
      `,
      expectedMinEvidence: 1
    };

    const response = await analyzeCoverage([input], [query]);
    const preview = response.results[0].evidencePreview?.[0] ?? '';

    expect(preview).toContain('?system=');
    expect(preview).not.toContain('[object Object]');
  });
});