<svelte:options runes={false} />

<script lang="ts">
  import { browser, dev } from '$app/environment';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { Card, Helper, Label, Select } from 'flowbite-svelte';
  import ErrorState from '$lib/components/feedback/ErrorState.svelte';
  import LoadingState from '$lib/components/feedback/LoadingState.svelte';
  import StatusAlert from '$lib/components/feedback/StatusAlert.svelte';
  import type { CoverageAnalysisResponse } from '$lib/server/coverage/types';

  const LAST_RESULTS_STORAGE_KEY = 'coverage:lastResult';

  let isLoading = false;
  let hasSavedResults = false;
  let errorState: { message: string; issues: string[] } | null = null;
  let retryIssues: string[] = [];
  let selectedExample = 'encom';

  const exampleOptions = [
    { value: 'encom', name: 'Encom' },
    { value: 'hr-ai', name: 'HR AI' },
    { value: 'biometrics', name: 'Biometrics' }
  ];

  onMount(() => {
    if (!browser) {
      return;
    }

    hasSavedResults = Boolean(sessionStorage.getItem(LAST_RESULTS_STORAGE_KEY));
  });

  async function handleAnalyze() {
    isLoading = true;
    errorState = null;
    retryIssues = [];

    let result: Response;

    if (dev) {
      // In development, use the live server-side API.
      const formData = new FormData();
      formData.set('instantiatedExample', selectedExample);
      result = await fetch('/api/coverage', { method: 'POST', body: formData });
    } else {
      // In the static build, fetch the pre-generated JSON.
      result = await fetch(`/data/coverage-${selectedExample}.json`);
    }

    const responseBody = await result.json();

    if (!result.ok) {
      retryIssues = responseBody.issues ?? [];
      errorState = {
        message: responseBody.message,
        issues: responseBody.issues ?? []
      };
      isLoading = false;
      return;
    }

    if (browser) {
      sessionStorage.setItem(LAST_RESULTS_STORAGE_KEY, JSON.stringify(responseBody satisfies CoverageAnalysisResponse));
      hasSavedResults = true;
    }

    isLoading = false;
    await goto('/results');
  }
</script>

<svelte:head>
  <title>Ontology Coverage Dashboard</title>
  <meta
    name="description"
    content="Analyze ontology coverage with a traffic-light summary, competency-query details, and actionable error feedback."
  />
</svelte:head>

<div class="page-shell container space-y-8">
  <header class="space-y-3">
    <!-- <p class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700 dark:text-blue-400">CERTAIN</p> -->
    <div class="space-y-2">
      <h1 class="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Ontology coverage dashboard</h1>
      <p class="max-w-3xl text-base text-slate-600 dark:text-slate-300">
        Select an instantiated ontology to evaluate competency-query coverage against the AIdoc-AP reference on the server with Comunica.
      </p>
    </div>
  </header>

  <Card class="section-card p-4" size="xl">
    <form class="space-y-6" on:submit|preventDefault={handleAnalyze}>
      <div>
        <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100">Select ontology</h2>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Choose an instantiated ontology to evaluate against the AIdoc-AP reference ontology.
        </p>
      </div>

      <div class="max-w-sm">
        <Label for="instantiatedExample" class="mb-2 block font-medium text-slate-900 dark:text-slate-100">Instantiated ontology</Label>
        <Select
          id="instantiatedExample"
          name="instantiatedExample"
          items={exampleOptions}
          bind:value={selectedExample}
        />
        <Helper class="mt-2 text-slate-600 dark:text-slate-300">Used as the current project state to assess coverage.</Helper>
      </div>

      {#if retryIssues.length}
        <div class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
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
        class="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700 dark:disabled:text-slate-300"
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

  {#if !isLoading}
    <StatusAlert
      title="Ready to analyze"
      message="Run an analysis to open the dedicated results page with summary, filters, and detailed evidence."
    />

    {#if hasSavedResults}
      <div class="section-card p-4">
        <p class="text-sm text-slate-700 dark:text-slate-200">
          Latest analysis results are available.
          <a href="/results" class="font-semibold text-blue-700 underline-offset-2 hover:underline dark:text-blue-400">
            Open results
          </a>
        </p>
      </div>
    {/if}
  {/if}
</div>
