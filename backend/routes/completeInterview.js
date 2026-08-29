import express from 'express'
import { supabaseAdmin } from '../lib/supabaseAdmin.js'

const router = express.Router()

router.post('/complete-interview', async (req, res) => {
  const { session_id } = req.body
  const userId = req.user.id

  if (!session_id) {
    return res.status(400).json({ error: 'session_id is required' })
  }

  const { data: session, error: sessionError } = await supabaseAdmin
    .from('interview_sessions')
    .select('*')
    .eq('id', session_id)
    .single()

  if (sessionError || !session) {
    return res.status(404).json({ error: 'Interview session not found' })
  }

  if (session.user_id !== userId) {
    return res.status(403).json({ error: 'This session does not belong to you' })
  }

  const { data: answers, error: answersError } = await supabaseAdmin
    .from('interview_answers')
    .select('score')
    .eq('session_id', session_id)

  if (answersError) {
    return res.status(500).json({ error: answersError.message })
  }

  const totalQuestions = session.question_ids.length
  const answeredQuestions = answers.length

  if (answeredQuestions < totalQuestions) {
    return res.status(409).json({
      error: 'Not all questions have been answered yet',
      total_questions: totalQuestions,
      answered_questions: answeredQuestions,
    })
  }

  const averageScore =
    answers.reduce((sum, a) => sum + a.score, 0) / answers.length

  const { error: updateError } = await supabaseAdmin
    .from('interview_sessions')
    .update({ status: 'completed', average_score: averageScore })
    .eq('id', session_id)

  if (updateError) {
    return res.status(500).json({ error: updateError.message })
  }

  res.status(200).json({
    session_id,
    status: 'completed',
    average_score: Math.round(averageScore * 10) / 10,
    total_questions: totalQuestions,
    answered_questions: answeredQuestions,
  })
})

export default router