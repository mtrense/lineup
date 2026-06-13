// Icon registry — single source of truth for all glyphs used in the app.
// Add a new glyph by importing it here and adding an entry to the relevant map.
// Do NOT use library.add() global mutation or barrel imports of entire icon packs.

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

// --- FontAwesome individual icon imports ---
import { faRust } from "@fortawesome/free-brands-svg-icons";
import { faPython } from "@fortawesome/free-brands-svg-icons";
import { faJs } from "@fortawesome/free-brands-svg-icons";
import { faLinux } from "@fortawesome/free-brands-svg-icons";
import { faApple } from "@fortawesome/free-brands-svg-icons";
import { faWindows } from "@fortawesome/free-brands-svg-icons";
import { faAndroid } from "@fortawesome/free-brands-svg-icons";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { faServer } from "@fortawesome/free-solid-svg-icons";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";

// --- Devicon SVG imports (resolved to asset URL by Vite, stub string in Vitest) ---
import rustSvg from "devicon/icons/rust/rust-original.svg";
import pythonSvg from "devicon/icons/python/python-original.svg";
import javascriptSvg from "devicon/icons/javascript/javascript-original.svg";
import typescriptSvg from "devicon/icons/typescript/typescript-original.svg";
import goSvg from "devicon/icons/go/go-original.svg";
import kotlinSvg from "devicon/icons/kotlin/kotlin-original.svg";
import dartSvg from "devicon/icons/dart/dart-original.svg";
import csharpSvg from "devicon/icons/csharp/csharp-original.svg";
import scalaSvg from "devicon/icons/scala/scala-original.svg";
import clojureSvg from "devicon/icons/clojure/clojure-original.svg";
import elmSvg from "devicon/icons/elm/elm-original.svg";
import linuxSvg from "devicon/icons/linux/linux-original.svg";
import appleSvg from "devicon/icons/apple/apple-original.svg";
import windows8Svg from "devicon/icons/windows8/windows8-original.svg";

// ---- Types ----

export type IconPack = "fa-solid" | "fa-brands" | "fa-regular" | "devicon";

export interface IconRef {
  name: string;
  pack?: IconPack;
}

export type ResolvedIcon =
  | { kind: "fa"; def: IconDefinition }
  | { kind: "svg"; url: string };

// ---- FontAwesome registry ----
// Map: icon name → IconDefinition
// Pack is determined by which map the caller consults (solid vs brands).

const faRegistry: Record<string, IconDefinition> = {
  // brands
  rust: faRust,
  python: faPython,
  js: faJs,
  javascript: faJs,
  linux: faLinux,
  apple: faApple,
  windows: faWindows,
  android: faAndroid,
  // solid
  code: faCode,
  globe: faGlobe,
  server: faServer,
  database: faDatabase,
};

// ---- Devicon registry ----
// Map: icon name → SVG asset URL string

const deviconRegistry: Record<string, string> = {
  rust: rustSvg,
  python: pythonSvg,
  javascript: javascriptSvg,
  js: javascriptSvg,
  typescript: typescriptSvg,
  ts: typescriptSvg,
  go: goSvg,
  golang: goSvg,
  kotlin: kotlinSvg,
  dart: dartSvg,
  csharp: csharpSvg,
  "c#": csharpSvg,
  scala: scalaSvg,
  clojure: clojureSvg,
  elm: elmSvg,
  linux: linuxSvg,
  apple: appleSvg,
  windows: windows8Svg,
  windows8: windows8Svg,
};

// ---- Resolver ----

/**
 * Resolve an IconRef to a renderable icon descriptor.
 * Returns null when the (pack, name) pair is not in the registry.
 */
export function resolveIcon(ref: IconRef): ResolvedIcon | null {
  const pack = ref.pack ?? "fa-solid";
  const name = ref.name;

  if (pack === "devicon") {
    // Prefer a FontAwesome brand glyph when one exists: it fills with
    // `currentColor`, so it stays legible on both light and dark themes,
    // whereas a Devicon <img> carries baked-in colors that can vanish against
    // a matching background (e.g. Rust's solid-black logo on a dark theme).
    // Logos without an FA equivalent fall back to the full-color Devicon image.
    const fa = faRegistry[name];
    if (fa != null) {
      return { kind: "fa", def: fa };
    }
    const url = deviconRegistry[name];
    return url != null ? { kind: "svg", url } : null;
  }

  // fa-solid, fa-brands, fa-regular all share the same definition map because
  // the definitions imported above already carry their correct prefix.
  const def = faRegistry[name];
  return def != null ? { kind: "fa", def } : null;
}
