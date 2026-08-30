import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.GEMINI_API_KEY) {
  console.error('FATAL: GEMINI_API_KEY is missing from backend/.env')
  process.exit(1)
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function callGeminiOnce(promptText) {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' })
  const result = await model.generateContent(promptText)
  return result.response.text()
}

export function parseJsonResponse(rawText) {
  let cleaned = rawText.trim()
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '')
  return JSON.parse(cleaned)
}

// Shared retry-once wrapper used by every route that calls Gemini and expects JSON back.
export async function callGeminiForJson(promptText) {
  try {
    const raw = await callGeminiOnce(promptText)
    return parseJsonResponse(raw)
  } catch (firstError) {
    console.warn('Gemini call failed once, retrying:', firstError.message)
    const raw = await callGeminiOnce(promptText)
    return parseJsonResponse(raw)
  }
}

export async function callGemini(promptText) {
  return callGeminiOnce(promptText)
}