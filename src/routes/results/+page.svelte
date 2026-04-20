<svelte:options runes={false} />

<script lang="ts">
  import { browser } from '$app/environment';
  import CoverageSummary from '$lib/components/coverage/CoverageSummary.svelte';
  import ResultDetailPanel from '$lib/components/coverage/ResultDetailPanel.svelte';
  import ResultsFilterBar from '$lib/components/coverage/ResultsFilterBar.svelte';
  import ResultsTable from '$lib/components/coverage/ResultsTable.svelte';
  import StatusAlert from '$lib/components/feedback/StatusAlert.svelte';
  import type {
    CoverageAnalysisResponse,
    QueryEvaluation,
    ResultFilterStatus
  } from '$lib/server/coverage/types';

  const LAST_RESULTS_STORAGE_KEY = 'coverage:lastResult';

  let response: CoverageAnalysisResponse | null = null;
  let loadError: string | null = null;
  let selectedFilter: ResultFilterStatus = 'all';
  let selectedResult: QueryEvaluation | null = null;

  $: filteredResults =
    response?.results.filter((result) => selectedFilter === 'all' || result.status === selectedFilter) ?? [];

  $: if (
    filteredResults.length &&
    (!selectedResult || !filteredResults.find((result) => result.queryId === selectedResult?.queryId))
  ) {
    selectedResult = filteredResults[0];
  }

  if (browser) {
    const raw = sessionStorage.getItem(LAST_RESULTS_STORAGE_KEY);

    if (raw) {
      try {
        response = JSON.parse(raw) as CoverageAnalysisResponse;
      } catch {
        loadError = 'Stored analysis results could not be read. Run a new analysis from the dashboard.';
      }
    }
  }
</script>

<svelte:head>
  <title>Coverage Results | CERTAIN Coverage</title>
  <meta
    name="description"
    content="Inspect ontology coverage analysis results with traffic-light summary, filters, and query evidence details."
  />
</svelte:head>

<div class="page-shell space-y-8">
  <header class="space-y-3">
    <p class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700 dark:text-blue-400">CERTAIN</p>
    <div class="space-y-2">
      <h1 class="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Coverage results</h1>
      <p class="max-w-3xl text-base text-slate-600 dark:text-slate-300">
        Review the latest competency-query analysis and inspect evidence for each query.
      </p>
    </div>
  </header>

  {#if loadError}
    <StatusAlert color="red" title="Unable to load results" message={loadError} />
  {:else if response}
    <section class="space-y-6" aria-label="Coverage results">
      <StatusAlert
        color={response.summary.overallStatus === 'green'
          ? 'green'
          : response.summary.overallStatus === 'yellow'
            ? 'yellow'
            : 'red'}
        title="Coverage analysis completed"
        message={`Run ${response.runId} analyzed ${response.summary.totalQueries} competency queries.`}
      />

      <CoverageSummary summary={response.summary} />
      <ResultsFilterBar selected={selectedFilter} on:change={(event) => (selectedFilter = event.detail)} />

      {#if filteredResults.length}
        <div class="space-y-6">
          <ResultsTable
            results={filteredResults}
            selectedId={selectedResult?.queryId ?? ''}
            on:select={(event) => (selectedResult = event.detail)}
          />
          <ResultDetailPanel result={selectedResult} />
        </div>
      {:else}
        <StatusAlert
          color="blue"
          title="No results in this filter"
          message="Try another filter to inspect competency queries from a different status group."
        />
      {/if}
    </section>
  {:else}
    <StatusAlert
      title="No analysis results yet"
      message="Run an analysis on the dashboard page to populate this view."
    />
    <div class="section-card p-4">
      <a href="/" class="text-sm font-semibold text-blue-700 underline-offset-2 hover:underline dark:text-blue-400">
        Go to dashboard
      </a>
    </div>
  {/if}
</div>
