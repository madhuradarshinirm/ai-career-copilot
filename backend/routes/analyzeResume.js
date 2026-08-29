import express from 'express'
import { supabaseAdmin } from '../lib/supabaseAdmin.js'
import { callGemini, parseJsonResponse } from '../lib/geminiClient.js'
import { buildSkillGapPrompt } from '../prompts/skillGapPrompt.js'

const router = express.Router()

router.post('/analyze-resume', async (req, res) => {
  const { resume_id } = req.body
  const userId = req.user.id

  if (!resume_id) {
    return res.status(400).json({ error: 'resume_id is required' })
  }

  // Fetch the resume and confirm ownership
  const { data: resume, error: fetchError } = await supabaseAdmin
    .from('resumes')
    .select('*')
    .eq('id', resume_id)
    .single()

  if (fetchError || !resume) {
    return res.status(404).json({ error: 'Resume not found' })
  }

  if (resume.user_id !== userId) {
    return res.status(403).json({ error: 'This resume does not belong to you' })
  }

  const prompt = buildSkillGapPrompt(resume.resume_text)

  let parsed
  try {
    const rawResponse = await callGemini(prompt)
    parsed = parseJsonResponse(rawResponse)
  } catch (firstError) {
    // Retry once
    try {
      const rawResponse = await callGemini(prompt)
      parsed = parseJsonResponse(rawResponse)
    } catch (secondError) {
      console.error('Gemini call failed twice:', secondError.message)
      return res.status(502).json({ error: 'AI analysis failed. Please try again.' })
    }
  }

  if (!parsed.strengths || !parsed.gaps || !parsed.prep_plan) {
    return res.status(502).json({ error: 'AI returned an unexpected format. Please try again.' })
  }

  const { data: savedReport, error: insertError } = await supabaseAdmin
    .from('skill_reports')
    .insert({
      user_id: userId,
      resume_id: resume_id,
      strengths_json: parsed.strengths,
      gaps_json: parsed.gaps,
      prep_plan_json: parsed.prep_plan,
    })
    .select()
    .single()

  if (insertError) {
    return res.status(500).json({ error: insertError.message })
  }

  res.status(200).json({
    skill_report_id: savedReport.id,
    strengths: parsed.strengths,
    gaps: parsed.gaps,
    prep_plan: parsed.prep_plan,
  })
})

export default router