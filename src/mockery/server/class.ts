import path from 'node:path'
import consola from 'consola'
import fs from 'fs-extra'
import type { JSONSchemaType } from 'ajv'

import { defaultOptions } from '../../core/options'
import { MockeryDB } from '../db'
import { initSceneSchema } from '../schema'
import type { Options } from '../../types'
import type { SceneData } from '../schema'

export class MockeryServer {
  sceneSchema: JSONSchemaType<SceneData> = initSceneSchema()
  sceneSchemaPath: string

  sceneData: SceneData = {}

  constructor(public options: Options = defaultOptions) {
    this.options = options
    this.sceneSchemaPath = path.resolve(this.options.mockDir, 'schemas/scene.schema.json')
  }

  async init() {
    consola.debug('Init Mockery Server')
    await this.initDB()
  }

  async initDB() {
    consola.debug('Init Mockery DB')
    await MockeryDB.init(this.options)
  }

  async writeSceneSchema() {
    await fs.writeJSON(this.sceneSchemaPath, this.sceneSchema, { spaces: 2 })
  }
}
