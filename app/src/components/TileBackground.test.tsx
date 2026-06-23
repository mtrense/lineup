/**
 * Tests for TileBackground component.
 *
 * TileBackground renders a decorative, aria-hidden background image when given
 * a URL, and renders nothing when given null/undefined.
 */
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { TileBackground } from "./TileBackground";

describe("TileBackground", () => {
  describe("with a URL", () => {
    it("renders an element in the DOM", () => {
      const { container } = render(
        <TileBackground url="/assets/databases-tile.svg" />
      );
      expect(container.firstChild).not.toBeNull();
    });

    it("renders an img element with the given src", () => {
      const { container } = render(
        <TileBackground url="/assets/databases-tile.svg" />
      );
      const img = container.querySelector("img");
      expect(img).not.toBeNull();
      expect(img!.src).toContain("/assets/databases-tile.svg");
    });

    it("marks the img as aria-hidden for screen reader accessibility", () => {
      const { container } = render(
        <TileBackground url="/assets/databases-tile.svg" />
      );
      const img = container.querySelector("img");
      expect(img).not.toBeNull();
      expect(img!.getAttribute("aria-hidden")).toBe("true");
    });

    it("renders an img with empty alt text (decorative)", () => {
      const { container } = render(
        <TileBackground url="/assets/databases-tile.svg" />
      );
      const img = container.querySelector("img");
      expect(img).not.toBeNull();
      expect(img!.alt).toBe("");
    });

    it("applies pointer-events-none to prevent interaction", () => {
      const { container } = render(
        <TileBackground url="/assets/databases-tile.svg" />
      );
      // The wrapper element (or img itself) should carry pointer-events-none
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain("pointer-events-none");
    });

    it("is absolutely positioned to fill its container", () => {
      const { container } = render(
        <TileBackground url="/assets/databases-tile.svg" />
      );
      const wrapper = container.firstChild as HTMLElement;
      // absolute positioning classes
      expect(wrapper.className).toMatch(/\babsolute\b/);
      // Must fill the parent (inset-0 or equivalent)
      expect(wrapper.className).toMatch(/\binset-0\b/);
    });
  });

  describe("with null url", () => {
    it("renders nothing when url is null", () => {
      const { container } = render(<TileBackground url={null} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("with undefined url (prop omitted)", () => {
    it("renders nothing when url prop is omitted", () => {
      const { container } = render(<TileBackground />);
      expect(container.firstChild).toBeNull();
    });
  });
});
