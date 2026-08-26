# Environment Configuration — AI Career & Interview Copilot

Version 1.0 | Day 3 Deliverable

This document lists every environment variable, external tool, and configuration value the project depends on. **No actual secret values are included here** — only variable names, where to find them, and their purpose. Actual values live only in local `.env` files (gitignored) and in each hosting provider's dashboard once deployed.

---

## 1. Frontend Environment Variables (`frontend/.env`)

| Variable | Purpose | Where to Find It |
|---|---|---|
| `VITE_SUPABASE_URL` | Base URL of the Supabase project, used by the frontend Supabase client | Supabase Dashboard → Settings → API Keys → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Public-safe key ("Publishable key") allowing frontend auth + reads under RLS protection | Supabase Dashboard → Settings → API Keys → Publishable key |
| `VITE_API_BASE_URL` | Base URL of the backend Express API | `http://localhost:5000` locally; will become the Render production URL after Day 8 deployment |

**Note:** Vite only exposes variables prefixed `VITE_` to frontend code — this is a Vite security feature, not a project-specific choice.

---

## 2. Backend Environment Variables (`backend/.env`)

| Variable | Purpose | Where to Find It |
|---|---|---|
| `SUPABASE_URL` | Same project URL as frontend | Supabase Dashboard → Settings → API Keys → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Elevated-privilege key ("Secret key") allowing the backend to verify user tokens and bypass RLS when needed for admin operations | Supabase Dashboard → Settings → API Keys → Secret keys section |
| `GEMINI_API_KEY` | Authenticates all AI calls (resume analysis, answer feedback) to Google's Gemini API | [aistudio.google.com](https://aistudio.google.com) → Get API key |
| `PORT` | Local port the Express server listens on | Set to `5000` (arbitrary choice, matches `VITE_API_BASE_URL`) |

**Critical security note:** `SUPABASE_SERVICE_ROLE_KEY` and `GEMINI_API_KEY` must **never** appear in frontend code, browser network requests, or any committed file. They exist only in `backend/.env` locally, and later in Render's environment variable dashboard once deployed (Day 8).

---

## 3. Change Log — AI Provider (Day 3)

**Original plan (Day 1-2):** Anthropic Claude API, using variable name `CLAUDE_API_KEY`.

**Changed Day 3 to:** Google Gemini API, using variable name `GEMINI_API_KEY`.

**Reason:** The Anthropic account associated with this project had $0.00 available API credits. The PRD (Section 9, Non-Functional Requirements) mandates the product run entirely on free tiers. Google Gemini offers a genuine free tier suitable for this project's expected usage volume, satisfying that requirement. This was a like-for-like architectural swap — see `ARCHITECTURE.md`'s change log for full rationale. No other environment variables, schema fields, or API contracts were affected.

---

## 4. Tools & Accounts Required

| Tool/Service | Used For | Account Type |
|---|---|---|
| Node.js + npm | Local development runtime | N/A (local install) |
| Git | Version control | N/A (local install) |
| GitHub | Remote repository, triggers deploys | Free account |
| Supabase | Database (Postgres) + Authentication | Free tier project |
| Google AI Studio (Gemini) | AI model access | Free tier API key |
| Vercel | Frontend hosting (Day 8) | Free (Hobby) tier |
| Render | Backend hosting (Day 8) | Free (Web Service) tier |
| VS Code | Code editor | Free |

---

## 5. `.env.example` Files (committed to repo, no real values)

For reference and onboarding, each folder should contain a committed `.env.example` with the variable names only:

**`frontend/.env.example`**
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_BASE_URL=
```

**`backend/.env.example`**
```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
PORT=
```

*(These should be created alongside the real `.env` files — see Day 3 checklist for status.)*

---

## 6. Confirming Your Environment Is Correctly Configured

Run the app locally per `SETUP.md`. If both the frontend (`localhost:5173`) and backend (`localhost:5000`) load without errors, your environment variables are correctly wired. Full functional testing of Supabase Auth and the Gemini API happens Day 4, once the actual feature logic is built on top of today's foundation.
