// @vitest-environment node

import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { QueryEngine } from '@comunica/query-sparql';

import { POST } from '../../../src/routes/api/coverage/+server.ts';
import { coverageQueryManifest } from '../../../src/lib/server/coverage/query-set/manifest.ts';

function createRequest() {
  return new Request('http://localhost/api/coverage', { method: 'POST' });
}

describe('POST /api/coverage', () => {
  beforeAll(() => {
    process.env.SPARQL_ENDPOINT_URL = 'http://example.test/sparql';
    delete process.env.COVERAGE_QUERYSET_MODE;
    vi.spyOn(QueryEngine.prototype, 'queryBindings').mockResolvedValue({
      toArray: async () => []
    } as never);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('givenConfiguredEndpoint_whenPosted_thenReturnsNormalizedCoveragePayload', async () => {
    vi.spyOn(QueryEngine.prototype, 'queryBindings').mockResolvedValue({
      toArray: async () => []
    } as never);

    const response = await POST({ request: createRequest() } as never);
    const payload = await response.json();
    const expectedTotalQueries = coverageQueryManifest.length;
    const accountedStatuses =
      payload.summary.coveredCount +
      payload.summary.partialCount +
      payload.summary.notCoveredCount +
      payload.summary.errorCount;

    expect(response.status).toBe(200);
    expect(payload.summary.totalQueries).toBe(expectedTotalQueries);
    expect(payload.results).toHaveLength(expectedTotalQueries);
    expect(accountedStatuses).toBe(expectedTotalQueries);
    expect(payload.summary.overallStatus).toMatch(/^(green|yellow|red|error)$/);
    expect(payload.results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ queryId: 'cq1_2-what_is_the_name_of_the_provider' }),
        expect.objectContaining({ queryId: 'cq1_3-what_is_the_version_of_the_system_and_its_relation_to_previous_versions' }),
        expect.objectContaining({ queryId: 'cq5_1-what_hardware_does_the_ai_system_need_to_run' })
      ])
    );
  });
});
