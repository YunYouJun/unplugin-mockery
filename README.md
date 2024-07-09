# unplugin-mocker

[![NPM version](https://img.shields.io/npm/v/unplugin-mocker?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-mocker)

## Features

- Hot Reload Routes on demand

## Install

```bash
pnpm add -D unplugin-mocker
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import Mocker from 'unplugin-mocker/vite'

export default defineConfig({
  plugins: [
    Mocker({ /* options */ }),
  ],
})
```

Example: [`playground/`](./playground/)

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import Mocker from 'unplugin-mocker/rollup'

export default {
  plugins: [
    Mocker({ /* options */ }),
  ],
}
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-mocker/webpack')({ /* options */ })
  ]
}
```

<br></details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.js
export default defineNuxtConfig({
  modules: [
    ['unplugin-mocker/nuxt', { /* options */ }],
  ],
})
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('unplugin-mocker/webpack')({ /* options */ }),
    ],
  },
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import Mocker from 'unplugin-mocker/esbuild'

build({
  plugins: [Mocker()],
})
```

<br></details>
