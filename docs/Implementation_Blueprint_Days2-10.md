# Implementation Blueprint — AI Career & Interview Copilot
### Days 2–10 | AB Talks 60-Day Claude AI Challenge — 10-Day Capstone

**This document is the single source of truth for building this project.** Each day below is written so a fresh AI conversation can pick it up with no prior context and continue building without redesigning or re-planning. Paste the relevant day's section (plus "Handoff Notes from previous day") into a new chat to continue.

**Locked decisions from Day 1 (do not re-litigate these):**
- Product: AI Career & Interview Copilot for **Software Engineer Intern** candidates only (single role, v1.0)
- Core loop: **Resume Upload → Skill Gap Report → Personalized Prep Plan → Mock Technical Interview → AI Feedback**
- Interview questions: **conceptual CS + coding-review (no code execution)**, selected **semi-dynamically** from a tagged question bank based on identified gaps
- Feedback format: **score + 3-4 structured points** (strengths + improvements)
- Resume input: **PDF upload + plain text paste fallback**
- Accounts: **yes**, via a managed auth/database provider (free tier)
- Out of scope for v1.0: HR/behavioral practice, code execution, multi-role support, fully dynamic question generation, DOCX parsing, payments
- Deliverable on Day 10: live deployed app + README/case study + demo video
- Builder profile: beginner/intermediate, solo, ~3-4 hrs/day, has deployed full apps before, has an LLM API key ready

---

## Day 2 — Technical Design & System Architecture ✅ COMPLETED

### 🎯 Objective
Finalize the tech stack and produce the complete technical design: architecture, database schema, API contract, UI wireframes, and project structure — no code written yet.

### ✅ Final Locked Stack (confirmed Day 2, AI provider updated Day 3)
| Layer | Choice |
|---|---|
| Frontend | React (Vite) |
| Backend | Node.js + Express |
| Database | Supabase (Postgres) |
| Auth | Supabase Auth (email/password) |
| AI | **Google Gemini API** (switched from Anthropic Claude API on Day 3 — free tier requirement) |
| Frontend Hosting | Vercel |
| Backend Hosting | Render (free Web Service) |

### 📦 Deliverables produced Day 2 (all in `docs/`)
- `ARCHITECTURE.md`, `SCHEMA.md`, `API.md`, `UI-WIREFRAMES.md`, `PROJECT-STRUCTURE.md`

### ➡️ Handoff notes for Day 3
Design complete. Day 3 begins actual project scaffolding, Supabase project creation, and foundation code — no design decisions remain open except AI provider (resolved Day 3, see below).

---

## Day 3 — Project Setup & Foundation ✅ COMPLETED

### 🎯 Objective
Build the project's technical foundation: dev environment configured, both `frontend/` and `backend/` scaffolded and running, Supabase project live with schema deployed, environment variables wired, and basic routing/navigation/auth scaffold in place. No full feature logic yet — that starts Day 4.

### 📖 What I'll learn
Scaffolding a two-service (frontend + backend) JavaScript project from scratch; connecting a managed backend-as-a-service (Supabase); structuring environment variables safely; setting up client-side routing.

### 🛠 Features to build
None — foundation only, per plan. A "Hello World" level app that runs, not a working product yet.

### 📝 Step-by-step implementation plan (as executed today)
1. Verified environment: Node v22.19.0, npm 10.9.3, Git 2.50.1 — all healthy.
2. Scaffolded frontend: `npm create vite@latest frontend -- --template react`, then `npm install`.
3. Scaffolded backend: `mkdir backend && cd backend && npm init -y`, then `npm install express cors dotenv @supabase/supabase-js`.
4. Installed remaining frontend dependencies: `npm install react-router-dom @supabase/supabase-js pdfjs-dist`.
5. Created Supabase project (`ai-career-copilot`, South Asia/Mumbai region, Free tier).
6. Ran full schema SQL from `SCHEMA.md` in Supabase SQL Editor — created all 5 tables (`resumes`, `skill_reports`, `questions`, `interview_sessions`, `interview_answers`) with RLS policies. Verified in Table Editor.
7. Confirmed Email/Password auth provider enabled in Supabase Auth settings.
8. Retrieved API credentials (Publishable key, Secret key, Project URL) from Supabase → Settings → API Keys.
9. **Decision point:** discovered Anthropic Claude API account had $0 credits. Switched AI provider to **Google Gemini API** (free tier) to satisfy PRD's free-tier requirement. Updated `ARCHITECTURE.md`, `PROJECT-STRUCTURE.md`, `API.md`, and this Blueprint accordingly (see change log in `ARCHITECTURE.md`).
10. Created `frontend/.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_BASE_URL`) and `backend/.env` (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, `PORT`).

