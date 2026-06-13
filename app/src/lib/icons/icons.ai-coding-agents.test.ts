/**
 * Icon-attribute test for ai-coding-agents — interface.
 *
 * Verifies that:
 *   - The `interface` attribute is a Tags type with display: "both"
 *   - CLI and Web tags carry icons
 *   - IDE and IDE Extension tags carry icons
 *   - Desktop App tag carries an icon
 *   - Every icon ref in the attribute resolves through the real registry
 */
import { describe, it, expect } from "vitest";
import {
  getTagsAttribute,
  iconTags,
  expectAllIconsResolve,
} from "./iconAttribute.testutil";
import aiCodingAgentsAttributes from "../../../../data/ai-coding-agents/attributes.json";

describe("ai-coding-agents: interface icon attribute", () => {
  const vt = getTagsAttribute(
    aiCodingAgentsAttributes,
    "form-integration",
    "interface"
  );

  it("interface is a tags type with display: 'both'", () => {
    expect(vt.type).toBe("tags");
    expect(vt.display).toBe("both");
  });

  it("cli tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "cli");
    expect(tag?.icon).toBeDefined();
  });

  it("web tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "web");
    expect(tag?.icon).toBeDefined();
  });

  it("ide tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "ide");
    expect(tag?.icon).toBeDefined();
  });

  it("ide-extension tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "ide-extension");
    expect(tag?.icon).toBeDefined();
  });

  it("desktop-app tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "desktop-app");
    expect(tag?.icon).toBeDefined();
  });

  it("every interface icon resolves through the registry", () => {
    const tagged = iconTags(vt);
    // At least 5 tags should have icons (cli, ide, ide-extension, web, desktop-app)
    expect(tagged.length).toBeGreaterThanOrEqual(5);
    expect(() => expectAllIconsResolve(vt)).not.toThrow();
  });
});
