// @vitest-environment node

import { beforeAll, describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { POST } from '../../../src/routes/api/coverage/+server.ts';

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

    expect(response.status).toBe(200);
    expect(payload.summary.totalQueries).toBe(4);
    expect(payload.summary.overallStatus).toBe('red');
    expect(payload.results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ queryId: 'cq1-2-provider', status: 'covered' }),
        expect.objectContaining({ queryId: 'cq1-3-version-history', status: 'partially_covered' }),
        expect.objectContaining({ queryId: 'cq5-1-hardware', status: 'not_covered' })
      ])
    );
  });
});
