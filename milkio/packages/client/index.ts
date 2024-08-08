import { defineMilkioClient } from 'milkio-client'
import { failCode } from '../../src/fail-code'
import type ApiSchema from '../../generated/api-schema'

export * from './types'

export const createClient = defineMilkioClient<
  typeof ApiSchema,
  typeof failCode
>([
  //
])

export const FailCode = failCode
