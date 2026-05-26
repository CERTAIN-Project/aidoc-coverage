// @vitest-environment node

import { afterEach, describe, expect, it, vi } from 'vitest';
import { QueryEngine } from '@comunica/query-sparql';

import { POST } from '../../../src/routes/api/coverage/+server.ts';

afterEach(() => {
  delete process.env.SPARQL_ENDPOINT_URL;
  delete process.env.COVERAGE_QUERYSET_MODE;
  vi.restoreAllMocks();
});

describe('coverage error handling', () => {
  it('givenMissingSparqlEndpointAndMissingFallbackExample_whenPosted_thenReturns422', async () => {
    const response = await POST({
      request: new Request('http://localhost/api/coverage', { method: 'POST' })
    } as never);
    const payload = await response.json();

    expect(response.status).toBe(422);
    expect(payload.message).toContain('example selection');
  });

  it('givenMissingQueryAssets_whenPosted_thenReturnsQuerySetGuidance', async () => {
    process.env.SPARQL_ENDPOINT_URL = 'http://example.test/sparql';
    process.env.COVERAGE_QUERYSET_MODE = 'missing';
    vi.spyOn(QueryEngine.prototype, 'queryBindings').mockResolvedValue({
      toArray: async () => []
    } as never);

    const response = await POST({
      request: new Request('http://localhost/api/coverage', { method: 'POST' })
    } as never);
    const payload = await response.json();

    expect(response.status).toBe(422);
    expect(payload.message).toContain('competency-query set');
  });
});
