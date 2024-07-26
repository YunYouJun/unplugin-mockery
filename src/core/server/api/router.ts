import { Router } from 'express'
import { getMockFiles, jiti } from '../../utils'
import { globalState } from '../../env'
import { defaultOptions } from '../../options'

export const router = Router()

router.use('/ping', (req, res) => {
  res.send('pong')
})

router.use('/mock-list', (req, res) => {
  const files = getMockFiles(globalState.userOptions?.mockDir || defaultOptions.mockDir)

  const list = files.map(file => ({
    path: file,
    methods: jiti(file).default,
  }))

  res.json({
    list,
  })
})

router.use('/', (req, res) => {
  res.json({
    message: 'Hello Mockery API',
  })
})
