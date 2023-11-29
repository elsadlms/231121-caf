<script>
  import { onMount } from 'svelte'

  export let context
  export let pContext

  let AppComponent

  onMount(async () => {
    let appComponentPromise

    if (import.meta.env.MODE === 'production') {
      appComponentPromise = import('~/entry/prod/App.svelte')
    } else {
      appComponentPromise = import('~/entry/dev/App.svelte')
    }

    const promiseResult = await appComponentPromise
    AppComponent = promiseResult.default
  })
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="lm-svelte-module">
  {#if AppComponent !== undefined}
    <svelte:component this={AppComponent} {context} {pContext} />
  {/if}
</div>

<style>
  :global(:root) {
    --caf-c-light-blue: #cde6e7;
    --caf-c-blue: #48FFFF;
    --caf-c-red: #FF1B1B;
    --caf-ff-roboto-mono: 'Roboto Mono', monospace;
  }

  :global(.lm-svelte-module p) {
    margin: 0;
  }
</style>
