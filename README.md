# StudySpark 🎴

AI-powered study flashcard generator — paste your notes or a topic, and StudySpark turns them into ready-to-study flashcards.

**Live app:** [studyspark-capstone.vercel.app](https://studyspark-capstone.vercel.app)

Built as part of the FlyRank AI Internship — Frontend AI Engineering Track. This is the final capstone submission (Week 8: "Ship It — Your First Production AI Product").

## Tech Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Vercel (auto-deploys from `main`)
- **AI:** Google Gemini API (flashcard generation via a Next.js API route)
- **Testing:** Vitest + React Testing Library

## Project Status

✅ **Capstone complete.** Live, functional, AI-integrated, tested, and documented.

### What's built

- **Home (`/`)** — landing page with hero, feature highlights, and CTAs into the two main flows
- **Generate (`/generate`)** — paste notes or a topic, AI generates a set of flashcards via the Gemini API
- **Study (`/study`)** — flip-card review interface for the generated flashcard set (flip, next, previous)
- **Health (`/health`)** — server-rendered status page showing mock service health indicators
- **Navbar** — responsive navigation with a hamburger menu on mobile

## Architecture Overview

app/
├── page.tsx # Home page
├── layout.tsx # Root layout: wraps every page in Navbar + footer
├── generate/page.tsx # Generate flashcards UI — form, validation, API call, results
├── study/page.tsx # Study UI — reads flashcards from sessionStorage, flip/next/prev
├── health/page.tsx # Async server component, renders mock service status
└── api/generate/route.ts # POST handler — validates input, calls Gemini, parses/validates output

components/
└── Navbar.tsx # Client component — responsive nav with mobile hamburger menu


**Flow:** `Generate` page → user submits notes → client calls `POST /api/generate` → API route validates the input, calls the Gemini API with a system prompt, parses and validates the JSON response, returns clean flashcard data → client stores the result in `sessionStorage` → `Study` page reads from `sessionStorage` and renders the flip-card review UI.

## AI Integration

StudySpark uses the **Google Gemini API** (`gemini-3.5-flash`) to turn raw notes or a topic into structured flashcards.

**Why Gemini:** it offers a generous free tier and a native `responseMimeType: "application/json"` mode, which makes it straightforward to get back structured, parseable data instead of free-form text.

**The prompt (system instruction sent with every request):**
> You are a flashcard generator. Given study notes or a topic, create high-quality flashcards. Return ONLY valid JSON in the shape `{ "flashcards": [{ "question": "...", "answer": "..." }] }`. Generate 5–10 flashcards depending on content length. Each answer should be concise (1–3 sentences). Questions should test understanding, not just memorization. If the input is too vague or too short to produce meaningful flashcards, return an empty array with an explanatory `error` field instead of guessing.

**Why this design:** rather than a generic chatbot, the AI is scoped to one job — turning arbitrary study material into a fixed JSON structure the UI can render directly. The API route also validates and filters the AI's output (rejecting flashcards with missing questions/answers) so a malformed or partial AI response never breaks the UI.

## Error Handling & Resilience

- **Empty input** is caught client-side before any API call is made ("Please paste some notes or a topic first.")
- **Network failures** (offline, request can't reach the server) show a clear message: "Couldn't reach the server. Check your connection and try again."
- **Missing/invalid API key** on the server returns a clear 500 error rather than a silent failure
- **Upstream Gemini errors** (e.g. intermittent 503 "high demand" responses) are caught and surfaced with a specific status code (502) rather than crashing
- **Malformed AI output** (missing fields, broken JSON) is caught, and any invalid flashcard entries are filtered out rather than shown broken in the UI
- **Request timeout** — Gemini calls are capped at 30 seconds and time out gracefully rather than hanging indefinitely

All of the above are covered by automated tests in `app/api/generate/__tests__/route.test.ts`.

## Testing

```bash
npm test              # run all tests once
npm run test:watch    # run tests in watch mode
```

**Coverage: 7 of 7 components tested (100%)** — 32 tests total, all passing.

| File | Tests | Covers |
|---|---|---|
| `components/Navbar.tsx` | 3 | Nav links render, hamburger toggle, mobile menu closes on link click |
| `app/page.tsx` | 4 | Heading, links to Generate/Study, feature card headings |
| `app/generate/page.tsx` | 4 | Renders form, empty-input validation, successful generation, network error handling |
| `app/study/page.tsx` | 4 | Empty state, loads stored cards, flip reveals answer, next/previous navigation |
| `app/health/page.tsx` | 3 | Heading, service status rows, timestamp |
| `app/api/generate/route.ts` | 10 | Input validation, missing API key, upstream errors, successful parsing, malformed data filtering, network errors |
| `app/layout.tsx` | 4 | Metadata, Navbar renders, children render, footer renders |

## Performance & Accessibility

Audited in Chrome Incognito (no extensions) against the production deployment:

- **Lighthouse Performance:** 85
- **Lighthouse Accessibility:** 100
- **Lighthouse Best Practices:** 100
- **Lighthouse SEO:** 100
- **WAVE:** 0 errors across all pages

One concrete fix made from the audit: the homepage originally skipped a heading level (`h1` → `h3` on feature cards). This was corrected to `h1` → `h2` to fix the heading hierarchy for screen reader users.

## Deployment & Rollback

Deployed on Vercel, auto-deploying from `main`. See [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md) for the full sign-off checklist.

**Rollback plan:** in the Vercel dashboard, go to Deployments, find the last known-good deployment, and use "Promote to Production" to instantly roll back — no code changes required. Separately, revert the breaking commit locally (`git revert <hash>` → `git push`) so `main` matches what's live.

## Known Limitations & Future Improvements

- No third-party monitoring/alerting is configured beyond Vercel's built-in deployment status — a future improvement would be adding uptime monitoring or error tracking (e.g. Sentry)
- The `GEMINI_API_KEY` environment variable is currently only set for the Production environment on Vercel, not Preview/Development
- Flashcards are stored in `sessionStorage`, so a generated set is lost if the browser tab is closed — a future improvement would be persisting sets (e.g. to local storage or a database) so users can return to past study sessions
- No spaced-repetition or progress-tracking logic yet, despite the homepage referencing "Track Progress" as a feature — this is a natural next feature to build

## Getting Started (local dev)

**1. Clone and install:**

```bash
git clone https://github.com/Ayesha-Arshed/studyspark-capstone.git
cd studyspark-capstone
npm install
```

**2. Set up your API key:**

Create a file named `.env.local` in the project root with:

GEMINI_API_KEY=your_gemini_api_key_here


Get a free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey). Without this, `/generate` will return a server configuration error.

**3. Run the dev server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it locally.

## Author

**Ayesha Arshed**
[GitHub](https://github.com/Ayesha-Arshed) · [LinkedIn](https://linkedin.com/in/Ayesha-Arshed)
