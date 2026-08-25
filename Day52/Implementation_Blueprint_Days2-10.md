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

### ✅ Final Locked Stack (confirmed Day 2 — do not revisit)
| Layer | Choice |
|---|---|
| Frontend | React (Vite) |
| Backend | Node.js + Express |
| Database | Supabase (Postgres) |
| Auth | Supabase Auth (email/password) |
| AI | Anthropic Claude API |
| Frontend Hosting | **Vercel** |
| Backend Hosting | **Render** (free Web Service — chosen over Vercel serverless because Express needs an always-on process) |

**Design refinement from original plan:** frontend and backend are hosted on **two different platforms** (Vercel + Render) rather than one host for both. This was approved Day 2 — see `ARCHITECTURE.md` for rationale. All other Day 1 decisions are unchanged.

### 📦 Deliverables produced today (all in `docs/`)
- `ARCHITECTURE.md` — component diagram, data flow, request lifecycle, AI interaction design
- `SCHEMA.md` — full Postgres schema (`resumes`, `skill_reports`, `questions`, `interview_sessions`, `interview_answers`) + RLS policies, validated against every PRD user story
- `API.md` — all 4 backend endpoints fully specified (request/response/validation/auth/errors)
- `UI-WIREFRAMES.md` — user flow diagram, screen inventory, low-fidelity wireframes for all 8 screens
- `PROJECT-STRUCTURE.md` — complete folder structure for `frontend/` and `backend/`, mapped to which day builds what

### 📝 Manual setup steps completed today
1. GitHub repository confirmed: `https://github.com/madhuradarshinirm/ai-career-copilot`
2. Repository cloned locally via `git clone`
3. Design documents created and ready to commit

### 🔗 APIs, libraries, services, or tools to integrate (confirmed, not yet installed)
- `@supabase/supabase-js` (frontend + backend)
- `pdfjs-dist` (PDF text extraction)
- `react-router-dom` (navigation)
- `express`, `cors`, `dotenv` (backend)
- Anthropic Claude API SDK/fetch calls

### ✅ End-of-day checklist
- [x] Tech stack finalized and documented
- [x] System architecture designed with diagrams
- [x] Database schema designed and validated against PRD
- [x] API endpoints fully specified
- [x] UI wireframes and user flow completed
- [x] Project folder structure defined
- [x] GitHub repo confirmed and cloned locally
- [ ] Today's docs committed and pushed (final step of Day 2, see chat)

### ➡️ Handoff notes for Day 3
**Everything needed to start writing code exists in `docs/`.** Day 3 should NOT re-derive architecture, schema, API shapes, or UI layout — reference `ARCHITECTURE.md`, `SCHEMA.md`, `API.md`, `UI-WIREFRAMES.md`, and `PROJECT-STRUCTURE.md` directly. Day 3 begins by creating the actual `frontend/` and `backend/` folder scaffolds per `PROJECT-STRUCTURE.md`, setting up the Supabase project (tables from `SCHEMA.md`, RLS policies as specified), and building signup/login + resume upload UI exactly as wireframed. No design decisions remain open.

---


## Day 3 — Authentication + Resume Input UI

### 🎯 Objective
Build working signup/login and the resume input screen (PDF upload + paste fallback), storing the uploaded resume text tied to the logged-in user.

### 📖 What I'll learn
Wiring a managed auth flow into a React UI; handling file uploads; extracting text from a PDF client-side or server-side.

### 🛠 Features to build
- Signup / Login / Logout screens
- Protected route (only logged-in users reach the resume screen)
- Resume upload (PDF) with text extraction
- Resume paste-text fallback
- Save extracted resume text to the database, linked to the user

### 📝 Step-by-step implementation plan
1. Build `SignUp.jsx` and `Login.jsx` forms using `supabase.auth.signUp()` and `supabase.auth.signInWithPassword()`.
2. Build a simple auth context/hook (`useAuth`) that tracks the current logged-in user across the app.
3. Add a protected route wrapper: redirect to `/login` if no user session.
4. Create a `resumes` table in Supabase: columns `id, user_id, resume_text, created_at`.
5. Build `ResumeUpload.jsx`: a file input accepting `.pdf`, plus a "Paste your resume text instead" textarea toggle.
6. For PDF text extraction, use a client-side library (e.g. `pdfjs-dist`) OR send the file to a backend endpoint that extracts text server-side — pick whichever matches your chosen architecture from Day 2.
7. On submit, save extracted/pasted resume text to the `resumes` table linked to `user_id`.
8. Show a simple confirmation state ("Resume received") after successful save.

### 📂 Files and folders to create or modify
```
frontend/src/
├── auth/
│   ├── SignUp.jsx
│   ├── Login.jsx
│   ├── useAuth.js
│   ├── ProtectedRoute.jsx
├── resume/
│   ├── ResumeUpload.jsx
│   ├── resumeParser.js       (PDF text extraction helper)
├── lib/
│   ├── supabaseClient.js
```

### 🔗 APIs, libraries, services, or tools to integrate
- `@supabase/supabase-js` (auth + database calls)
- `pdfjs-dist` (or equivalent) for PDF text extraction
- React Router (if not already set up) for protected routes

