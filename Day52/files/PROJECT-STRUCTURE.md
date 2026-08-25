# Project Structure — AI Career & Interview Copilot

Version 1.0 | Day 2 Design Output

This is the complete folder structure to be created on Day 3 (Blueprint Day 2/3 setup). Every folder below has a defined purpose — nothing is speculative.

```
ai-career-copilot/
│
├── frontend/                          React app (Vite) — deployed to Vercel
│   ├── src/
│   │   ├── auth/                      Signup, Login, useAuth hook, ProtectedRoute
│   │   │   ├── SignUp.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── useAuth.js
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── resume/                    Resume upload + parsing (Day 3)
│   │   │   ├── ResumeUpload.jsx
│   │   │   └── resumeParser.js
│   │   │
│   │   ├── analysis/                  Skill Gap Report + Prep Plan display (Day 4)
│   │   │   ├── SkillGapReport.jsx
│   │   │   └── PrepPlan.jsx
│   │   │
│   │   ├── interview/                 Mock interview flow (Days 5-6)
│   │   │   ├── InterviewSession.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── FeedbackCard.jsx
│   │   │   └── SessionSummary.jsx
│   │   │
│   │   ├── dashboard/                 History/home screen (Day 7)
│   │   │   └── Dashboard.jsx
│   │   │
│   │   ├── layout/                    Shared UI shell
│   │   │   ├── NavBar.jsx
│   │   │   └── EmptyState.jsx
│   │   │
│   │   ├── lib/                       Shared clients/helpers
│   │   │   ├── supabaseClient.js      Initializes Supabase JS client
│   │   │   └── apiClient.js           Wrapper for calling the Express backend with auth headers
│   │   │
│   │   ├── styles/
│   │   │   └── theme.css              Consolidated colors/spacing (Day 7 polish)
│   │   │
│   │   ├── App.jsx                    Route definitions
│   │   └── main.jsx                   Vite entry point
│   │
│   ├── .env                           VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_BASE_URL (gitignored)
│   ├── .env.example                   Same keys, no values — committed for reference
│   ├── package.json
│   └── vite.config.js
│
├── backend/                           Express API — deployed to Render
│   ├── routes/                        One file per endpoint group
│   │   ├── analyzeResume.js           POST /api/analyze-resume
│   │   ├── startInterview.js          POST /api/start-interview
│   │   ├── evaluateAnswer.js          POST /api/evaluate-answer
│   │   └── completeInterview.js       POST /api/complete-interview
│   │
│   ├── prompts/                       LLM prompt templates, kept separate from route logic
│   │   ├── skillGapPrompt.js
│   │   └── feedbackPrompt.js
│   │
│   ├── logic/                         Pure business logic, testable independent of Express
│   │   └── selectQuestions.js         Gap-weighted question selection (Day 5)
│   │
│   ├── data/                          Only used if question bank is NOT migrated to Supabase
│   │   └── questionBank.json
│   │
│   ├── middleware/
│   │   └── verifyAuth.js              Validates Supabase bearer token on every request
│   │
│   ├── lib/
│   │   ├── supabaseAdmin.js           Server-side Supabase client (service role)
│   │   └── claudeClient.js            Wrapper around the Claude API call
│   │
│   ├── index.js                       Express app entry point, route mounting
│   ├── .env                           SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CLAUDE_API_KEY (gitignored)
│   ├── .env.example                   Same keys, no values — committed for reference
│   └── package.json
│
├── docs/                              Project documentation (this design set + future additions)
│   ├── PRD.docx
│   ├── ARCHITECTURE.md
│   ├── SCHEMA.md
│   ├── API.md
│   ├── UI-WIREFRAMES.md
│   ├── PROJECT-STRUCTURE.md
│   ├── Implementation_Blueprint_Days2-10.md
│   ├── PROJECT-LOG.md                 Running daily log (started today)
│   └── screenshots/                   Screenshots captured per Blueprint's daily checklists
│
├── .gitignore                         Ignores .env, node_modules, build output
├── README.md                          Written Day 9 per Blueprint — placeholder for now
└── Pitch_Deck.pptx
```

---

## Rationale

- **`frontend/` and `backend/` are fully separate** because they deploy to two different hosts (Vercel and Render respectively per today's stack decision) — keeping them as sibling folders with independent `package.json` files means each can be deployed cleanly without one dragging the other's dependencies along.
- **`prompts/` is separated from `routes/`** in the backend so prompt text can be iterated on (a likely activity during Day 4 and Day 6 testing) without touching endpoint logic — keeps prompt engineering changes low-risk.
- **`logic/` holds pure functions** (like question selection) with no Express dependencies, so they're easy to reason about and manually test in isolation before wiring into a route.
- **`docs/` centralizes every planning artifact**, including this one — so Day 3 onward, anyone (including a fresh AI conversation) can find the full source of truth in one place instead of scattered across the repo root.
- **`.env.example` files are committed** (with no real values) so the exact required environment variables are documented in version control, without ever risking a real secret being committed.
- Folder names match the **feature names used throughout the PRD and Blueprint** (`resume`, `analysis`, `interview`, `dashboard`) rather than generic names like `components/` or `pages/` — this keeps the codebase self-explanatory and easy for a fresh AI conversation to navigate on any given day.

---

## What Gets Created When (mapped to Blueprint days)

| Day | Folders/files created |
|---|---|
| Day 2 (today) | `docs/` populated with this design set; root scaffold only |
| Day 3 | `frontend/src/auth/`, `frontend/src/resume/`, `frontend/src/lib/`, `backend/middleware/`, `backend/lib/supabaseAdmin.js` |
| Day 4 | `frontend/src/analysis/`, `backend/routes/analyzeResume.js`, `backend/prompts/skillGapPrompt.js` |
| Day 5 | `backend/data/` or Supabase `questions` table, `backend/logic/selectQuestions.js`, `backend/routes/startInterview.js` |
| Day 6 | `frontend/src/interview/`, `backend/routes/evaluateAnswer.js`, `backend/routes/completeInterview.js`, `backend/prompts/feedbackPrompt.js` |
| Day 7 | `frontend/src/dashboard/`, `frontend/src/layout/`, `frontend/src/styles/theme.css` |
| Day 8 | No new folders — deployment configuration only |
| Day 9 | `README.md` finalized, `docs/screenshots/` populated |
