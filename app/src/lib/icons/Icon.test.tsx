import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Icon } from "./Icon";

// Mock the registry so tests don't depend on actual SVG imports or FA tree-shaking
vi.mock("./registry", () => ({
  resolveIcon: vi.fn((ref: { name: string; pack?: string }) => {
    if (ref.pack === "fa-brands" && ref.name === "rust") {
      // Simulate a FontAwesome icon definition
      return {
        kind: "fa",
        def: {
          prefix: "fab",
          iconName: "rust",
          icon: [640, 512, [], "e07a", "M0 0"],
        },
      };
    }
    if (ref.pack === "devicon" && ref.name === "python") {
      return { kind: "svg", url: "/mock-python.svg" };
    }
    return null;
  }),
}));

describe("Icon component", () => {
  it("renders a FontAwesome icon as an svg with the expected data-icon attribute", () => {
    render(<Icon name="rust" pack="fa-brands" />);
    const svg = document.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg!.getAttribute("data-icon")).toBe("rust");
  });

  it("renders a Devicon glyph as an img element with a truthy src", () => {
    const { container } = render(<Icon name="python" pack="devicon" />);
    // When no title is provided the img is decorative (alt=""), so its accessible
    // role is "presentation". Query via the DOM directly.
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img!.src).toBeTruthy();
  });

  it("renders nothing when the (pack, name) pair is unknown", () => {
    const { container } = render(<Icon name="totally-unknown-icon-xyz" pack="fa-solid" />);
    expect(container.firstChild).toBeNull();
  });

  it("applies title as aria-label on the FontAwesome icon wrapper", () => {
    render(<Icon name="rust" pack="fa-brands" title="Rust programming language" />);
    const labeled = screen.getByLabelText("Rust programming language");
    expect(labeled).toBeInTheDocument();
  });

  it("applies title as alt text on the Devicon img element", () => {
    render(<Icon name="python" pack="devicon" title="Python programming language" />);
    const img = screen.getByAltText("Python programming language");
    expect(img).toBeInTheDocument();
  });
});
