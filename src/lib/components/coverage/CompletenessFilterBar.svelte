<svelte:options runes={false} />

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { CompletenessFilterStatus, CompletenessFilterType } from './completeness-helpers';
    import { Label } from 'flowbite-svelte';

  const dispatch = createEventDispatcher<{
    changeType: CompletenessFilterType;
    changeStatus: CompletenessFilterStatus;
  }>();

  export let selectedType: CompletenessFilterType = 'all';
  export let selectedStatus: CompletenessFilterStatus = 'all';

  const typeOptions: { label: string; value: CompletenessFilterType }[] = [
    { label: 'All types', value: 'all' },
    { label: 'owl:Class', value: 'owl:Class' },
    { label: 'owl:ObjectProperty', value: 'owl:ObjectProperty' },
    { label: 'owl:DatatypeProperty', value: 'owl:DatatypeProperty' },
    { label: 'owl:NamedIndividual', value: 'owl:NamedIndividual' }
  ];

  const statusOptions: { label: string; value: CompletenessFilterStatus }[] = [
    { label: 'All', value: 'all' },
    { label: 'Exists', value: 'used' },
    { label: 'Not exists', value: 'unused' }
  ];
</script>

<div class="section-card space-y-4 p-4">
  <div>
    <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Filter ontology types</h3>
    <p class="text-sm text-slate-600 dark:text-slate-300">Focus on a category or on terms that are missing from the analyzed data.</p>
  </div>

  <div class="flex flex-wrap gap-2 items-center">
  <Label class="text-base w-24">OWL Type:</Label>
    {#each typeOptions as option}
      <button
        type="button"
        class="rounded-lg border px-4 py-2 text-sm font-medium transition"
        class:bg-blue-700={selectedType === option.value}
        class:text-white={selectedType === option.value}
        class:border-blue-700={selectedType === option.value}
        class:border-slate-300={selectedType !== option.value}
        class:dark:border-slate-600={selectedType !== option.value}
        class:bg-white={selectedType !== option.value}
        class:dark:bg-slate-900={selectedType !== option.value}
        class:text-slate-700={selectedType !== option.value}
        class:dark:text-slate-200={selectedType !== option.value}
        on:click={() => dispatch('changeType', option.value)}
      >
        {option.label}
      </button>
    {/each}
  </div>

  <div class="flex flex-wrap gap-2 items-center">
  <Label class="text-base w-24">Status:</Label>
    {#each statusOptions as option}
      <button
        type="button"
        class="rounded-lg border px-4 py-2 text-sm font-medium transition"
        class:bg-blue-700={selectedStatus === option.value}
        class:text-white={selectedStatus === option.value}
        class:border-blue-700={selectedStatus === option.value}
        class:border-slate-300={selectedStatus !== option.value}
        class:dark:border-slate-600={selectedStatus !== option.value}
        class:bg-white={selectedStatus !== option.value}
        class:dark:bg-slate-900={selectedStatus !== option.value}
        class:text-slate-700={selectedStatus !== option.value}
        class:dark:text-slate-200={selectedStatus !== option.value}
        on:click={() => dispatch('changeStatus', option.value)}
      >
        {option.label}
      </button>
    {/each}
  </div>
</div>
