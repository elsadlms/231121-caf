<script>
  import { fade } from 'svelte/transition'

  import { pagesConfig } from './pagesConfig'

  import Square from './Square.svelte'

  export let width
  export let height
  export let currentPage

  let isAnimationPlaying = false
  let currentConfig = { ...pagesConfig[0] }
  $: updateConfig(currentPage)

  const updateConfig = (page) => {
    if (page === undefined || page === null) return
    if (pagesConfig[page] === undefined) return
    if (pagesConfig[page] === currentConfig) return

    currentConfig = { ...pagesConfig[currentPage] }
    isAnimationPlaying = true

    setTimeout(() => {
      isAnimationPlaying = false
    }, 1000)

    console.log(currentConfig)
  }

  $: isMobile = width < 700

  const colsNumber = 10
  const rowsNumber = 10

  $: margin = isMobile ? 60 : 100
  $: availableWidth = width - margin * 2
  $: availableHeight = height - margin * 2
  $: squareWidth = Math.min(
    100,
    availableWidth / colsNumber,
    availableHeight / rowsNumber,
  )

  $: containerClasses = [
    'nanog__container',
    isAnimationPlaying ? 'nanog__container--animated' : '',
  ]

  $: inlineStyle = [
    `--squares-width: ${squareWidth}px;`,
    `--cols-number: ${colsNumber};`,
    `--rows-number: ${rowsNumber};`,
  ]
</script>

<div class={containerClasses.join(' ')} style={inlineStyle.join(' ')}>
  <div class="nanog__grid">
    {#each Array.from({ length: 100 }) as _, i}
      {@const isHighlighted = i < currentConfig.highlighted}
      {@const genderLimit = isHighlighted ? currentConfig.womenProportion : 0.5}
      {@const gender = Math.random() < genderLimit ? 'woman' : 'man'}
      <div class="nanog__grid__cell">
        {#key pagesConfig}
          <div transition:fade={200}>
            <Square width={squareWidth} {isHighlighted} {gender} />
          </div>
        {/key}
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .nanog__container {
    width: 100%;
    height: 100%;
    display: grid;
    align-items: center;
    justify-content: center;
  }

  .nanog__grid {
    display: grid;
    grid-template-columns: repeat(var(--cols-number), var(--squares-width));
    grid-template-rows: repeat(var(--rows-number), var(--squares-width));
    grid-gap: 2px;
  }

  .nanog__grid__cell {
    display: grid;

    > * {
      grid-area: 1/-1;
    }
  }

  .nanog__container--animated {
    .nanog__grid__cell {
      // animation: fadeInOut 1000ms;
    }
  }

  @keyframes fadeInOut {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }
</style>
