<svelte:options runes={false} />

<script lang="ts">
  import { Card, Progressbar } from 'flowbite-svelte';
  import CoverageBadge from './CoverageBadge.svelte';
  import type { CoverageSummary } from '$lib/server/coverage/types';

  export let summary: CoverageSummary;
</script>

<Card class="section-card h-full p-4" size="md">
  <div class="flex h-full flex-col space-y-4">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Coverage status</p>
        <h2 class="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{summary.coveragePercent}% covered</h2>
      </div>
      <!-- <CoverageBadge status={summary.overallStatus} large /> -->
    </div>

    <Progressbar progress={summary.coveragePercent} labelInside size="lg" color="blue" class="text-white"/>

    <p class="text-sm text-slate-600 dark:text-slate-300">
      {summary.coveredCount} of {summary.totalQueries} competency queries are fully covered.
    </p>

    <div class="mt-auto grid gap-4 sm:grid-cols-2">
      {#each [
        { label: 'Covered', value: summary.coveredCount, color: 'text-green-700 dark:text-green-400' },
        { label: 'Partial', value: summary.partialCount, color: 'text-amber-700 dark:text-amber-400' },
        { label: 'Not covered', value: summary.notCoveredCount, color: 'text-red-700 dark:text-red-400' },
        { label: 'Errors', value: summary.errorCount, color: 'text-slate-700 dark:text-slate-200' }
      ] as metric}
        <div>
          <p class="text-sm font-medium text-slate-600 dark:text-slate-300">{metric.label}</p>
          <p class={`mt-1 text-2xl font-semibold ${metric.color}`}>{metric.value}</p>
        </div>
      {/each}
    </div>
  </div>
</Card>
