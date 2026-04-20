import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { format, parseISO } from "date-fns";
import { ComparisonView } from "./ComparisonView";
import type { AttributesFile, CandidateFile, CandidateEntry } from "@/types";

function fmt(iso: string) {
  return format(parseISO(iso), "MMM d, yyyy");
}

const twoGroupAttributes: AttributesFile = {
  name: "Test",
  groups: [
    {
      id: "general",
      name: "General",
      expandedByDefault: true,
      attributes: [
        {
          id: "score",
          name: "Score",
          valueType: { type: "integer", direction: "ascending" },
        },
      ],
    },
    {
      id: "extra",
      name: "Extra",
      expandedByDefault: true,
      attributes: [
        { id: "note", name: "Note", valueType: "text" },
      ],
    },
  ],
};

const alpha: CandidateFile = {
  name: "Alpha",
  lastVerified: "2026-01-15",
  values: { score: { value: 10 }, note: { value: "a" } },
};
const beta: CandidateFile = {
  name: "Beta",
  lastVerified: "2026-03-20",
  values: { score: { value: 5 }, note: { value: "b" } },
};
const gamma: CandidateFile = {
  name: "Gamma",
  values: { score: { value: 7 }, note: { value: "c" } },
};

const threeEntries: CandidateEntry[] = [
  { id: "alpha", shownByDefault: true },
  { id: "beta", shownByDefault: true },
  { id: "gamma", shownByDefault: true },
];

function renderView(
  candidates: CandidateFile[] = [alpha, beta, gamma],
  attributes: AttributesFile = twoGroupAttributes,
  extraProps: Partial<React.ComponentProps<typeof ComparisonView>> = {}
) {
  const entries: CandidateEntry[] = candidates.map((c) => ({
    id: c.name.toLowerCase(),
    shownByDefault: true,
  }));
  return render(
    <ComparisonView
      attributes={attributes}
      candidates={candidates}
      candidateEntries={entries}
      onBack={vi.fn()}
      {...extraProps}
    />
  );
}

describe("ComparisonView – Last Verified row", () => {
  it("shows formatted dates for candidates with lastVerified and — for those without", () => {
    renderView();

    expect(screen.getByText("Last Verified")).toBeInTheDocument();
    expect(screen.getByText(fmt("2026-01-15"))).toBeInTheDocument();
    expect(screen.getByText(fmt("2026-03-20"))).toBeInTheDocument();
    // Gamma has no lastVerified → em dash fallback
    expect(screen.getByLabelText("No data available")).toBeInTheDocument();
  });

  it("em-dash cell carries aria-label='No data available'", () => {
    renderView();

    const noDataCell = screen.getByLabelText("No data available");
    expect(noDataCell).toHaveTextContent("—");
    expect(noDataCell).toHaveAttribute("title", "No data available");
  });

  it("hides the Last Verified row when the first group is collapsed", async () => {
    const user = userEvent.setup();
    renderView();

    expect(screen.getByText("Last Verified")).toBeInTheDocument();

    // Click the General group header to collapse it
    await user.click(screen.getByText("General"));

    expect(screen.queryByText("Last Verified")).not.toBeInTheDocument();
  });

  it("does not call onSortChange when clicking the Last Verified label cell", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    renderView([alpha, beta, gamma], twoGroupAttributes, { onSortChange });

    // onSortChange fires on mount (null); clear before asserting the click is a no-op
    onSortChange.mockClear();
    await user.click(screen.getByText("Last Verified"));

    expect(onSortChange).not.toHaveBeenCalled();
  });

  it("best-value highlighting on the first attribute row is unaffected", () => {
    // Alpha has score 10 (highest, ascending → best). Its cell should get bg-green-50.
    const { container } = renderView();

    const greenCells = container.querySelectorAll(".bg-green-50");
    // There should be exactly one green cell (Alpha's score)
    expect(greenCells).toHaveLength(1);
  });

  it("renders — without throwing when lastVerified is not a valid date", () => {
    const bad: CandidateFile = {
      name: "Bad",
      lastVerified: "not-a-date",
      values: { score: { value: 1 }, note: { value: "x" } },
    };
    expect(() => renderView([bad])).not.toThrow();
    expect(screen.getByLabelText("No data available")).toBeInTheDocument();
  });

  it("only the first group emits a Last Verified row (second group does not)", () => {
    renderView();

    // Both groups are expanded; "Last Verified" should appear exactly once.
    const all = screen.getAllByText("Last Verified");
    expect(all).toHaveLength(1);
    // The matching cell should be inside the General group section, not the Extra group.
    const generalHeader = screen.getByText("General");
    const extraHeader = screen.getByText("Extra");
    const lastVerifiedCell = all[0];

    // Last Verified row appears after General header but before Extra header in DOM order
    const pos = (el: Element) =>
      Array.from(document.body.querySelectorAll("*")).indexOf(el);
    expect(pos(lastVerifiedCell)).toBeGreaterThan(pos(generalHeader));
    expect(pos(lastVerifiedCell)).toBeLessThan(pos(extraHeader));
  });

  it("renders inside the first group when candidates have no lastVerified at all", () => {
    const noDate: CandidateFile = {
      name: "Noddy",
      values: { score: { value: 3 }, note: { value: "n" } },
    };
    renderView([noDate]);

    expect(screen.getByText("Last Verified")).toBeInTheDocument();
    expect(screen.getByLabelText("No data available")).toBeInTheDocument();
  });
});
