export const loadModule = async () => {
  let componentPromise

  if (import.meta.env.VITE_MODULE === 'intro') {
    componentPromise = import('~/modules/intro/Index.svelte')
  }

  if (import.meta.env.VITE_MODULE === 'nanograph') {
    componentPromise = import('~/modules/nanograph/Index.svelte')
  }

  if (import.meta.env.VITE_MODULE === 'graph') {
    componentPromise = import('~/modules/graph/Index.svelte')
  }

  if (import.meta.env.VITE_MODULE === 'simulation') {
    componentPromise = import('~/modules/simulation/Index.svelte')
  }

  const component = await componentPromise
  return component.default
}