### 🧪 Testing tasks
- Sign up a new test account, confirm it appears in Supabase Auth dashboard.
- Log out and log back in successfully.
- Upload a real PDF resume, confirm extracted text looks correct (spot check, doesn't need to be perfect).
- Use paste fallback, confirm it saves identically to the `resumes` table.
- Confirm an unauthenticated user is redirected away from the resume screen.

### 🐞 Common issues and debugging tips
- **PDF extraction returns garbled text:** common with multi-column resumes — this is exactly why the paste fallback exists; don't over-invest time perfecting PDF parsing.
- **Supabase Row Level Security (RLS) blocking inserts:** by default Supabase tables are locked down — you'll need to add an RLS policy allowing users to insert/select their own rows (`auth.uid() = user_id`).
- **Session not persisting on refresh:** make sure `useAuth` subscribes to `supabase.auth.onAuthStateChange`.

### ✅ End-of-day checklist
- [ ] Signup/login/logout working end-to-end
- [ ] Protected route blocks unauthenticated access
- [ ] PDF upload extracts and saves text
- [ ] Paste fallback saves text
- [ ] RLS policies confirmed working (user only sees their own resume)

### 📸 Expected project state and screenshots to capture
- Screenshot of signup form and successful account creation
- Screenshot of resume upload screen with a real resume uploaded
- Screenshot of the `resumes` table in Supabase showing a saved row

### ➡️ Handoff notes for next day
Auth and resume storage are fully working. A logged-in user can upload/paste a resume and it's saved to `resumes`. Day 4 takes that saved resume text and sends it to the LLM to generate the Skill Gap Report and Prep Plan.

---

## Day 4 — Skill Gap Report + Personalized Prep Plan (AI Integration)

### 🎯 Objective
Send the saved resume text to the LLM, generate a structured Skill Gap Report and Prep Plan, and display both clearly in the UI.

### 📖 What I'll learn
Prompt engineering for structured, reliable JSON output from an LLM; designing a UI around AI-generated content that must feel personalized and trustworthy.

### 🛠 Features to build
- "Analyze My Resume" action that calls the LLM
- Skill Gap Report display (strengths vs. gaps)
- Personalized Prep Plan display (prioritized topic list)
- Save both to the database, linked to the user and resume

### 📝 Step-by-step implementation plan
1. Define the **SDE Intern skill framework** as a fixed reference list you feed into the prompt — e.g. Data Structures & Algorithms, OOP fundamentals, System Design basics, Databases/SQL, Version Control/Git, Web Fundamentals, Problem Solving/Communication. This grounds the AI's analysis instead of letting it invent arbitrary criteria.
2. Write the LLM prompt (system + user) instructing the model to: read the resume text, compare against the skill framework, and return **strict JSON** with fields like `{ strengths: [...], gaps: [{ topic, why, priority }], prep_plan: [{ topic, action, priority }] }`.
3. Build a backend endpoint (or serverless function) `POST /api/analyze-resume` that: fetches resume text, calls the LLM API, parses the JSON response, saves it to a new `skill_reports` table (`id, user_id, resume_id, gaps_json, prep_plan_json, created_at`).
4. Build `SkillGapReport.jsx` to render strengths and gaps clearly (e.g. two columns or a simple list with priority badges).
5. Build `PrepPlan.jsx` to render the prioritized topic list.
6. Add a loading state while the AI call is in progress (this can take several seconds).
7. Add basic error handling: if the LLM call fails or returns malformed JSON, show a friendly retry message instead of a blank/broken screen.

### 📂 Files and folders to create or modify
```
frontend/src/
├── analysis/
│   ├── SkillGapReport.jsx
│   ├── PrepPlan.jsx
backend/
├── routes/
│   ├── analyzeResume.js
├── prompts/
│   ├── skillGapPrompt.js
```

### 🔗 APIs, libraries, services, or tools to integrate
- Your LLM provider's API (Anthropic Claude API or equivalent)
- Supabase (new `skill_reports` table)

### 🧪 Testing tasks
- Run the analysis on 3-4 different real/sample resumes (varying experience levels) and check output quality and consistency.
- Confirm malformed JSON from the LLM is caught and doesn't crash the UI (test by temporarily breaking the prompt to force a bad response).
- Confirm results save correctly and reload correctly if the user revisits the page.

### 🐞 Common issues and debugging tips
- **LLM returns JSON wrapped in markdown fences (` ```json `):** strip these before `JSON.parse()`, or explicitly instruct the model to return raw JSON only, no preamble.
- **Inconsistent output structure between calls:** tighten the prompt with an explicit example of the exact JSON shape expected.
- **Report feels generic, not personalized:** make sure the actual resume text is being interpolated into the prompt, not a placeholder — a very common silent bug.

### ✅ End-of-day checklist
- [ ] Resume analysis produces valid structured JSON reliably (test at least 4 times)
- [ ] Skill Gap Report renders clearly in the UI
- [ ] Prep Plan renders clearly and reads as prioritized, not just a flat list
- [ ] Results persist and reload from the database
- [ ] Error state handles LLM failures gracefully

### 📸 Expected project state and screenshots to capture
- Screenshot of a completed Skill Gap Report for a real test resume
- Screenshot of the corresponding Prep Plan
- Screenshot of the `skill_reports` table row in Supabase

### ➡️ Handoff notes for next day
The AI can now turn a saved resume into a Skill Gap Report + Prep Plan, both displayed and persisted. Day 5 builds the tagged question bank and the logic that selects mock interview questions based on the gaps identified today.

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
