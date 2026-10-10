import 'dotenv/config'
import express from 'express'
import projectsRouter from './routes/projects.js'
import boardsRouter from './routes/boards.js'
import cardsRouter from './routes/cards.js'
import { authenticate } from './auth.js'
// import todosRouter from './routes/todos.js'
import cors from "cors"

const app = express()

app.use(cors({
    origin: "http://localhost:5173"
}))

app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ ok: true })
})

// Everything under /api/projects requires authentication
app.use('/api/projects', authenticate, projectsRouter)
app.use('/api/projects/:pid/boards', authenticate, boardsRouter)
app.use('/api/cards', authenticate, cardsRouter)

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
