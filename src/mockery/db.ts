import path from 'node:path'
import type { Low } from 'lowdb/lib'
import fs from 'fs-extra'

import consola from 'consola'
import type { JSONSchemaType } from 'ajv'
import { getMockApiFiles, jiti } from '../core/utils'
import type { Mockery, Options } from '../types'
import { type SceneData, initSceneSchema } from './schema'
import { isMockery } from './utils'

export interface MockeryConfigData {
  curScene?: string
}

export class MockeryDB {
  static options: Options

  static configPath = ''
  static configDB: Low<MockeryConfigData>
  static sceneData: SceneData = {}

  static sceneSchema: JSONSchemaType<SceneData> = initSceneSchema()
  static sceneSchemaPath = ''

  static async init(options: Options) {
    this.options = options

    const sceneDir = path.resolve(options.mockDir, 'scenes')
    const schemaDir = path.resolve(options.mockDir, 'schemas')
    await fs.ensureDir(sceneDir)
    await fs.ensureDir(schemaDir)

    await this.initSceneSchema()
    await this.updateConfigSchema()

    const { JSONFilePreset } = await import('lowdb/node')
    const configPath = path.resolve(options.mockDir || '', 'config.json')
    this.configPath = configPath
    consola.debug('Init Mockery DB', configPath)

    this.configDB = await JSONFilePreset<MockeryConfigData>(configPath, {
      curScene: 'default',
    })
    this.sceneData = this.readScene(this.configDB.data.curScene)
  }

  /**
   * Update internal data
   */
  static async update() {
    await this.configDB.read()
  }

  static getScenePath(sceneName?: string) {
    const curScene = sceneName || this.configDB.data.curScene
    const scenePath = path.resolve(this.options.mockDir, 'scenes', `${curScene}.scene.json`)
    if (!fs.existsSync(scenePath)) {
      throw new Error(`Scene file not found: ${scenePath}`)
    }
    return scenePath
  }

  /**
   * Read scene data
   * @param sceneName
   */
  static readScene(sceneName?: string) {
    consola.info('Current Scene:', sceneName || this.configDB.data.curScene)
    const scenePath = this.getScenePath(sceneName)
    const sceneData = fs.readJSONSync(scenePath)
    consola.debug('Scene Data:', sceneData)
    this.sceneData = sceneData
    return sceneData
  }

  static async initSceneSchema() {
    this.sceneSchemaPath = path.resolve(this.options.mockDir, 'schemas/scene.schema.json')
    this.sceneSchema = await fs.readJSON(this.sceneSchemaPath).catch(() => initSceneSchema())

    const apiFiles = getMockApiFiles(this.options.mockDir)
    for (const file of apiFiles) {
      const mockery = jiti(file).default as Mockery
      this.updateSceneSchema(mockery)
    }

    await this.saveSceneSchema()
  }

  /**
   * Update scene schema
   * @param mockery
   */
  static updateSceneSchema(mockery: Mockery) {
    if (!isMockery(mockery))
      return

    if (mockery?.url) {
      this.sceneSchema.properties[mockery.url] = {
        type: 'string',
        description: mockery.description,
      }

      if (mockery.results) {
        this.sceneSchema.properties[mockery.url].enum = Object.keys(mockery.results || {})
      }
    }
  }

  static async saveSceneSchema() {
    await fs.writeJSON(this.sceneSchemaPath, this.sceneSchema, { spaces: 2 })
  }

  static async updateConfigSchema() {
    const configSchemaPath = path.resolve(this.options.mockDir, 'schemas/config.schema.json')
    const scenes = fs.readdirSync(path.resolve(this.options.mockDir, 'scenes'))
    const enumScenes = scenes.filter(i => i.endsWith('.scene.json')).map(i => i.replace('.scene.json', ''))
    const schemaJSON: JSONSchemaType<object> = {
      type: 'object',
      properties: {
        curScene: {
          type: 'string',
          description: '当前场景',
          enum: Array.from((new Set(enumScenes)).add('default')),
        },
      },
    }
    await fs.writeJSON(configSchemaPath, schemaJSON, { spaces: 2 })
  }

  static async save() {
    await MockeryDB.configDB.write()
    await fs.appendFile(this.configPath, '\n')
  }
}
