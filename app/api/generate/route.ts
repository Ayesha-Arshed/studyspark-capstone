export interface Flashcard {
  question: string;
  answer: string;
}

interface GenerateRequest {
  notes?: string;
}

interface GeminiSuccessResponse {
  flashcards: Flashcard[];
  error?: never;
}

interface GeminiErrorResponse {
  flashcards: [];
  error: string;
}

type GeminiParsedResponse = GeminiSuccessResponse | GeminiErrorResponse;

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent";

const SYSTEM_INSTRUCTION = `You are a flashcard generator. Given study notes or a topic, create high-quality flashcards.

Rules:
- Return ONLY valid JSON, no markdown fences, no extra text.
- JSON shape: { "flashcards": [{ "question": "...", "answer": "..." }] }
- Generate 5-10 flashcards depending on content length (more content = more cards).
- Each answer should be concise, 1-3 sentences maximum.
- Questions should test understanding, not just memorization of facts.
- If the input is too vague, empty, nonsensical, or too short to create meaningful flashcards, return: { "flashcards": [], "error": "explanation of why the input was insufficient" }
`;

interface GeminiPart {
  text?: string;
}

interface GeminiContent {
  parts?: GeminiPart[];
}

interface GeminiCandidate {
  content?: GeminiContent;
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
}

function extractGeminiText(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;
  const resp = data as GeminiResponse;
  if (!resp.candidates || !Array.isArray(resp.candidates)) return undefined;

  const candidate = resp.candidates[0];
  if (!candidate || typeof candidate !== "object") return undefined;

  const content = candidate.content;
  if (!content || typeof content !== "object") return undefined;

  const parts = content.parts;
  if (!parts || !Array.isArray(parts)) return undefined;

  const firstPart = parts[0];
  if (!firstPart || typeof firstPart !== "object") return undefined;

  const text = firstPart.text;
  return typeof text === "string" ? text : undefined;
}

export async function POST(request: Request) {
  let body: GenerateRequest;
  try {
    body = (await request.json()) as GenerateRequest;
  } catch {
    return Response.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const notes = body.notes;

  if (typeof notes !== "string" || notes.trim().length === 0) {
    return Response.json(
      { error: "Missing or empty 'notes' field — please provide study notes or a topic." },
      { status: 400 }
    );
  }

  if (notes.length > 8000) {
    return Response.json(
      { error: `Notes too long — ${notes.length} characters exceeds the 8000 character limit.` },
      { status: 400 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Server configuration error: GEMINI_API_KEY is not set." },
      { status: 500 }
    );
  }

  const url = `${GEMINI_URL}?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          role: "user",
          parts: [
            {
              text: SYSTEM_INSTRUCTION,
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: notes,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json",
        },
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      return Response.json(
        {
          error: `Gemini API returned status ${response.status}${
            errorText ? `: ${errorText.slice(0, 500)}` : ""
          }`,
        },
        { status: 502 }
      );
    }

    let data: unknown;
    try {
      data = await response.json();
    } catch {
      return Response.json(
        { error: "Gemini API returned a non-JSON response." },
        { status: 502 }
      );
    }

    const rawText = extractGeminiText(data);

    if (!rawText || typeof rawText !== "string") {
      return Response.json(
        { error: "Gemini API response did not contain generated text." },
        { status: 502 }
      );
    }

      let parsed: GeminiParsedResponse;
    try {
      const cleanedText = rawText
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();
      parsed = JSON.parse(cleanedText) as GeminiParsedResponse;
    }  catch (parseErr){
      return Response.json(
         { 
          error: "Failed to parse flashcard JSON from Gemini response.",
          debug_raw: rawText.slice(0, 1000)
        },
        { status: 502 }
       
      );
    }

    if (
      !parsed ||
      typeof parsed !== "object" ||
      !("flashcards" in parsed) ||
      !Array.isArray(parsed.flashcards)
    ) {
      return Response.json(
        { error: "Gemini response is missing the required 'flashcards' array." },
        { status: 502 }
      );
    }

    if ("error" in parsed && parsed.error) {
      if (parsed.flashcards.length === 0) {
        return Response.json(
          { flashcards: [], error: parsed.error },
          { status: 200 }
        );
      }
    }

    const validFlashcards: Flashcard[] = parsed.flashcards.filter(
      (card): card is Flashcard =>
        card &&
        typeof card === "object" &&
        "question" in card &&
        "answer" in card &&
        typeof (card as { question?: unknown }).question === "string" &&
        (card as { question: string }).question.trim().length > 0 &&
        typeof (card as { answer?: unknown }).answer === "string" &&
        (card as { answer: string }).answer.trim().length > 0
    );

    return Response.json(
      { flashcards: validFlashcards },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof DOMException && err.name === "TimeoutError") {
      return Response.json(
        { error: "Flashcard generation timed out after 30 seconds." },
        { status: 504 }
      );
    }

    return Response.json(
      {
        error:
          err instanceof Error && err.message
            ? `Unexpected error: ${err.message}`
            : "Unexpected server error during flashcard generation.",
      },
      { status: 500 }
    );
  }
}
