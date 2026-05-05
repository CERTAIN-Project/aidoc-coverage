import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';

import ResultDetailPanel from '$lib/components/coverage/ResultDetailPanel.svelte';

describe('ResultDetailPanel', () => {
  it('givenSelectedResult_whenRendered_thenShowsTraceabilityAndEvidence', () => {
    const { getByText } = render(ResultDetailPanel, {
      result: {
        queryId: 'cq1',
        title: 'Provider information is documented',
        description: 'Checks provider coverage.',
        status: 'partially_covered',
        explanation: 'Only one item was present.',
        evidenceCount: 1,
        evidencePreview: ['?system=https://example.com/system'],
        sourcePath: 'src/lib/server/coverage/query-set/assets/cq1.rq',
        group: 'Requirement 1'
      }
    });

    expect(getByText('Provider information is documented')).toBeInTheDocument();
    expect(getByText('Only one item was present.')).toBeInTheDocument();
    expect(getByText('cq1')).toBeInTheDocument();
  });
});
