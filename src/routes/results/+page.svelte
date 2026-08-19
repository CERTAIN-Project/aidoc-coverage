<svelte:options runes={false} />

<script lang="ts">
  import { browser } from '$app/environment';
  import { base } from '$app/paths';
  import { TabItem, Tabs } from 'flowbite-svelte';
  import CoverageSummary from '$lib/components/coverage/CoverageSummary.svelte';
  import CompletenessSummary from '$lib/components/coverage/CompletenessSummary.svelte';
  import CompletenessFilterBar from '$lib/components/coverage/CompletenessFilterBar.svelte';
  import CompletenessTable from '$lib/components/coverage/CompletenessTable.svelte';
  import CompletenessDetailPanel from '$lib/components/coverage/CompletenessDetailPanel.svelte';
  import { flattenCompleteness, type CompletenessEntry, type CompletenessFilterStatus, type CompletenessFilterType } from '$lib/components/coverage/completeness-helpers';
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
  let hasLoggedQueryErrors = false;
  let selectedCompletenessType: CompletenessFilterType = 'all';
  let selectedCompletenessStatus: CompletenessFilterStatus = 'all';
  let selectedCompletenessEntry: CompletenessEntry | null = null;
  let completenessTableHeight = 0;

  $: filteredResults =
    response?.results.filter((result) => selectedFilter === 'all' || result.status === selectedFilter) ?? [];

  $: if (
    filteredResults.length &&
    (!selectedResult || !filteredResults.find((result) => result.queryId === selectedResult?.queryId))
  ) {
    selectedResult = filteredResults[0];
  }

  $: completenessEntries = response?.completeness ? flattenCompleteness(response.completeness) : [];

  $: filteredCompletenessEntries = completenessEntries.filter(
    (entry) =>
      (selectedCompletenessType === 'all' || entry.type === selectedCompletenessType) &&
      (selectedCompletenessStatus === 'all' ||
        (selectedCompletenessStatus === 'used' ? entry.used : !entry.used))
  );

  $: if (
    filteredCompletenessEntries.length &&
    (!selectedCompletenessEntry ||
      !filteredCompletenessEntries.find((entry) => entry.value === selectedCompletenessEntry?.value))
  ) {
    selectedCompletenessEntry = filteredCompletenessEntries[0];
  }

  if (browser) {
    const raw = sessionStorage.getItem(LAST_RESULTS_STORAGE_KEY);

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as CoverageAnalysisResponse;
        const hasInstanceData =
          !parsed.completeness ||
          parsed.completeness.results.every((result) => result.entries.every((entry) => Array.isArray(entry.instances)));

        if (hasInstanceData) {
          response = parsed;
        } else {
          sessionStorage.removeItem(LAST_RESULTS_STORAGE_KEY);
          loadError = 'Stored analysis results are outdated. Run a new analysis from the dashboard to see instance names.';
        }
      } catch {
        loadError = 'Stored analysis results could not be read. Run a new analysis from the dashboard.';
      }
    }
  }

  $: if (browser && response && !hasLoggedQueryErrors) {
    const failedQueries = response.results.filter((result) => result.status === 'error');

    if (failedQueries.length) {
      console.groupCollapsed(`[Coverage] ${failedQueries.length} query evaluation error(s)`);

      for (const result of failedQueries) {
        console.error(`[${result.queryId}] ${result.title}`, {
          message: result.errorMessage ?? 'No detailed error message available.',
          code: result.errorCode,
          sourcePath: result.sourcePath
        });
      }

      console.groupEnd();
    }

    hasLoggedQueryErrors = true;
  }
</script>

<svelte:head>
  <title>Coverage Results | CERTAIN Coverage</title>
  <meta
    name="description"
    content="Inspect ontology coverage analysis results with traffic-light summary, filters, and query evidence details."
  />
</svelte:head>

<div class="lg:container page-shell space-y-8">
  <header class="space-y-3">
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
      <Tabs tabStyle="underline" contentClass="pt-6" class="h-full">
        <TabItem open title="Overview">
          <div class="flex gap-10 h-fit">
            <CoverageSummary summary={response.summary} />
            {#if response.completeness}
              <CompletenessSummary completeness={response.completeness} />
            {/if}
          </div>
        </TabItem>

        <TabItem title="Coverage">
          <div class="space-y-6">
            <ResultsFilterBar selected={selectedFilter} on:change={(event) => (selectedFilter = event.detail)} />

            {#if filteredResults.length}
              <div class="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-start gap-6">
                <div class="min-w-0">
                  <ResultsTable
                    results={filteredResults}
                    selectedId={selectedResult?.queryId ?? ''}
                    on:select={(event) => (selectedResult = event.detail)}
                  />
                </div>
                <div class="min-w-0">
                  <ResultDetailPanel result={selectedResult} />
                </div>
              </div>
            {:else}
              <div class="section-card p-4">
                <p class="text-sm text-slate-700 dark:text-slate-200">
                  No results in this filter. Try another filter to inspect competency queries from a different status group.
                </p>
              </div>
            {/if}
          </div>
        </TabItem>

        <TabItem title="Completeness">
          <div class="space-y-6">
            <CompletenessFilterBar
              selectedType={selectedCompletenessType}
              selectedStatus={selectedCompletenessStatus}
              on:changeType={(event) => (selectedCompletenessType = event.detail)}
              on:changeStatus={(event) => (selectedCompletenessStatus = event.detail)}
            />

            {#if filteredCompletenessEntries.length}
              <div class="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-stretch gap-6">
                <div class="min-w-0" bind:clientHeight={completenessTableHeight}>
                  <CompletenessTable
                    entries={filteredCompletenessEntries}
                    selectedValue={selectedCompletenessEntry?.value ?? ''}
                    on:select={(event) => (selectedCompletenessEntry = event.detail)}
                  />
                </div>
                <div class="min-w-0 overflow-hidden" style="height: {completenessTableHeight}px">
                  <CompletenessDetailPanel entry={selectedCompletenessEntry} />
                </div>
              </div>
            {:else}
              <div class="section-card p-4">
                <p class="text-sm text-slate-700 dark:text-slate-200">
                  No ontology terms in this filter. Try another filter to inspect a different category or status.
                </p>
              </div>
            {/if}
          </div>
        </TabItem>
      </Tabs>
    </section>
  {:else}
    <StatusAlert
      title="No analysis results yet"
      message="Run an analysis on the dashboard page to populate this view."
    />
    <div class="section-card p-4">
      <a href="{base}/" class="text-sm font-semibold text-blue-700 underline-offset-2 hover:underline dark:text-blue-400">
        Go to dashboard
      </a>
    </div>
  {/if}
</div>
