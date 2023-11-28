<script>
  import arrow from '~/assets/arrow.svg'
  import { texts } from '~/texts'

  export let value
  export let previousValue

  const riskLimit = 0.7

  const colorScale = [
    { range: [0, 0.05], color: '#D9FFFF' },
    { range: [0.05, 0.2], color: '#FFE963' },
    { range: [0.2, 0.6], color: 'orange' },
    { range: [0.6, 1], color: 'red' },
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

  $: console.log(value)

  $: inlineStyle = [
    `--limit-offset: ${riskLimit * 100}%;`,
    `--score-width: ${value * 100}%;`,
    `--score-fill: ${getScoreColor(value)};`,
  ]
</script>

<div class="score__container" style={inlineStyle.join(' ')}>
  <div class="score__bar">
    <div class="score__bar__shadow"></div>
    <div class="score__bar__fill"></div>
    <div class="score__bar__limit">
      <span>Risque&nbsp;de&nbsp;contrôle</span>
    </div>
  </div>
  <!-- <p>{value}</p> -->
</div>

<style lang="scss">
  .score__bar {
    display: grid;
    height: 10px;
    width: 300px;
    background-color: #2a4555;
    position: relative;

    > * {
      grid-area: 1 / -1;
    }
  }

  .score__bar__fill {
    background-color: var(--score-fill);
    width: var(--score-width);
    transition: width 600ms, background-color 600ms;
  }

  .score__bar__limit {
    background-color: red;
    width: 0;
    position: absolute;
    left: var(--limit-offset);
    display: grid;
    justify-content: center;
    justify-items: center;

    > * {
      grid-area: 1 / -1;
    }

    &::after {
      content: '';
      display: block;
      height: 24px;
      width: 12px;
      background-image: url('https://assets-decodeurs.lemonde.fr/redacweb/231121-caf-assets/arrow.svg');
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
    }

    span {
      text-transform: uppercase;
      position: absolute;
      top: calc(100% + 4px);
    }
  }
</style>
