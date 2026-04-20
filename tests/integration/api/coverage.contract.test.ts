// @vitest-environment node

import { beforeAll, describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { POST } from '../../../src/routes/api/coverage/+server.ts';
import { coverageQueryManifest } from '../../../src/lib/server/coverage/query-set/manifest.ts';

async function createRequest() {
  const [originating, instantiated] = await Promise.all([
    readFile(path.resolve('tests/fixtures/ontologies/originating.ttl'), 'utf8'),
    readFile(path.resolve('tests/fixtures/ontologies/instantiated.ttl'), 'utf8')
  ]);

  const formData = new FormData();
  formData.set('originatingOntology', new File([originating], 'originating.ttl', { type: 'text/turtle' }));
  formData.set('instantiatedOntology', new File([instantiated], 'instantiated.ttl', { type: 'text/turtle' }));

  return new Request('http://localhost/api/coverage', {
    method: 'POST',
    body: formData
  });
}

describe('POST /api/coverage', () => {
  beforeAll(() => {
    delete process.env.COVERAGE_QUERYSET_MODE;
  });

  it('givenValidFiles_whenPosted_thenReturnsNormalizedCoveragePayload', async () => {
    const response = await POST({ request: await createRequest() } as never);
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
