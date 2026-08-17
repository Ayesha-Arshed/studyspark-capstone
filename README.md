# StudySpark 🎴

AI-powered study flashcard generator — paste your notes or a topic, and StudySpark turns them into ready-to-study flashcards.

**Live app:** [studyspark-capstone.vercel.app](https://studyspark-capstone.vercel.app)

Built as part of the FlyRank AI Internship — Frontend AI Engineering Track (assignments FE-05 through FE-11 all build on this codebase, culminating in a final capstone submission).

## Tech Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Vercel (auto-deploys from `main`)
- **AI:** Google Gemini API (flashcard generation via Next.js API route)

## Project Status

🚧 In active development. Current milestone: **Final capstone — AI integration complete, working toward production readiness (testing, accessibility, deployment).**

### What's built so far
- Home page with hero, feature highlights, and CTA buttons
- `/generate` — AI-powered flashcard generation page, calling Gemini via a Next.js API route
- `/study` — flashcard study/review page with flip-card navigation
- `/health` — health-check page verifying server-side data fetching, with mock data and status indicators
- Responsive nav bar and base Tailwind design system

### Roadmap

- **FE-07 – FE-11:** Additional features building toward a production-ready app (details TBD as each assignment is scoped)
- **FE-12:** Final case study and capstone submission — live URL, README, AI integration write-up, ≥50% test coverage, Lighthouse ≥85, WCAG AA compliance, deployment checklist, and written reflection

## Getting Started (local dev)

```bash
git clone https://github.com/Ayesha-Arshed/studyspark-capstone.git
cd studyspark-capstone
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it locally.

## Author

**Ayesha Arshed**
[GitHub](https://github.com/Ayesha-Arshed) · [LinkedIn](https://linkedin.com/in/Ayesha-Arshed)
