<svelte:options runes={false} />

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { ResultFilterStatus } from '$lib/server/coverage/types';

  const dispatch = createEventDispatcher<{ change: ResultFilterStatus }>();

  export let selected: ResultFilterStatus = 'all';
  export let onChange: ((value: ResultFilterStatus) => void) | undefined = undefined;

  const options: { label: string; value: ResultFilterStatus }[] = [
    { label: 'All results', value: 'all' },
    { label: 'Covered', value: 'covered' },
    { label: 'Partial', value: 'partially_covered' },
    { label: 'Not covered', value: 'not_covered' },
    { label: 'Errors', value: 'error' }
  ];
</script>

<div class="section-card p-4">
  <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
    <div>
      <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Filter results</h3>
      <p class="text-sm text-slate-600 dark:text-slate-300">Focus on the status groups that need attention.</p>
    </div>

    <div class="flex flex-wrap gap-2">
      {#each options as option}
        <button
          type="button"
          class:selected={selected === option.value}
          class="rounded-lg border px-4 py-2 text-sm font-medium transition"
          class:bg-blue-700={selected === option.value}
          class:text-white={selected === option.value}
          class:border-blue-700={selected === option.value}
          class:border-slate-300={selected !== option.value}
          class:dark:border-slate-600={selected !== option.value}
          class:bg-white={selected !== option.value}
          class:dark:bg-slate-900={selected !== option.value}
          class:text-slate-700={selected !== option.value}
          class:dark:text-slate-200={selected !== option.value}
          on:click={() => {
            onChange?.(option.value);
            dispatch('change', option.value);
          }}
        >
          {option.label}
        </button>
      {/each}
    </div>
  </div>
</div>
