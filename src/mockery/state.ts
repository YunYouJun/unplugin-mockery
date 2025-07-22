import type { Mockery } from '../types'

export interface MockeryFile {
  mockery: Mockery
}

export class StateManager {
  filesMap: Map<string, MockeryFile> = new Map()
}