### 📂 Files and folders created today
```
ai-career-copilot/
├── frontend/                  (Vite React scaffold, dependencies installed)
│   ├── .env                   (gitignored)
├── backend/                   (Express scaffold, dependencies installed)
│   ├── .env                   (gitignored)
├── docs/                      (Day 1-2 deliverables to be organized here)
```
Remaining foundation code (routing, layout, auth scaffold, Supabase clients, API client) to be created in the rest of today's session per `PROJECT-STRUCTURE.md`.

### 🔗 APIs, libraries, services, or tools integrated
- Supabase (Auth + Postgres) — live, free tier
- Google Gemini API — free tier (replaces Claude API)
- react-router-dom, pdfjs-dist, @supabase/supabase-js (frontend)
- express, cors, dotenv, @supabase/supabase-js (backend)

### 🧪 Testing tasks
- Confirmed `npm install` completed with 0 vulnerabilities on both frontend and backend.
- Confirmed all 5 Supabase tables exist via Table Editor.
- Confirmed Email auth provider shows "Enabled."

### 🐞 Common issues and debugging tips
- **AI provider swap mid-project:** handled cleanly because `ARCHITECTURE.md` always treated the LLM as a single wrapped client — no schema or API contract changes needed, only the client wrapper file and env variable name.
- **Supabase's newer key naming** ("Publishable key" / "Secret key") replaces the older "anon key" / "service_role key" terms found in some Supabase docs/tutorials — they are functionally equivalent.

### ✅ End-of-day checklist
- [x] Environment verified (Node, npm, Git)
- [x] Frontend scaffolded and dependencies installed
- [x] Backend scaffolded and dependencies installed
- [x] Supabase project created, schema deployed, RLS policies active
- [x] Email/password auth enabled
- [x] Environment variables configured in both `.env` files
- [x] AI provider decision resolved (Gemini) and documented
- [ ] Foundation code (routing, layout, auth scaffold) — in progress, see chat
- [ ] Hello World verified running — pending
- [ ] Committed and pushed to GitHub — pending

### 📸 Expected project state and screenshots to capture
- Terminal output for each scaffold/install step
- Supabase Table Editor showing all 5 tables
- Supabase Auth Providers showing Email enabled
- Running Hello World app in browser (pending)

### ➡️ Handoff notes for Day 4
**AI provider is Google Gemini, not Claude — use `GEMINI_API_KEY` and Gemini's API format for all AI calls from today onward.** Foundation (routing, layout, Supabase clients, auth scaffold) is in place by end of Day 3. Day 4 now covers a combined scope: (1) finish wiring **working** signup/login/logout and resume upload+save logic — originally planned as a standalone Day 3 — plus (2) the Skill Gap Report + Prep Plan AI integration using Gemini. If time is tight, prioritize (1) and (2)'s core loop; defer AI prompt-quality polish to Day 7's polish pass rather than over-iterating today.

---

## Day 4 — Auth + Resume Input (Working Logic) + Skill Gap Report & Prep Plan (AI Integration)

*Note: this day's scope was expanded on Day 3 — it now includes finishing the working authentication and resume-input logic (originally planned as a standalone Day 3) in addition to the original AI integration work, since Day 2 was used entirely for design. See Day 3's handoff notes above.*

