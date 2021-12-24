import config from '#root/nuxt.config.js'

export function getModuleOptions (moduleName, optsContainer) {
  const opts = {}
  const containers = ['buildModules', 'modules', optsContainer]
  containers.some((container) => {
    if (container === optsContainer) {
      Object.assign(opts, { [optsContainer]: config[container] })
      return true
    }
    const arr = config[container]
    const mod = arr.find(
      /**
     * @param {string | any[]} item
     */
      (item) => {
        if (typeof item === 'string') {
          return item === moduleName
        } else if (item.length) {
          return item[0] === moduleName
        }
        return false
      })
    if (mod) {
      if (mod.length) {
        Object.assign(opts, mod[1])
      }
      return true
    }
    return false
  })
  return opts
}

const hooks = {}
export const getHooks = () => hooks

export function wrapModule (Module) {
  const ctx = {
    nuxt: {
      version: '2.x',
      hooks: {},
      hook (evt, cb) {
        if (!ctx.nuxt.hooks[evt]) {
          ctx.nuxt.hooks[evt] = []
        }
        ctx.nuxt.hooks[evt].push(cb)
      },
      options: {
        build: {
          templates: [],
          transpile: []
        },
        plugins: [],
        publicRuntimeConfig: {}
      }
    },
    Module
  }
  return ctx
}