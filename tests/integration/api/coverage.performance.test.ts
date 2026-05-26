// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { performance } from 'node:perf_hooks';
import { QueryEngine } from '@comunica/query-sparql';

import { POST } from '../../../src/routes/api/coverage/+server.ts';

describe('coverage performance', () => {
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

  it('givenConfiguredEndpoint_whenAnalyzed_thenCompletesWithinBudget', async () => {

    const startedAt = performance.now();
    const response = await POST({
      request: new Request('http://localhost/api/coverage', { method: 'POST' })
    } as never);
    const elapsed = performance.now() - startedAt;

    expect(response.status).toBe(200);
    expect(elapsed).toBeLessThan(5000);
  });
});
