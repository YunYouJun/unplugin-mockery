// import type { TypedMockeryMap } from '../class/typed-map'
// @TODO types

/**
 * generate dts for mockery.d.ts
 */
export function generateMockeryDTS(mockeryMap: any) {
  // sort for fixed order
  const keyArr = Array.from(mockeryMap.map.keys()).filter(key => typeof key === 'string').sort()

  const mapTypeLines: string[] = []
  for (const key of keyArr) {
    const mockery = mockeryMap.get(key)
    if (!mockery)
      continue

    const statusMap = mockery.statusMap || {}
    if (statusMap) {
      if (mockery.description) {
        mapTypeLines.push(`    /** ${mockery.description} */`)
      }

      const mockeryKeys = Object.keys(statusMap)
      mapTypeLines.push(
        `    '${key}': ${mockeryKeys.map(k => `'${k}'`).join(' | ')},`,
      )
    }

    const statusGroups = mockery.statusGroups
    if (statusGroups) {
      if (mockery.description) {
        mapTypeLines.push(`    /** ${mockery.description} */`)
      }
      const types = Object.keys(statusGroups).map((key) => {
        return {
          [key]: Object.keys(statusGroups[key].items).map(itemKey => `'${itemKey}'`).join(` | `),
        }
      })
      const typeStr = `{${types.map(t => Object.entries(t).map(([k, v]) => ` ${k}: ${v}`).join(', '))} }`

      mapTypeLines.push(
        `    '${key}': ${typeStr},`,
      )
    }
  }

  const dts = `/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck

declare module 'mockery:generated:types' {
  export interface MockeryMapType {
${mapTypeLines.join('\n')}
  }
}`

  return dts
}