### 🎯 Objective
Part A: Finish wiring **working** signup/login/logout and resume upload+save logic on top of today's (Day 3's) foundation scaffold. Part B: Send the saved resume text to the LLM (Gemini), generate a structured Skill Gap Report and Prep Plan, and display both clearly in the UI.

### 📖 What I'll learn
Wiring a managed auth flow into a React UI; handling file uploads and PDF text extraction; prompt engineering for structured, reliable JSON output from an LLM; designing a UI around AI-generated content that must feel personalized and trustworthy.

### 🛠 Features to build
**Part A — Auth + Resume Input:**
- Working signup / login / logout (build on Day 3's `useAuth` scaffold)
- Protected route enforcement (build on Day 3's `ProtectedRoute` scaffold)
- Resume upload (PDF, using `pdfjs-dist`) with text extraction
- Resume paste-text fallback
- Save extracted resume text to the `resumes` table, linked to the logged-in user

**Part B — AI Integration:**
- "Analyze My Resume" action that calls the Gemini API
- Skill Gap Report display (strengths vs. gaps)
- Personalized Prep Plan display (prioritized topic list)
- Save both to the database, linked to the user and resume

### 📝 Step-by-step implementation plan

**Part A:**
1. Build `SignUp.jsx` and `Login.jsx` forms using `supabase.auth.signUp()` and `supabase.auth.signInWithPassword()`, using the `useAuth` hook created Day 3.
2. Confirm the `ProtectedRoute` wrapper (Day 3 scaffold) correctly redirects unauthenticated users.
3. Build `ResumeUpload.jsx`: a file input accepting `.pdf`, plus a "Paste your resume text instead" textarea toggle.
4. Use `pdfjs-dist` to extract text client-side from the uploaded PDF.
5. On submit, save extracted/pasted resume text to the `resumes` table (RLS-protected, per `SCHEMA.md`) linked to `user_id`.
6. Show a simple confirmation state ("Resume received") after successful save.

**Part B:**
7. Define the **SDE Intern skill framework** as a fixed reference list fed into the prompt — e.g. Data Structures & Algorithms, OOP fundamentals, System Design basics, Databases/SQL, Version Control/Git, Web Fundamentals, Problem Solving/Communication.
8. Write the Gemini prompt instructing the model to: read the resume text, compare against the skill framework, and return **strict JSON**: `{ strengths: [...], gaps: [{ topic, why, priority }], prep_plan: [{ topic, action, priority }] }`.
9. Build the backend endpoint `POST /api/analyze-resume` (per `API.md`): fetches resume text, calls the Gemini API via `geminiClient.js`, parses the JSON response, saves it to `skill_reports`.
10. Build `SkillGapReport.jsx` and `PrepPlan.jsx` to render the results clearly.
11. Add a loading state while the AI call is in progress, and error handling for malformed/failed responses (retry-once pattern per `ARCHITECTURE.md`).

### 📂 Files and folders to create or modify
```
frontend/src/
├── auth/
│   ├── SignUp.jsx
│   ├── Login.jsx
├── resume/
│   ├── ResumeUpload.jsx
│   ├── resumeParser.js
├── analysis/
│   ├── SkillGapReport.jsx
│   ├── PrepPlan.jsx
backend/
├── routes/
│   ├── analyzeResume.js
├── prompts/
│   ├── skillGapPrompt.js
├── lib/
│   ├── geminiClient.js
```

### 🔗 APIs, libraries, services, or tools to integrate
- `@supabase/supabase-js` (auth + database calls)
- `pdfjs-dist` (PDF text extraction)
- Google Gemini API
- Supabase (`resumes` and `skill_reports` tables)

### 🧪 Testing tasks
- Sign up a new test account, confirm it appears in Supabase Auth dashboard.
- Log out and log back in successfully.
- Upload a real PDF resume, confirm extracted text looks correct (spot check).
- Use paste fallback, confirm it saves identically.
- Confirm an unauthenticated user is redirected away from protected screens.
- Run the analysis on 3-4 different real/sample resumes and check output quality and consistency.
- Confirm malformed JSON from Gemini is caught and doesn't crash the UI.
- Confirm results save correctly and reload correctly if the user revisits the page.

### 🐞 Common issues and debugging tips
- **PDF extraction returns garbled text:** common with multi-column resumes — this is exactly why the paste fallback exists; don't over-invest time perfecting PDF parsing.
- **Supabase RLS blocking inserts:** confirm policies from `SCHEMA.md` are active (verified Day 3) — if inserts fail, double check `auth.uid() = user_id` matches.
- **Gemini returns JSON wrapped in markdown fences:** strip these before `JSON.parse()`, or instruct the model explicitly to return raw JSON only.
- **Report feels generic, not personalized:** verify the actual resume text is being interpolated into the prompt, not a placeholder.

### ✅ End-of-day checklist
- [ ] Signup/login/logout working end-to-end
- [ ] Protected routes enforced
- [ ] PDF upload extracts and saves text; paste fallback works identically
- [ ] Resume analysis produces valid structured JSON reliably (test at least 4 times)
- [ ] Skill Gap Report and Prep Plan render clearly and persist correctly
- [ ] Error states handled gracefully throughout

### 📸 Expected project state and screenshots to capture
- Screenshot of signup form and successful account creation
- Screenshot of resume upload screen with a real resume uploaded
- Screenshot of a completed Skill Gap Report and Prep Plan for a real test resume
- Screenshot of the relevant Supabase table rows

### ➡️ Handoff notes for next day
Auth, resume storage, and AI-driven Skill Gap Report + Prep Plan are all working and persisted. Day 5 builds the tagged question bank and the logic that selects mock interview questions based on the gaps identified today.

---

## Day 5 — Interview Question Bank + Semi-Dynamic Selection Logic

### 🎯 Objective
Build the tagged question bank (conceptual + coding-review questions) and the logic that selects relevant questions based on the user's identified skill gaps.

### 📖 What I'll learn
Structuring reusable content data; writing selection/filtering logic that connects two features (Skill Gap Report → Interview) into one coherent product loop.

### 🛠 Features to build
- Static, tagged question bank (stored as JSON or a database table)
- Question selection logic (filter/prioritize by matching gap topics)
- Interview session initialization (creates a set of questions for the user to answer)

### 📝 Step-by-step implementation plan
1. Build the question bank content: aim for **25-40 questions total**, tagged by topic (matching the Day 4 skill framework: DSA, OOP, System Design basics, Databases/SQL, Git, Web Fundamentals). Mix conceptual questions (~60%) and coding-review questions (~40%, e.g. "Write a function to X, then explain your approach").
2. Store the bank either as a static JSON file (`questionBank.json`) bundled with the app, or as a Supabase table `questions` (id, topic, type, prompt, difficulty) — a table is preferable since it lets you edit content without redeploying.
3. Write the **selection logic**: given the user's `gaps` array (with priorities) from `skill_reports`, select ~6-8 questions total, weighted toward higher-priority gap topics, with at least 1 question from a topic the user is strong in (to build confidence and demonstrate range).
4. Create an `interview_sessions` table: `id, user_id, skill_report_id, question_ids (array), created_at, status`.
5. Build the "Start Mock Interview" action: runs the selection logic, creates a session row, and navigates the user into the interview flow (built tomorrow).

### 📂 Files and folders to create or modify
```
backend/
├── data/
│   ├── questionBank.json          (or migrate to Supabase table)
├── routes/
│   ├── startInterview.js
├── logic/
│   ├── selectQuestions.js
```

### 🔗 APIs, libraries, services, or tools to integrate
- Supabase (new `questions` and `interview_sessions` tables, or bundled JSON)

### 🧪 Testing tasks
- Confirm selection logic returns different question sets for different gap profiles (test with 2-3 varied skill reports).
- Confirm no duplicate questions within a single session.
- Confirm a session row is created correctly with the right `question_ids`.

### 🐞 Common issues and debugging tips
- **Selection logic always returns the same questions:** check that gap priority/topic matching is actually reading the real `gaps_json`, not falling back to a default.
- **Question bank too thin in one topic:** if a topic has too few tagged questions, selection will feel repetitive across users — pad thin topics before moving on.

### ✅ End-of-day checklist
- [ ] Question bank has 25-40 tagged questions covering all skill-framework topics
- [ ] Selection logic reliably weights toward gap topics
- [ ] `interview_sessions` created correctly with selected question IDs
- [ ] Manually verified output feels personalized across 2-3 different test profiles

### 📸 Expected project state and screenshots to capture
- Screenshot of the question bank data (JSON or Supabase table view)
- Screenshot/log of selection logic output for a sample skill report

### ➡️ Handoff notes for next day
Question selection is working and tied to each user's gaps. `interview_sessions` holds the question set for a session. Day 6 builds the actual interview UI — presenting questions one at a time, capturing answers, and sending each answer to the LLM for feedback.

---

## Day 6 — Mock Interview Flow + AI Feedback

### 🎯 Objective
Build the interview-taking experience: present questions one at a time, capture the user's answer, and generate structured AI feedback (score + strengths + improvements) per answer.

### 📖 What I'll learn
Building multi-step interactive flows in React; prompt engineering for evaluative (not just generative) AI tasks; designing UI for AI feedback that feels credible and useful.

### 🛠 Features to build
- Interview question-by-question UI (progress indicator, one question at a time)
- Answer input (textarea for both conceptual and coding-review questions)
- AI feedback generation per answer (score + 3-4 structured points)
- Session summary screen at the end

### 📝 Step-by-step implementation plan
1. Build `InterviewSession.jsx`: loads the session's question set, shows one question at a time with a progress bar ("Question 3 of 7").
2. Build the answer textarea with a "Submit Answer" button.
3. Write the **feedback prompt**: given the question, the question type (conceptual/coding-review), and the user's answer, instruct the LLM to return strict JSON: `{ score: 1-10, strengths: [...max 3], improvements: [...max 3] }`. Keep the prompt strict about staying within moderate detail (per PRD scope) — not a full model answer.
4. Build `POST /api/evaluate-answer` endpoint that calls the LLM and returns parsed feedback.
5. Create an `interview_answers` table: `id, session_id, question_id, user_answer, score, strengths_json, improvements_json, created_at`.
6. After each answer's feedback is shown, let the user proceed to the next question.
7. Build `SessionSummary.jsx`: shown after the last question — average score, list of all questions with their individual scores, link back to the dashboard.

### 📂 Files and folders to create or modify
```
frontend/src/
├── interview/
│   ├── InterviewSession.jsx
│   ├── QuestionCard.jsx
│   ├── FeedbackCard.jsx
│   ├── SessionSummary.jsx
backend/
├── routes/
│   ├── evaluateAnswer.js
├── prompts/
│   ├── feedbackPrompt.js
```

### 🔗 APIs, libraries, services, or tools to integrate
- Your LLM provider's API
- Supabase (`interview_answers` table)

### 🧪 Testing tasks
- Complete a full mock interview session end-to-end (all questions, all feedback).
- Test with a deliberately weak/short answer and a strong/detailed answer — confirm scores and feedback genuinely differ.
- Confirm session summary correctly aggregates all answers and scores.
- Refresh mid-session and confirm behavior is sensible (either resumes or clearly restarts — decide and be consistent).

### 🐞 Common issues and debugging tips
- **Feedback feels generic/copy-pasted across answers:** verify the actual `user_answer` text is reaching the prompt, not a stale value.
- **Score inconsistency (same answer scores very differently on reruns):** add a bit more structure/rubric guidance to the prompt (e.g. "score 8-10 = correct and well-explained, 5-7 = correct but underexplained, below 5 = incorrect or missing key ideas").
- **UI feels slow between questions:** make sure the loading state clearly communicates "AI is reviewing your answer" so it doesn't look frozen.

### ✅ End-of-day checklist
- [ ] Full interview session completes end-to-end without errors
- [ ] Feedback is structured, specific, and varies meaningfully by answer quality
- [ ] Session summary displays and aggregates correctly
- [ ] All answers and scores persist to the database

### 📸 Expected project state and screenshots to capture
- Screenshot of a question card mid-interview
- Screenshot of an AI feedback card after answering
- Screenshot of the final session summary screen

### ➡️ Handoff notes for next day
The full core product loop now works locally end-to-end: signup → resume → gap report/prep plan → mock interview → feedback → summary. Day 7 focuses on polish, the saved-history feature (dashboard showing past reports/sessions), and getting the app ready to deploy.

---

## Day 7 — Saved History Dashboard + UI Polish

### 🎯 Objective
Build the dashboard that lets logged-in users revisit past prep plans and interview attempts, and polish the overall UI/UX so the product feels cohesive, not like disconnected screens.

### 📖 What I'll learn
Designing a simple dashboard/history view backed by relational data; UI polish techniques that meaningfully increase perceived product quality without much extra time investment.

### 🛠 Features to build
- Dashboard/home screen listing past skill reports and interview sessions
- Navigation between all screens (dashboard, upload, report, interview, summary)
- Visual polish pass (consistent spacing, colors, loading/empty states)

### 📝 Step-by-step implementation plan
1. Build `Dashboard.jsx`: on login, query `skill_reports` and `interview_sessions` for the current user, list them chronologically with key info (date, average score, quick links).
2. Add "Start New Analysis" and "View Report" / "Retake Interview" actions from the dashboard.
3. Add a persistent navigation bar (logo/name, Dashboard, Logout) across all screens.
4. Do a full pass on visual consistency: consistent color palette, spacing, button styles, font sizes across every screen built Days 3-6.
5. Add empty states (e.g. "No reports yet — upload your resume to get started") and loading skeletons where missing.
6. Test the entire flow as a brand-new user from scratch, then again as a returning user with history.

### 📂 Files and folders to create or modify
```
frontend/src/
├── dashboard/
│   ├── Dashboard.jsx
├── layout/
│   ├── NavBar.jsx
│   ├── EmptyState.jsx
├── styles/
│   ├── theme.css (or equivalent, consolidating colors/spacing)
```

### 🔗 APIs, libraries, services, or tools to integrate
- No new services — this is consolidation and UI work using what's already integrated

### 🧪 Testing tasks
- New user flow: signup → dashboard (empty) → full loop → dashboard (populated).
- Returning user flow: log in → see history → open an old report → retake interview.
- Check the app on a smaller browser window/mobile width for obvious layout breaks.

### 🐞 Common issues and debugging tips
- **Dashboard queries slow or return wrong user's data:** double check RLS policies and that queries filter by `user_id` explicitly, not relying on RLS alone during development.
- **Inconsistent styling across screens:** this is the day to fix it — resist adding new features today, this is a polish-only day.

### ✅ End-of-day checklist
- [ ] Dashboard shows accurate history for the logged-in user only
- [ ] Navigation works consistently across all screens
- [ ] Empty and loading states exist everywhere data is fetched
- [ ] Full new-user and returning-user flows tested manually, no dead ends

### 📸 Expected project state and screenshots to capture
- Screenshot of the dashboard with history populated
- Screenshot of the dashboard empty state
- Screenshot showing consistent nav/branding across 2-3 different screens

### ➡️ Handoff notes for next day
The app is now feature-complete and polished, running correctly on localhost. Day 8 is entirely about deployment: getting the frontend, backend, and environment variables live and working in production.

---

## Day 8 — Deployment

### 🎯 Objective
Deploy the complete application to a live, publicly accessible URL, with all environment variables and services (Supabase, LLM API) working correctly in production.

### 📖 What I'll learn
Production environment variable management; debugging the gap between "works on localhost" and "works in production."

### 🛠 Features to build
None new — this day is entirely deployment and production verification of everything already built.

### 📝 Step-by-step implementation plan
1. Push the final, polished codebase to GitHub (clean commit history preferred but not required).
2. Connect your chosen host (Vercel/Render/Railway/Netlify — whichever you've used successfully before) to the GitHub repo.
3. Configure the build settings (framework preset, build command, output directory) — these are usually auto-detected for a Vite app.
4. Add all environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `LLM_API_KEY`, etc.) into the host's dashboard environment variable settings — **never commit these**.
5. If using a separate backend, deploy it as its own service (or as serverless functions on the same host) and update the frontend's API base URL to point to the deployed backend.
6. In Supabase, add the production URL to the Auth "allowed redirect URLs" / site URL settings so signup/login works from the live domain, not just localhost.
7. Trigger the deploy, then test the entire core loop on the live URL exactly as a new user would.
8. Fix any production-only bugs (commonly: environment variables, CORS, redirect URLs) and redeploy.

### 📂 Files and folders to create or modify
```
(no new files typically — configuration happens in host dashboard)
frontend/vite.config.js         (verify build settings if needed)
```

### 🔗 APIs, libraries, services, or tools to integrate
- Your hosting provider (Vercel/Render/Railway/Netlify)
- Supabase Auth production URL configuration

### 🧪 Testing tasks
- Full core loop test on the live URL: signup → resume → report → plan → interview → feedback → dashboard.
- Test in an incognito/private browser window to rule out cached localhost sessions.
- Test signup/login specifically, since this is the most common production-only failure point.

### 🐞 Common issues and debugging tips
- **"Works locally, breaks in production":** almost always environment variables not set in the host dashboard, or Supabase redirect URL not updated.
- **CORS errors in production only:** the deployed backend URL differs from localhost — update CORS allowed origins to include the production frontend URL.
- **Auth redirect loops:** check Supabase Auth site URL settings match your actual deployed domain exactly (including https://).

### ✅ End-of-day checklist
- [ ] App is live at a public URL
- [ ] Full core loop tested and working on the live URL, in an incognito window
- [ ] Signup/login confirmed working in production
- [ ] No console errors on any core screen in production

### 📸 Expected project state and screenshots to capture
- Screenshot of the live URL in the browser address bar with the app loaded
- Screenshot of a completed live signup
- Screenshot of a completed live interview feedback screen

### ➡️ Handoff notes for next day
The product is fully deployed and functioning end-to-end in production. Day 9 focuses on writing the README/case study and recording the demo video — no further feature work.

---

## Day 9 — README / Case Study + Demo Video

### 🎯 Objective
Produce a polished README/case study documenting the project, and record a short demo video walking through the live product.

### 📖 What I'll learn
Communicating a technical project clearly to a non-technical or time-constrained reader (recruiter, judge); presenting your own work concisely on camera or in a screen recording.

### 🛠 Features to build
None — documentation and presentation only. Resist the urge to add features today.

### 📝 Step-by-step implementation plan
1. Write `README.md` in the repo root covering: Problem, Solution (with a screenshot or two), Core Features, Tech Stack, Architecture (brief diagram or bullet list), Live Demo link, How to Run Locally, What's Out of Scope / Future Work.
2. Add 3-5 real screenshots from the live deployed app (dashboard, gap report, interview, feedback) into the README.
3. Write a short **case study** section or separate doc: what problem you set out to solve, the key product decision you're proud of (e.g. the semi-dynamic question selection tying gaps to practice), and one thing you'd do differently with more time.
4. Plan a **2-4 minute demo video** script: (a) 15-sec problem framing, (b) live walkthrough of the core loop on the deployed app, (c) 15-sec close on what's next.
5. Record the demo video using free screen-recording tools already available on your OS (e.g. built-in screen recorder), narrating as you go.
6. Upload the video (e.g. unlisted YouTube link, or per the challenge's submission instructions) and add the link to the README.
7. Final proofread of the README for typos, broken links, and outdated screenshots.

### 📂 Files and folders to create or modify
```
README.md
docs/
├── case-study.md   (optional, can also fold into README)
├── screenshots/
```

### 🔗 APIs, libraries, services, or tools to integrate
- None (free OS-native screen recording tool only, per standing "no paid tools" rule)

### 🧪 Testing tasks
- Click every link in the README (live demo, video) to confirm they work.
- Read the README as if you're a recruiter with 60 seconds — confirm it's scannable, not a wall of text.
- Watch the recorded video once fully through to check audio/clarity before finalizing.

### 🐞 Common issues and debugging tips
- **Video too long/rambling:** script the walkthrough beats in advance (step 4) rather than improvising live.
- **Screenshots go stale if you tweak the UI after taking them:** take final screenshots only after Day 8's deployment is fully stable.

### ✅ End-of-day checklist
- [ ] README complete with screenshots, live link, and tech stack
- [ ] Case study section written
- [ ] Demo video recorded, under ~4 minutes, and uploaded
- [ ] All links in README verified working

### 📸 Expected project state and screenshots to capture
- Screenshot of the finished README rendered on GitHub
- Screenshot/thumbnail of the demo video

### ➡️ Handoff notes for next day
Documentation and demo are complete. Day 10 is final QA, bug fixing, and formal submission — no new writing or recording needed unless a bug requires re-recording a segment.

---

## Day 10 — Final QA, Bug Fixes & Submission

### 🎯 Objective
Do a final end-to-end quality pass on the live product, fix any remaining bugs, and formally submit the completed capstone.

### 📖 What I'll learn
Systematic QA practices for a small product; how to triage and prioritize last-minute bugs under time pressure without introducing new risk.

### 🛠 Features to build
None — bug fixes only. No new features on Day 10, by design.

### 📝 Step-by-step implementation plan
1. Run the **full core loop** on the live URL one more time, in a fresh incognito window, as if you were a first-time user.
2. Test edge cases deliberately: a very short/sparse resume, a very long resume, an empty answer submitted in the interview, rapid double-clicking submit buttons.
3. Make a prioritized bug list: **P0 (breaks the core loop) → P1 (visible but doesn't block) → P2 (nice-to-fix, skip if time-constrained)**. Only fix P0 and P1 today.
4. Fix and redeploy, then **re-run the full core loop test again** after any fix — never assume a fix worked without retesting the whole flow.
5. Do a final check of the README: live link works, video link works, screenshots match the current live UI.
6. Submit per the AB Talks 60-Day Claude AI Challenge submission instructions (repo link, live link, video link, README).
7. Write a short personal retrospective (can be private): what worked, what you'd scope differently next time — useful for interviews later ("tell me about a project you built").

### 📂 Files and folders to create or modify
```
(bug fixes only, across existing files — no new structure expected)
```

### 🔗 APIs, libraries, services, or tools to integrate
None new.

### 🧪 Testing tasks
- Full core loop, fresh incognito window, start to finish.
- Edge cases: empty inputs, very long inputs, rapid clicking, logout mid-flow.
- Cross-check every README link one final time.

### 🐞 Common issues and debugging tips
- **Tempted to add "just one more feature":** don't — Day 10 risk tolerance should be near zero; a working, polished v1.0 beats a broken v1.1.
- **A fix for one bug breaks something else:** always retest the full loop after any change, not just the specific bug you fixed.

### ✅ End-of-day checklist
- [ ] Full core loop verified working on live URL, fresh session
- [ ] All P0 and P1 bugs fixed and retested
- [ ] README and video links final and verified
- [ ] Submission completed per challenge instructions

### 📸 Expected project state and screenshots to capture
- Final screenshot of the deployed dashboard
- Screenshot of the submitted entry/confirmation (if applicable)

### ➡️ Handoff notes
Capstone complete. Project is deployed, documented, demoed, and submitted. Any remaining P2 issues or the excluded v1.0 features (HR interview practice, code execution, multi-role support, dynamic question generation) are documented as future work in the README — a clear, honest scope story is itself a strength in review.
