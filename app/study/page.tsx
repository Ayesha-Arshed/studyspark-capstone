"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Flashcard } from "../api/generate/route";

export default function StudyPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[] | null>(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("studyspark:flashcards");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFlashcards(parsed);
          return;
        }
      } catch {
        // fall through to empty state
      }
    }
    setFlashcards([]);
  }, []);

  function handleFlip() {
    setFlipped((f) => !f);
  }

  function handleNext() {
    if (!flashcards) return;
    setFlipped(false);
    setIndex((i) => (i + 1) % flashcards.length);
  }

  function handlePrev() {
    if (!flashcards) return;
    setFlipped(false);
    setIndex((i) => (i - 1 + flashcards.length) % flashcards.length);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleFlip();
    }
  }

  if (flashcards === null) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted">Loading your flashcards...</p>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
          No flashcards yet
        </h1>
        <p className="max-w-md text-lg text-muted mb-8">
          Generate a set of flashcards first, then come back here to study them.
        </p>
        <Link
          href="/generate"
          className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-medium text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Generate Flashcards
        </Link>
      </div>
    );
  }

  const card = flashcards[index];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
        Study Flashcards
      </h1>
      <p className="text-muted mb-10">
        Card {index + 1} of {flashcards.length}
      </p>

      <div
        role="button"
        tabIndex={0}
        onClick={handleFlip}
        onKeyDown={handleKeyDown}
        aria-pressed={flipped}
        aria-label={flipped ? "Showing answer. Press to show question." : "Showing question. Press to show answer."}
        className="mt-2 flex min-h-[220px] w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-border bg-card shadow-sm p-10 transition-colors hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <p className="text-xs font-medium text-primary mb-4 uppercase tracking-wide">
          {flipped ? "Answer" : "Question"}
        </p>
        <p className="text-lg text-foreground">
          {flipped ? card.answer : card.question}
        </p>
        <p className="mt-6 text-xs text-muted">Click or press Enter to flip</p>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <button
          onClick={handlePrev}
          className="h-10 rounded-lg border border-border bg-card px-6 text-sm font-medium text-foreground transition-colors hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Previous
        </button>
        <button
          onClick={handleFlip}
          className="h-10 rounded-lg bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Flip
        </button>
        <button
          onClick={handleNext}
          className="h-10 rounded-lg border border-border bg-card px-6 text-sm font-medium text-foreground transition-colors hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Next
        </button>
      </div>

      <Link
        href="/generate"
        className="mt-10 text-sm text-primary hover:text-primary-hover font-medium"
      >
        Generate a new set
      </Link>
    </div>
  );
}