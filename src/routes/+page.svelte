<svelte:options runes={false} />

<script lang="ts">
  import { Card, Helper, Label } from 'flowbite-svelte';
  import CoverageSummary from '$lib/components/coverage/CoverageSummary.svelte';
  import ResultDetailPanel from '$lib/components/coverage/ResultDetailPanel.svelte';
  import ResultsFilterBar from '$lib/components/coverage/ResultsFilterBar.svelte';
  import ResultsTable from '$lib/components/coverage/ResultsTable.svelte';
  import ErrorState from '$lib/components/feedback/ErrorState.svelte';
  import LoadingState from '$lib/components/feedback/LoadingState.svelte';
  import StatusAlert from '$lib/components/feedback/StatusAlert.svelte';
  import type {
    CoverageAnalysisResponse,
    QueryEvaluation,
    ResultFilterStatus
  } from '$lib/server/coverage/types';

  let isLoading = false;
  let response: CoverageAnalysisResponse | null = null;
  let selectedFilter: ResultFilterStatus = 'all';
  let selectedResult: QueryEvaluation | null = null;
  let errorState: { message: string; issues: string[] } | null = null;
  let retryIssues: string[] = [];
  let originatingFiles: FileList | null = null;
  let instantiatedFiles: FileList | null = null;

  $: filteredResults =
    response?.results.filter((result) => selectedFilter === 'all' || result.status === selectedFilter) ?? [];
  $: if (
    filteredResults.length &&
    (!selectedResult || !filteredResults.find((result) => result.queryId === selectedResult?.queryId))
  ) {
    selectedResult = filteredResults[0];
  }

  async function handleAnalyze() {
    const originatingOntology = originatingFiles?.item(0) ?? null;
    const instantiatedOntology = instantiatedFiles?.item(0) ?? null;

    if (!originatingOntology || !instantiatedOntology) {
      return;
    }

    isLoading = true;
    errorState = null;
    retryIssues = [];

    const formData = new FormData();
    formData.set('originatingOntology', originatingOntology);
    formData.set('instantiatedOntology', instantiatedOntology);

    const result = await fetch('/api/coverage', {
      method: 'POST',
      body: formData
    });

    const responseBody = await result.json();

    if (!result.ok) {
      response = null;
      selectedResult = null;
      retryIssues = responseBody.issues ?? [];
      errorState = {
        message: responseBody.message,
        issues: responseBody.issues ?? []
      };
      isLoading = false;
      return;
    }

    response = responseBody;
    selectedFilter = 'all';
    selectedResult = responseBody.results[0] ?? null;
    isLoading = false;
  }
</script>

<svelte:head>
  <title>Ontology Coverage Dashboard</title>
  <meta
    name="description"
    content="Analyze ontology coverage with a traffic-light summary, competency-query details, and actionable error feedback."
  />
</svelte:head>

<div class="page-shell space-y-8">
  <header class="space-y-3">
    <p class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">CERTAIN</p>
    <div class="space-y-2">
      <h1 class="text-4xl font-bold tracking-tight text-slate-900">Ontology coverage dashboard</h1>
      <p class="max-w-3xl text-base text-slate-600">
        Upload an originating ontology and an instantiated ontology to evaluate competency-query coverage on the server with Comunica.
      </p>
    </div>
  </header>

  <Card class="section-card">
    <form class="space-y-6" on:submit|preventDefault={handleAnalyze}>
      <div>
        <h2 class="text-xl font-semibold text-slate-900">Upload ontologies</h2>
        <p class="mt-1 text-sm text-slate-600">
          Provide one originating ontology and one instantiated ontology in Turtle format.
        </p>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <div>
          <Label for="originatingOntology" class="mb-2 block font-medium">Originating ontology (.ttl)</Label>
          <input
            id="originatingOntology"
            name="originatingOntology"
            type="file"
            accept=".ttl,text/turtle"
            class="block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm"
            bind:files={originatingFiles}
          />
          <Helper class="mt-2">Used as the reference ontology and query context.</Helper>
        </div>

        <div>
          <Label for="instantiatedOntology" class="mb-2 block font-medium">Instantiated ontology (.ttl)</Label>
          <input
            id="instantiatedOntology"
            name="instantiatedOntology"
            type="file"
            accept=".ttl,text/turtle"
            class="block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm"
            bind:files={instantiatedFiles}
          />
          <Helper class="mt-2">Used as the current project state to assess coverage.</Helper>
        </div>
      </div>

      {#if retryIssues.length}
        <div class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p class="font-medium">Please resolve the following before retrying:</p>
          <ul class="mt-2 list-disc pl-5">
            {#each retryIssues as issue}
              <li>{issue}</li>
            {/each}
          </ul>
        </div>
      {/if}

      <button
        type="submit"
        class="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        disabled={isLoading}
      >
        Analyze coverage
      </button>
    </form>
  </Card>

  {#if isLoading}
    <LoadingState />
  {/if}

  {#if errorState}
    <ErrorState message={errorState.message} issues={errorState.issues} />
  {/if}

  {#if response}
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
        <div class="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
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
  {:else if !isLoading}
    <StatusAlert
      title="Ready to analyze"
      message="Run an analysis to see the traffic-light summary, filter results, and inspect evidence."
    />
  {/if}
</div>
