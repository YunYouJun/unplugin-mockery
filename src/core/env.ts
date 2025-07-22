import type { MockeryContext } from '../mockery'

export { MockeryDB } from '../mockery'

// instance for unplugin
export const GLOBAL_STATE: {
  mockeryCtx?: MockeryContext
} = {
  mockeryCtx: undefined,
}
