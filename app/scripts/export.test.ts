/**
 * @vitest-environment node
 *
 * Tests for the export CLI's core (`buildExportHtml`) and thin wrapper
 * (`main`) — see PLAN.md, milestone 0019, Task 5.
 *
 * Runs under the "node" environment (not the project default "jsdom"):
 * `buildExportHtml()` drives a real Vite SSR server plus a real Vite build
 * (via `buildExportBundle()`), and esbuild (invoked by that build) is
 * incompatible with jsdom's TextEncoder shim — same reasoning as
 * `build-bundle.test.ts`.
 *
 * Covers:
 *   - buildExportHtml() produces a complete, self-contained HTML document
 *     (doctype, candidate names + a rendered attribute value, inlined
 *     <style>, inlined data script, SSR table markup inside #root)
 *   - the inlined data JSON round-trips back to loadComparison()'s output
 *   - an unknown id makes buildExportHtml() reject
 *   - main() with an unknown id writes nothing to stdout, writes an
 *     id-naming message to stderr, and sets a non-zero exit code
 *   - main() with no argument does the same, without invoking the build
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { buildExportHtml, main } from "./export";
import { loadComparison } from "./lib/load-comparison";

const EXPORT_TIMEOUT = 60000;

describe("buildExportHtml()", () => {
  it(
    "assembles a complete, self-contained HTML document",
    async () => {
      const html = await buildExportHtml("databases");

      expect(html).toMatch(/^<!DOCTYPE html>/);
      expect(html).toContain("PostgreSQL");
      // PostgreSQL's latest-version value ("17.2") proves ValueRenderer ran.
      expect(html).toContain("17.2");
      expect(html).toMatch(/<style>[\s\S]*<\/style>/);
      expect(html).toContain("window.__LINEUP_DATA__");
      expect(html).toMatch(/<div id="root"><[\s\S]*<table/i);
    },
    EXPORT_TIMEOUT,
  );

  it(
    "inlines a data payload that round-trips to loadComparison()'s output, safely escaped",
    async () => {
      const html = await buildExportHtml("databases");
      const expected = loadComparison("databases");

      const match = html.match(
        /window\.__LINEUP_DATA__ = (.*);<\/script>/,
      );
      expect(match).not.toBeNull();

      const inlineJson = match![1];
      // No raw "<" survives in the inlined payload (it would risk
      // prematurely closing the surrounding <script> tag).
      expect(inlineJson).not.toContain("<");

      const parsed = JSON.parse(inlineJson.replace(/\\u003C/g, "<"));
      expect(parsed).toEqual(expected);
    },
    EXPORT_TIMEOUT,
  );

  it("rejects for an unknown comparison id", async () => {
    await expect(buildExportHtml("does-not-exist")).rejects.toThrow(
      /does-not-exist/,
    );
  });
});

describe("main()", () => {
  afterEach(() => {
    process.exitCode = 0;
    vi.restoreAllMocks();
  });

  it("writes nothing to stdout and exits non-zero for an unknown id", async () => {
    const stdoutSpy = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true);
    const stderrSpy = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true);

    await main(["does-not-exist"]);

    expect(stdoutSpy).not.toHaveBeenCalled();
    expect(stderrSpy).toHaveBeenCalledWith(
      expect.stringContaining("does-not-exist"),
    );
    expect(process.exitCode).toBe(1);
  });

  it("writes a usage message and exits non-zero when no id is given", async () => {
    const stdoutSpy = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true);
    const stderrSpy = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true);

    await main([]);

    expect(stdoutSpy).not.toHaveBeenCalled();
    expect(stderrSpy).toHaveBeenCalled();
    expect(process.exitCode).toBe(1);
  });
});
