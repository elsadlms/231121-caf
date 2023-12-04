<script>
  import Person from '~/components/Person/Index.svelte'

  export let width
  export let isMobile
  export let isHighlighted
  export let gender
  export let index

  $: inlineStyle = [`--width: ${width}px;`, `--delay: ${index * 100}ms;`]
  $: containerClasses = [
    'nanog-square',
    isHighlighted ? 'nanog-square--highlighted' : '',
  ]
</script>

<div class={containerClasses.join(' ')} style={inlineStyle.join(' ')}>
  <Person
    {isMobile}
    {gender}
    color={'transparentBlue'}
    secondLayer={true}
    secondLayerOpacity={isHighlighted === true ? 1 : 0}
  />
</div>

<style lang="scss">
  .nanog-square {
    height: var(--width);
    width: var(--width);
    font-family: monospace;
    position: relative;
    border-radius: 3px;
  }

  :global(.nanog-square .person__img) {
    transition: opacity 200ms;
  }
</style>
