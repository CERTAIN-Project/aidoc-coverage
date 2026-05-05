// @vitest-environment node

import { describe, expect, it } from 'vitest';

import { POST } from '../../../src/routes/api/coverage/+server.ts';

describe('coverage results payload', () => {
  it('givenMixedCoverage_whenAnalysisCompletes_thenResponseSupportsFilteringAndDetailViews', async () => {
    const formData = new FormData();
    formData.set('instantiatedExample', 'encom');

    const response = await POST({
      request: new Request('http://localhost/api/coverage', { method: 'POST', body: formData })
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
