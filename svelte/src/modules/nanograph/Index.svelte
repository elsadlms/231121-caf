<script>
  import { fade } from 'svelte/transition'
  import { cubicOut } from 'svelte/easing'

  import { pagesConfig } from './pagesConfig'

  import Square from './Square.svelte'

  export let width
  export let height
  export let currentPage

  let currentConfig = { ...pagesConfig[0] }
  let lastConfig = {}
  $: updateConfig(currentPage)

  const updateConfig = (page) => {
    if (page === undefined || page === null) return
    if (pagesConfig[page] === undefined) return
    if (pagesConfig[page] === currentConfig) return

    lastConfig = currentConfig
    currentConfig = { ...pagesConfig[currentPage] }

    if (currentConfig.highlighted !== lastConfig.highlighted) updateSquaresObject()
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

  const flip = (node, { duration, delay }) => {
    return {
      duration,
      delay,
      css: (t) => {
        const eased = cubicOut(t)

        return `
          transform: rotateX(${180 - 180 * eased}deg);
					opacity: ${eased};
          `
      },
    }
  }

  const getRandomSquare = (i) => {
    const isHighlighted = i < currentConfig.highlighted
    const genderProba = isHighlighted ? currentConfig.womenProportion : 0.5
    const gender = Math.random() < genderProba ? 'woman' : 'man'
    return { isHighlighted, gender }
  }

  let squaresObject = Array.from({ length: colsNumber * rowsNumber }, (_, i) => getRandomSquare(i))

  const updateSquaresObject = () => {
    squaresObject = squaresObject.map((_, i) => {
      return getRandomSquare(i)
    })
  }

  $: containerClasses = [
    'nanog__container',
    `nanog__container--${currentPage > 0 ? 'active' : 'inactive'}`,
  ]

  $: inlineStyle = [
    `--squares-width: ${squareWidth}px;`,
    `--cols-number: ${colsNumber};`,
    `--rows-number: ${rowsNumber};`,
  ]
</script>

<div class={containerClasses.join(' ')} style={inlineStyle.join(' ')}>
  <div class="nanog__grid">
    {#each squaresObject as square, i}
      <div class="nanog__grid__cell">
        {#key currentConfig.highlighted}
          <div
            out:fade={{ duration: 600, delay: i * 2 }}
            in:flip={{
              duration: 400,
              delay: i * 6 + 100,
            }}
          >
            <Square
              {isMobile}
              width={squareWidth}
              isHighlighted={square.isHighlighted}
              gender={square.gender}
              index={i}
            />
          </div>
        {/key}
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .nanog__container {
    width: 100%;
    height: 100vh;
    display: grid;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    transition: opacity 600ms;
  }

  .nanog__container--inactive {
    opacity: 0.6;
  }

  :global(.nanog__container--inactive .person__img.person__img--second-layer) {
    opacity: 0 !important;
  }

  .nanog__grid {
    display: grid;
    grid-template-columns: repeat(var(--cols-number), var(--squares-width));
    grid-template-rows: repeat(var(--rows-number), var(--squares-width));
    grid-gap: 6px;

    @media (max-width: 800px) {
      grid-gap: 4px;
    }

    @media (max-width: 500px) {
      grid-gap: 2px;
    }
  }

  .nanog__grid__cell {
    display: grid;

    > * {
      grid-area: 1/-1;
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
