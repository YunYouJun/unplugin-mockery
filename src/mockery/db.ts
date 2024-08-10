import path from 'node:path'
import type { Low } from 'lowdb/lib'
import fs from 'fs-extra'

import consola from 'consola'
import type { Options } from '../types'

export interface MockeryConfigData {
  curScene: string
}

export class MockeryDB {
  static configPath = ''
  static configDB: Low<MockeryConfigData>

  static async init(options: Options) {
    const { JSONFilePreset } = await import('lowdb/node')
    const configPath = path.resolve(options.mockDir || '', 'config.json')
    this.configPath = configPath
    consola.debug('Init Mockery DB', configPath)

    this.configDB = await JSONFilePreset<MockeryConfigData>(configPath, {
      curScene: 'default',
    })
  }

  static async save() {
    await MockeryDB.configDB.write()
    await fs.appendFile(this.configPath, '\n')
  }
}
