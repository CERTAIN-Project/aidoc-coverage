<svelte:options runes={false} />

<script lang="ts">
  import { Card } from 'flowbite-svelte';
  import { labelForValue, type CompletenessEntry } from './completeness-helpers';

  export let entry: CompletenessEntry | null = null;
</script>

<Card class="p-4 section-card h-full" size="xl">
  {#if entry}
    <div class="flex h-full min-w-0 flex-col space-y-4">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <p class="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">{entry.type}</p>
          <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100">{entry.label}</h3>
        </div>
        <div class="shrink-0">
          {#if entry.used}
            <span class="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-300">Exists</span>
          {:else}
            <span class="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800 dark:bg-red-900/40 dark:text-red-300">Not exists</span>
          {/if}
        </div>
      </div>

      <dl class="grid gap-4 rounded-xl bg-slate-100 p-4 sm:grid-cols-2 dark:bg-slate-800/60">
        <div>
          <dt class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Occurrences</dt>
          <dd class="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{entry.count}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Ontology IRI</dt>
          <dd class="mt-1 text-sm text-slate-700 dark:text-slate-200" style="word-break: break-all;">{entry.value}</dd>
        </div>
      </dl>

      {#if entry.instances?.length}
        <div class="flex min-h-0 flex-1 flex-col">
          <h4 class="shrink-0 text-sm font-semibold text-slate-900 dark:text-slate-100">Instance names</h4>
          <ul class="mt-2 min-h-0 flex-1 space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-slate-100 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
            {#each entry.instances as instance}
              <li class="break-all">
                {labelForValue(decodeURIComponent(instance))}
                <span class="block text-xs text-slate-500 dark:text-slate-400">{decodeURIComponent(instance)}</span>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  {:else}
    <div class="flex h-full items-center justify-center text-center text-sm text-slate-500 dark:text-slate-400">
      Select a term to inspect its usage in the analyzed data.
    </div>
  {/if}
</Card>
