<script>
  import { createNoise2D } from 'simplex-noise'
  import { texts } from '~/texts'

  import { generateSquaresArray } from './generateSquaresArray'
  import { gridCompositionData } from './gridComposition'

  import Square from './Square.svelte'

  export let width
  export let height
  export let currentPage
  export let progression
  export let pageProgression

  $: isMobile = width < 700
  $: gridComposition =
    isMobile === true ? gridCompositionData.mobile : gridCompositionData.desktop

  $: colsNumber = [
    ...gridComposition.cols.firstStep,
    ...gridComposition.cols.secondStep,
    ...gridComposition.cols.thirdStep,
  ].length

  $: rowsNumber = [
    ...gridComposition.rows.firstStep,
    ...gridComposition.rows.secondStep,
    ...gridComposition.rows.thirdStep,
  ].length

  $: console.log(gridComposition)
  $: console.log(colsNumber)
  $: console.log(rowsNumber)

  const noise2D = createNoise2D()

  let textData = texts.intro
  if (typeof LM_PAGE !== 'undefined')
    textData = LM_PAGE.database?.value?.texts?.['module-intro']

  $: margins = isMobile ? 20 : 40
  $: availableWidth = width - margins * 2

  $: squareWidth = Math.min(100, availableWidth / colsNumber)
  $: console.log(width)

  const animationSpan = 32
  $: squaresArray = generateSquaresArray(gridComposition)

  console.log(squaresArray)

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

      if (score > sortingLimit)
        return score * scoreProgression + sortProgression
      else return score * scoreProgression - sortProgression
    } else {
      const noiseValue = noise2D(
        square.col * progression,
        square.row * progression,
      )
      return score * scoreProgression + noiseValue * (1 - scoreProgression)
    }
  }

  $: getTextOpacity = () => {
    if (currentPage === 0 && pageProgression < 0.6)
      return { title: 1, publi: 1 }
    if (currentPage === 0 && pageProgression < 0.8)
      return { title: 1, publi: 0 }
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
    `intro__container--${isMobile ? 'mobile' : 'desktop'}`,
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
        order={square.order}
        opacity={getSquareOpacity(square)}
        risk={getSquareRisk(square)}
      />
    {/each}
  </div>
  <div class="intro__text-container">
    <p class="intro__publication">{@html textData.publication}</p>
    <h4 class="intro__title">{@html textData.title}</h4>
    <p class="intro__signature">{@html textData.signature}</p>
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

  .intro__grid {
    z-index: 2;
  }

  .intro__text-container {
    text-align: center;
    font-family: var(--lmui-ff-the-antiqua-b, var(--ff-the-antiqua-b));
    align-items: center;
    z-index: 1;
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
    padding: 0 12px;

    @media (max-width: 1200px) {
      font-size: 32px;
    }

    @media (max-width: 900px) {
      grid-column: 3 / 9;
      grid-row: 3 / 5;
    }

    // @media (max-width: 800px) {
    //   font-size: 42px;
    //   max-width: 80%;
    //   margin: 0 auto;
    // }

    @media (max-width: 700px) {
      max-width: 80%;
      font-size: 32px;
      margin: 0 auto;
      grid-column: 1 / 7;
      grid-row: 5 / 7;
    }

    @media (max-width: 430px) {
      max-width: 100%;
      padding: 0 8px;
      font-size: 24px;
    }
  }

  .intro__signature,
  .intro__publication {
    transition: opacity 800ms;
    opacity: var(--publi-opacity);
    margin: 0;
    padding: 0 12px;
    font-size: 16px;

    @media (max-width: 1200px) {
      font-size: 14px;
    }

    // @media (max-width: 800px) {
    //   max-width: 60%;
    //   margin: 0 auto;
    // }

    @media (max-width: 700px) {
      max-width: 80%;
      margin: 0 auto;
    }
  }

  .intro__publication {
    align-self: flex-end;
    grid-column: 4 / 8;
    grid-row: 2;

    @media (max-width: 700px) {
      grid-column: 1 / 7;
      grid-row: 4;
    }
  }

  .intro__signature {
    align-self: flex-start;
    grid-column: 4 / 8;
    grid-row: 5;

    @media (max-width: 700px) {
      grid-column: 1 / 7;
      grid-row: 7;
    }
  }
</style>
