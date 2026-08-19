<svelte:options runes={false} />

<script lang="ts">
  import { Card, Progressbar } from 'flowbite-svelte';
  import type { CompletenessReport } from '$lib/server/completeness/types';

  export let completeness: CompletenessReport;
</script>

<Card class="section-card h-full p-4" size="md">
  <div class="flex h-full flex-col space-y-4">
    <div>
      <p class="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        AIDOC-AP type usage
      </p>
      <h2 class="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        {completeness.overallUsagePercent}% of AIDOC-AP types in use
      </h2>
    </div>

    <Progressbar progress={completeness.overallUsagePercent} labelInside size="lg" color="blue" class="text-white" />

    <div class="mt-auto grid gap-4 sm:grid-cols-2">
      {#each completeness.results as result}
        <div>
          <p class="text-sm font-medium text-slate-600 dark:text-slate-300">{result.type}</p>
          <p class="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{result.usagePercent}%</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            {result.usedCount} of {result.totalDefined} used
          </p>
        </div>
      {/each}
    </div>
  </div>
</Card>
