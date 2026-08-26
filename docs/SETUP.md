# Setup Guide — AI Career & Interview Copilot

Version 1.0 | Day 3 Deliverable

This guide documents everything needed to get the project running locally from a fresh clone. Follow this if setting up the project on a new machine, or if you need to re-verify your own setup.

---

## 1. Prerequisites

| Tool | Minimum Version | Confirmed Working Version (this project) | Purpose |
|---|---|---|---|
| Node.js | 18+ | 22.19.0 | JavaScript runtime for both frontend build tools and the backend server |
| npm | bundled with Node | 10.9.3 | Installs and manages all project dependencies |
| Git | any recent | 2.50.1 | Version control, connects to GitHub |
| VS Code (or any code editor) | any recent | — | Editing code, integrated terminal |

**Check your versions** by running these in a terminal:
```
node --version
npm --version
git --version
```

---

## 2. Clone the Repository

```
git clone https://github.com/madhuradarshinirm/ai-career-copilot.git
cd ai-career-copilot
```

---

## 3. Frontend Setup

```
cd frontend
npm install
```

This installs: `react`, `react-dom`, `react-router-dom`, `@supabase/supabase-js`, `pdfjs-dist`, and Vite's build tooling.

**Create `frontend/.env`** (see `ENVIRONMENT.md` for exact variable names and where to find each value):
```
VITE_SUPABASE_URL=<your_supabase_project_url>
VITE_SUPABASE_ANON_KEY=<your_supabase_publishable_key>
VITE_API_BASE_URL=http://localhost:5000
```

**Run the frontend dev server:**
```
npm run dev
```
Visit `http://localhost:5173` — you should see the app load.

---

## 4. Backend Setup

Open a **second terminal**, from the project root:
```
cd backend
npm install
```

This installs: `express`, `cors`, `dotenv`, `@supabase/supabase-js`.

**Create `backend/.env`** (see `ENVIRONMENT.md`):
```
SUPABASE_URL=<your_supabase_project_url>
SUPABASE_SERVICE_ROLE_KEY=<your_supabase_secret_key>
GEMINI_API_KEY=<your_google_gemini_api_key>
PORT=5000
```

**Run the backend server:**
```
node index.js
```
Visit `http://localhost:5000` — you should see `{"message":"AI Career Copilot backend is running"}`.

---

## 5. Supabase Project Setup (one-time, already completed for this project)

If setting this project up fresh (new Supabase project), you would:

1. Go to [supabase.com](https://supabase.com), create a new project named `ai-career-copilot`, choose the Free tier and a nearby region.
2. Open the **SQL Editor**, paste and run the full schema SQL from `SCHEMA.md` (creates all 5 tables + Row Level Security policies).
3. Go to **Authentication → Providers**, confirm **Email** is enabled.
4. Go to **Settings → API Keys**, copy the **Project URL**, **Publishable key**, and **Secret key** into your `.env` files as shown above.

*For this project, this step is already complete — see `docs/PROJECT-LOG.md` for confirmation.*

---

## 6. Google Gemini API Key (one-time)

1. Go to [aistudio.google.com](https://aistudio.google.com).
2. Sign in with a Google account.
3. Click "Get API key" and create a new key (free tier).
4. Copy the key into `backend/.env` as `GEMINI_API_KEY`.

*For this project, this step is already complete.*

---

## 7. Running the Full App Locally

You need **both** servers running simultaneously, in two separate terminals:

**Terminal 1 (frontend):**
```
cd frontend
npm run dev
```

**Terminal 2 (backend):**
```
cd backend
node index.js
```

Then open `http://localhost:5173` in your browser.

---

## 8. Verifying Everything Works

- [ ] Frontend loads at `localhost:5173` without console errors
- [ ] Backend responds at `localhost:5000` with the running-confirmation message
- [ ] Supabase project shows 5 tables in Table Editor, RLS enabled
- [ ] Supabase Auth shows Email provider enabled
- [ ] Both `.env` files exist and are correctly filled (never commit these — confirmed gitignored)

---

## 9. Troubleshooting

| Problem | Likely Cause | Fix |
|---|---|---|
| Frontend shows blank page | `.env` values missing or typo'd | Double-check `VITE_` prefix on all frontend env vars |
| Backend crashes on `node index.js` | Missing `"type": "module"` in `backend/package.json` | Add it manually, right after `"main"` |
| CORS error when frontend calls backend | Backend `cors()` middleware not applied, or backend not running | Confirm `app.use(cors())` is present in `index.js` |
| Supabase insert fails silently | RLS policy blocking the write | Confirm you're logged in (RLS checks `auth.uid()`), or re-check policy SQL |
| "Cannot find module" errors | Dependencies not installed in that folder | Re-run `npm install` in the specific folder (`frontend` or `backend`) |
