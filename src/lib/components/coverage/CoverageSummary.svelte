<svelte:options runes={false} />

<script lang="ts">
  import { Card, Progressbar } from 'flowbite-svelte';
  import CoverageBadge from './CoverageBadge.svelte';
  import type { CoverageSummary } from '$lib/server/coverage/types';

  export let summary: CoverageSummary;
</script>

<div class="grid gap-4 lg:grid-cols-[1.3fr,2fr]">
  <Card class="section-card p-4">
    <div class="space-y-4">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Overall status</p>
          <h2 class="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{summary.coveragePercent}% covered</h2>
        </div>
        <CoverageBadge status={summary.overallStatus} large />
      </div>

      <Progressbar progress={summary.coveragePercent} labelInside size="lg" color="blue" class="text-white"/>

      <p class="text-sm text-slate-600 dark:text-slate-300">
        {summary.coveredCount} of {summary.totalQueries} competency queries are fully covered.
      </p>
    </div>
  </Card>

  <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {#each [
      { label: 'Covered', value: summary.coveredCount, color: 'text-green-700 dark:text-green-400' },
      { label: 'Partial', value: summary.partialCount, color: 'text-amber-700 dark:text-amber-400' },
      { label: 'Not covered', value: summary.notCoveredCount, color: 'text-red-700 dark:text-red-400' },
      { label: 'Errors', value: summary.errorCount, color: 'text-slate-700 dark:text-slate-200' }
    ] as metric}
      <Card class="section-card p-4">
        <p class="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{metric.label}</p>
        <p class={`mt-2 text-3xl font-semibold ${metric.color}`}>{metric.value}</p>
      </Card>
    {/each}
  </div>
</div>
