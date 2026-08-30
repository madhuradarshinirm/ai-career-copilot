import express from 'express'
import { supabaseAdmin } from '../lib/supabaseAdmin.js'
import { callGeminiForJson } from '../lib/geminiClient.js'
import { buildFeedbackPrompt } from '../prompts/feedbackPrompt.js'

const router = express.Router()

router.post('/evaluate-answer', async (req, res) => {
  const { session_id, question_id, user_answer } = req.body
  const userId = req.user.id

  if (!session_id || !question_id || typeof user_answer !== 'string' || !user_answer.trim()) {
    return res.status(400).json({ error: 'session_id, question_id, and a non-empty user_answer are required' })
  }

  if (user_answer.length > 3000) {
    return res.status(400).json({ error: 'Answer is too long (max 3000 characters)' })
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

  if (!session.question_ids.includes(question_id)) {
    return res.status(409).json({ error: 'This question is not part of the given session' })
  }

  const { data: question, error: questionError } = await supabaseAdmin
    .from('questions')
    .select('*')
    .eq('id', question_id)
    .single()

  if (questionError || !question) {
    return res.status(404).json({ error: 'Question not found' })
  }

  const prompt = buildFeedbackPrompt(question.prompt, question.type, user_answer)

  let parsed
  try {
    parsed = await callGeminiForJson(prompt)
  } catch (err) {
    console.error('Gemini feedback call failed twice:', err.message)
    return res.status(502).json({ error: 'AI feedback failed. Please try again.' })
  }

  if (
    typeof parsed.score !== 'number' ||
    !Array.isArray(parsed.strengths) ||
    !Array.isArray(parsed.improvements)
  ) {
    return res.status(502).json({ error: 'AI returned an unexpected format. Please try again.' })
  }

  const clampedScore = Math.max(1, Math.min(10, Math.round(parsed.score)))

  const { data: savedAnswer, error: insertError } = await supabaseAdmin
    .from('interview_answers')
    .insert({
      session_id,
      question_id,
      user_answer,
      score: clampedScore,
      strengths_json: parsed.strengths,
      improvements_json: parsed.improvements,
    })
    .select()
    .single()

  if (insertError) {
    return res.status(500).json({ error: insertError.message })
  }

  res.status(200).json({
    answer_id: savedAnswer.id,
    score: clampedScore,
    strengths: parsed.strengths,
    improvements: parsed.improvements,
  })
})

export default router