<script>
  import Person from '~/components/Person/Index.svelte'

  export let width
  export let isHighlighted
  export let gender

  $: color = isHighlighted ? '#FF1B1B' : '#D8FEFE'

  $: inlineStyle = [`--width: ${width}px;`]
  $: containerClasses = [
    'nanog-square',
    isHighlighted ? 'nanog-square--highlighted' : '',
  ]
</script>

<div class={containerClasses.join(' ')} style={inlineStyle.join(' ')}>
  <Person {gender} {color} />
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
</style>
