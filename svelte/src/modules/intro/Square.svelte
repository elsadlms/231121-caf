<script>
  import Person from '~/components/Person/Index.svelte'

  export let isMobile
  export let width
  export let opacity
  export let risk

  $: inlineStyle = [`--width: ${width}px;`, `--opacity: ${opacity};`]
</script>

<div class="square" style={inlineStyle.join('')}>
  <Person
    {isMobile}
    color={'transparentBlue'}
    secondLayer={true}
    secondColor={'red'}
    secondLayerOpacity={risk}
  />
</div>

<style lang="scss">
  .square {
    height: var(--width);
    width: var(--width);
    position: relative;
    opacity: var(--opacity);
    transition: opacity 600ms;
  }
</style>
