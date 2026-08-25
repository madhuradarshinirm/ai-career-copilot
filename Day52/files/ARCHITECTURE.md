# System Architecture — AI Career & Interview Copilot

Version 1.0 | Day 2 Design Output | Source of truth: PRD.docx, Implementation_Blueprint_Days2-10.md

---

## 1. Tech Stack Summary

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend API | Node.js + Express |
| Database | Supabase (Postgres) |
| Authentication | Supabase Auth (email/password) |
| AI Model | Anthropic Claude API |
| Frontend Hosting | Vercel |
| Backend Hosting | Render (free web service) |

---

## 2. Component Diagram

```mermaid
flowchart TB
    subgraph Client["Browser (User)"]
        UI["React App (Vite)<br/>hosted on Vercel"]
    end

    subgraph Backend["Backend API (Render)"]
        API["Node.js + Express Server"]
        Logic["Business Logic<br/>(question selection, prompt building)"]
    end

    subgraph SupabaseCloud["Supabase (Managed Backend)"]
        Auth["Supabase Auth"]
        DB[("Postgres Database")]
    end

    subgraph AIProvider["Anthropic"]
        Claude["Claude API"]
    end

    UI -- "1. Sign up / Log in" --> Auth
    UI -- "2. Direct DB reads<br/>(session, history)" --> DB
    UI -- "3. API calls<br/>(resume, analysis, interview)" --> API
    API -- "4. Verify user session" --> Auth
    API -- "5. Read/write app data" --> DB
    API -- "6. AI requests<br/>(gap analysis, feedback)" --> Claude
    Claude -- "7. Structured JSON response" --> API
    API -- "8. Response to client" --> UI
```

**Design note:** The frontend talks to Supabase **directly** for simple auth and read operations (login state, fetching dashboard history) — this is standard practice with Supabase's client library and reduces backend complexity. The frontend talks to the **Express backend** only for operations that require the LLM API key (which must never be exposed client-side) — resume analysis, question selection, and answer feedback. This split keeps the backend small and focused only on what truly needs a server.

---

## 3. Data Flow — Full Core Loop

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as React Frontend
    participant S as Supabase (Auth+DB)
    participant B as Express Backend
    participant C as Claude API

    U->>F: Sign up / Log in
    F->>S: supabase.auth.signUp()/signIn()
    S-->>F: Session token

    U->>F: Upload resume (PDF) or paste text
    F->>F: Extract text (pdfjs-dist, if PDF)
    F->>S: Insert into resumes table
    S-->>F: resume_id

    U->>F: Click "Analyze My Resume"
    F->>B: POST /api/analyze-resume {resume_id}
    B->>S: Fetch resume_text
    B->>C: Prompt: resume + skill framework
    C-->>B: JSON {strengths, gaps, prep_plan}
    B->>S: Insert into skill_reports
    B-->>F: Skill Gap Report + Prep Plan

    U->>F: Click "Start Mock Interview"
    F->>B: POST /api/start-interview {skill_report_id}
    B->>S: Fetch questions table
    B->>B: selectQuestions() logic (gap-weighted)
    B->>S: Insert interview_sessions row
    B-->>F: Question set

    loop Each Question
        U->>F: Submit answer
        F->>B: POST /api/evaluate-answer {question, answer}
        B->>C: Prompt: question + answer + rubric
        C-->>B: JSON {score, strengths, improvements}
        B->>S: Insert into interview_answers
        B-->>F: Feedback card
    end

    U->>F: View Dashboard
    F->>S: Direct query: skill_reports, interview_sessions
    S-->>F: History data
```

---

## 4. Request Lifecycle — Example: "Analyze My Resume"

```mermaid
flowchart LR
    A["User clicks<br/>Analyze My Resume"] --> B["Frontend shows<br/>loading state"]
    B --> C["POST /api/analyze-resume<br/>+ Supabase auth token in header"]
    C --> D{"Backend verifies<br/>token with Supabase"}
    D -- invalid --> E["401 Unauthorized<br/>returned to frontend"]
    D -- valid --> F["Fetch resume_text<br/>from Postgres"]
    F --> G["Build prompt with<br/>resume + skill framework"]
    G --> H["Call Claude API"]
    H --> I{"Valid JSON<br/>response?"}
    I -- no --> J["Retry once, then<br/>return friendly error"]
    I -- yes --> K["Save skill_report<br/>to Postgres"]
    K --> L["Return report to frontend"]
    L --> M["Frontend renders<br/>Skill Gap Report + Prep Plan"]
    E --> N["Frontend shows<br/>'please log in again'"]
    J --> O["Frontend shows<br/>'analysis failed, try again'"]
```

---

## 5. AI Interaction Design

Two distinct AI calls exist in v1.0, both using the Claude API with **strict JSON-only prompting**:

| Call | Trigger | Input | Output Shape |
|---|---|---|---|
| **Resume Analysis** | User clicks "Analyze My Resume" | Resume text + fixed SDE Intern skill framework | `{ strengths: [], gaps: [{topic, why, priority}], prep_plan: [{topic, action, priority}] }` |
| **Answer Feedback** | User submits an interview answer | Question text + question type + user's answer | `{ score: 1-10, strengths: [max 3], improvements: [max 3] }` |

**Reliability safeguards (both calls):**
- System prompt explicitly instructs "return raw JSON only, no markdown fences, no preamble text."
- Backend strips any accidental ` ```json ` fences before parsing, as a safety net.
- If `JSON.parse()` fails, the backend retries the call once before surfacing a friendly error to the user (per Request Lifecycle diagram above).
- Both calls are stateless from Claude's perspective — no conversation history is sent, which keeps prompts small, fast, and predictable.

---

## 6. External Services

| Service | Purpose | Tier |
|---|---|---|
| Supabase | Auth + Postgres database | Free |
| Anthropic Claude API | Resume analysis + answer feedback | Existing key (pay-as-you-go, low volume expected) |
| Vercel | Frontend hosting + CI from GitHub | Free (Hobby) |
| Render | Backend (Express) hosting | Free (Web Service) |
| GitHub | Version control, triggers deploys | Free |

---

## 7. Security Notes (v1.0 scope)

- The Claude API key lives **only** in the backend's environment variables (Render dashboard) — never shipped to the browser.
- Supabase's public `anon` key is safe to expose in the frontend by design (Supabase's model), but all table access is protected by **Row Level Security (RLS) policies** restricting each user to their own rows.
- Passwords are never handled directly by our code — Supabase Auth manages hashing and storage entirely.
