import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "--font-geist-sans" }),
  Geist_Mono: () => ({ variable: "--font-geist-mono" }),
}));

import RootLayout, { metadata } from "../layout";

describe("RootLayout", () => {
  it("exports the correct page metadata", () => {
    expect(metadata.title).toBe("StudySpark - AI Flashcard Generator");
    expect(metadata.description).toBe(
      "Generate and study flashcards with AI"
    );
  });

  it("renders the Navbar", () => {
    render(
      <RootLayout>
        <p>Test child content</p>
      </RootLayout>
    );
    expect(screen.getByText("StudySpark")).toBeInTheDocument();
  });

  it("renders the children passed into it", () => {
    render(
      <RootLayout>
        <p>Test child content</p>
      </RootLayout>
    );
    expect(screen.getByText("Test child content")).toBeInTheDocument();
  });

  it("renders the footer copyright text", () => {
    render(
      <RootLayout>
        <p>Test child content</p>
      </RootLayout>
    );
    expect(
      screen.getByText(/studyspark\. learn smarter, not harder\./i)
    ).toBeInTheDocument();
  });
});
