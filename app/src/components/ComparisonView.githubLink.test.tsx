import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ComparisonView } from "./ComparisonView";
import type { AttributesFile, CandidateFile, CandidateEntry } from "@/types";

const attributes: AttributesFile = {
  name: "Databases",
  description: "Compare database engines",
  groups: [
    {
      id: "general",
      name: "General",
      expandedByDefault: true,
      attributes: [{ id: "license", name: "License", valueType: "text" }],
    },
  ],
};

const candidates: CandidateFile[] = [
  { name: "PostgreSQL", values: { license: { value: "PostgreSQL License" } } },
];

const candidateEntries: CandidateEntry[] = [
  { id: "postgresql", shownByDefault: true },
];

function renderView(comparisonId?: string) {
  return render(
    <ComparisonView
      comparisonId={comparisonId}
      attributes={attributes}
      candidates={candidates}
      candidateEntries={candidateEntries}
      onBack={() => {}}
    />
  );
}

describe("ComparisonView — repository link", () => {
  it("links to the comparison's data directory on GitHub", () => {
    renderView("databases");
    const link = screen.getByRole("link", { name: /github/i });
    expect(link).toHaveAttribute(
      "href",
      "https://github.com/mtrense/lineup/tree/main/data/databases"
    );
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("names the comparison in the accessible label", () => {
    renderView("databases");
    expect(
      screen.getByRole("link", {
        name: "View the Databases data directory on GitHub",
      })
    ).toBeInTheDocument();
  });

  it("renders no link when the comparison id is unknown", () => {
    renderView(undefined);
    expect(
      screen.queryByRole("link", { name: /github/i })
    ).not.toBeInTheDocument();
  });
});
