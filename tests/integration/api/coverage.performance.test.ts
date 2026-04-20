// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { performance } from 'node:perf_hooks';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { POST } from '../../../src/routes/api/coverage/+server.ts';

describe('coverage performance', () => {
  it('givenFixtureOntologies_whenAnalyzed_thenCompletesWithinBudget', async () => {
    const [originating, instantiated] = await Promise.all([
      readFile(path.resolve('tests/fixtures/ontologies/originating.ttl'), 'utf8'),
      readFile(path.resolve('tests/fixtures/ontologies/instantiated.ttl'), 'utf8')
    ]);
    const formData = new FormData();
    formData.set('originatingOntology', new File([originating], 'originating.ttl', { type: 'text/turtle' }));
    formData.set('instantiatedOntology', new File([instantiated], 'instantiated.ttl', { type: 'text/turtle' }));

    const startedAt = performance.now();
    const response = await POST({
      request: new Request('http://localhost/api/coverage', { method: 'POST', body: formData })
    } as never);
    const elapsed = performance.now() - startedAt;

    expect(response.status).toBe(200);
    expect(elapsed).toBeLessThan(5000);
  });
});
