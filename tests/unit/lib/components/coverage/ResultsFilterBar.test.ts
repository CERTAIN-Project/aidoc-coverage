import { describe, expect, it } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';

import ResultsFilterBar from '$lib/components/coverage/ResultsFilterBar.svelte';

describe('ResultsFilterBar', () => {
  it('givenStatusButtons_whenClicked_thenDispatchesSelectedFilter', async () => {
    const dispatched: string[] = [];
    const { getByText } = render(ResultsFilterBar, {
      selected: 'all',
      onChange: (value: string) => dispatched.push(value)
    });

    await fireEvent.click(getByText('Not covered'));

    expect(dispatched).toEqual(['not_covered']);
  });
});
