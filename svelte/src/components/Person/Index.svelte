<script>
  import { getRandomFromArray } from '~/utils.js'
  import { menArray, womenArray } from './faces'

  export let gender
  export let nathalie
  export let color

  $: svg =
    nathalie === true
      ? womenArray[0]
      : gender === 'woman'
        ? getRandomFromArray(womenArray)
        : getRandomFromArray(menArray)

  $: inlineStyle = [`--stroke-color: ${color};`]
</script>

<div class="person__container" style={inlineStyle.join(' ')}>
  {@html svg}
</div>

<style lang="scss">
  :global(.person__container svg) {
    max-width: 100%;
    height: 100%;
  }

  :global(.person__container svg rect),
  :global(.person__container svg path) {
    stroke: var(--stroke-color) !important;
    stroke-width: 4px !important;
  }
</style>
