/**
 * Tests for the export SSR render surface (renderExportHtml) and the
 * shared ExportRoot component used by both SSR and client hydration.
 */
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { renderExportHtml } from "./render";
import { ExportRoot } from "./ExportRoot";
import { loadComparison } from "../../scripts/lib/load-comparison";

describe("renderExportHtml()", () => {
  it("returns a non-empty string containing candidate names", () => {
    const data = loadComparison("databases");
    const html = renderExportHtml(data);
    expect(html.length).toBeGreaterThan(0);
    expect(html).toContain("PostgreSQL");
  });

  it("contains a rendered attribute value produced by ValueRenderer", () => {
    const data = loadComparison("databases");
    const html = renderExportHtml(data);
    // PostgreSQL's latest-version value ("17.2") proves ValueRenderer ran.
    expect(html).toContain("17.2");
  });

  it("contains comparison table markup and is not an empty root", () => {
    const data = loadComparison("databases");
    const html = renderExportHtml(data);
    expect(html).toMatch(/<table/i);
  });
});

describe("ExportRoot", () => {
  it("renders without a Router provider (router-independent)", () => {
    const data = loadComparison("databases");
    expect(() => render(<ExportRoot data={data} />)).not.toThrow();
  });
});
