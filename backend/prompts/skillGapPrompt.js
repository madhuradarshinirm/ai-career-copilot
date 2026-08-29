const SKILL_FRAMEWORK = [
  'Data Structures & Algorithms',
  'OOP Fundamentals',
  'System Design Basics',
  'Databases / SQL',
  'Version Control / Git',
  'Web Fundamentals',
  'Problem Solving / Communication',
]

export function buildSkillGapPrompt(resumeText) {
  return `You are an expert technical recruiter evaluating a resume for a Software Engineer Intern role.

SKILL FRAMEWORK to evaluate against (use these exact topic names):
${SKILL_FRAMEWORK.map((s) => `- ${s}`).join('\n')}

RESUME TEXT:
"""
${resumeText}
"""

TASK:
1. Identify the candidate's genuine strengths based on evidence in the resume.
2. Identify gaps: skill framework topics that are missing, weak, or unclear in the resume.
3. For each gap, write a short prep plan action.

Return ONLY raw JSON in exactly this shape, with no markdown fences, no preamble, no explanation text:

{
  "strengths": ["short strength statement", "short strength statement"],
  "gaps": [
    { "topic": "one of the skill framework topics", "why": "brief reason based on the resume", "priority": "high" }
  ],
  "prep_plan": [
    { "topic": "same topic as a gap", "action": "concrete study action", "priority": "high" }
  ]
}

Rules:
- "priority" must be exactly "high", "medium", or "low".
- Include 2-5 strengths and 2-5 gaps.
- prep_plan should have one entry per gap, in the same priority order.
- Do not invent skills not evidenced in the resume as strengths.
- Return ONLY the JSON object, nothing else.`
}