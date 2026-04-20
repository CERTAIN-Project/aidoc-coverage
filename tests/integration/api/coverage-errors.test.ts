// @vitest-environment node

import { afterEach, describe, expect, it } from 'vitest';

import { POST } from '../../../src/routes/api/coverage/+server.ts';

afterEach(() => {
  delete process.env.COVERAGE_QUERYSET_MODE;
});

describe('coverage error handling', () => {
  it('givenInvalidTurtle_whenPosted_thenReturnsActionableValidationFeedback', async () => {
    const formData = new FormData();
    formData.set('originatingOntology', new File(['not ttl'], 'originating.ttl', { type: 'text/turtle' }));
    formData.set(
      'instantiatedOntology',
      new File(['@prefix aidoc: <https://w3id.org/aidoc-ap#> . <https://example.com/s> a aidoc:AISystem .'], 'instantiated.ttl', { type: 'text/turtle' })
    );

    const response = await POST({
      request: new Request('http://localhost/api/coverage', {
        method: 'POST',
        body: formData
      })
    } as never);
    const payload = await response.json();

    expect(response.status).toBe(422);
    expect(payload.message).toContain('could not be parsed');
  });

  it('givenMissingQueryAssets_whenPosted_thenReturnsQuerySetGuidance', async () => {
    process.env.COVERAGE_QUERYSET_MODE = 'missing';

    const formData = new FormData();
    formData.set(
      'originatingOntology',
      new File(['@prefix aidoc: <https://w3id.org/aidoc-ap#> . <https://example.com/s> a aidoc:AISystem .'], 'originating.ttl', { type: 'text/turtle' })
    );
    formData.set(
      'instantiatedOntology',
      new File(['@prefix aidoc: <https://w3id.org/aidoc-ap#> . <https://example.com/s> a aidoc:AISystem .'], 'instantiated.ttl', { type: 'text/turtle' })
    );

    const response = await POST({
      request: new Request('http://localhost/api/coverage', {
        method: 'POST',
        body: formData
      })
    } as never);
    const payload = await response.json();

    expect(response.status).toBe(422);
    expect(payload.message).toContain('competency-query set');
  });
});
