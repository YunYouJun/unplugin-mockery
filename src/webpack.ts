import { createWebpackPlugin } from 'unplugin'
import { unpluginFactory } from '.'

export default createWebpackPlugin(unpluginFactory)
export * from './core/webpack'
