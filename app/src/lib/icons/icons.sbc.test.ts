/**
 * Icon-attribute test for sbc — distros-with-images.
 *
 * Verifies that:
 *   - The `distros-with-images` attribute is a Tags type with display: "both"
 *   - Ubuntu, Debian, Fedora, Raspberry Pi OS tags carry icons
 *   - Every icon ref in the attribute resolves through the real registry
 */
import { describe, it, expect } from "vitest";
import {
  getTagsAttribute,
  iconTags,
  expectAllIconsResolve,
} from "./iconAttribute.testutil";
import sbcAttributes from "../../../../data/sbc/attributes.json";

describe("sbc: distros-with-images icon attribute", () => {
  const vt = getTagsAttribute(
    sbcAttributes,
    "software-support",
    "distros-with-images"
  );

  it("distros-with-images is a tags type with display: 'both'", () => {
    expect(vt.type).toBe("tags");
    expect(vt.display).toBe("both");
  });

  it("ubuntu tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "ubuntu");
    expect(tag?.icon).toBeDefined();
  });

  it("debian tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "debian");
    expect(tag?.icon).toBeDefined();
  });

  it("fedora tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "fedora");
    expect(tag?.icon).toBeDefined();
  });

  it("raspberry-pi-os tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "raspberry-pi-os");
    expect(tag?.icon).toBeDefined();
  });

  it("every distros-with-images icon resolves through the registry", () => {
    const tagged = iconTags(vt);
    // At least 4 tags should have icons (ubuntu, debian, fedora, raspberry-pi-os)
    expect(tagged.length).toBeGreaterThanOrEqual(4);
    expect(() => expectAllIconsResolve(vt)).not.toThrow();
  });
});
