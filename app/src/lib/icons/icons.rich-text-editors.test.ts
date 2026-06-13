/**
 * Icon-attribute test for rich-text-editors — framework.
 *
 * Verifies that:
 *   - The `framework` attribute is a Tags type with display: "both"
 *   - React, Vue, Angular, Svelte tags carry icons
 *   - Every icon ref in the attribute resolves through the real registry
 */
import { describe, it, expect } from "vitest";
import {
  getTagsAttribute,
  iconTags,
  expectAllIconsResolve,
} from "./iconAttribute.testutil";
import rteAttributes from "../../../../data/rich-text-editors/attributes.json";

describe("rich-text-editors: framework icon attribute", () => {
  const vt = getTagsAttribute(rteAttributes, "technical", "framework");

  it("framework is a tags type with display: 'both'", () => {
    expect(vt.type).toBe("tags");
    expect(vt.display).toBe("both");
  });

  it("react tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "react");
    expect(tag?.icon).toBeDefined();
  });

  it("vue tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "vue");
    expect(tag?.icon).toBeDefined();
  });

  it("angular tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "angular");
    expect(tag?.icon).toBeDefined();
  });

  it("svelte tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "svelte");
    expect(tag?.icon).toBeDefined();
  });

  it("every framework icon resolves through the registry", () => {
    const tagged = iconTags(vt);
    // At least 4 tags should have icons (react, vue, angular, svelte)
    expect(tagged.length).toBeGreaterThanOrEqual(4);
    expect(() => expectAllIconsResolve(vt)).not.toThrow();
  });
});
