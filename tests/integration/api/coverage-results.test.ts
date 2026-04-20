// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { POST } from '../../../src/routes/api/coverage/+server.ts';

describe('coverage results payload', () => {
  it('givenMixedCoverage_whenAnalysisCompletes_thenResponseSupportsFilteringAndDetailViews', async () => {
    const [originating, instantiated] = await Promise.all([
      readFile(path.resolve('tests/fixtures/ontologies/originating.ttl'), 'utf8'),
      readFile(path.resolve('tests/fixtures/ontologies/instantiated.ttl'), 'utf8')
    ]);

    const formData = new FormData();
    formData.set('originatingOntology', new File([originating], 'originating.ttl', { type: 'text/turtle' }));
    formData.set('instantiatedOntology', new File([instantiated], 'instantiated.ttl', { type: 'text/turtle' }));

    const response = await POST({
      request: new Request('http://localhost/api/coverage', {
        method: 'POST',
        body: formData
      })
    } as never);
    const payload = await response.json();

    const attentionItems = payload.results.filter((result: { status: string }) => result.status !== 'covered');
    const evidenceSamples = payload.results.flatMap((result: { evidencePreview?: string[] }) => result.evidencePreview ?? []);

    expect(attentionItems.length).toBeGreaterThan(0);
    expect(evidenceSamples.length).toBeGreaterThan(0);
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
