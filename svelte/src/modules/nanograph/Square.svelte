<script>
  import Person from '~/components/Person/Index.svelte'

  export let width
  export let isHighlighted
  export let gender
  export let index

  // $: color = isHighlighted ? 'red' : 'lightBlue'

  $: inlineStyle = [`--width: ${width}px;`, `--delay: ${index * 100}ms;`]
  $: containerClasses = [
    'nanog-square',
    isHighlighted ? 'nanog-square--highlighted' : '',
  ]
</script>

<div class={containerClasses.join(' ')} style={inlineStyle.join(' ')}>
  <Person
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
    // background-color: plum;
    font-family: monospace;
    position: relative;
    border-radius: 3px;

    &.nanog-square--highlighted {
      // background-color: palevioletred;
    }
  }

  :global(.nanog-square .person__img) {
    transition: opacity 200ms;
  }
</style>
