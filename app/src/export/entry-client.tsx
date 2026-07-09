/**
 * Browser hydration entry for the HTML export. Bundled by the dedicated
 * export Vite build (see PLAN.md, milestone 0019, Task 4) and inlined into
 * the exported HTML file's `<script>` tag. Hydrates the same `ExportRoot`
 * tree the SSR render (render.tsx) produced, so the client and server trees
 * match and no hydration mismatch occurs.
 */
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import "../index.css";
import { ExportRoot, type ExportData } from "./ExportRoot";

declare global {
  interface Window {
    __LINEUP_DATA__: ExportData;
  }
}

hydrateRoot(
  document.getElementById("root")!,
  <StrictMode>
    <ExportRoot data={window.__LINEUP_DATA__} />
  </StrictMode>
);
