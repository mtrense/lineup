/**
 * Tests for TileBackground component.
 *
 * TileBackground inlines the tile's SVG markup when given a non-empty `svg`
 * string, and renders nothing when given null/undefined. The SVG is inlined
 * (not referenced via <img> or CSS mask) so its `fill="currentColor"` inherits
 * the card's text colour and themes in light/dark mode.
 */
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { TileBackground } from "./TileBackground";

const SVG =
  '<svg viewBox="0 0 200 200"><rect x="30" y="120" fill="currentColor"/></svg>';

describe("TileBackground", () => {
  describe("with SVG markup", () => {
    it("renders an element in the DOM", () => {
      const { container } = render(<TileBackground svg={SVG} />);
      expect(container.firstChild).not.toBeNull();
    });

    it("inlines the given SVG markup into the DOM", () => {
      const { container } = render(<TileBackground svg={SVG} />);
      const svg = container.querySelector("svg");
      expect(svg).not.toBeNull();
      // The inlined shapes carry through verbatim.
      expect(svg!.querySelector("rect")).not.toBeNull();
      expect(svg!.getAttribute("viewBox")).toBe("0 0 200 200");
    });

    it("preserves currentColor fills so the art themes with the card", () => {
      const { container } = render(<TileBackground svg={SVG} />);
      const rect = container.querySelector("rect");
      expect(rect!.getAttribute("fill")).toBe("currentColor");
    });

    it("marks the wrapper as aria-hidden for screen reader accessibility", () => {
      const { container } = render(<TileBackground svg={SVG} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.getAttribute("aria-hidden")).toBe("true");
    });

    it("applies pointer-events-none to prevent interaction", () => {
      const { container } = render(<TileBackground svg={SVG} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain("pointer-events-none");
    });

    it("is absolutely positioned to fill its container", () => {
      const { container } = render(<TileBackground svg={SVG} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toMatch(/\babsolute\b/);
      expect(wrapper.className).toMatch(/\binset-0\b/);
    });
  });

  describe("with null svg", () => {
    it("renders nothing when svg is null", () => {
      const { container } = render(<TileBackground svg={null} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("with undefined svg (prop omitted)", () => {
    it("renders nothing when svg prop is omitted", () => {
      const { container } = render(<TileBackground />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("with empty-string svg", () => {
    it("renders nothing for an empty string (falsy)", () => {
      const { container } = render(<TileBackground svg="" />);
      expect(container.firstChild).toBeNull();
    });
  });
});
