import { join } from 'node:path'
import { createTemplate } from 'milkio-template'

await createTemplate(async (tools) => {
  return {
    path: join(tools.directory(), `${tools.hyphen(tools.name())}.ts`),
    content: `
import { defineApi, defineApiTest } from "milkio"

/**
 * ${tools.name()}
 */
export const api = defineApi({
  meta: {},
  async action(params: { /* your params.. */ }, context) {
    const message = \`hello world!\`

    return {
      say: message
    }
  }
})

export const test = defineApiTest(api, [
  {
    name: "Basic",
    handler: async (test) => {
      const result = await test.client.execute({ params: await test.randParams() })
      test.log("result", result)
      if (!result.success) throw test.reject(\`The result was not success\`)
    }
  }
])
`.trim(),
  }
})
