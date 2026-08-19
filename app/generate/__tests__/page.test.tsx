import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import GeneratePage from "../page";

describe("Generate page", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("renders the heading and textarea", () => {
    render(<GeneratePage />);
    expect(
      screen.getByRole("heading", { name: /generate flashcards/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/notes or topic/i)).toBeInTheDocument();
  });

  it("shows a validation error when submitting empty input, without calling the API", async () => {
    const user = userEvent.setup();
    render(<GeneratePage />);

    const button = screen.getByRole("button", { name: /generate flashcards/i });
    await user.click(button);

    expect(
      await screen.findByText(/please paste some notes or a topic first/i)
    ).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("displays generated flashcards after a successful API response", async () => {
    const user = userEvent.setup();
    const mockFlashcards = [
      { question: "What is 2+2?", answer: "4" },
      { question: "What is the capital of France?", answer: "Paris" },
    ];

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ flashcards: mockFlashcards }),
    });

    render(<GeneratePage />);

    const textarea = screen.getByLabelText(/notes or topic/i);
    await user.type(textarea, "Some study notes about math and geography.");

    const button = screen.getByRole("button", { name: /generate flashcards/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/2 flashcards generated/i)).toBeInTheDocument();
    });

    expect(screen.getByText("What is 2+2?")).toBeInTheDocument();
    expect(screen.getByText("Paris")).toBeInTheDocument();
  });

  it("shows a network error message when the fetch call fails", async () => {
    const user = userEvent.setup();
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Network error")
    );

    render(<GeneratePage />);

    const textarea = screen.getByLabelText(/notes or topic/i);
    await user.type(textarea, "Some notes that will fail to send.");

    const button = screen.getByRole("button", { name: /generate flashcards/i });
    await user.click(button);

    expect(
      await screen.findByText(/couldn't reach the server/i)
    ).toBeInTheDocument();
  });
});
