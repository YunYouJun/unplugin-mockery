import axios from 'axios'

export const mockeryAxios = axios.create({
  baseURL: '/_mockery_api_',
})
