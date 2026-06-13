/**
 * Icon-attribute test for audio-transcription — platforms.
 *
 * Verifies that:
 *   - The `platforms` attribute is a Tags type with display: "both"
 *   - The expected platform tags (macOS, Windows, Linux, Android, Web) carry icons
 *   - Every icon ref in the attribute resolves through the real registry
 */
import { describe, it, expect } from "vitest";
import {
  getTagsAttribute,
  iconTags,
  expectAllIconsResolve,
} from "./iconAttribute.testutil";
import audioAttributes from "../../../../data/audio-transcription/attributes.json";

describe("audio-transcription: platforms icon attribute", () => {
  const vt = getTagsAttribute(
    audioAttributes,
    "platforms-integration",
    "platforms"
  );

  it("platforms is a tags type with display: 'both'", () => {
    expect(vt.type).toBe("tags");
    expect(vt.display).toBe("both");
  });

  it("macOS tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "macos");
    expect(tag?.icon).toBeDefined();
  });

  it("Windows tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "windows");
    expect(tag?.icon).toBeDefined();
  });

  it("Linux tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "linux");
    expect(tag?.icon).toBeDefined();
  });

  it("Android tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "android");
    expect(tag?.icon).toBeDefined();
  });

  it("Web tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "web");
    expect(tag?.icon).toBeDefined();
  });

  it("every platform icon resolves through the registry", () => {
    const tagged = iconTags(vt);
    // At least 5 tags should have icons (macOS, Windows, Linux, Android, Web)
    expect(tagged.length).toBeGreaterThanOrEqual(5);
    expect(() => expectAllIconsResolve(vt)).not.toThrow();
  });
});
