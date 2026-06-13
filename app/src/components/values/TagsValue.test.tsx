import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TagsValue } from "./TagsValue";
import type { Tag } from "@/types";

// Mock the Icon component so tests don't depend on real SVG assets or FA tree-shaking.
vi.mock("@/lib/icons", () => ({
  Icon: vi.fn(
    ({
      name,
      title,
    }: {
      name: string;
      pack?: string;
      title?: string;
    }) => (
      <svg data-icon={name} aria-label={title ?? undefined}>
        <title>{name}</title>
      </svg>
    )
  ),
}));

const tagWithIcon: Tag = {
  id: "rust",
  value: "Rust",
  color: "orange",
  icon: { name: "rust", pack: "fa-brands" },
};

const tagWithoutIcon: Tag = {
  id: "other",
  value: "Other",
  color: "gray",
};

describe("TagsValue", () => {
  describe('display: "both" (default)', () => {
    it("renders both the icon glyph and the label text", () => {
      render(
        <TagsValue
          value={["rust"]}
          tags={[tagWithIcon]}
          defaultColor="gray"
        />
      );
      // Label text is present
      expect(screen.getByText("Rust")).toBeInTheDocument();
      // Icon glyph is present
      const svg = document.querySelector("svg[data-icon='rust']");
      expect(svg).not.toBeNull();
    });

    it("renders the label without a glyph when the tag has no icon", () => {
      render(
        <TagsValue
          value={["other"]}
          tags={[tagWithoutIcon]}
          defaultColor="gray"
        />
      );
      expect(screen.getByText("Other")).toBeInTheDocument();
      expect(document.querySelector("svg")).toBeNull();
    });
  });

  describe('display: "icon"', () => {
    it("renders the glyph and exposes the tag value via aria-label", () => {
      render(
        <TagsValue
          value={["rust"]}
          tags={[tagWithIcon]}
          defaultColor="gray"
          display="icon"
        />
      );
      // The wrapper element has aria-label equal to the tag text value
      expect(screen.getByLabelText("Rust")).toBeInTheDocument();
      // The icon is rendered
      const svg = document.querySelector("svg[data-icon='rust']");
      expect(svg).not.toBeNull();
      // Visible label text is not separately rendered as a standalone text node
      // (it may appear only inside aria attributes or tooltips, not as a sibling span)
      const allText = document.body.textContent ?? "";
      // The raw visible text "Rust" should not appear outside the aria-label context.
      // We check that there's no standalone label span by verifying no <span> with
      // only "Rust" as visible content exists outside the aria wrapper.
      const spans = Array.from(document.querySelectorAll("span"));
      const visibleLabelSpan = spans.find(
        (s) => s.textContent === "Rust" && !s.closest("[aria-label]")
      );
      expect(visibleLabelSpan).toBeUndefined();
      // Suppress unused var warning — allText used for context only
      void allText;
    });

    it("renders the icon wrapper with no colored pill background", () => {
      render(
        <TagsValue
          value={["rust"]}
          tags={[tagWithIcon]}
          defaultColor="gray"
          display="icon"
        />
      );
      const wrapper = screen.getByLabelText("Rust");
      // No bg-* class applied — glyph stands on its own without a chip
      expect(wrapper.className).not.toMatch(/\bbg-/);
    });

    it("icon wrapper uses theme foreground color so brand glyphs stay visible", () => {
      render(
        <TagsValue
          value={["rust"]}
          tags={[tagWithIcon]}
          defaultColor="gray"
          display="icon"
        />
      );
      const wrapper = screen.getByLabelText("Rust");
      // currentColor-filled FA glyphs inherit this, adapting to light/dark theme
      expect(wrapper.className).toMatch(/\btext-foreground\b/);
    });

    it("icon wrapper is keyboard focusable", () => {
      render(
        <TagsValue
          value={["rust"]}
          tags={[tagWithIcon]}
          defaultColor="gray"
          display="icon"
        />
      );
      const wrapper = screen.getByLabelText("Rust");
      expect(wrapper).toHaveAttribute("tabindex", "0");
    });

    it("falls back to the text label when the tag has no icon", () => {
      render(
        <TagsValue
          value={["other"]}
          tags={[tagWithoutIcon]}
          defaultColor="gray"
          display="icon"
        />
      );
      // Falls back to visible text label since there's no icon to show
      expect(screen.getByText("Other")).toBeInTheDocument();
      // No icon rendered
      expect(document.querySelector("svg")).toBeNull();
    });

    it("fallback tag (no icon) still renders inside a colored pill", () => {
      render(
        <TagsValue
          value={["other"]}
          tags={[tagWithoutIcon]}
          defaultColor="gray"
          display="icon"
        />
      );
      const spans = Array.from(document.querySelectorAll("span"));
      const pill = spans.find((s) => s.textContent === "Other");
      expect(pill).toBeDefined();
      expect(pill!.className).toMatch(/\bbg-/);
    });
  });

  describe('display: "label"', () => {
    it("renders text only with no svg or img element", () => {
      render(
        <TagsValue
          value={["rust"]}
          tags={[tagWithIcon]}
          defaultColor="gray"
          display="label"
        />
      );
      expect(screen.getByText("Rust")).toBeInTheDocument();
      expect(document.querySelector("svg")).toBeNull();
      expect(document.querySelector("img")).toBeNull();
    });
  });
});
