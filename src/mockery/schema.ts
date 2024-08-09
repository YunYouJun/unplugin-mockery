import type { JSONSchemaType } from 'ajv'

import type { Mockery } from '../types'

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

export function updateSceneSchema(schema: JSONSchemaType<SceneData>, mockery: Mockery) {
  if (mockery.url) {
    schema.properties[mockery.url] = {
      type: 'string',
      description: mockery.description,
      enum: Object.keys(mockery.results || {}),
    }
  }
}
