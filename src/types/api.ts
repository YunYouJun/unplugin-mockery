import type { http } from 'msw'

/**
 * HTTP Method Type
 *
 * @see [HTTP request methods | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
 */
export type MethodType = keyof typeof http
