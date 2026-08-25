# API Design — AI Career & Interview Copilot

Version 1.0 | Day 2 Design Output | Backend: Node.js + Express (Render)

All endpoints below are served from the Express backend. Simple reads (dashboard history, session status) happen via **direct Supabase client calls from the frontend** and are not listed here — this file covers only endpoints that require the backend (i.e. anything touching the Claude API key or shared business logic).

**Base URL (production):** `https://<render-service-name>.onrender.com`
**Base URL (local dev):** `http://localhost:5000`

**Authentication (all endpoints):** Every request must include an `Authorization: Bearer <supabase_access_token>` header. The backend verifies this token against Supabase before processing. Requests without a valid token receive `401 Unauthorized`.

---

## 1. `POST /api/analyze-resume`

**Purpose:** Takes a saved resume and generates the Skill Gap Report + Prep Plan via the Claude API.

**Request**
```json
{
  "resume_id": "uuid"
}
```

**Response — 200 OK**
```json
{
  "skill_report_id": "uuid",
  "strengths": ["Strong grasp of OOP fundamentals shown in project descriptions", "..."],
  "gaps": [
    { "topic": "System Design", "why": "No mention of scalability or design trade-offs", "priority": "high" },
    { "topic": "SQL/Databases", "why": "No database work referenced", "priority": "medium" }
  ],
  "prep_plan": [
    { "topic": "System Design", "action": "Study basic system design patterns (load balancing, caching)", "priority": "high" },
    { "topic": "SQL/Databases", "action": "Practice writing SQL queries on sample datasets", "priority": "medium" }
  ]
}
```

**Validation**
- `resume_id` required, must be a valid UUID.
- `resume_id` must belong to the authenticated user (checked via `user_id` match) — otherwise `403 Forbidden`.

**Authentication:** Required (Bearer token).

**Error Cases**
| Status | Condition |
|---|---|
| 400 | Missing or malformed `resume_id` |
| 401 | Missing/invalid auth token |
| 403 | `resume_id` belongs to a different user |
| 404 | `resume_id` not found |
| 502 | Claude API call failed after retry, or returned unparseable JSON |

---

## 2. `POST /api/start-interview`

**Purpose:** Given a skill report, selects a semi-dynamic set of questions (weighted by gap priority) and creates a new interview session.

**Request**
```json
{
  "skill_report_id": "uuid"
}
```

**Response — 200 OK**
```json
{
  "session_id": "uuid",
  "questions": [
    { "id": "uuid", "topic": "System Design", "type": "conceptual", "prompt": "Explain the difference between vertical and horizontal scaling." },
    { "id": "uuid", "topic": "DSA", "type": "coding_review", "prompt": "Write a function to reverse a linked list, and explain your approach." }
  ]
}
```

**Validation**
- `skill_report_id` required, must be a valid UUID belonging to the authenticated user.
- Selection logic must return 6-8 questions per the Blueprint (Day 5 spec), no duplicates.

**Authentication:** Required (Bearer token).

**Error Cases**
| Status | Condition |
|---|---|
| 400 | Missing or malformed `skill_report_id` |
| 401 | Missing/invalid auth token |
| 403 | `skill_report_id` belongs to a different user |
| 404 | `skill_report_id` not found |
| 500 | Question bank returned insufficient questions for selection (safety check — should not occur once bank is seeded per Day 5 plan) |

---

## 3. `POST /api/evaluate-answer`

**Purpose:** Takes a user's answer to one interview question and returns structured AI feedback.

**Request**
```json
{
  "session_id": "uuid",
  "question_id": "uuid",
  "user_answer": "text of the user's answer"
}
```

**Response — 200 OK**
```json
{
  "answer_id": "uuid",
  "score": 7,
  "strengths": ["Correctly identified the core trade-off", "Clear explanation structure"],
  "improvements": ["Missing discussion of time complexity", "Could mention an alternative approach"]
}
```

**Validation**
- `session_id`, `question_id` required, valid UUIDs.
- `user_answer` required, non-empty string, reasonable max length (e.g. 3000 characters) to keep prompt size predictable.
- `session_id` must belong to the authenticated user.
- `question_id` must be part of that session's `question_ids` array (prevents evaluating a question not actually assigned to the session).

**Authentication:** Required (Bearer token).

**Error Cases**
| Status | Condition |
|---|---|
| 400 | Missing/empty `user_answer`, or malformed UUIDs |
| 401 | Missing/invalid auth token |
| 403 | `session_id` belongs to a different user |
| 404 | `session_id` or `question_id` not found |
| 409 | `question_id` is not part of the given session's question set |
| 502 | Claude API call failed after retry, or returned unparseable JSON |

---

## 4. `POST /api/complete-interview`

**Purpose:** Marks a session as completed and computes the average score, once all questions have been answered.

**Request**
```json
{
  "session_id": "uuid"
}
```

**Response — 200 OK**
```json
{
  "session_id": "uuid",
  "status": "completed",
  "average_score": 7.2,
  "total_questions": 7,
  "answered_questions": 7
}
```

**Validation**
- `session_id` required, must belong to the authenticated user.
- All questions in `question_ids` must have a corresponding row in `interview_answers` — otherwise return `409` rather than completing early.

**Authentication:** Required (Bearer token).

**Error Cases**
| Status | Condition |
|---|---|
| 400 | Missing/malformed `session_id` |
| 401 | Missing/invalid auth token |
| 403 | `session_id` belongs to a different user |
| 404 | `session_id` not found |
| 409 | Not all questions in the session have been answered yet |

---

## 5. Endpoint Summary Table

| Method | Path | Purpose | Auth Required |
|---|---|---|---|
| POST | `/api/analyze-resume` | Generate Skill Gap Report + Prep Plan | Yes |
| POST | `/api/start-interview` | Select questions, create session | Yes |
| POST | `/api/evaluate-answer` | Score one answer, return feedback | Yes |
| POST | `/api/complete-interview` | Finalize session, compute average score | Yes |

**Not included here (handled via direct Supabase client calls from frontend, no backend endpoint needed):**
- Sign up / Log in / Log out (Supabase Auth SDK)
- Saving a resume upload/paste (`resumes` table insert)
- Fetching dashboard history (`skill_reports`, `interview_sessions` queries filtered by `user_id`)
- Fetching a single past report or session's details for review

This keeps the backend surface area small and focused exactly on the parts that require server-side secrets or shared logic — consistent with the Architecture design in `ARCHITECTURE.md`.
