#!/usr/bin/env bash
# Verify a batch of freshly-written candidate JSON files for a comparison type.
#
# For each candidate id passed, checks that data/<type>/<id>.json exists, parses
# as JSON, and reports its lastVerified date plus populated/null value counts.
# This replaces ad-hoc `node -e` loops in the gather-data-cycle orchestrator so
# the Step 5 post-flight check runs through a single allow-listed command instead
# of an unallowlistable `cd ...; for ...; do node -e ...; done` compound.
#
# Output: one tab-separated line per candidate:
#   <id>\t<ok|MISSING|BAD_JSON>\t<lastVerified|->\t<populated>\t<null>
# Exit status is 0 even when individual candidates fail — the orchestrator reads
# the per-line status and decides whether to halt.
#
# Usage: ./verify-batch.sh <comparison-type> <candidate-id> [<candidate-id> ...]
set -euo pipefail

type="${1:-}"
if [[ -z "$type" ]]; then
  echo "Error: comparison type id required (usage: verify-batch.sh <type> <id>...)" >&2
  exit 1
fi
shift

if [[ $# -eq 0 ]]; then
  echo "Error: at least one candidate id required" >&2
  exit 1
fi

for id in "$@"; do
  file="data/$type/$id.json"
  if [[ ! -f "$file" ]]; then
    printf '%s\tMISSING\t-\t0\t0\n' "$id"
    continue
  fi
  # node is the project's runtime; parse + summarise the file with the path passed
  # as argv (no inline data interpolation), emitting one TSV line.
  node -e '
    const fs = require("fs");
    const [id, file] = [process.argv[1], process.argv[2]];
    let d;
    try { d = JSON.parse(fs.readFileSync(file, "utf8")); }
    catch (e) { process.stdout.write(`${id}\tBAD_JSON\t-\t0\t0\n`); process.exit(0); }
    const vals = d && d.values && typeof d.values === "object" ? d.values : {};
    let pop = 0, nul = 0;
    for (const k of Object.keys(vals)) {
      const v = vals[k] && Object.prototype.hasOwnProperty.call(vals[k], "value") ? vals[k].value : undefined;
      if (v === null || v === undefined) nul++; else pop++;
    }
    const lv = d && d.lastVerified ? d.lastVerified : "-";
    process.stdout.write(`${id}\tok\t${lv}\t${pop}\t${nul}\n`);
  ' "$id" "$file"
done
