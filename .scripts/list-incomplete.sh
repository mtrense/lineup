#!/usr/bin/env bash
# List incomplete candidates for a comparison type: registered candidates whose
# JSON file is missing one or more attribute keys defined in attributes.json.
#
# A key that is present with a null value counts as researched ("no data" is an
# honest answer) — only genuinely absent keys count as gaps. Candidates whose
# file is missing entirely are reported with MISSING_FILE so the orchestrator
# can surface them; it never silently invents work for unregistered files.
#
# Output: one tab-separated line per incomplete candidate, in index.json order:
#   <candidate-id>\t<comma-separated-missing-attribute-ids>
# or, when the file is absent:
#   <candidate-id>\tMISSING_FILE
# Complete candidates produce no output. Exit status is 0 even when some
# candidates are incomplete — the orchestrator reads the lines and decides.
#
# Usage: ./list-incomplete.sh <comparison-type>
set -euo pipefail

type="${1:-}"
if [[ -z "$type" ]]; then
  echo "Error: comparison type id required (usage: list-incomplete.sh <type>)" >&2
  exit 1
fi

dir="data/$type"
if [[ ! -d "$dir" ]]; then
  echo "Error: unknown comparison type '$type' — $dir does not exist." >&2
  echo "Available types:" >&2
  for d in data/*/; do
    [[ -d "$d" ]] && echo "  - $(basename "$d")" >&2
  done
  exit 1
fi
if [[ ! -f "$dir/attributes.json" ]]; then
  echo "Error: '$type' is not scaffolded yet — $dir/attributes.json is missing." >&2
  if [[ -f "$dir/RESEARCH.md" ]]; then
    echo "A RESEARCH.md exists; run /scaffold-type $type to generate attributes.json, index.json, and candidate stubs." >&2
  else
    echo "Run /new-type $type to draft the research guide, then /scaffold-type $type." >&2
  fi
  exit 1
fi
if [[ ! -f "$dir/index.json" ]]; then
  echo "Error: $dir/index.json is missing — '$type' has attribute definitions but no candidate index." >&2
  echo "Run /scaffold-type $type to create index.json and candidate stubs from RESEARCH.md." >&2
  exit 1
fi

# node is the project's runtime; paths are passed as argv (no inline data
# interpolation), emitting one TSV line per incomplete candidate.
node -e '
  const fs = require("fs");
  const dir = process.argv[1];
  const attrs = JSON.parse(fs.readFileSync(`${dir}/attributes.json`, "utf8"))
    .groups.flatMap((g) => g.attributes.map((a) => a.id));
  const index = JSON.parse(fs.readFileSync(`${dir}/index.json`, "utf8"));
  for (const entry of index.candidates) {
    const file = `${dir}/${entry.id}.json`;
    if (!fs.existsSync(file)) {
      process.stdout.write(`${entry.id}\tMISSING_FILE\n`);
      continue;
    }
    let d;
    try { d = JSON.parse(fs.readFileSync(file, "utf8")); }
    catch (e) { process.stdout.write(`${entry.id}\tBAD_JSON\n`); continue; }
    const vals = d && d.values && typeof d.values === "object" ? d.values : {};
    const missing = attrs.filter((a) => !Object.prototype.hasOwnProperty.call(vals, a));
    if (missing.length > 0) {
      process.stdout.write(`${entry.id}\t${missing.join(",")}\n`);
    }
  }
' "$dir"
