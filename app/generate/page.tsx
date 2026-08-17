"use client";

import { useState } from "react";
import Link from "next/link";
import type { Flashcard } from "../api/generate/route";

type Status = "idle" | "loading" | "success" | "error";

export default function GeneratePage() {
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = notes.trim();
    if (!trimmed) {
      setStatus("error");
      setError("Please paste some notes or a topic first.");
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setError(data?.error || "Something went wrong. Please try again.");
        return;
      }

      setFlashcards(data.flashcards);
      setStatus("success");

      sessionStorage.setItem("studyspark:flashcards", JSON.stringify(data.flashcards));
    } catch {
      setStatus("error");
      setError("Couldn't reach the server. Check your connection and try again.");
    }
  }

  function handleReset() {
    setStatus("idle");
    setError(null);
    setFlashcards([]);
    setNotes("");
  }

  return (
    <div className="flex flex-col items-center py-16 px-4">
      <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4 text-center">
        Generate Flashcards
      </h1>
      <p className="max-w-md text-lg text-muted mb-10 text-center">
        Paste your notes, an article, or a topic — AI will turn it into
        ready-to-study flashcards.
      </p>

      {status !== "success" && (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl"
          aria-describedby={error ? "generate-error" : undefined}
        >
          <label htmlFor="notes" className="sr-only">
            Notes or topic
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={status === "loading"}
            rows={8}
            placeholder="Paste your notes, textbook excerpt, or just a topic like 'the French Revolution'..."
            className="w-full rounded-xl border border-border bg-card p-4 text-foreground shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
          />

          {error && (
            <p id="generate-error" role="alert" className="mt-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 text-base font-medium text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70"
          >
            {status === "loading" ? (
              <>
                <span
                  className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin"
                  aria-hidden="true"
                />
                Generating...
              </>
            ) : (
              "Generate Flashcards"
            )}
          </button>
        </form>
      )}

      {status === "success" && (
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <p className="text-foreground font-medium">
              {flashcards.length} flashcard{flashcards.length !== 1 ? "s" : ""} generated
            </p>
            <button
              onClick={handleReset}
              className="text-sm text-primary hover:text-primary-hover font-medium"
            >
              Start over
            </button>
          </div>

          <div className="grid gap-4 mb-8">
            {flashcards.map((card, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5 shadow-sm text-left">
                <p className="text-xs font-medium text-primary mb-1">Q{i + 1}</p>
                <p className="text-foreground font-medium mb-3">{card.question}</p>
                <p className="text-xs font-medium text-muted mb-1">Answer</p>
                <p className="text-muted">{card.answer}</p>
              </div>
            ))}
          </div>

          <Link
            href="/study"
            className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary px-8 text-base font-medium text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Study These Flashcards
          </Link>
        </div>
      )}
    </div>
  );
}