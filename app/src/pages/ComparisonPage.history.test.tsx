/**
 * Regression tests for browser-back from a comparison page.
 *
 * ComparisonView notifies its parent of selection/sort/range-filter state in
 * mount effects. Those notifications write to the URL. When those writes push
 * history entries, arriving on a comparison page immediately stacks up several
 * near-identical entries, and the back button appears to do nothing — the user
 * has to press it three or four times to reach the landing page again.
 *
 * View state belongs in the URL (the URL is a shareable snapshot), but it is
 * not navigation: those writes must replace, not push.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { ComparisonPage } from "./ComparisonPage";
import type { AttributesFile, CandidateFile, CandidateEntry } from "@/types";

vi.mock("@/lib/data", () => ({
  getComparisonData: vi.fn(),
}));

import { getComparisonData } from "@/lib/data";

const attributes: AttributesFile = {
  name: "Test",
  groups: [
    {
      id: "general",
      name: "General",
      expandedByDefault: true,
      attributes: [{ id: "note", name: "Note", valueType: "text" }],
    },
  ],
};

const candidates: CandidateFile[] = [
  { name: "Alpha", values: { note: { value: "alpha-value" } } },
  { name: "Beta", values: { note: { value: "beta-value" } } },
];

// Only one candidate shown by default, so the selection sync has a non-empty
// `candidates` param to write — the case that actually changes the URL.
const candidateEntries: CandidateEntry[] = [
  { id: "alpha", shownByDefault: true },
  { id: "beta", shownByDefault: false },
];

function renderAtComparison(initialUrl = "/test") {
  const router = createMemoryRouter(
    [
      { path: "/", element: <div>home-marker</div> },
      { path: "/:comparisonId", element: <ComparisonPage /> },
    ],
    { initialEntries: ["/", initialUrl], initialIndex: 1 }
  );
  render(<RouterProvider router={router} />);
  return router;
}

describe("ComparisonPage – history behaviour", () => {
  beforeEach(() => {
    vi.mocked(getComparisonData).mockResolvedValue({
      attributes,
      candidates,
      candidateEntries,
    });
  });

  it("returns to the landing page with a single back navigation", async () => {
    const router = renderAtComparison();

    // Wait for the comparison to finish loading and for the mount-time URL
    // syncs to settle.
    await screen.findByText("alpha-value");
    await waitFor(() =>
      expect(router.state.location.search).toContain("candidates=")
    );

    await act(async () => {
      await router.navigate(-1);
    });

    expect(await screen.findByText("home-marker")).toBeInTheDocument();
  });

  it("still records the view state in the URL", async () => {
    const router = renderAtComparison();

    await screen.findByText("alpha-value");

    await waitFor(() =>
      expect(router.state.location.search).toBe("?candidates=Alpha")
    );
  });

  it("does not push a history entry for a no-op URL sync", async () => {
    // With no selection to record (all candidates shown) the mount effects
    // produce no URL change at all, so nothing should land in history.
    vi.mocked(getComparisonData).mockResolvedValue({
      attributes,
      candidates,
      candidateEntries: [
        { id: "alpha", shownByDefault: true },
        { id: "beta", shownByDefault: true },
      ],
    });

    const router = renderAtComparison();

    await screen.findByText("alpha-value");
    await waitFor(() => expect(router.state.location.search).toBe(""));

    await act(async () => {
      await router.navigate(-1);
    });

    expect(await screen.findByText("home-marker")).toBeInTheDocument();
  });
});
