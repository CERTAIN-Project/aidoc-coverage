<svelte:options runes={false} />

<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { Card, Helper, Label } from 'flowbite-svelte';
  import ErrorState from '$lib/components/feedback/ErrorState.svelte';
  import LoadingState from '$lib/components/feedback/LoadingState.svelte';
  import StatusAlert from '$lib/components/feedback/StatusAlert.svelte';
  import type { CoverageAnalysisResponse } from '$lib/server/coverage/types';

  const LAST_RESULTS_STORAGE_KEY = 'coverage:lastResult';

  let isLoading = false;
  let hasSavedResults = false;
  let errorState: { message: string; issues: string[] } | null = null;
  let retryIssues: string[] = [];
  let originatingFiles: FileList | null = null;
  let instantiatedFiles: FileList | null = null;

  onMount(() => {
    if (!browser) {
      return;
    }

    hasSavedResults = Boolean(sessionStorage.getItem(LAST_RESULTS_STORAGE_KEY));
  });

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

<div class="page-shell space-y-8">
  <header class="space-y-3">
    <p class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700 dark:text-blue-400">CERTAIN</p>
    <div class="space-y-2">
      <h1 class="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Ontology coverage dashboard</h1>
      <p class="max-w-3xl text-base text-slate-600 dark:text-slate-300">
        Upload an originating ontology and an instantiated ontology to evaluate competency-query coverage on the server with Comunica.
      </p>
    </div>
  </header>

  <Card class="section-card p-4" size="xl">
    <form class="space-y-6" on:submit|preventDefault={handleAnalyze}>
      <div>
        <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100">Upload ontologies</h2>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Provide one originating ontology and one instantiated ontology in Turtle format.
        </p>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <div>
          <Label for="originatingOntology" class="mb-2 block font-medium text-slate-900 dark:text-slate-100">Originating ontology (.ttl)</Label>
          <input
            id="originatingOntology"
            name="originatingOntology"
            type="file"
            accept=".ttl,text/turtle"
            class="block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-900 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:file:bg-slate-800 dark:file:text-slate-100 dark:hover:file:bg-slate-700"
            bind:files={originatingFiles}
          />
          <Helper class="mt-2 text-slate-600 dark:text-slate-300">Used as the reference ontology and query context.</Helper>
        </div>

        <div>
          <Label for="instantiatedOntology" class="mb-2 block font-medium text-slate-900 dark:text-slate-100">Instantiated ontology (.ttl)</Label>
          <input
            id="instantiatedOntology"
            name="instantiatedOntology"
            type="file"
            accept=".ttl,text/turtle"
            class="block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-900 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:file:bg-slate-800 dark:file:text-slate-100 dark:hover:file:bg-slate-700"
            bind:files={instantiatedFiles}
          />
          <Helper class="mt-2 text-slate-600 dark:text-slate-300">Used as the current project state to assess coverage.</Helper>
        </div>
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
