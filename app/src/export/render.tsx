/**
 * SSR entry point for the HTML export. Loaded at runtime via Vite's
 * programmatic SSR API (`createServer(...).ssrLoadModule(...)`) by the
 * export CLI (see PLAN.md, milestone 0019, Task 5).
 */
import { renderToString } from "react-dom/server";
import { ExportRoot, type ExportData } from "./ExportRoot";

export function renderExportHtml(data: ExportData): string {
  return renderToString(<ExportRoot data={data} />);
}
