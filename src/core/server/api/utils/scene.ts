import type { ASTNode } from 'magicast'
import { generateCode, parseModule } from 'magicast'
import fs from 'fs-extra'

import consola from 'consola'
import colors from 'picocolors'

/**
 * get `curScene` key
 * @param ast
 */
export function getCurSceneKey(ast: ASTNode) {
  // @ts-expect-error body in ast
  const defaultExportDeclaration = ast.body.find((node: any) => node.type === 'ExportDefaultDeclaration').declaration
  const objectExpression = defaultExportDeclaration.arguments[0]

  // modify to target scene
  const curSceneKey = objectExpression.properties.find((node: any) => node.key.name === 'curScene')
  return curSceneKey
}

/**
 * get cur active scene
 */
export async function getActiveScene(params: {
  filePath: string
  url: string
}) {
  const { filePath } = params
  const fileContent = await fs.readFile(filePath, 'utf-8')

  const mod = parseModule(fileContent)
  const ast = mod.$ast

  const curSceneKey = getCurSceneKey(ast)
  if (curSceneKey)
    return curSceneKey.value.value
  else
    return null
}

export async function toggleMockScene(params: {
  filePath: string
  url: string
  sceneName: string
}) {
  // todo check url

  const { filePath, sceneName, url } = params
  const fileContent = await fs.readFile(filePath, 'utf-8')

  const mod = parseModule(fileContent)
  const ast = mod.$ast

  // @ts-expect-error body in ast
  if (!ast.body) {
    throw new Error('Invalid file content')
  }

  const curSceneKey = getCurSceneKey(ast)
  curSceneKey.value.value = sceneName

  const { code } = generateCode(ast)
  await fs.writeFile(filePath, code, 'utf-8')

  consola.success(`${colors.cyan(url)} Switched to scene: ${colors.yellow(sceneName)}`)
  return code
}
