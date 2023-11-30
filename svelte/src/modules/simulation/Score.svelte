<script>
  import arrow from '~/assets/arrow.svg'
  import { texts } from '~/texts'

  export let value
  // export let previousValue
  export let displayRange
  export let minValue
  export let maxValue

  console.log(minValue)
  console.log(maxValue)

  const riskLimit = 0.5

  const colorScale = [
    { range: [0, 0.5], color: '#BE6D6D' },
    { range: [0.5, 1], color: '#FF1B1B' },
  ]

  const getScoreColor = (value) => {
    for (const section of colorScale) {
      if (value >= section.range[0] && value < section.range[1]) {
        return section.color
      }
    }
    return '#000'
  }

  let textData = texts.simulation
  if (typeof LM_PAGE !== 'undefined')
    textData = LM_PAGE.database?.value?.texts?.['module-simulation']

  // $: console.log(value * 10)

  $: containerClasses = [
    'score__container',
    displayRange ? 'score__container--range' : '',
  ]

  $: inlineStyle = [
    `--limit-offset: ${riskLimit * 100}%;`,
    `--score-value: ${value * 100}%;`,
    `--score-min: ${minValue * 100}%;`,
    `--score-max: ${maxValue * 100}%;`,
    `--score-fill-left: #48FFFF;`,
    // `--score-fill-right: ${getScoreColor(value)};`,
    `--score-fill-right: #FF1B1B;`,
  ]
</script>

<div class={containerClasses.join(' ')} style={inlineStyle.join(' ')}>
  <div class="score__bar">
    <div class="score__bar__shadow"></div>
    <div class="score__bar__fill"></div>
    <div class="score__bar__range"></div>
    <div class="score__bar__limit"></div>
  </div>
  <!-- <p>{value}</p> -->
</div>

<style lang="scss">
  .score__bar {
    --score-fill-gradient: linear-gradient(
      270deg,
      var(--score-fill-right) 0%,
      var(--score-fill-left) 100%
    );
    display: grid;
    height: 10px;
    width: 300px;
    max-width: 70vw;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    position: relative;

    > * {
      grid-area: 1 / -1;
    }

    &::before,
    &::after {
      --pos-offset: -1.3em;
      display: block;
      line-height: 1em;
      font-size: 20px;
      top: -50%;
      font-weight: 600;
      font-family: var(--caf-ff-roboto-mono);
    }

    &::before {
      content: '0';
      position: absolute;
      left: var(--pos-offset);
      color: var(--caf-c-blue);
      text-shadow: 0px 1px 4px rgba(72, 255, 255, 0.75);
    }

    &::after {
      content: '1';
      position: absolute;
      right: var(--pos-offset);
      color: var(--caf-c-red);
      text-shadow: 0px 1px 4px rgba(255, 27, 27, 0.75);
    }
  }

  .score__bar__fill {
    border-radius: 10px;
    background: var(--score-fill-gradient);
    width: var(--score-value);
    transition:
      width 600ms,
      background-color 600ms;
  }

  .score__bar__limit {
    border-right: 1px dashed #fff;
    height: 30px;
    position: absolute;
    top: -100%;
    left: var(--limit-offset);
    display: grid;
    justify-content: center;
    justify-items: center;
  }

  .score__bar__range {
    border-radius: 10px;
    background: red;
    width: 2px;
    left: var(--score-min);
    transition:
      width 600ms,
      background-color 600ms;

    &::after {
      display: block;
      content: '';
      position: absolute;
      left: var(--score-max);
      height: 10px;
      border-right: 2px solid red;
    }
  }

  .score__container {
    .score__bar__range {
      display: none;
    }
  }

  .score__container--range {
    .score__bar__fill {
      display: none;
    }

    .score__bar__range {
      display: block;
    }
  }
</style>
