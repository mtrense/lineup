/**
 * Shared test helper for icon-attribute data tests.
 *
 * Provides the boilerplate that every per-type icon test repeats:
 *   - Locate a Tags attribute by group + attribute id
 *   - Filter to the tags that carry an icon ref
 *   - Assert that every icon ref resolves through the real registry
 *
 * This is a plain .ts module (not a .test.ts). It exports helpers used by
 * per-type test files; it contains no describe/it itself.
 *
 * Philosophy: uses the REAL resolveIcon (no vi.mock), same as demo.test.ts,
 * so a missing or misspelled registry entry is caught at test time.
 */
import { expect } from "vitest";
import { resolveIcon } from "./registry";
import type { IconRef } from "./registry";

// ---- Shape types (mirror demo.test.ts; no refactor of that file required) ----

export interface TagDef {
  id: string;
  value: string;
  color?: string;
  icon?: IconRef;
}

export interface TagsValueType {
  type: "tags";
  defaultColor: string;
  tags: TagDef[];
  display?: "label" | "icon" | "both";
}

interface AttributeDef {
  id: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valueType: any;
}

interface AttributeGroupDef {
  id: string;
  attributes: AttributeDef[];
}

interface AttributesFile {
  groups: AttributeGroupDef[];
}

// ---- Exported helpers ----

/**
 * Locate a Tags attribute inside an attributes.json by group id and attribute id.
 * Throws a descriptive error if the group, attribute, or type is not found.
 */
export function getTagsAttribute(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributesFile: any,
  groupId: string,
  attrId: string
): TagsValueType {
  const file = attributesFile as AttributesFile;

  const group = file.groups.find((g) => g.id === groupId);
  if (group == null) {
    throw new Error(
      `Group '${groupId}' not found in attributes file. Available groups: ${file.groups.map((g) => g.id).join(", ")}`
    );
  }

  const attr = group.attributes.find((a) => a.id === attrId);
  if (attr == null) {
    throw new Error(
      `Attribute '${attrId}' not found in group '${groupId}'. Available attributes: ${group.attributes.map((a) => a.id).join(", ")}`
    );
  }

  const vt = attr.valueType;
  if (typeof vt !== "object" || vt === null || vt.type !== "tags") {
    throw new Error(
      `Attribute '${attrId}' in group '${groupId}' is not a tags type (got: ${JSON.stringify(vt)})`
    );
  }

  return vt as TagsValueType;
}

/**
 * Return the subset of tags in a TagsValueType that carry an icon ref.
 */
export function iconTags(vt: TagsValueType): TagDef[] {
  return vt.tags.filter((t) => t.icon != null);
}

/**
 * Assert that every tag with an icon ref resolves through the real registry.
 * Throws a descriptive test failure naming the offending tag id if resolution fails.
 */
export function expectAllIconsResolve(vt: TagsValueType): void {
  const tagged = iconTags(vt);
  for (const tag of tagged) {
    const resolved = resolveIcon(tag.icon!);
    expect(
      resolved,
      `Tag '${tag.id}' has icon ${JSON.stringify(tag.icon)} but resolveIcon returned null — check registry.ts`
    ).not.toBeNull();
  }
}
