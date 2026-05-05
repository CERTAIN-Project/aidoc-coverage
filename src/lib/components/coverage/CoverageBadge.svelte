<svelte:options runes={false} />

<script lang="ts">
  import { Badge } from 'flowbite-svelte';
  import type { CoverageStatus, SummaryStatus } from '$lib/server/coverage/types';

  export let status: CoverageStatus | SummaryStatus;
  export let large = false;

  const palette = {
    covered: 'green',
    partially_covered: 'yellow',
    not_covered: 'red',
    error: 'gray',
    green: 'green',
    yellow: 'yellow',
    red: 'red'
  } as const;

  const labels = {
    covered: 'Covered',
    partially_covered: 'Partially covered',
    not_covered: 'Not covered',
    error: 'Error',
    green: 'Green',
    yellow: 'Yellow',
    red: 'Red'
  } as const;
</script>

<Badge color={palette[status]} class={large ? 'px-3 py-1 text-sm font-semibold' : ''}>
  {labels[status]}
</Badge>
