/**
 * Tests for the redesigned HomePage component.
 *
 * HomePage renders comparisons grouped under named headings using
 * getGroupedComparisons(). It uses ComparisonTile (with TileBackground)
 * for each tile and excludes hidden comparisons.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HomePage } from "./HomePage";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("@/lib/data", () => ({
  getGroupedComparisons: vi.fn(),
}));

vi.mock("@/lib/tiles", () => ({
  getTileUrl: vi.fn(),
}));

import { getGroupedComparisons } from "@/lib/data";
import { getTileUrl } from "@/lib/tiles";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeGroup(id: string, name: string, order: number) {
  return { id, name, order };
}

function makeComparison(
  id: string,
  name: string,
  description: string,
  groupId: string
) {
  return { id, name, description, groupId };
}

function renderHomePage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );
}

// ---------------------------------------------------------------------------
// Test Data
// ---------------------------------------------------------------------------

const groupDatabases = makeGroup("databases", "Databases", 1);
const groupWebFrontend = makeGroup("web-frontend", "Web & Frontend", 2);
const groupAiDev = makeGroup("ai-dev", "AI & Dev Workflow", 3);
const groupRust = makeGroup("rust", "Rust", 4);
const groupHardware = makeGroup("hardware", "Hardware", 5);
const groupMedia = makeGroup("media", "Audio & Media", 6);

const compDb1 = makeComparison(
  "databases",
  "Databases",
  "Database management systems",
  "databases"
);
const compDb2 = makeComparison(
  "distributed-databases",
  "Distributed Databases",
  "Distributed database systems",
  "databases"
);
const compWeb1 = makeComparison(
  "spa-web-frameworks",
  "SPA Web Frameworks",
  "Frontend frameworks for SPAs",
  "web-frontend"
);
const compAi1 = makeComparison(
  "ai-coding-agents",
  "AI Coding Agents",
  "AI-assisted coding tools",
  "ai-dev"
);
const compRust1 = makeComparison(
  "rust-gui",
  "Rust GUI",
  "GUI frameworks for Rust",
  "rust"
);
const compHw1 = makeComparison(
  "sbc",
  "Single-board Computers",
  "Compact computing boards",
  "hardware"
);
const compMedia1 = makeComparison(
  "audio-transcription",
  "Audio Transcription",
  "Speech-to-text tools",
  "media"
);

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("HomePage", () => {
  beforeEach(() => {
    vi.mocked(getTileUrl).mockReturnValue(null);
  });

  describe("group headings", () => {
    it("renders a heading for each non-empty group in order", () => {
      vi.mocked(getGroupedComparisons).mockReturnValue([
        { group: groupDatabases, comparisons: [compDb1] },
        { group: groupWebFrontend, comparisons: [compWeb1] },
      ]);

      renderHomePage();

      const headings = screen.getAllByRole("heading", { level: 2 });
      const headingTexts = headings.map((h) => h.textContent);
      expect(headingTexts).toContain("Databases");
      expect(headingTexts).toContain("Web & Frontend");
    });

    it("renders groups in the order returned by getGroupedComparisons", () => {
      vi.mocked(getGroupedComparisons).mockReturnValue([
        { group: groupDatabases, comparisons: [compDb1] },
        { group: groupWebFrontend, comparisons: [compWeb1] },
      ]);

      renderHomePage();

      const headings = screen.getAllByRole("heading", { level: 2 });
      const headingTexts = headings.map((h) => h.textContent);
      const dbIdx = headingTexts.indexOf("Databases");
      const webIdx = headingTexts.indexOf("Web & Frontend");
      expect(dbIdx).toBeLessThan(webIdx);
    });
  });

  describe("comparison tiles", () => {
    it("renders a link to /<id> for each comparison", () => {
      vi.mocked(getGroupedComparisons).mockReturnValue([
        { group: groupDatabases, comparisons: [compDb1, compDb2] },
      ]);

      renderHomePage();

      const dbLink = screen.getByRole("link", { name: "Databases" });
      expect(dbLink).toBeDefined();
      expect(dbLink.getAttribute("href")).toBe("/databases");

      const distLink = screen.getByRole("link", {
        name: "Distributed Databases",
      });
      expect(distLink.getAttribute("href")).toBe("/distributed-databases");
    });

    it("renders each comparison's name and description", () => {
      vi.mocked(getGroupedComparisons).mockReturnValue([
        { group: groupDatabases, comparisons: [compDb1] },
      ]);

      renderHomePage();

      // The tile name appears inside the card (CardTitle)
      expect(screen.getByText("Database management systems")).toBeDefined();
      // Link is accessible by its aria-label which matches the comparison name
      expect(screen.getByRole("link", { name: "Databases" })).toBeDefined();
    });

    it("renders a TileBackground when a tile URL is available", () => {
      vi.mocked(getTileUrl).mockImplementation((id) =>
        id === "databases" ? "/assets/databases-tile.svg" : null
      );
      vi.mocked(getGroupedComparisons).mockReturnValue([
        { group: groupDatabases, comparisons: [compDb1] },
      ]);

      const { container } = renderHomePage();

      // TileBackground renders an img with empty alt (decorative)
      const img = container.querySelector("img[alt='']");
      expect(img).not.toBeNull();
      expect(img!.getAttribute("aria-hidden")).toBe("true");
    });

    it("renders the tile cleanly with no broken image when no tile URL exists", () => {
      vi.mocked(getTileUrl).mockReturnValue(null);
      vi.mocked(getGroupedComparisons).mockReturnValue([
        { group: groupDatabases, comparisons: [compDb1] },
      ]);

      const { container } = renderHomePage();

      // No img element at all when url is null
      const imgs = container.querySelectorAll("img");
      expect(imgs.length).toBe(0);
    });

    it("renders TileBackground only for comparisons that have a tile URL (mixed batch)", () => {
      // Simulate the first-batch scenario: one tile per group, others untiled
      vi.mocked(getTileUrl).mockImplementation((id) => {
        const tiled = new Set([
          "databases",
          "spa-web-frameworks",
          "ai-coding-agents",
          "rust-gui",
          "sbc",
          "audio-transcription",
        ]);
        return tiled.has(id) ? `/assets/${id}-tile.svg` : null;
      });
      vi.mocked(getGroupedComparisons).mockReturnValue([
        { group: groupDatabases, comparisons: [compDb1, compDb2] },
        { group: groupWebFrontend, comparisons: [compWeb1] },
        { group: groupAiDev, comparisons: [compAi1] },
        { group: groupRust, comparisons: [compRust1] },
        { group: groupHardware, comparisons: [compHw1] },
        { group: groupMedia, comparisons: [compMedia1] },
      ]);

      const { container } = renderHomePage();

      // databases has a tile but distributed-databases does not
      // so we expect 6 imgs (one for each tiled comparison)
      const imgs = container.querySelectorAll("img[alt=''][aria-hidden='true']");
      expect(imgs.length).toBe(6);
    });
  });

  describe("hidden comparisons", () => {
    it("does not render the test comparison (hidden)", () => {
      // getGroupedComparisons already excludes hidden — this verifies the
      // component only renders what it receives (no extra filtering needed)
      vi.mocked(getGroupedComparisons).mockReturnValue([
        { group: groupDatabases, comparisons: [compDb1] },
      ]);

      renderHomePage();

      expect(screen.queryByText("Test Comparison")).toBeNull();
    });
  });

  describe("empty state", () => {
    it("shows 'No comparisons available' when there are no groups", () => {
      vi.mocked(getGroupedComparisons).mockReturnValue([]);

      renderHomePage();

      expect(screen.getByText(/No comparisons available/i)).toBeDefined();
    });
  });

  describe("hero block", () => {
    it("renders the main site heading", () => {
      vi.mocked(getGroupedComparisons).mockReturnValue([]);

      renderHomePage();

      expect(screen.getByRole("heading", { level: 1 })).toBeDefined();
    });
  });

  describe("explanatory sections", () => {
    it("renders all four LandingSections headings when grid is empty", () => {
      vi.mocked(getGroupedComparisons).mockReturnValue([]);

      renderHomePage();

      const texts = screen
        .getAllByRole("heading")
        .map((h) => h.textContent?.toLowerCase() ?? "");
      expect(texts.some((t) => t.includes("lineup"))).toBe(true);
      expect(texts.some((t) => t.includes("built"))).toBe(true);
      expect(texts.some((t) => t.includes("data"))).toBe(true);
      expect(texts.some((t) => t.includes("contribute"))).toBe(true);
    });

    it("renders all four LandingSections headings even when the grid has content", () => {
      vi.mocked(getGroupedComparisons).mockReturnValue([
        { group: groupDatabases, comparisons: [compDb1] },
      ]);

      renderHomePage();

      const texts = screen
        .getAllByRole("heading")
        .map((h) => h.textContent?.toLowerCase() ?? "");
      expect(texts.some((t) => t.includes("lineup"))).toBe(true);
      expect(texts.some((t) => t.includes("built"))).toBe(true);
      expect(texts.some((t) => t.includes("data"))).toBe(true);
      expect(texts.some((t) => t.includes("contribute"))).toBe(true);
    });

    it("renders the repository link in the page", () => {
      vi.mocked(getGroupedComparisons).mockReturnValue([]);

      renderHomePage();

      const repoLink = screen.getByRole("link", { name: /github/i });
      expect(repoLink.getAttribute("href")).toMatch(
        /github\.com\/[^/]+\/lineup/i
      );
    });
  });
});