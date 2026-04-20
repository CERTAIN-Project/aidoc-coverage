<svelte:options runes={false} />

<script lang="ts">
  import { Card, Helper, Label } from 'flowbite-svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{
    analyze: { originatingOntology: File; instantiatedOntology: File };
  }>();

  export let disabled = false;
  export let issues: string[] = [];
  export let onAnalyze:
    | ((payload: { originatingOntology: File; instantiatedOntology: File }) => void)
    | undefined = undefined;

  let formElement: HTMLFormElement;

  function handleSubmit() {
    const formData = new FormData(formElement);
    const originatingOntology = formData.get('originatingOntology');
    const instantiatedOntology = formData.get('instantiatedOntology');

    if (!(originatingOntology instanceof File) || !(instantiatedOntology instanceof File)) {
      return;
    }

    const payload = { originatingOntology, instantiatedOntology };
    onAnalyze?.(payload);
    dispatch('analyze', payload);
  }
</script>

<Card class="section-card">
  <form bind:this={formElement} class="space-y-6" on:submit|preventDefault={handleSubmit}>
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
        />
        <Helper class="mt-2">Used as the current project state to assess coverage.</Helper>
      </div>
    </div>

    {#if issues.length}
      <div class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        <p class="font-medium">Please resolve the following before retrying:</p>
        <ul class="mt-2 list-disc pl-5">
          {#each issues as issue}
            <li>{issue}</li>
          {/each}
        </ul>
      </div>
    {/if}

    <button
      type="submit"
      class="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
      disabled={disabled}
    >
      Analyze coverage
    </button>
  </form>
</Card>
