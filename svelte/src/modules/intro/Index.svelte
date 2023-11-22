<script>
  import { createNoise2D } from 'simplex-noise'
  import { texts } from '~/texts'

  import {
    rowsNumber,
    colsNumber,
    generateSquaresArray,
  } from './gridComposition'

  import Square from '~/components/Square.svelte'

  export let width
  export let height
  export let currentPage
  export let progression
  export let pageProgression

  const noise2D = createNoise2D()

  const squareWidth = 100
  const animationSpan = 32
  const squaresArray = generateSquaresArray()

  const STEP_APPARITION = 'apparition'
  const STEP_SCORE = 'score'
  const STEP_SORT = 'sort'

  const STEPS = [STEP_APPARITION, STEP_SCORE, STEP_SORT]

  $: getProgression = (step) => {
    const stepIndex = STEPS.indexOf(step)

    const rawValue = progression * STEPS.length - stepIndex
    const clampedValue = Math.max(0, Math.min(rawValue, 1))

    const mapped = clampedValue * (squaresArray.length + animationSpan)
    const index = Math.floor(mapped)

    return {
      value: clampedValue,
      mapped,
      index,
    }
  }

  $: getSquareOpacity = (square) => {
    const { order } = square

    if (
      order <= getProgression(STEP_APPARITION).index &&
      order > getProgression(STEP_APPARITION).index - animationSpan
    ) {
      return (getProgression(STEP_APPARITION).mapped - order) / animationSpan
    } else if (order <= getProgression(STEP_APPARITION).index - animationSpan) {
      return 1
    } else {
      return 0
    }
  }

  $: getSquareRisk = (square) => {
    const { score } = square

    const scoreProgression = getProgression(STEP_SCORE).value
    if (scoreProgression === 0) return 0

    if (scoreProgression === 1) {
      const sortingLimit = 0.7
      const sortProgression = getProgression(STEP_SORT).value
      if (sortProgression === 0) return 0

      if (score > sortingLimit) return score * scoreProgression + sortProgression
      else return score * scoreProgression - sortProgression
    } else {
      const noiseValue = noise2D(
        square.col * progression,
        square.row * progression
      )
      return score * scoreProgression + noiseValue * (1 - scoreProgression)
    }
  }

  $: getTextOpacity = () => {
    console.log(currentPage)
    if (currentPage === 0) return { title: 1, publi: 1 }
    if (currentPage === 1) return { title: 1, publi: 0 }
    return { title: 0, publi: 0 }
  }

  $: inlineStyle = [
    `--squares-width: ${squareWidth}px;`,
    `--cols-number: ${colsNumber};`,
    `--rows-number: ${rowsNumber};`,
    `--title-opacity: ${getTextOpacity().title};`,
    `--publi-opacity: ${getTextOpacity().publi};`,
  ]

  $: containerClasses = [
    'intro__container',
    `intro__container--page-${currentPage}`,
  ]
</script>

<div class={containerClasses.join(' ')} style={inlineStyle.join(' ')}>
  <div class="intro__grid">
    {#each squaresArray as square}
      <Square
        width={squareWidth}
        col={square.col + 1}
        row={square.row + 1}
        score={square.score}
        step={square.step}
        opacity={getSquareOpacity(square)}
        risk={getSquareRisk(square)}
      />
    {/each}
  </div>
  <div class="intro__text-container">
    <p class="intro__publication">{@html texts.publication}</p>
    <h4 class="intro__title">{@html texts.title}</h4>
    <p class="intro__signature">{@html texts.signature}</p>
  </div>
</div>

<style lang="scss">
  .intro__container {
    height: 100vh;
    width: 100%;
    display: grid;
    align-items: center;
    justify-content: center;

    > * {
      grid-area: 1 / -1;
    }
  }

  .intro__text-container,
  .intro__grid {
    display: grid;
    grid-template-columns: repeat(var(--cols-number), var(--squares-width));
    grid-template-rows: repeat(var(--rows-number), var(--squares-width));
    grid-gap: 2px;
  }

  .intro__text-container {
    text-align: center;
    font-family: var(--lmui-ff-the-antiqua-b, var(--ff-the-antiqua-b));
    align-items: center;
  }

  .intro__title {
    grid-column: 4 / 8;
    grid-row: 3 / 5;
    font-family: var(
      --lmui-ff-marr-sans-condensed,
      var(--ff-marr-sans-condensed)
    );
    text-transform: uppercase;
    font-size: 42px;
    font-weight: 600;
    line-height: 100%;
    transition: opacity 800ms;
    opacity: var(--title-opacity);
    margin: 0;
    padding: 0;
  }

  .intro__signature,
  .intro__publication {
    margin: 0;
    padding: 0;
    transition: opacity 800ms;
    opacity: var(--publi-opacity);
  }

  .intro__publication {
    align-self: flex-end;
    grid-column: 4 / 8;
    grid-row: 2;
  }

  .intro__signature {
    align-self: flex-start;
    grid-column: 4 / 8;
    grid-row: 5;
  }
</style>
