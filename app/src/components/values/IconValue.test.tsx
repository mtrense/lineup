import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { IconValue } from "./IconValue";

// Mock the Icon component so tests don't depend on real SVG assets or FA tree-shaking.
// The mock mirrors the real component's behaviour at the surface visible in the DOM.
vi.mock("@/lib/icons", () => ({
  Icon: vi.fn(
    ({
      name,
      pack,
      title,
    }: {
      name: string;
      pack?: string;
      title?: string;
    }) => {
      if (pack === "devicon") {
        return (
          <img
            src={`/mock-${name}.svg`}
            alt={title ?? ""}
            data-testid="devicon-img"
          />
        );
      }
      // FontAwesome: render an svg with data-icon so assertions mirror real FA output
      return (
        <svg data-icon={name} aria-label={title ?? undefined}>
          <title>{name}</title>
        </svg>
      );
    }
  ),
}));

describe("IconValue", () => {
  describe("icon-fontawesome type", () => {
    it("renders a real glyph (svg with data-icon), not a placeholder <i> element", () => {
      render(<IconValue type="fontawesome" name="rust" pack="fa-brands" />);
      const svg = document.querySelector("svg[data-icon='rust']");
      expect(svg).not.toBeNull();
      // Must not fall back to the old placeholder
      const placeholder = document.querySelector("i.fab, i.fas");
      expect(placeholder).toBeNull();
    });

    it("uses fa-solid as the default pack when none is provided", () => {
      render(<IconValue type="fontawesome" name="globe" />);
      const svg = document.querySelector("svg[data-icon='globe']");
      expect(svg).not.toBeNull();
    });

    it("forwards pack='devicon' to <Icon> so the Devicon path is resolved", () => {
      render(<IconValue type="fontawesome" name="python" pack="devicon" />);
      const img = document.querySelector("img[data-testid='devicon-img']");
      expect(img).not.toBeNull();
      // No svg placeholder should appear
      const svg = document.querySelector("svg");
      expect(svg).toBeNull();
    });
  });

  describe("icon-emoji type", () => {
    it("still renders the emoji character", () => {
      render(<IconValue type="emoji" emoji="🦀" />);
      expect(screen.getByText("🦀")).toBeInTheDocument();
    });

    it("does not render any svg or img for an emoji value", () => {
      const { container } = render(<IconValue type="emoji" emoji="🐍" />);
      expect(container.querySelector("svg")).toBeNull();
      expect(container.querySelector("img")).toBeNull();
    });
  });
});
