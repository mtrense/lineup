import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ComparisonView } from "./ComparisonView";
import type { AttributesFile, CandidateFile, CandidateEntry } from "@/types";

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

function renderView(candidates: CandidateFile[], entries: CandidateEntry[]) {
  return render(
    <ComparisonView
      attributes={attributes}
      candidates={candidates}
      candidateEntries={entries}
      onBack={vi.fn()}
    />
  );
}

// A candidate's note value only renders in the comparison grid when the
// candidate is part of the current selection, so it is a reliable proxy for
// "is this candidate visible" (unlike the name, which also shows in the
// filter panel regardless of selection).

describe("ComparisonView – default selection", () => {
  it("shows a shownByDefault candidate whose id differs from its normalized name", () => {
    // Regression: "dust.tt" normalizes to id "dust-tt", which the old
    // name-derivation matching failed to reconcile, so the candidate was
    // silently dropped from the default selection.
    const dust: CandidateFile = {
      name: "dust.tt",
      values: { note: { value: "dust-value" } },
    };
    const entries: CandidateEntry[] = [{ id: "dust-tt", shownByDefault: true }];

    renderView([dust], entries);

    expect(screen.getByText("dust-value")).toBeInTheDocument();
  });

  it("respects shownByDefault positionally, hiding unselected candidates", () => {
    const shown: CandidateFile = { name: "Shown", values: { note: { value: "shown-value" } } };
    const hidden: CandidateFile = { name: "Hidden", values: { note: { value: "hidden-value" } } };
    const entries: CandidateEntry[] = [
      { id: "shown", shownByDefault: true },
      { id: "hidden", shownByDefault: false },
    ];

    renderView([shown, hidden], entries);

    expect(screen.getByText("shown-value")).toBeInTheDocument();
    expect(screen.queryByText("hidden-value")).not.toBeInTheDocument();
  });

  it("shows all candidates when none are marked shownByDefault", () => {
    const a: CandidateFile = { name: "Aaa", values: { note: { value: "a-value" } } };
    const b: CandidateFile = { name: "Bbb", values: { note: { value: "b-value" } } };
    const entries: CandidateEntry[] = [
      { id: "aaa", shownByDefault: false },
      { id: "bbb", shownByDefault: false },
    ];

    renderView([a, b], entries);

    expect(screen.getByText("a-value")).toBeInTheDocument();
    expect(screen.getByText("b-value")).toBeInTheDocument();
  });
});
