<script>
  import { getRandomFromArray } from '~/utils.js'
  import { faces } from './faces'

  export let isMobile
  export let gender = undefined
  export let nathalie = false
  export let color = 'lightBlue'
  export let secondLayer = false
  export let secondColor = 'red'
  export let secondLayerOpacity = 0

  const getFace = (nathalie, gender) => {
    if (nathalie === true) return faces['women'][0]
    if (gender === 'woman') return getRandomFromArray(faces['women'])
    if (gender === 'man') return getRandomFromArray(faces['men'])
    return getRandomFromArray([...faces['women'], ...faces['men']])
  }

  $: device = isMobile === true ? 'mobile' : 'desktop'
  $: selectedFace = getFace(nathalie, gender)

  $: inlineStyle = [`--second-layer-opacity: ${secondLayerOpacity};`]

</script>

<!-- svelte-ignore a11y-missing-attribute -->
<div class="person__container" style={inlineStyle.join(' ')}>
  <!-- <div class="person__svg">{@html svg}</div> -->

  <img class="person__img person__img--first-layer" src={selectedFace[device][color]} />
  {#if secondLayer === true}
    <img
      class="person__img person__img--second-layer"
      src={selectedFace[device][secondColor]}
    />
  {/if}
</div>

<style lang="scss">
  .person__container {
    display: grid;

    > * {
      grid-area: 1/-1;
    }
  }

  .person__img {
    max-width: 100%;
  }

  .person__img.person__img--second-layer {
    // transition: opacity 200ms;
    opacity: var(--second-layer-opacity);
  }
</style>



