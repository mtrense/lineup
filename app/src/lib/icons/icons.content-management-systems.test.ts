/**
 * Icon-attribute tests for content-management-systems.
 *
 * Verifies that:
 *   - `database-support` and `frontend-frameworks` are Tags types with display: "both"
 *   - The expected DB tags (postgresql, mysql, mongodb, sqlite) carry icons
 *   - The expected framework tags (nextjs, gatsby, astro) carry icons
 *   - Every icon ref in both attributes resolves through the real registry
 *   - Every tag color on both touched attributes is a named Tailwind color (not hex)
 */
import { describe, it, expect } from "vitest";
import {
  getTagsAttribute,
  iconTags,
  expectAllIconsResolve,
} from "./iconAttribute.testutil";
import cmsAttributes from "../../../../data/content-management-systems/attributes.json";

// Named Tailwind colors accepted by the TagsValue colorClasses map
const NAMED_COLORS = new Set([
  "gray",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "indigo",
  "purple",
  "pink",
]);

describe("content-management-systems: database-support icon attribute", () => {
  const vt = getTagsAttribute(cmsAttributes, "architecture", "database-support");

  it("database-support is a tags type with display: 'both'", () => {
    expect(vt.type).toBe("tags");
    expect(vt.display).toBe("both");
  });

  it("postgresql tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "postgresql");
    expect(tag?.icon).toBeDefined();
  });

  it("mysql tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "mysql");
    expect(tag?.icon).toBeDefined();
  });

  it("mongodb tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "mongodb");
    expect(tag?.icon).toBeDefined();
  });

  it("sqlite tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "sqlite");
    expect(tag?.icon).toBeDefined();
  });

  it("every database-support icon resolves through the registry", () => {
    const tagged = iconTags(vt);
    expect(tagged.length).toBeGreaterThanOrEqual(4);
    expect(() => expectAllIconsResolve(vt)).not.toThrow();
  });

  it("every tag color is a named Tailwind color (not a hex string)", () => {
    for (const tag of vt.tags) {
      if (tag.color != null) {
        expect(
          NAMED_COLORS.has(tag.color),
          `Tag '${tag.id}' has color '${tag.color}' which is not a named Tailwind color`
        ).toBe(true);
      }
    }
  });
});

describe("content-management-systems: frontend-frameworks icon attribute", () => {
  const vt = getTagsAttribute(
    cmsAttributes,
    "integrations",
    "frontend-frameworks"
  );

  it("frontend-frameworks is a tags type with display: 'both'", () => {
    expect(vt.type).toBe("tags");
    expect(vt.display).toBe("both");
  });

  it("nextjs tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "nextjs");
    expect(tag?.icon).toBeDefined();
  });

  it("gatsby tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "gatsby");
    expect(tag?.icon).toBeDefined();
  });

  it("astro tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "astro");
    expect(tag?.icon).toBeDefined();
  });

  it("every frontend-frameworks icon resolves through the registry", () => {
    const tagged = iconTags(vt);
    expect(tagged.length).toBeGreaterThanOrEqual(3);
    expect(() => expectAllIconsResolve(vt)).not.toThrow();
  });

  it("every tag color is a named Tailwind color (not a hex string)", () => {
    for (const tag of vt.tags) {
      if (tag.color != null) {
        expect(
          NAMED_COLORS.has(tag.color),
          `Tag '${tag.id}' has color '${tag.color}' which is not a named Tailwind color`
        ).toBe(true);
      }
    }
  });
});
