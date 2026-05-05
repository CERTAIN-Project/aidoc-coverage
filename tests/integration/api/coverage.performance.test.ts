// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { performance } from 'node:perf_hooks';

import { POST } from '../../../src/routes/api/coverage/+server.ts';

describe('coverage performance', () => {
  it('givenExampleOntology_whenAnalyzed_thenCompletesWithinBudget', async () => {
    const formData = new FormData();
    formData.set('instantiatedExample', 'encom');

    const startedAt = performance.now();
    const response = await POST({
      request: new Request('http://localhost/api/coverage', { method: 'POST', body: formData })
    } as never);
    const elapsed = performance.now() - startedAt;

    expect(response.status).toBe(200);
    expect(elapsed).toBeLessThan(5000);
  });
});
