import axios from 'axios'
import NProgress from 'nprogress'

export const mockeryAxios = axios.create({
  baseURL: '/_mockery_api_',
})

mockeryAxios.interceptors.request.use((config) => {
  NProgress.start()
  return config
})
mockeryAxios.interceptors.response.use((response) => {
  NProgress.done()
  return response
})
