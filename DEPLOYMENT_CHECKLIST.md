# StudySpark — Deployment Checklist (FE-11)

**Project:** StudySpark — AI-Powered Flashcard Generator
**Live URL:** https://studyspark-capstone.vercel.app
**Repository:** https://github.com/Ayesha-Arshed/studyspark-capstone
**Hosting:** Vercel (auto-deploys from `main` branch)
**Date signed off:** [FILL IN TODAY'S DATE]
**Signed off by:** Ayesha Arshed

---

## 1. Environment & Configuration

- [x] `GEMINI_API_KEY` set in Vercel → Project Settings → Environments → Production
- [x] API key marked as **Sensitive** (hidden after save)
- [x] Key exists in `.env.local` for local development and is **excluded from git** via `.gitignore`
- [x] Confirmed live app can reach the Gemini API without the "GEMINI_API_KEY is not set" error
- [ ] *(Optional, not required for this submission)* Same key added to Preview/Development environments

## 2. Build & Deploy

- [x] Production build (`npm run build`) completes with no errors
- [x] Deployment triggers automatically on push to `main` (Vercel Git integration)
- [x] Verified a manual redeploy from the Vercel dashboard works (used this to pick up the new env var)
- [x] No build warnings related to missing environment variables

## 3. Functional Verification (Production)

- [x] `/` (Home) loads correctly
- [x] `/generate` — pasted sample text, AI successfully generated flashcards
- [x] `/study` — flip, next, and previous controls all work correctly through a full set of cards
- [x] `/health` — health check page reachable
- [x] Full user flow tested end-to-end on the **live production URL**, not just localhost

## 4. Accessibility

- [x] WAVE audit: 0 errors on Home, /generate, /study, /health
- [x] Lighthouse Accessibility score: 100/100 on all pages
- [x] Heading hierarchy fixed (no skipped levels — h3s corrected to h2s on homepage feature cards)
- [x] Removed redundant duplicate navigation link (logo vs. "Home" link)
- [x] Site verified responsive from 344px (small mobile) to 820px (tablet) via Chrome DevTools device emulation

## 5. Performance

- [x] Lighthouse Performance score (Incognito, no browser extensions): **85**
- [x] Lighthouse Best Practices: 100
- [x] Lighthouse SEO: 100
- [x] Screenshot of Incognito Lighthouse run saved for submission evidence
- Note: dev-server and non-Incognito scores were lower (70–74) due to unminified dev code and browser extension interference (McAfee WebAdvisor, IDM, Instant Data Scraper) — real score confirmed in a clean Incognito environment

## 6. Error Handling & Resilience

- [x] Gemini API 503 ("high demand") errors tested and confirmed handled gracefully by the app's existing error handling — this is a known, intermittent Google-side issue, not an app bug
- [x] Missing/invalid API key previously surfaced a clear server configuration error message (now resolved)
- [x] **Empty input on `/generate`** — tested on production. Submitting with an empty text box does not fire an API call; the app shows a clear inline message: *"Please paste some notes or a topic first."*
- [x] **Network failure mid-generation** — tested on production using Chrome DevTools Network throttling set to "Offline." The request failed cleanly (no crash, no infinite spinner) and the app displayed: *"Couldn't reach the server. Check your connection and try again."* Restoring the connection and retrying succeeded normally.

## 7. Testing

- [x] Vitest + React Testing Library set up (`vitest.config.ts`, `vitest.setup.ts`)
- [x] `Navbar.test.tsx` — 3 passing tests: renders logo/nav links, hamburger menu toggle, mobile menu closes on link click
- [x] `page.test.tsx` (Home) — 4 passing tests: heading renders, links to Generate and Study pages work, all three feature card headings render
- [x] `page.test.tsx` (Generate) — 4 passing tests: renders heading/textarea, empty-input validation blocks the API call, successful generation displays flashcards, network failure shows a clear error message
- [x] `page.test.tsx` (Study) — 4 passing tests: empty state with link to Generate, loads stored flashcards, flip reveals answer, next/previous navigation works correctly
- [x] `page.test.tsx` (Health) — 3 passing tests: heading renders, all service status rows render, last-checked timestamp renders
- [x] `route.test.ts` (API — `/api/generate`) — 10 passing tests covering input validation, missing API key, upstream Gemini errors (bad status, malformed JSON), successful parsing, filtering malformed flashcard entries, and unexpected network errors
- [x] `layout.test.tsx` (RootLayout) — 4 passing tests: correct metadata, Navbar renders, children render, footer renders
- [x] `npm test` and `npm run test:watch` scripts added to `package.json`
- [x] **Test coverage: 7 of 7 components tested (100%)** — every component and the API route handler are covered
- [x] **32 total tests, all passing** — confirmed via `npm test -- --run`

## 8. Documentation

- [x] README updated to remove outdated references (no more FE-06 "streaming chat" / Claude API mentions — app correctly documents Google Gemini API usage)
- [x] README reflects current Tech Stack, Project Status, What's Built, and Roadmap
- [x] README includes an Architecture Overview explaining what each file/folder does
- [x] README explains the AI integration: model used, the exact prompt sent to Gemini, and the reasoning behind the design
- [x] README setup instructions include creating `.env.local` with `GEMINI_API_KEY` — closing the gap that originally caused the production bug this checklist documents fixing
- [x] README documents known limitations and future improvements honestly

## 9. Rollback Plan

**If a deployment breaks production:**

1. Go to Vercel → Deployments tab
2. Find the last known-good deployment (identified by commit message/timestamp)
3. Click the deployment's `⋯` menu → **"Promote to Production"** (or redeploy that specific commit)
4. This instantly points the production domain back to the working build — no code changes required
5. Separately, revert the breaking commit locally: `git revert <commit-hash>` → `git push`, so `main` matches what's live

**Monitoring:** Vercel's built-in deployment status (Ready/Error) and build logs are used to catch failed builds immediately. No third-party monitoring service is currently configured — noted as a known limitation.

## 10. Known Limitations (for README/reflection)

- No automated monitoring/alerting beyond Vercel's dashboard
- Environment variable currently only set for Production (not Preview/Development)
- Flashcards are stored in `sessionStorage` only — a generated set is lost if the browser tab is closed
- No spaced-repetition or progress-tracking logic yet, despite the homepage referencing "Track Progress" as a feature

---

**Sign-off:** This checklist was completed and verified against the live production deployment at studyspark-capstone.vercel.app on [DATE].
