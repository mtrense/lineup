/**
 * Demo integration test — verifies that the spa-web-frameworks primary-language
 * attribute is properly configured for icon-only display and that every icon
 * referenced in its tag definitions is resolvable through the registry.
 *
 * This test uses the REAL registry (no vi.mock) so it can confirm the registry
 * entries actually exist. It imports the data file directly so any schema or
 * data change that breaks the icon wiring is caught at test time.
 */
import { describe, it, expect } from "vitest";
import { resolveIcon } from "./registry";
import type { IconRef } from "./registry";

// Load the attributes directly — Vite/Vitest handles JSON imports natively.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import spaAttributes from "../../../../data/spa-web-frameworks/attributes.json";

interface TagDef {
  id: string;
  value: string;
  color?: string;
  icon?: IconRef;
}

interface TagsValueType {
  type: "tags";
  defaultColor: string;
  tags: TagDef[];
  display?: "label" | "icon" | "both";
}

interface AttributeDef {
  id: string;
  name: string;
  valueType: TagsValueType | unknown;
}

interface AttributeGroupDef {
  id: string;
  attributes: AttributeDef[];
}

function findAttribute(
  groupId: string,
  attributeId: string
): AttributeDef | undefined {
  const group = (spaAttributes.groups as AttributeGroupDef[]).find(
    (g) => g.id === groupId
  );
  return group?.attributes.find((a) => a.id === attributeId);
}

describe("spa-web-frameworks demo: primary-language icon tags", () => {
  const attr = findAttribute("language-syntax", "primary-language");
  const vt = attr?.valueType as TagsValueType | undefined;

  it("primary-language attribute exists and is a tags type", () => {
    expect(attr).toBeDefined();
    expect(vt?.type).toBe("tags");
  });

  it("primary-language display is set to 'icon'", () => {
    expect(vt?.display).toBe("icon");
  });

  it("javascript tag has a devicon icon ref", () => {
    const tag = vt?.tags.find((t) => t.id === "javascript");
    expect(tag?.icon).toBeDefined();
    expect(tag?.icon?.pack).toBe("devicon");
  });

  it("typescript tag has a devicon icon ref", () => {
    const tag = vt?.tags.find((t) => t.id === "typescript");
    expect(tag?.icon).toBeDefined();
    expect(tag?.icon?.pack).toBe("devicon");
  });

  it("rust tag has a devicon icon ref", () => {
    const tag = vt?.tags.find((t) => t.id === "rust");
    expect(tag?.icon).toBeDefined();
    expect(tag?.icon?.pack).toBe("devicon");
  });

  it("go tag has a devicon icon ref", () => {
    const tag = vt?.tags.find((t) => t.id === "go");
    expect(tag?.icon).toBeDefined();
    expect(tag?.icon?.pack).toBe("devicon");
  });

  it("every tag with an icon ref resolves through the registry", () => {
    const tags = vt?.tags ?? [];
    const iconTags = tags.filter((t) => t.icon != null);

    // At least the 4 most common language tags should have icons
    expect(iconTags.length).toBeGreaterThanOrEqual(4);

    for (const tag of iconTags) {
      const resolved = resolveIcon(tag.icon!);
      expect(resolved).not.toBeNull();
    }
  });
});
