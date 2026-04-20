<svelte:options runes={false} />

<script lang="ts">
  import { Alert } from 'flowbite-svelte';

  export let title = 'Coverage analysis failed';
  export let message: string;
  export let issues: string[] = [];
</script>

<Alert color="red">
  <span class="font-semibold">{title}</span>
  <p class="mt-1 text-sm">{message}</p>
  {#if issues.length}
    <ul class="mt-2 list-disc pl-5 text-sm">
      {#each issues as issue}
        <li>{issue}</li>
      {/each}
    </ul>
  {/if}
</Alert>
