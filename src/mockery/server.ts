import path from 'node:path'
import consola from 'consola'
import fs from 'fs-extra'
import type { JSONSchemaType } from 'ajv'

import { defaultOptions } from '../core/options'
import type { MockeryRequest, Options } from '../types'
import type { SceneData } from './schema'
import { initSceneSchema, updateSceneSchema } from './schema'

export class MockeryServer {
  sceneSchema: JSONSchemaType<SceneData> = initSceneSchema()
  sceneSchemaPath: string

  constructor(public options: Options = defaultOptions) {
    this.options = options
    this.sceneSchemaPath = path.resolve(this.options.mockDir, 'scenes/schema.json')
  }

  async init() {
    consola.debug('Init Mockery Server')
  }

  async updateSceneSchema(mockery: MockeryRequest) {
    updateSceneSchema(this.sceneSchema, mockery)
  }

  async writeSceneSchema() {
    await fs.writeJSON(this.sceneSchemaPath, this.sceneSchema, { spaces: 2 })
  }
}
