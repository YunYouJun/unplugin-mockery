import { createWebpackPlugin } from 'unplugin'
import { unpluginFactory } from '.'

export * from './webpack'
export default createWebpackPlugin(unpluginFactory)
