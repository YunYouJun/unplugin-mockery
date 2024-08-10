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
