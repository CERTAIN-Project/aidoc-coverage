// @vitest-environment node

import { afterEach, describe, expect, it } from 'vitest';

import { POST } from '../../../src/routes/api/coverage/+server.ts';

afterEach(() => {
  delete process.env.COVERAGE_QUERYSET_MODE;
});

describe('coverage error handling', () => {
  it('givenInvalidExampleKey_whenPosted_thenReturns422', async () => {
    const formData = new FormData();
    formData.set('instantiatedExample', 'not-a-valid-key');

    const response = await POST({
      request: new Request('http://localhost/api/coverage', { method: 'POST', body: formData })
    } as never);
    const payload = await response.json();

    expect(response.status).toBe(422);
    expect(payload.message).toBeTruthy();
  });

  it('givenMissingQueryAssets_whenPosted_thenReturnsQuerySetGuidance', async () => {
    process.env.COVERAGE_QUERYSET_MODE = 'missing';

    const formData = new FormData();
    formData.set('instantiatedExample', 'encom');

    const response = await POST({
      request: new Request('http://localhost/api/coverage', { method: 'POST', body: formData })
    } as never);
    const payload = await response.json();

    expect(response.status).toBe(422);
    expect(payload.message).toContain('competency-query set');
  });
});
