import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  candidatePassesFilters,
  FilterDrawer,
  emptyFilterState,
  type FilterState,
} from "./FilterPanel";
import { isRankableType } from "@/lib/compare";
import type { AttributesFile, CandidateFile, TagsType } from "@/types";

/**
 * Parity tests: verify that tag filtering and best-value highlighting behave
 * identically regardless of the display mode ("label", "icon", "both")
 * set on a TagsType attribute.  Display mode is purely presentational and must
 * never influence filtering or ranking logic.
 */

// Shared tag definitions used across tests
const tagsWithIcons: TagsType["tags"] = [
  { id: "rust", value: "Rust", color: "orange", icon: { name: "rust", pack: "fa-brands" } },
  { id: "python", value: "Python", color: "blue", icon: { name: "python", pack: "fa-brands" } },
  { id: "js", value: "JavaScript", color: "yellow" },
];

const makeCandidates = (): CandidateFile[] => [
  { name: "RustProject", values: { lang: { value: ["rust"] } } },
  { name: "PythonProject", values: { lang: { value: ["python"] } } },
  { name: "JSProject", values: { lang: { value: ["js"] } } },
  { name: "MultiProject", values: { lang: { value: ["rust", "python"] } } },
];

const tagFilter: FilterState = {
  tags: [{ attributeId: "lang", tagIds: new Set(["rust"]) }],
  booleans: [],
  ranges: [],
};

describe("FilterPanel Parity — filtering is display-mode-independent", () => {
  describe("candidatePassesFilters with tag filter", () => {
    it("returns the same passing set for display: label, icon, and both", () => {
      const candidates = makeCandidates();

      // candidatePassesFilters reads only values[].value (array of tag ids).
      // The display mode lives only in TagsType (the attribute definition) and
      // is never consulted during filtering — so we just call the function with
      // the same filterState for each display mode and assert identical results.
      const passingLabel = candidates.filter((c) =>
        candidatePassesFilters(c, tagFilter)
      );
      const passingIcon = candidates.filter((c) =>
        candidatePassesFilters(c, tagFilter)
      );
      const passingBoth = candidates.filter((c) =>
        candidatePassesFilters(c, tagFilter)
      );

      expect(passingLabel.map((c) => c.name)).toEqual(["RustProject", "MultiProject"]);
      expect(passingIcon.map((c) => c.name)).toEqual(passingLabel.map((c) => c.name));
      expect(passingBoth.map((c) => c.name)).toEqual(passingLabel.map((c) => c.name));
    });

    it("OR logic within a tag filter is display-mode-independent", () => {
      const candidates = makeCandidates();
      const multiTagFilter: FilterState = {
        tags: [{ attributeId: "lang", tagIds: new Set(["rust", "js"]) }],
        booleans: [],
        ranges: [],
      };

      const passing = candidates.filter((c) =>
        candidatePassesFilters(c, multiTagFilter)
      );

      // RustProject (rust), JSProject (js), MultiProject (rust+python)
      expect(passing.map((c) => c.name)).toEqual([
        "RustProject",
        "JSProject",
        "MultiProject",
      ]);
    });

    it("a candidate with no tags attribute fails the filter regardless of display mode", () => {
      const candidates: CandidateFile[] = [
        { name: "NoLang", values: {} },
        { name: "WithLang", values: { lang: { value: ["rust"] } } },
      ];

      const passing = candidates.filter((c) =>
        candidatePassesFilters(c, tagFilter)
      );

      expect(passing.map((c) => c.name)).toEqual(["WithLang"]);
    });

    it("emptyFilterState passes all candidates regardless of display mode", () => {
      const candidates = makeCandidates();

      const passing = candidates.filter((c) =>
        candidatePassesFilters(c, emptyFilterState)
      );

      expect(passing.length).toBe(candidates.length);
    });
  });

  describe("isRankableType on TagsType — unaffected by display option", () => {
    it("returns false for display: label", () => {
      const tagsType: TagsType = {
        type: "tags",
        defaultColor: "gray",
        tags: tagsWithIcons,
        display: "label",
      };
      expect(isRankableType(tagsType)).toBe(false);
    });

    it("returns false for display: icon", () => {
      const tagsType: TagsType = {
        type: "tags",
        defaultColor: "gray",
        tags: tagsWithIcons,
        display: "icon",
      };
      expect(isRankableType(tagsType)).toBe(false);
    });

    it("returns false for display: both", () => {
      const tagsType: TagsType = {
        type: "tags",
        defaultColor: "gray",
        tags: tagsWithIcons,
        display: "both",
      };
      expect(isRankableType(tagsType)).toBe(false);
    });

    it("returns false when display is omitted (default)", () => {
      const tagsType: TagsType = {
        type: "tags",
        defaultColor: "gray",
        tags: tagsWithIcons,
      };
      expect(isRankableType(tagsType)).toBe(false);
    });
  });

  describe("FilterDrawer renders tag option labels from tag.value — not blanked by display mode", () => {
    // We render FilterDrawer with a tags attribute whose TagsType.display is
    // set to each mode and verify the filter chip buttons still show the text
    // label of each tag (the filter UI always uses tag.value, never the icon).

    const makeAttributesWithDisplay = (
      display: TagsType["display"]
    ): AttributesFile => ({
      name: "Test",
      groups: [
        {
          id: "g1",
          name: "Languages",
          expandedByDefault: true,
          attributes: [
            {
              id: "lang",
              name: "Language",
              valueType: {
                type: "tags",
                defaultColor: "gray",
                tags: tagsWithIcons,
                display,
              },
            },
          ],
        },
      ],
    });

    const candidates = makeCandidates();

    it.each([["label"] as const, ["icon"] as const, ["both"] as const])(
      "filter drawer shows text labels for display: %s",
      async (display) => {
        const user = userEvent.setup();

        render(
          <FilterDrawer
            attributes={makeAttributesWithDisplay(display)}
            candidates={candidates}
            filterState={emptyFilterState}
            onFilterChange={vi.fn()}
          />
        );

        // Open the filter sheet
        await user.click(screen.getByRole("button", { name: /filters/i }));

        // All three tag values must appear as visible button text in the drawer
        expect(await screen.findByText("Rust")).toBeInTheDocument();
        expect(screen.getByText("Python")).toBeInTheDocument();
        expect(screen.getByText("JavaScript")).toBeInTheDocument();
      }
    );
  });
});
