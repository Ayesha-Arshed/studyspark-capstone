import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HealthPage from "../page";

describe("Health page", () => {
  it("renders the System Health heading", async () => {
    const ui = await HealthPage();
    render(ui);
    expect(
      screen.getByRole("heading", { name: /system health/i })
    ).toBeInTheDocument();
  });

  it("renders all expected service status rows", async () => {
    const ui = await HealthPage();
    render(ui);

    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("operational")).toBeInTheDocument();

    expect(screen.getByText("Database")).toBeInTheDocument();
    expect(screen.getByText("connected")).toBeInTheDocument();

    expect(screen.getByText("API Server")).toBeInTheDocument();
    expect(screen.getByText("responding")).toBeInTheDocument();
  });

  it("renders a last checked timestamp", async () => {
    const ui = await HealthPage();
    render(ui);
    expect(screen.getByText(/last checked:/i)).toBeInTheDocument();
  });
});
