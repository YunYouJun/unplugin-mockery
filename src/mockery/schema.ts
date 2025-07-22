import type { JSONSchemaType } from 'ajv'

export interface SceneData {
  [key: string]: string
}

/**
 * Generate a schema for *.scene.json
 */
export function initSceneSchema() {
  const schemaJSON: JSONSchemaType<Partial<SceneData>> = {
    type: 'object',
    properties: {},
  }
  return schemaJSON as JSONSchemaType<SceneData>
}

export interface MockeryConfigData {
  /**
   * schema file path
   */
  $schema?: string
  curScene?: string
}

/**
 * 默认的 场景 schema
 * for `scene.schema.json`
 */
export const defaultSceneSchemaJSON: JSONSchemaType<Partial<SceneData>> = {
  type: 'object',
  properties: {},
}

/**
 * 默认的 配置 schema
 * for `config.schema.json`
 */
export const defaultConfigSchemaJSON: JSONSchemaType<Partial<MockeryConfigData>> = {
  type: 'object',
  properties: {
    $schema: {
      type: 'string',
      description: 'schema file path',
      nullable: true,
    },
    curScene: {
      type: 'string',
      description: '当前场景',
      enum: ['default'],
      nullable: true,
    },
  },
}
