import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ msg: 'Hello World in express' })
})

export default router
