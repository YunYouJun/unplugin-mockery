# unplugin-mockery

[![NPM version](https://img.shields.io/npm/v/unplugin-mockery?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-mockery)

## Features

Now, only for webpack. Vite(developing...)

- Hot Reload Routes on demand

## Install

```bash
pnpm add -D unplugin-mockery
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import Mocker from 'unplugin-mockery/vite'

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
import Mocker from 'unplugin-mockery/rollup'

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
    require('unplugin-mockery/webpack').default({ /* options */ })
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
    ['unplugin-mockery/nuxt', { /* options */ }],
  ],
})
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI</summary><br>

在 Webpack 中，它工作地很好。
但在 Vue Cli 中，`webpack-dev-server` 的启动时机有所不同，因此我们无法通过插件获取 Vue Cli 中的 `webpack-dev-server` `devServer` 的实例。
而是通过获取 webpack 的方式进行设置。

In Webpack, it works well.
But in Vue Cli, the timing of starting `webpack-dev-server` is different, so we cannot get the instance of `webpack-dev-server` `devServer` in Vue Cli through the plugin.
Instead, we set it by `getWebpackConfig`.

```ts
// vue.config.js
const { getWebpackConfig } = require('unplugin-mockery/webpack')

module.exports = {
  configureWebpack: {
    devServer: {
      ...getWebpackConfig({ /* options */ }).devServer,
    },
  },
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import Mocker from 'unplugin-mockery/esbuild'

build({
  plugins: [Mocker()],
})
```

### Schema Setting in VSCode

Edit `.vscode/settings.json`:

```json
{
  // schema
  "json.schemas": [
    {
      "fileMatch": ["*.scene.json"],
      "url": "./mock/schemas/scene.schema.json"
    }
  ]
}
```

<br></details>

## Development

```bash
# run template

# for vue-cli(webpack)
pnpm play:vue-cli

# for webpack
pnpm play:webpack

# for vite
pnpm play:vite
```
