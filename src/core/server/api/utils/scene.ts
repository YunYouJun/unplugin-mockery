import type { ASTNode } from 'magicast'
import { generateCode, parseModule } from 'magicast'
import fs from 'fs-extra'

function getMatchedMockItem(ast: ASTNode, url: string) {
  // @ts-expect-error elements in ast
  if (!ast.elements)
    return

  // @ts-expect-error elements in ast
  return ast.elements?.filter((node: any) => {
    if (node.type === 'ObjectExpression') {
      const properties = node.properties
      const key = properties.find((p: any) => p.key.name === 'url')
      return key?.value.value === url
    }
    return false
  })[0]
}

/**
 * get cur active scene
 */
export async function getActiveScene(params: {
  filePath: string
  url: string
}) {
  const { filePath, url } = params
  const fileContent = await fs.readFile(filePath, 'utf-8')

  const mod = parseModule(fileContent)
  const ast = mod.exports.default.$ast

  const matchedMockItem = getMatchedMockItem(ast, url)
  if (!matchedMockItem)
    return

  return matchedMockItem.properties.find((node: any) => node.key.name === 'response').value.property.value
}

export async function toggleMockScene(params: {
  filePath: string
  url: string
  sceneName: string
}) {
  const { filePath, sceneName, url } = params
  const fileContent = await fs.readFile(filePath, 'utf-8')

  const mod = parseModule(fileContent)
  // console.log(mod, fileContent)
  const ast = mod.$ast

  const options = mod.exports.default.$type === 'function-call'
    ? mod.exports.default.$args[0]
    : mod.exports.default

  // eslint-disable-next-line no-console
  console.log(ast, options)

  // @ts-expect-error body in ast
  if (!ast.body) {
    throw new Error('Invalid file content')
  }

  // @ts-expect-error body in ast
  const defaultExportExpression = ast.body.find((node: any) => node.type === 'ExportDefaultDeclaration').declaration.expression
  const matchedMockItem = getMatchedMockItem(defaultExportExpression, url)
  if (!matchedMockItem)
    return

  matchedMockItem.properties.forEach((node: any) => {
    if (node.key && node.key.name === 'response') {
      node.value.property.value = sceneName
    }
  })

  const { code } = generateCode(ast)
  await fs.writeFile(filePath, code, 'utf-8')
  return code
}
