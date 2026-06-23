/**
 * Tests for the LandingSections component.
 *
 * LandingSections renders four static explanatory sections below the grid:
 *   1. What Lineup is
 *   2. How it's built
 *   3. Where the data comes from
 *   4. How to contribute (incl. a link to the repository)
 *
 * The component is purely presentational — no props, no comparison data
 * dependency.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LandingSections } from "./LandingSections";

describe("LandingSections", () => {
  describe("section headings", () => {
    it("renders a heading for the 'What is Lineup?' section", () => {
      render(<LandingSections />);
      expect(
        screen.getByRole("heading", { name: /what is lineup/i })
      ).toBeDefined();
    });

    it("renders a heading for the 'How it's built' section", () => {
      render(<LandingSections />);
      expect(
        screen.getByRole("heading", { name: /how it.?s built/i })
      ).toBeDefined();
    });

    it("renders a heading for the 'Where the data comes from' section", () => {
      render(<LandingSections />);
      expect(
        screen.getByRole("heading", { name: /where the data comes from/i })
      ).toBeDefined();
    });

    it("renders a heading for the 'How to contribute' section", () => {
      render(<LandingSections />);
      expect(
        screen.getByRole("heading", { name: /how to contribute/i })
      ).toBeDefined();
    });

    it("renders all four headings in a single pass", () => {
      render(<LandingSections />);
      const headings = screen.getAllByRole("heading");
      const texts = headings.map((h) => h.textContent?.toLowerCase() ?? "");
      expect(texts.some((t) => t.includes("lineup"))).toBe(true);
      expect(texts.some((t) => t.includes("built"))).toBe(true);
      expect(texts.some((t) => t.includes("data"))).toBe(true);
      expect(texts.some((t) => t.includes("contribute"))).toBe(true);
    });
  });

  describe("repository link", () => {
    it("renders a link that points to the GitHub repository", () => {
      render(<LandingSections />);
      const repoLink = screen.getByRole("link", { name: /github/i });
      expect(repoLink).toBeDefined();
      expect(repoLink.getAttribute("href")).toMatch(
        /github\.com\/[^/]+\/lineup/i
      );
    });

    it("opens the repository link in a new tab", () => {
      render(<LandingSections />);
      const repoLink = screen.getByRole("link", { name: /github/i });
      expect(repoLink.getAttribute("target")).toBe("_blank");
    });

    it("includes rel=noopener on the external repository link", () => {
      render(<LandingSections />);
      const repoLink = screen.getByRole("link", { name: /github/i });
      expect(repoLink.getAttribute("rel")).toContain("noopener");
    });
  });

  describe("resilience", () => {
    it("renders without any props (no comparison data dependency)", () => {
      // Should not throw or require external data
      expect(() => render(<LandingSections />)).not.toThrow();
    });

    it("renders content describing the static/build-time architecture", () => {
      render(<LandingSections />);
      // The "How it's built" section should mention static or build-time approach
      expect(document.body.textContent?.toLowerCase()).toMatch(
        /static|build.time|compiled/i
      );
    });

    it("renders content describing the AI-assisted research workflow", () => {
      render(<LandingSections />);
      // The contribute/data section should mention AI or RESEARCH.md
      expect(document.body.textContent?.toLowerCase()).toMatch(
        /ai.assisted|research\.md|gather.data/i
      );
    });
  });
});
