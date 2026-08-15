export default function StudyPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="h-16 w-16 rounded-2xl bg-primary-light flex items-center justify-center mb-8">
        <svg
          className="h-8 w-8 text-primary"
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

      <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
        Study Flashcards
      </h1>

      <p className="max-w-md text-lg text-muted mb-4">
        Flashcard review coming soon
      </p>

      <div className="mt-8 rounded-xl border-2 border-border bg-card shadow-sm p-16 max-w-md">
        <div className="text-muted italic">Your flashcard will appear here.</div>
        <div className="mt-6 flex justify-center gap-3">
          <div className="h-10 w-24 rounded-lg bg-primary-light" />
          <div className="h-10 w-24 rounded-lg bg-primary-light" />
          <div className="h-10 w-24 rounded-lg bg-primary-light" />
        </div>
      </div>
    </div>
  );
}
