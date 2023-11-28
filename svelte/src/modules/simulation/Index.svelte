<script>
  import { pagesConfig } from './pagesConfig.js'
  import { computeScore } from './computeScore.js'
  import { dictionary } from './dictionary.js'
  import { potentialValues } from './potentialValues.js'

  import Score from './Score.svelte'

  export let width
  export let height
  export let currentPage
  export let progression
  export let pageProgression

  // WIP à implémenter (if currentPage === x)
  let explorationMode = false

  const calculateScore = (config) => {
    return computeScore(config).default
  }

  let currentConfig = { ...pagesConfig[0] }
  let currentScore = calculateScore(currentConfig)
  let previousConfig = currentConfig
  let previousScore = currentScore
  let updatedParams = {}

  $: updateConfig(currentPage)

  const paramsToHide = ['ID', 'GENDER']
  const filterParamsToHide = (configObject) => {
    return Object.fromEntries(
      Object.entries(configObject).filter(([key]) => {
        return !paramsToHide.includes(key)
      }),
    )
  }

  $: configToDisplay = filterParamsToHide(currentConfig)

  const updateConfig = (page) => {
    if (page === undefined || page === null) return
    if (pagesConfig[page] === undefined) return
    if (pagesConfig[page] === currentConfig) return

    previousConfig = currentConfig
    currentConfig = { ...pagesConfig[currentPage] }

    previousScore = currentScore
    currentScore = calculateScore(currentConfig)

    updatedParams = diffConfig(previousConfig, currentConfig)
  }

  const diffConfig = (previousConfig, currentConfig) => {
    let diff = {}
    for (const key in currentConfig) {
      if (previousConfig[key] !== currentConfig[key]) {
        diff[key] = currentConfig[key]
      }
    }
    return diff
  }

  const toggleValue = (key, value) => {
    if (explorationMode === false) return
    const currentIndex = potentialValues[key].indexOf(value)
    const newIndex =
      currentIndex === potentialValues[key].length - 1 ? 0 : currentIndex + 1
    currentConfig[key] = potentialValues[key][newIndex]
  }

  const wrapperClasses = [
    `simulation__wrapper`,
    explorationMode && `simulation__wrapper--exploration`,
  ]
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class={wrapperClasses.join(' ')}>
  <div class="simulation__container">
    <p>ILLU</p>
    <div class="simulations__parameters">
      {#each Object.entries(filterParamsToHide(configToDisplay)) as [key, value]}
        {#if key === 'ID'}
          <p>id</p>
        {:else}
          {@const hasBeenUpdated = updatedParams[key] !== undefined}
          {@const elementClasses = [
            `simulation__parameter`,
            hasBeenUpdated && 'simulation__parameter--updated',
          ]}
          <p class={elementClasses.join(' ')}>
            <span class="simulation__parameter__key">{dictionary[key]}: </span>
            <span
              on:click={() => toggleValue(key, value)}
              class="simulation__parameter__value">{value}</span
            >
          </p>
        {/if}
      {/each}
    </div>
    <p>PREV SCORE: {previousScore}</p>
    <p>SCORE: {currentScore}</p>
    <Score value={currentScore} previousValue={previousScore} />
  </div>
</div>

<style lang="scss">
  .simulation__wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .simulation__container {
    width: 600px;
  }

  .simulation__parameter {
    font-family: monospace;
    display: inline-block;

    &.simulation__parameter--updated {
      color: red;
    }
  }

  .simulation__wrapper--exploration {
    .simulation__parameter__value {
      color: #777;
      cursor: pointer;
    }
  }
</style>
