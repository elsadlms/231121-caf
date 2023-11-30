<script>
  import { onMount } from 'svelte'
  import { loadModule } from '~/loadModule'

  export let context
  export let pContext
  export let currentPage = 0

  let pagesNumber = 5

  $: {
    currentPage = Math.floor(context.progression * pagesNumber)
  }

  let Module
  onMount(async () => {
    Module = await loadModule()
  })

  const incrementPage = () => {
    currentPage++
  }

  const decrementPage = () => {
    if (currentPage === 0) return
    currentPage--
  }

  const resetPage = () => {
    currentPage = 0
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div class="dev-container" style="--pages-numbers: {pagesNumber};">
  <div class="dev-dashboard">
    <div>
      <p>page: {currentPage}</p>
      <p>progression: {context.progression.toFixed(2)}</p>
    </div>
    <!-- <div>
      <p on:click={incrementPage}>page++</p>
      <p on:click={decrementPage}>page--</p>
      <p on:click={resetPage}>reset page</p>
    </div> -->
    {#if Module === undefined}
      <p>
        Le composant `{import.meta.env.VITE_MODULE}` ne fait pas partie de la
        liste des composants !
      </p>
    {:else}
      <p>
        composant: `{import.meta.env.VITE_MODULE}`
      </p>
    {/if}
  </div>

  <div class="module-container">
    {#if Module !== undefined}
      <svelte:component
        this={Module}
        width={context.width}
        height={context.height}
        {currentPage}
        progression={context.progression}
        pageProgression={context.pageProgression}
      />
    {/if}
  </div>
</div>

<style lang="scss">
  :global(body) {
    margin: 0;
  }

  .module-container {
    background-color: #001c37;
    color: #fff;
  }

  .dev-container {
    height: calc(var(--pages-numbers) * 100vh);
    position: relative;
    font-family: monospace;
  }

  .dev-dashboard {
    position: fixed;
    top: 0;
    z-index: 10;
    margin: 12px;
    background-color: #00000033;
    color: #fff;
    padding: 20px;
    border-radius: 3px;

    > div {
      display: flex;

      p {
        margin: 0;
      }

      p + p {
        padding-left: 1em;
      }
    }
  }

  .module-container {
    position: fixed;
    top: 0;
    height: 100%;
    width: 100%;
  }
</style>
