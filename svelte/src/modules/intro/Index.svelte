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

  const noise2D = createNoise2D()

  let textData = texts.intro
  if (typeof LM_PAGE !== 'undefined')
    textData = LM_PAGE.database?.value?.texts?.['module-intro']

  $: squareWidth = isMobile ? 60 : 100

  const animationSpan = 20
  const squaresAlreadyPresent = 20
  $: squaresArray = generateSquaresArray(gridComposition)

  const STEP_APPARITION = 'apparition'
  const STEP_SCORE = 'score'
  const STEP_SCORE_FADE_IN = 'score-fade-in'
  const STEP_SORT = 'sort'

  const STEPS = [
    {
      name: STEP_APPARITION,
      start: 0,
      end: 0.15,
    },
    {
      name: STEP_SCORE_FADE_IN,
      start: 0.15,
      end: 0.3,
    },
    {
      name: STEP_SCORE,
      start: 0.3,
      end: 0.65,
    },
    {
      name: STEP_SORT,
      start: 0.65,
      end: 1.01,
    },
  ]

  $: getProgression = (step) => {
    const stepLength = step.end - step.start

    let rawValue = 0
    if (progression < step.start) rawValue = 0
    else if (progression > step.end) rawValue = 1
    else if (progression > step.start && progression < step.end) {
      rawValue = (progression - step.start) * (1 / stepLength)
    }

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
    const { order, step } = square

    if (currentPage === undefined) return 0
    if (currentPage === null) return 0

    if (currentPage > 5) {
      if (step === 2 || step === 3) return 0
      else return 1
    } else {
      const shiftedOrder = order - squaresAlreadyPresent

      const stepApparition = STEPS.find((el) => el.name === STEP_APPARITION)

      if (
        shiftedOrder <= getProgression(stepApparition).index &&
        shiftedOrder > getProgression(stepApparition).index - animationSpan
      ) {
        return (
          (getProgression(stepApparition).mapped - shiftedOrder) / animationSpan
        )
      } else if (
        shiftedOrder <=
        getProgression(stepApparition).index - animationSpan
      ) {
        return 1
      } else {
        return 0
      }
    }
  }

  $: getSquareRisk = (square) => {
    const { score } = square

    const stepScoreFadeIn = STEPS.find((el) => el.name === STEP_SCORE_FADE_IN)
    const stepScore = STEPS.find((el) => el.name === STEP_SCORE)
    const stepSort = STEPS.find((el) => el.name === STEP_SORT)

    const scoreFadeInProgression = getProgression(stepScoreFadeIn).value
    const scoreProgression = getProgression(stepScore).value

    if (scoreFadeInProgression === 0) return 0

    if (scoreProgression === 1) {
      const sortingLimit = 0.7
      const sortProgression = getProgression(stepSort).value
      if (sortProgression === 0) return 0

      if (score > sortingLimit)
        return score * scoreProgression + sortProgression
      else return score * scoreProgression - sortProgression
    } else {
      const noiseValue = noise2D(
        square.col * progression,
        square.row * progression,
      )
      return (
        score * scoreProgression +
        noiseValue * (1 - scoreProgression) * scoreFadeInProgression
      )
    }
  }

  $: getTextOpacity = () => {
    if (currentPage > 5) return { title: 1, publi: 1 }
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
        {isMobile}
        width={squareWidth}
        opacity={getSquareOpacity(square)}
        risk={getSquareRisk(square)}
        step={square.step}
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
    width: 100%;
    height: fit-content;
    top: 50%;
    position: absolute;
    transform: translateY(-50%);
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
    grid-gap: 12px;
  }

  .intro__grid {
    z-index: 2;
    pointer-events: none;
  }

  .intro__text-container {
    text-align: center;
    font-family: var(--lmui-ff-the-antiqua-b, var(--ff-the-antiqua-b));
    align-items: center;
    z-index: 1;
  }

  .intro__title {
    font-family: var(
      --lmui-ff-marr-sans-condensed,
      var(--ff-marr-sans-condensed)
    );
    text-transform: uppercase;
    font-size: 42px;
    text-shadow: 0px 0px 7px rgba(72, 255, 255, 0.48);
    font-weight: 500;
    line-height: 100%;
    letter-spacing: 0.02em;
    transition: opacity 800ms;
    opacity: var(--title-opacity);
    margin: 0 auto;
    padding: 0 12px;
    max-width: 90vw;

    @media (max-width: 700px) {
      font-size: 32px;
    }

    @media (max-width: 430px) {
      font-size: 28px;
    }
  }

  .intro__signature,
  .intro__publication {
    font-family: var(--caf-ff-roboto-mono);
    text-transform: uppercase;
    color: var(--caf-c-blue);
    transition: opacity 800ms;
    opacity: var(--publi-opacity);
    margin: 0 auto;
    padding: 0 12px;
    font-size: 14px;
    line-height: 120%;
    font-weight: 500;
    max-width: min(90vw, 400px);

    @media (max-width: 900px) {
      font-size: 12px;
      max-width: min(90vw, 300px);
    }
  }

  .intro__title {
    grid-column: 7 / 11;
    grid-row: 4 / 6;
  }

  .intro__publication {
    align-self: flex-end;
    grid-column: 7 / 11;
    grid-row: 3;
  }

  .intro__signature {
    align-self: flex-start;
    grid-column: 7 / 11;
    grid-row: 6;
  }

  .intro__container--mobile {
    .intro__title {
      grid-column: 1 / -1;
      grid-row: 8 / 10;
    }

    .intro__publication {
      grid-column: 1 / -1;
      grid-row: 7;
    }

    .intro__signature {
      grid-column: 1 / -1;
      grid-row: 10;
    }

    .intro__text-container,
    .intro__grid {
      grid-gap: 10px;
    }
  }

  .intro__grid,
  .intro__text-container {
    animation-name: fadeIn;
    animation-duration: 1600ms;
    animation-fill-mode: forwards;
  }

  // .intro__publication {
  //   animation-delay: 0;
  // }

  // .intro__title {
  //   animation-delay: 150ms;
  // }

  // .intro__signature {
  //   animation-delay: 300ms;
  // }

  @keyframes fadeIn {
    0% {
      filter: blur(6px);
      opacity: 0;
    }
  }
</style>
