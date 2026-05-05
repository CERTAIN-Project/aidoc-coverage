<svelte:options runes={false} />

<script lang="ts">
  import { Card } from 'flowbite-svelte';
  import CoverageBadge from './CoverageBadge.svelte';
  import type { QueryEvaluation } from '$lib/server/coverage/types';

  export let result: QueryEvaluation | null = null;
</script>

<Card class="p-4 section-card" size="xl">
  {#if result}
    <div class="min-w-0 space-y-4">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <p class="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">{result.group}</p>
          <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100">{result.title}</h3>
          <!-- <p class="mt-1 wrap-break-word text-sm text-slate-600 dark:text-slate-300">{result.queryId}</p> -->
        </div>
        <div class="shrink-0">
          <CoverageBadge status={result.status} />
        </div>
      </div>

      <p class="text-sm text-slate-700 dark:text-slate-200">{result.explanation}</p>

      <dl class="grid gap-4 rounded-xl bg-slate-100 p-4 sm:grid-cols-2 dark:bg-slate-800/60">
        <div>
          <dt class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Evidence count</dt>
          <dd class="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{result.evidenceCount}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Query asset</dt>
          <dd class="mt-1 text-sm text-slate-700 dark:text-slate-200" style="word-break: break-all;">{result.sourcePath}</dd>
        </div>
      </dl>

      {#if result.evidencePreview?.length}
        <div>
          <h4 class="text-sm font-semibold text-slate-900 dark:text-slate-100">Sample evidence</h4>
          <ul class="mt-2 space-y-2 rounded-xl border border-slate-200 bg-slate-100 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
            {#each result.evidencePreview as evidence}
              <li class="break-all">{evidence}</li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  {:else}
    <div class="flex h-full items-center justify-center text-center text-sm text-slate-500 dark:text-slate-400">
      Select a result to inspect the related competency query and evidence.
    </div>
  {/if}
</Card>
