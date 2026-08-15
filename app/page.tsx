import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="inline-flex items-center gap-2 rounded-full bg-primary-light px-4 py-1.5 mb-8">
        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        <span className="text-sm font-medium text-primary">
          AI-Powered Learning
        </span>
      </div>

      <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-foreground mb-6">
        StudySpark
      </h1>

      <p className="max-w-2xl text-lg leading-8 text-muted mb-10">
        Transform your notes and textbooks into smart flashcards instantly.
        Powered by AI, designed for learners who want to study efficiently and
        remember more.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/generate"
          className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-medium text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Generate Flashcards
        </Link>
        <Link
          href="/study"
          className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-card px-8 text-base font-medium text-foreground transition-colors hover:bg-primary-light"
        >
          Start Studying
        </Link>
      </div>

      <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
        <div className="rounded-xl border border-border bg-card p-6 text-left">
          <div className="h-10 w-10 rounded-lg bg-primary-light flex items-center justify-center mb-4">
            <svg
              className="h-5 w-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-foreground mb-2">AI Generation</h3>
          <p className="text-sm text-muted">
            Paste any text and let AI create high-quality flashcards for you.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 text-left">
          <div className="h-10 w-10 rounded-lg bg-primary-light flex items-center justify-center mb-4">
            <svg
              className="h-5 w-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-foreground mb-2">Smart Review</h3>
          <p className="text-sm text-muted">
            Spaced repetition algorithm helps you remember long-term.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 text-left">
          <div className="h-10 w-10 rounded-lg bg-primary-light flex items-center justify-center mb-4">
            <svg
              className="h-5 w-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-foreground mb-2">Track Progress</h3>
          <p className="text-sm text-muted">
            See your improvement with detailed stats and analytics.
          </p>
        </div>
      </div>
    </div>
  );
}
