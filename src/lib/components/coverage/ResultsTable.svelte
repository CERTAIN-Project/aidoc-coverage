<svelte:options runes={false} />

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import CoverageBadge from './CoverageBadge.svelte';
  import type { QueryEvaluation } from '$lib/server/coverage/types';

  const dispatch = createEventDispatcher<{ select: QueryEvaluation }>();

  export let results: QueryEvaluation[] = [];
  export let selectedId = '';

  const PAGE_SIZE = 10;
  let currentPage = 0;

  $: totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  $: { if (currentPage >= totalPages) currentPage = 0; }
  $: pageResults = results.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);
  $: start = currentPage * PAGE_SIZE + 1;
  $: end = Math.min((currentPage + 1) * PAGE_SIZE, results.length);
</script>

<div class="section-card w-full overflow-hidden">
  <div class="w-full overflow-x-auto">
    <table class="w-full table-auto divide-y divide-slate-200 dark:divide-slate-700">
      <thead class="bg-slate-100 dark:bg-slate-800">
        <tr>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">Query</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">Status</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">Evidence</th>
          <th class="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">Group</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-900">
      {#each pageResults as result}
        <tr
          class="result-row cursor-pointer transition-colors"
          data-selected={selectedId === result.queryId}
          on:click={() => dispatch('select', result)}
        >
          <td class="px-4 py-3">
            <div>
              <p class="font-medium text-slate-900 dark:text-slate-100">{result.title}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">{result.queryId}</p>
            </div>
          </td>
          <td class="px-4 py-3 text-slate-700 dark:text-slate-200"><CoverageBadge status={result.status} /></td>
          <td class="px-4 py-3 text-slate-700 dark:text-slate-200">{result.evidenceCount}</td>
          <td class="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-slate-200">{result.group}</td>
        </tr>
      {/each}
      </tbody>
    </table>
  </div>
  {#if totalPages > 1}
    <div class="flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-700">
      <p class="text-xs text-slate-500 dark:text-slate-400">{start}–{end} of {results.length}</p>
      <div class="flex gap-2">
        <button
          class="rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300"
          class:opacity-30={currentPage === 0}
          class:cursor-not-allowed={currentPage === 0}
          disabled={currentPage === 0}
          on:click={() => (currentPage -= 1)}
        >Previous</button>
        <button
          class="rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300"
          class:opacity-30={currentPage === totalPages - 1}
          class:cursor-not-allowed={currentPage === totalPages - 1}
          disabled={currentPage === totalPages - 1}
          on:click={() => (currentPage += 1)}
        >Next</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .result-row[data-selected='true'] {
    background-color: #eff6ff;
  }

  .result-row[data-selected='false']:hover {
    background-color: #f8fafc;
  }

  :global(.dark) .result-row[data-selected='true'] {
    background-color: rgb(23 37 84 / 0.4);
  }

  :global(.dark) .result-row[data-selected='false']:hover {
    background-color: rgb(30 41 59 / 0.6);
  }
</style>
