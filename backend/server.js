import 'dotenv/config'
import express from 'express'

import { authenticate } from './auth.js'
// import todosRouter from './routes/todos.js'

const app = express()

app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ ok: true })
})

// Everything under /api/todos requires authentication
// app.use('/api/todos', authenticate, todosRouter)

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
