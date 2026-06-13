/**
 * Icon-attribute test for ai-workflows — install-mechanism.
 *
 * Verifies that:
 *   - The `install-mechanism` attribute is a Tags type with display: "both"
 *   - npm and shell-script tags carry icons
 *   - pip and cargo tags carry icons (reusing registered python/rust glyphs)
 *   - Every icon ref in the attribute resolves through the real registry
 */
import { describe, it, expect } from "vitest";
import {
  getTagsAttribute,
  iconTags,
  expectAllIconsResolve,
} from "./iconAttribute.testutil";
import aiWorkflowsAttributes from "../../../../data/ai-workflows/attributes.json";

describe("ai-workflows: install-mechanism icon attribute", () => {
  const vt = getTagsAttribute(
    aiWorkflowsAttributes,
    "distribution",
    "install-mechanism"
  );

  it("install-mechanism is a tags type with display: 'both'", () => {
    expect(vt.type).toBe("tags");
    expect(vt.display).toBe("both");
  });

  it("npm tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "npm");
    expect(tag?.icon).toBeDefined();
  });

  it("pip tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "pip");
    expect(tag?.icon).toBeDefined();
  });

  it("cargo tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "cargo");
    expect(tag?.icon).toBeDefined();
  });

  it("shell-script tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "shell-script");
    expect(tag?.icon).toBeDefined();
  });

  it("every install-mechanism icon resolves through the registry", () => {
    const tagged = iconTags(vt);
    // At least 4 tags should have icons (npm, pip, cargo, shell-script)
    expect(tagged.length).toBeGreaterThanOrEqual(4);
    expect(() => expectAllIconsResolve(vt)).not.toThrow();
  });
});
