import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function callGemini(promptText) {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' })

  const result = await model.generateContent(promptText)
  const responseText = result.response.text()

  return responseText
}

export function parseJsonResponse(rawText) {
  // Strip markdown fences if the model wraps its response in ```json ... ```
  let cleaned = rawText.trim()
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '')
  return JSON.parse(cleaned)
}