import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "../route";

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function geminiResponse(flashcards: unknown) {
  return {
    ok: true,
    json: async () => ({
      candidates: [
        {
          content: {
            parts: [{ text: JSON.stringify({ flashcards }) }],
          },
        },
      ],
    }),
  };
}

describe("POST /api/generate", () => {
  const originalKey = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    process.env.GEMINI_API_KEY = "test-key";
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    process.env.GEMINI_API_KEY = originalKey;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns 400 for invalid JSON body", async () => {
    const badRequest = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not valid json",
    });

    const res = await POST(badRequest);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/invalid json/i);
  });

  it("returns 400 when notes field is missing", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/missing or empty/i);
  });

  it("returns 400 when notes field is empty/whitespace", async () => {
    const res = await POST(makeRequest({ notes: "   " }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/missing or empty/i);
  });

  it("returns 400 when notes exceed the character limit", async () => {
    const res = await POST(makeRequest({ notes: "a".repeat(8001) }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/too long/i);
  });

  it("returns 500 when GEMINI_API_KEY is not set", async () => {
    delete process.env.GEMINI_API_KEY;
    const res = await POST(makeRequest({ notes: "Some valid notes" }));
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toMatch(/gemini_api_key is not set/i);
  });

  it("returns 502 when the Gemini API responds with a non-OK status", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 503,
      text: async () => "high demand",
    });

    const res = await POST(makeRequest({ notes: "Some valid notes" }));
    expect(res.status).toBe(502);
    const data = await res.json();
    expect(data.error).toMatch(/status 503/i);
  });

  it("returns 200 with parsed flashcards on a successful Gemini response", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      geminiResponse([
        { question: "What is 2+2?", answer: "4" },
        { question: "What is H2O?", answer: "Water" },
      ])
    );

    const res = await POST(makeRequest({ notes: "Basic math and chemistry" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.flashcards).toHaveLength(2);
    expect(data.flashcards[0]).toEqual({ question: "What is 2+2?", answer: "4" });
  });

  it("filters out malformed flashcard entries from the response", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      geminiResponse([
        { question: "Valid question?", answer: "Valid answer" },
        { question: "", answer: "Missing question text" },
        { question: "Missing answer" },
      ])
    );

    const res = await POST(makeRequest({ notes: "Some notes" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.flashcards).toHaveLength(1);
    expect(data.flashcards[0].question).toBe("Valid question?");
  });

  it("returns 502 when Gemini's response cannot be parsed as JSON", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [
          { content: { parts: [{ text: "this is not valid json {{{" }] } },
        ],
      }),
    });

    const res = await POST(makeRequest({ notes: "Some notes" }));
    expect(res.status).toBe(502);
    const data = await res.json();
    expect(data.error).toMatch(/failed to parse/i);
  });

  it("returns 500 with a clear message on an unexpected network error", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("fetch failed")
    );

    const res = await POST(makeRequest({ notes: "Some notes" }));
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toMatch(/unexpected error/i);
  });
});
