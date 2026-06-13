/**
 * Self-check for iconAttribute.testutil — verifies the helper works correctly
 * against the existing spa-web-frameworks primary-language wiring (the demo type).
 *
 * This re-pins the existing icon demo without touching demo.test.ts.
 */
import { describe, it, expect } from "vitest";
import {
  getTagsAttribute,
  iconTags,
  expectAllIconsResolve,
} from "./iconAttribute.testutil";
import spaAttributes from "../../../../data/spa-web-frameworks/attributes.json";

describe("iconAttribute.testutil self-check (spa-web-frameworks primary-language)", () => {
  const vt = getTagsAttribute(spaAttributes, "language-syntax", "primary-language");

  it("getTagsAttribute returns a tags type with display: 'icon'", () => {
    expect(vt.type).toBe("tags");
    expect(vt.display).toBe("icon");
  });

  it("iconTags returns at least 4 tagged entries", () => {
    const tagged = iconTags(vt);
    expect(tagged.length).toBeGreaterThanOrEqual(4);
  });

  it("expectAllIconsResolve passes for all icon tags", () => {
    expect(() => expectAllIconsResolve(vt)).not.toThrow();
  });
});

describe("getTagsAttribute: error cases", () => {
  it("throws a clear error when the group does not exist", () => {
    expect(() =>
      getTagsAttribute(spaAttributes, "no-such-group", "primary-language")
    ).toThrow(/group.*no-such-group/i);
  });

  it("throws a clear error when the attribute does not exist", () => {
    expect(() =>
      getTagsAttribute(spaAttributes, "language-syntax", "no-such-attr")
    ).toThrow(/attribute.*no-such-attr/i);
  });

  it("throws a clear error when the attribute is not a tags type", () => {
    // "name" is a text attribute in the general group
    expect(() =>
      getTagsAttribute(spaAttributes, "general", "name")
    ).toThrow(/not a tags/i);
  });
});
