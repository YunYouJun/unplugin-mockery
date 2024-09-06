import { createWebpackPlugin } from 'unplugin'
import { unpluginFactory } from '.'

export default createWebpackPlugin(unpluginFactory)

export * from './webpack/get-config'
export * from './webpack/mock-server'
