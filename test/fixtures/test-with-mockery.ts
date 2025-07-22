/* eslint-disable no-empty-pattern */

import type { InlineConfig } from 'vite'
import type { MockeryContext, MockeryOptions } from '../../src'
import path from 'node:path'
import { test } from 'vitest'
import { createMockeryContext } from '../../src'

// import { createMockeryContext } from '../../packages/core/src'
// import { aliasOptions } from '../../shared/alias'

const commonViteOptions: InlineConfig = {
  resolve: {
    // alias: aliasOptions,
  },
}

const commonMockeryOptions: MockeryOptions = {
  vite: commonViteOptions,
}

export function createMockeryFixture(options: MockeryOptions) {
  return test.extend<{ mockeryContext: MockeryContext }>({
    mockeryContext: [
      async ({}, use) => {
        const mCtx = createMockeryContext({
          dirs: [],
          // 设置 mode: 'test' 等价于设置 `watch: false`和 `dotFiles: false`
          mode: 'test',

          ...commonMockeryOptions,
          ...options,
        })

        await mCtx.init()

        await use(mCtx)

        // 移除副作用的 mock
        await mCtx.destroy()
      },
      { auto: true },
    ],
  })
}

export const testWithMockery = createMockeryFixture({
  dts: false,
})

/**
 * with examples/mocks
 */
const globalSetupFilePath = path.resolve(import.meta.dirname, '../../examples/mocks/setup.ts')
export const testWithMockeryExamples = createMockeryFixture({
  dirs: [
    path.resolve(import.meta.dirname, '../../examples/mocks'),
  ],
  // 设置 mode: 'test' 等价于设置 `watch: false`和 `dotFiles: false`
  mode: 'test',
  globalSetup: globalSetupFilePath,
  dts: true,
})

/**
 * empty dirs
 */
export const testWithMockeryDTS = createMockeryFixture({
  dts: true,
  dotFiles: path.resolve(import.meta.dirname, '.mockery'),
})

export const testWithMockeryGlobalPredicate = createMockeryFixture({})
