import express from 'express'
import { supabaseAdmin } from '../lib/supabaseAdmin.js'
import { selectQuestions } from '../logic/selectQuestions.js'

const router = express.Router()

router.post('/start-interview', async (req, res) => {
  const { skill_report_id } = req.body
  const userId = req.user.id

  if (!skill_report_id) {
    return res.status(400).json({ error: 'skill_report_id is required' })
  }

  const { data: report, error: reportError } = await supabaseAdmin
    .from('skill_reports')
    .select('*')
    .eq('id', skill_report_id)
    .single()

  if (reportError || !report) {
    return res.status(404).json({ error: 'Skill report not found' })
  }

  if (report.user_id !== userId) {
    return res.status(403).json({ error: 'This skill report does not belong to you' })
  }

  const { data: allQuestions, error: questionsError } = await supabaseAdmin
    .from('questions')
    .select('*')

  if (questionsError || !allQuestions || allQuestions.length === 0) {
    return res.status(500).json({ error: 'Question bank is unavailable' })
  }

  const selected = selectQuestions(allQuestions, report.gaps_json)

  if (selected.length === 0) {
    return res.status(500).json({ error: 'Could not select any questions' })
  }

  const questionIds = selected.map((q) => q.id)

  const { data: session, error: sessionError } = await supabaseAdmin
    .from('interview_sessions')
    .insert({
      user_id: userId,
      skill_report_id: skill_report_id,
      question_ids: questionIds,
      status: 'in_progress',
    })
    .select()
    .single()

  if (sessionError) {
    return res.status(500).json({ error: sessionError.message })
  }

  res.status(200).json({
    session_id: session.id,
    questions: selected.map((q) => ({
      id: q.id,
      topic: q.topic,
      type: q.type,
      prompt: q.prompt,
    })),
  })
})

export default router