<script>
  import { texts } from '~/texts'

  import { config as pagesConfig } from './pagesConfig.js'
  import { computeScore } from './computeScore.js'

  import Person from '~/components/Person/Index.svelte'
  import Score from './Score.svelte'

  export let width
  export let height
  export let currentPage
  export let progression
  export let pageProgression

  $: isMobile = width < 700

  let textData = texts.simulation
  if (typeof LM_PAGE !== 'undefined')
    textData = LM_PAGE.database?.value?.texts?.['module-simulation']

  const calculateScore = (config) => {
    return computeScore(config)
  }

  let currentConfig = { ...pagesConfig[currentPage ?? 0] }
  let currentScore = calculateScore(currentConfig.scoreData)
  let previousConfig = {}
  let lastConfig = {}
  let updatedParams = {}

  $: updateConfig(currentPage)

  $: displayScoreLimit = currentConfig.part === 3 ? true : false
  $: displayScoreRange = currentConfig.part === 3 ? true : false
  $: conjointAge = currentConfig.part === 2 ? getAge(pageProgression) : null

  const updateConfig = (page) => {
    if (page === undefined || page === null) return
    if (pagesConfig[page] === undefined) return
    if (pagesConfig[page] === currentConfig) return

    lastConfig = currentConfig
    currentConfig = { ...pagesConfig[page] }
    currentScore = calculateScore(currentConfig.scoreData)

    if (page - 1 === undefined || page - 1 === null) return
    if (pagesConfig[page - 1] === undefined) return
    if (pagesConfig[page - 1] === currentConfig) return

    previousConfig = { ...pagesConfig[page - 1] }
    // previousScore = calculateScore(previousConfig.scoreData)

    updatedParams = diffConfig(previousConfig.params, currentConfig.params)
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

  const getAge = (progression) => {
    if (currentConfig.id === 0) return currentConfig.baseAge

    const additionalAge = Math.floor(progression * 3)
    return currentConfig.baseAge + additionalAge
  }

  $: wrapperClasses = [
    `simulation__wrapper`,
    `simulation__wrapper--${currentConfig.name.toLowerCase()}`,
  ]
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class={wrapperClasses.join(' ')}>
  <div class="simulation__container">
    <div class="simulation__profile">
      {#if currentConfig.name !== 'couple'}
        <p class="simulation__profile__name">
          {@html currentConfig.name}
        </p>
      {/if}
      <div class="simulation__profile__illus">
        <Person
          {isMobile}
          name={currentConfig.name.toLowerCase()}
          color={'lightBlue'}
        />
      </div>
      <div class="simulation__profile__score">
        <Score
          value={currentScore.average}
          displayLimit={displayScoreLimit}
          displayRange={displayScoreRange}
          minValue={currentScore.min}
          maxValue={currentScore.max}
        />
      </div>
    </div>

    <div class="simulation__parameters">
      {#each Object.entries(currentConfig.params) as [key, value]}
        {#if currentConfig.part === 2 && key === 'conjoint'}
          {@const hasBeenUpdated = conjointAge !== 57}
          {@const elementClasses = [
            `simulation__parameter`,
            hasBeenUpdated ? 'simulation__parameter--updated' : '',
          ]}
          <p class={elementClasses.join(' ')}>
            <span class="simulation__parameter__value">
              {textData.conjoint1}
              {conjointAge}
              {textData.conjoint2}
            </span>
          </p>
        {:else}
          {@const hasBeenUpdated =
            currentConfig.id !== 0 && updatedParams[key] !== undefined}
          {@const isHidden = value === ''}
          {@const elementClasses = [
            `simulation__parameter`,
            hasBeenUpdated ? 'simulation__parameter--updated' : '',
            isHidden ? 'simulation__parameter--hidden' : '',
          ]}
          {@const lastValue = lastConfig.hasOwnProperty('params')
            ? lastConfig.params[key]
            : ''}
          {@const content =
            lastValue !== '' && value === '' ? lastValue : value}
          <p class={elementClasses.join(' ')}>
            {#if content !== undefined}
              <span class="simulation__parameter__value">{@html content}</span>
            {/if}
          </p>
        {/if}
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  .simulation__wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    // align-items: center;
    justify-content: center;
    padding-top: 10vh;

    @media (max-width: 400px) {
      padding-top: 8vh;
    }
  }

  .simulation__container {
    display: flex;
    flex-direction: column;
  }

  .simulation__profile {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .simulation__profile__name {
    text-transform: uppercase;
    color: var(--caf-c-light-blue);
    text-shadow: 0px 1px 4px rgba(72, 255, 255, 0.75);
    font-family: var(--caf-ff-roboto-mono);
    font-size: 16px;
    padding-bottom: 16px;
    font-style: normal;
    font-weight: 400;
    letter-spacing: 0.3px;
  }

  .simulation__profile__illus {
    width: 130px;
    filter: drop-shadow(0px 0px 54px #48ffff);
    padding-bottom: 42px;

    @media (max-width: 500px) {
      width: 100px;
    }
  }

  .simulation__parameters {
    font-family: var(--caf-ff-roboto-mono);
    width: 320px;
    max-width: 70vw;
    margin: 0 auto;
    font-size: 16px;
    letter-spacing: 0.02em;
    line-height: 100%;
    padding-top: 32px;
  }

  .simulation__parameter {
    transition:
      opacity 800ms,
      color 300ms;
    color: rgba(255, 255, 255, 0.65);
    font-size: 16px;

    &.simulation__parameter--updated {
      color: var(--caf-c-blue);
    }

    &.simulation__parameter--hidden {
      opacity: 0;
    }

    + .simulation__parameter {
      padding-top: 1em;
    }

    @media (max-width: 800px) {
      font-size: 14px;

      + .simulation__parameter {
        padding-top: 0.66em;
      }
    }

    @media (max-width: 400px) {
      font-size: 12px;
    }
  }

  .simulation__wrapper--couple {
    .simulation__profile__illus {
      width: 260px;
      padding-bottom: 48px;

      @media (max-width: 500px) {
        width: 200px;
      }
    }
  }
</style>
