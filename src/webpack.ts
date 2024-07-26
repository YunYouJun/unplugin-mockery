import { createWebpackPlugin } from 'unplugin'
import { unpluginFactory } from '.'

export default createWebpackPlugin(unpluginFactory)

export * from './webpack/mock-server'
export * from './webpack/get-config'
