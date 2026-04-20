<svelte:options runes={false} />

<script lang="ts">
  import { Alert } from 'flowbite-svelte';

  export let color: 'blue' | 'green' | 'red' | 'yellow' = 'blue';
  export let title: string;
  export let message: string;
</script>

<Alert {color}>
  <span class="font-semibold">{title}</span>
  <div class="mt-1 text-sm">{message}</div>
</Alert>
