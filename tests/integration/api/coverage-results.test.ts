// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryEngine } from '@comunica/query-sparql';

import { POST } from '../../../src/routes/api/coverage/+server.ts';

describe('coverage results payload', () => {
  beforeEach(() => {
    process.env.SPARQL_ENDPOINT_URL = 'http://example.test/sparql';
    vi.spyOn(QueryEngine.prototype, 'queryBindings').mockResolvedValue({
      toArray: async () => []
    } as never);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.SPARQL_ENDPOINT_URL;
  });

  it('givenConfiguredEndpoint_whenAnalysisCompletes_thenResponseSupportsFilteringAndDetailViews', async () => {
    const response = await POST({
      request: new Request('http://localhost/api/coverage', { method: 'POST' })
    } as never);
    const payload = await response.json();

    const attentionItems = payload.results.filter((result: { status: string }) => result.status !== 'covered');
    const evidenceSamples = payload.results.flatMap((result: { evidencePreview?: string[] }) => result.evidencePreview ?? []);

    expect(response.status).toBe(200);
    expect(attentionItems.length).toBeGreaterThan(0);
    expect(payload.results.length).toBeGreaterThan(0);
    expect(evidenceSamples.every((sample: string) => !sample.includes('[object Object]'))).toBe(true);
    expect(attentionItems[0]).toEqual(
      expect.objectContaining({
        queryId: expect.any(String),
        title: expect.any(String),
        explanation: expect.any(String),
        sourcePath: expect.stringContaining('query-set/assets')
      })
    );
  });
});
