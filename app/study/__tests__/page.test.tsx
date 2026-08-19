import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import StudyPage from "../page";

const sampleCards = [
  { question: "What is H2O?", answer: "Water" },
  { question: "What is the boiling point of water?", answer: "100°C" },
];

describe("Study page", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("shows an empty state with a link to Generate when no flashcards are stored", async () => {
    render(<StudyPage />);
    expect(
      await screen.findByRole("heading", { name: /no flashcards yet/i })
    ).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /generate flashcards/i });
    expect(link).toHaveAttribute("href", "/generate");
  });

  it("loads stored flashcards and shows the first question", async () => {
    sessionStorage.setItem(
      "studyspark:flashcards",
      JSON.stringify(sampleCards)
    );
    render(<StudyPage />);

    expect(await screen.findByText(/card 1 of 2/i)).toBeInTheDocument();
    expect(screen.getByText("What is H2O?")).toBeInTheDocument();
  });

  it("flips the card to reveal the answer", async () => {
    sessionStorage.setItem(
      "studyspark:flashcards",
      JSON.stringify(sampleCards)
    );
    const user = userEvent.setup();
    render(<StudyPage />);

    await screen.findByText("What is H2O?");

    const flipButton = screen.getByRole("button", { name: /^flip$/i });
    await user.click(flipButton);

    expect(screen.getByText("Water")).toBeInTheDocument();
  });

  it("moves to the next and previous cards correctly", async () => {
    sessionStorage.setItem(
      "studyspark:flashcards",
      JSON.stringify(sampleCards)
    );
    const user = userEvent.setup();
    render(<StudyPage />);

    await screen.findByText("What is H2O?");

    await user.click(screen.getByRole("button", { name: /next/i }));
    await waitFor(() => {
      expect(
        screen.getByText("What is the boiling point of water?")
      ).toBeInTheDocument();
    });
    expect(screen.getByText(/card 2 of 2/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /previous/i }));
    await waitFor(() => {
      expect(screen.getByText("What is H2O?")).toBeInTheDocument();
    });
    expect(screen.getByText(/card 1 of 2/i)).toBeInTheDocument();
  });
});
