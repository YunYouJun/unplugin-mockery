import type { MockeryContext } from '../../mockery'

/**
 * 定义 setup file
 *
 * 可提前操作上下文
 */
export function defineMockerySetup(setupFunc: (ctx: MockeryContext) => void | Promise<void>) {
  return setupFunc
}
