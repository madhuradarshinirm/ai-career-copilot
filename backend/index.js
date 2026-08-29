import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { verifyAuth } from './middleware/verifyAuth.js'
import analyzeResumeRouter from './routes/analyzeResume.js'
import startInterviewRouter from './routes/startInterview.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'AI Career Copilot backend is running' })
})

app.use('/api', verifyAuth, analyzeResumeRouter)
app.use('/api', verifyAuth, startInterviewRouter)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})