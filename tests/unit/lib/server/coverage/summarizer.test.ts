import { describe, expect, it } from 'vitest';

import { summarizeResults } from '$lib/server/coverage/summarizer';
import type { QueryEvaluation } from '$lib/server/coverage/types';

const baseResult = {
  title: 'Example',
  explanation: 'Example explanation',
  evidenceCount: 1,
  sourcePath: 'query.rq'
} satisfies Partial<QueryEvaluation>;

describe('summarizer', () => {
  it('summarizeResults_mixedStatuses_returnsRedOverallStatus', () => {
    const summary = summarizeResults([
      {
        ...baseResult,
        queryId: 'q1',
        status: 'covered'
      },
      {
        ...baseResult,
        queryId: 'q2',
        status: 'partially_covered'
      },
      {
        ...baseResult,
        queryId: 'q3',
        status: 'not_covered',
        evidenceCount: 0
      }
    ] as QueryEvaluation[]);

    expect(summary.overallStatus).toBe('red');
    expect(summary.totalQueries).toBe(3);
    expect(summary.coveragePercent).toBeCloseTo(33.3, 0);
  });
});
