<script>
  export let width
  export let row
  export let col
  export let score
  export let step
  export let opacity
  export let risk

  $: inlineStyle = [
    `--width: ${width}px;`,
    `--score: ${score};`,
    `--color: ${step === 1 ? 'plum' : step === 2 ? '#c1b6ff' : '#dbd5ff'};`,
    `--opacity: ${opacity};`,
    `--risk: ${risk};`,
  ]
</script>

<div class="square" style={inlineStyle.join('')}>
  <div class="square__background" />
  <div class="square__data">
    <p>col {col}</p>
    <p>row {row}</p>
    <p>score {score.toFixed(2)}</p>
  </div>

  <!-- <p>step {step}</p>
  <p>order {order}</p>
  <p>opacity {opacity.toFixed(2)}</p> -->
  <!-- <p>score {score}</p> -->
</div>

<style lang="scss">
  .square {
    height: var(--width);
    width: var(--width);
    // background-color: var(--color);
    background-color: plum;
    font-family: monospace;
    position: relative;
    opacity: var(--opacity);
    border-radius: 3px;
    display: grid;

    > * {
      grid-area: 1/-1;
    }

    .square__background::after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      height: 100%;
      width: 100%;
      background-color: rgb(221, 255, 163);
      opacity: var(--risk);
      transition: opacity 100ms;
      // opacity: 0;
    }

    .square__data {
      z-index: 10;
    }
  }
</style>
