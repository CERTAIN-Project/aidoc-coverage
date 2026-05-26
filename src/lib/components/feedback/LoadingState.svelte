<svelte:options runes={false} />

<script lang="ts">
  import { Spinner } from 'flowbite-svelte';

  export let message = 'Analyzing ontology coverage…';
</script>

<div class="section-card flex items-center gap-3 p-6" aria-live="polite">
  <Spinner size="8" color="blue" type="default" />
  <p class="text-sm font-medium text-slate-700">{message}</p>
</div>
