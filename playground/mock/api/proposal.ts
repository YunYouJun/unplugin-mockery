import { defineMockery } from 'unplugin-mockery'

/**
 * multiple results
 */
const results = {
  同意: {
    code: 0,
    message: 'Yes',
  },
  拒绝: {
    code: -1,
    message: 'No',
  },
}

export default defineMockery({
  url: '/api/proposal',
  description: '提案',
  method: 'post',
  results,
})
