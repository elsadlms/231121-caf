<script>
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

  const squareWidth = 100
  const animationSpan = 32
  const squaresArray = generateSquaresArray()

  $: apparitionProgression = Math.min(progression * 2, 1)
  $: apparitionMappedProgression =
    apparitionProgression * (squaresArray.length + animationSpan)
  $: apparitionMappedProgressionIndex = Math.floor(apparitionMappedProgression)

  $: scoreProgression = Math.max(progression * 2 - 1, 0)
  $: scoreMappedProgression =
    scoreProgression * (squaresArray.length + animationSpan)
  $: scoreMappedProgressionIndex = Math.floor(apparitionMappedProgression)

  $: getSquareOpacity = (order) => {
    if (
      order <= apparitionMappedProgressionIndex &&
      order > apparitionMappedProgressionIndex - animationSpan
    ) {
      return (apparitionMappedProgression - order) / animationSpan
    } else if (order <= apparitionMappedProgressionIndex - animationSpan) {
      return 1
    } else {
      return 0
    }
  }

  $: getSquareRisk = (square) => {
    const { score } = square

    if (scoreProgression === 0) return 0

    const noiseValue = 0

    return score * scoreProgression + noiseValue
  }

  $: getTextOpacity = () => {
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
        opacity={getSquareOpacity(square.order)}
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
