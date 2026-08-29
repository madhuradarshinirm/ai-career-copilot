export function buildFeedbackPrompt(questionPrompt, questionType, userAnswer) {
  return `You are an experienced technical interviewer evaluating a candidate's answer during a Software Engineer Intern mock interview.

QUESTION TYPE: ${questionType === 'coding_review' ? 'Coding (reviewed as written text, not executed)' : 'Conceptual'}

QUESTION:
"${questionPrompt}"

CANDIDATE'S ANSWER:
"""
${userAnswer}
"""

TASK:
Evaluate the answer and return ONLY raw JSON in exactly this shape, with no markdown fences, no preamble, no explanation text:

{
  "score": 7,
  "strengths": ["short strength point", "short strength point"],
  "improvements": ["short improvement point", "short improvement point"]
}

Scoring rubric:
- 8-10: Correct and well-explained, demonstrates solid understanding
- 5-7: Mostly correct but underexplained, or has minor gaps
- 1-4: Incorrect, missing key ideas, or does not address the question

Rules:
- "score" must be an integer from 1 to 10.
- Include 1-3 strengths and 1-3 improvements (do not pad with filler if there is little to say).
- If the answer is empty, extremely short, or clearly does not attempt the question, score it low (1-3) and say so plainly in "improvements".
- Be specific to what the candidate actually wrote — do not give generic feedback that could apply to any answer.
- Return ONLY the JSON object, nothing else.`
}