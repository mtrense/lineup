/**
 * Tests for the Devicon-to-CDN URL rewriter used by the HTML export build.
 *
 * Covers:
 *   - deviconCdnUrl() maps a devicon import specifier to the pinned jsdelivr URL
 *   - deviconCdnUrl() rejects/leaves alone non-devicon specifiers
 *   - deviconCdnPlugin() resolves devicon svg ids to a CDN-URL default export,
 *     and returns null/undefined for unrelated ids
 */
import { describe, it, expect } from "vitest";
import { deviconCdnUrl, deviconCdnPlugin, DEVICON_VERSION } from "./devicon-cdn";

describe("deviconCdnUrl()", () => {
  it("maps a devicon import specifier to the pinned jsdelivr URL", () => {
    expect(deviconCdnUrl("devicon/icons/rust/rust-original.svg")).toBe(
      `https://cdn.jsdelivr.net/npm/devicon@${DEVICON_VERSION}/icons/rust/rust-original.svg`,
    );
  });

  it("maps another devicon icon path correctly", () => {
    expect(deviconCdnUrl("devicon/icons/postgresql/postgresql-original.svg")).toBe(
      `https://cdn.jsdelivr.net/npm/devicon@${DEVICON_VERSION}/icons/postgresql/postgresql-original.svg`,
    );
  });

  it("throws for a specifier that is not a devicon icon path", () => {
    expect(() => deviconCdnUrl("./some-other-asset.svg")).toThrow();
    expect(() => deviconCdnUrl("devicon-not-really/icons/foo.svg")).toThrow();
  });
});

describe("deviconCdnPlugin()", () => {
  const plugin = deviconCdnPlugin();

  it("resolves a devicon svg id", () => {
    const resolved = (plugin.resolveId as (id: string) => string | null | undefined)(
      "devicon/icons/rust/rust-original.svg",
    );
    expect(resolved).toBeTruthy();
  });

  it("returns null/undefined for an unrelated id", () => {
    const resolved = (plugin.resolveId as (id: string) => string | null | undefined)(
      "react",
    );
    expect(resolved == null).toBe(true);
  });

  it("loads a resolved devicon id to a JS module exporting the CDN URL as default", () => {
    const id = (plugin.resolveId as (id: string) => string | null | undefined)(
      "devicon/icons/rust/rust-original.svg",
    );
    const code = (plugin.load as (id: string) => string | null | undefined)(id!);
    expect(code).toContain(
      `https://cdn.jsdelivr.net/npm/devicon@${DEVICON_VERSION}/icons/rust/rust-original.svg`,
    );
    expect(code).toMatch(/export default/);
  });

  it("returns null/undefined from load for an unresolved id", () => {
    const code = (plugin.load as (id: string) => string | null | undefined)(
      "some/unrelated/id.svg",
    );
    expect(code == null).toBe(true);
  });
});
