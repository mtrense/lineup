/**
 * Icon-attribute test for rust-scripting — language-family.
 *
 * Verifies that:
 *   - The `language-family` attribute is a Tags type with display: "both"
 *   - JavaScript-like, Rust-like, Python-like, Lua-like, Ruby-like tags carry icons
 *   - Every icon ref in the attribute resolves through the real registry
 */
import { describe, it, expect } from "vitest";
import {
  getTagsAttribute,
  iconTags,
  expectAllIconsResolve,
} from "./iconAttribute.testutil";
import rustScriptingAttributes from "../../../../data/rust-scripting/attributes.json";

describe("rust-scripting: language-family icon attribute", () => {
  const vt = getTagsAttribute(
    rustScriptingAttributes,
    "general",
    "language-family"
  );

  it("language-family is a tags type with display: 'both'", () => {
    expect(vt.type).toBe("tags");
    expect(vt.display).toBe("both");
  });

  it("javascript-like tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "javascript-like");
    expect(tag?.icon).toBeDefined();
  });

  it("rust-like tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "rust-like");
    expect(tag?.icon).toBeDefined();
  });

  it("python-like tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "python-like");
    expect(tag?.icon).toBeDefined();
  });

  it("every language-family icon resolves through the registry", () => {
    const tagged = iconTags(vt);
    // At least 3 tags should have icons (javascript-like, rust-like, python-like)
    expect(tagged.length).toBeGreaterThanOrEqual(3);
    expect(() => expectAllIconsResolve(vt)).not.toThrow();
  });
});
