import type { Mockery } from '../types'

export interface MockeryMapType extends Record<string, string> {}
/**
 * extend mockery helper
 */
export interface MockeryHelper<V> {
  /**
   * get cur status
   *
   * or get groupKey status
   */
  getStatus: () => V | undefined
  /**
   * not modify local db
   * @param status
   * @returns
   */
  setStatus: (status?: V) => V | undefined
}

export type GetMockeryMapValueType<T, K extends keyof T> = T[K]

export class TypedMockeryMap<T extends Record<string, any> = MockeryMapType> {
  map: Map<string, any> = new Map()

  has(key: keyof T) {
    return this.map.has(key as string)
  }

  set(key: keyof T, value: any) {
    this.map.set(key as string, value)
  }

  /**
   * @example
   * '/api/login': "登录成功" | "登录失败-密码错误" | "登录失败-账号不存在"
   *
   * get('/api/login') => Mockery<object, "登录成功" | "登录失败-密码错误" | "登录失败-账号不存在">
   */
  get<K extends keyof T>(key: K) {
    type MockeryMapValue = GetMockeryMapValueType<T, K>
    const mockery = this.map.get(key as string) as (
      Mockery<object, MockeryMapValue> & MockeryHelper<
        MockeryMapValue extends object ? Partial<MockeryMapValue> : MockeryMapValue
      >
    )

    return mockery
  }

  delete(key: keyof T) {
    return this.map.delete(key as string)
  }
}
