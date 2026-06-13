/**
 * Icon-attribute tests for website-hosting-providers.
 *
 * Verifies that:
 *   - 'git-integration', 'functions-runtime', and 'supported-frameworks' are
 *     Tags types with display: "both"
 *   - The expected tags carry icons (github/gitlab/bitbucket; node/python/go/rust/ruby;
 *     nextjs/angular/vue/vite)
 *   - Every icon ref in all three attributes resolves through the real registry
 */
import { describe, it, expect } from "vitest";
import {
  getTagsAttribute,
  iconTags,
  expectAllIconsResolve,
} from "./iconAttribute.testutil";
import hostingAttributes from "../../../../data/website-hosting-providers/attributes.json";

describe("website-hosting-providers: git-integration icon attribute", () => {
  const vt = getTagsAttribute(
    hostingAttributes,
    "deployment",
    "git-integration"
  );

  it("git-integration is a tags type with display: 'both'", () => {
    expect(vt.type).toBe("tags");
    expect(vt.display).toBe("both");
  });

  it("github tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "github");
    expect(tag?.icon).toBeDefined();
  });

  it("gitlab tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "gitlab");
    expect(tag?.icon).toBeDefined();
  });

  it("bitbucket tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "bitbucket");
    expect(tag?.icon).toBeDefined();
  });

  it("every git-integration icon resolves through the registry", () => {
    const tagged = iconTags(vt);
    expect(tagged.length).toBeGreaterThanOrEqual(3);
    expect(() => expectAllIconsResolve(vt)).not.toThrow();
  });
});

describe("website-hosting-providers: functions-runtime icon attribute", () => {
  const vt = getTagsAttribute(
    hostingAttributes,
    "serverless",
    "functions-runtime"
  );

  it("functions-runtime is a tags type with display: 'both'", () => {
    expect(vt.type).toBe("tags");
    expect(vt.display).toBe("both");
  });

  it("node tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "node");
    expect(tag?.icon).toBeDefined();
  });

  it("python tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "python");
    expect(tag?.icon).toBeDefined();
  });

  it("go tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "go");
    expect(tag?.icon).toBeDefined();
  });

  it("rust tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "rust");
    expect(tag?.icon).toBeDefined();
  });

  it("ruby tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "ruby");
    expect(tag?.icon).toBeDefined();
  });

  it("every functions-runtime icon resolves through the registry", () => {
    const tagged = iconTags(vt);
    expect(tagged.length).toBeGreaterThanOrEqual(5);
    expect(() => expectAllIconsResolve(vt)).not.toThrow();
  });
});

describe("website-hosting-providers: supported-frameworks icon attribute", () => {
  const vt = getTagsAttribute(
    hostingAttributes,
    "deployment",
    "supported-frameworks"
  );

  it("supported-frameworks is a tags type with display: 'both'", () => {
    expect(vt.type).toBe("tags");
    expect(vt.display).toBe("both");
  });

  it("next (Next.js) tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "next");
    expect(tag?.icon).toBeDefined();
  });

  it("angular tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "angular");
    expect(tag?.icon).toBeDefined();
  });

  it("vue tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "vue");
    expect(tag?.icon).toBeDefined();
  });

  it("vite tag carries an icon", () => {
    const tag = vt.tags.find((t) => t.id === "vite");
    expect(tag?.icon).toBeDefined();
  });

  it("every supported-frameworks icon resolves through the registry", () => {
    const tagged = iconTags(vt);
    expect(tagged.length).toBeGreaterThanOrEqual(4);
    expect(() => expectAllIconsResolve(vt)).not.toThrow();
  });
});
