#!/usr/bin/env bash
# Verify a batch of freshly-written candidate JSON files for a comparison type.
#
# For each candidate id passed, checks that data/<type>/<id>.json exists, parses
# as JSON, and reports its lastVerified date plus populated/null value counts.
# This replaces ad-hoc `node -e` loops in the gather-data-cycle orchestrator so
# the Step 5 post-flight check runs through a single allow-listed command instead
# of an unallowlistable `cd ...; for ...; do node -e ...; done` compound.
#
# A candidate argument may carry a required-attribute suffix:
#   <id>:<attr1>,<attr2>,...
# Then the named keys must be present in the file's `values` object (a key with
# a null value counts as present). Used by backfill batches to verify that the
# attributes a worker was briefed to fill actually landed.
#
# Output: one tab-separated line per candidate:
#   <id>\t<ok|MISSING|BAD_JSON|MISSING_ATTRS>\t<lastVerified|->\t<populated>\t<null>\t<missing-attr-ids|->
# Exit status is 0 even when individual candidates fail — the orchestrator reads
# the per-line status and decides whether to halt.
#
# Usage: ./verify-batch.sh <comparison-type> <candidate-id>[:<attrs>] [...]
set -euo pipefail

type="${1:-}"
if [[ -z "$type" ]]; then
  echo "Error: comparison type id required (usage: verify-batch.sh <type> <id>[:<attrs>]...)" >&2
  exit 1
fi
shift

if [[ $# -eq 0 ]]; then
  echo "Error: at least one candidate id required" >&2
  exit 1
fi

for arg in "$@"; do
  id="${arg%%:*}"
  required=""
  if [[ "$arg" == *:* ]]; then
    required="${arg#*:}"
  fi
  file="data/$type/$id.json"
  if [[ ! -f "$file" ]]; then
    printf '%s\tMISSING\t-\t0\t0\t-\n' "$id"
    continue
  fi
  # node is the project's runtime; parse + summarise the file with the path and
  # required attrs passed as argv (no inline data interpolation), one TSV line.
  node -e '
    const fs = require("fs");
    const [id, file, required] = [process.argv[1], process.argv[2], process.argv[3]];
    let d;
    try { d = JSON.parse(fs.readFileSync(file, "utf8")); }
    catch (e) { process.stdout.write(`${id}\tBAD_JSON\t-\t0\t0\t-\n`); process.exit(0); }
    const vals = d && d.values && typeof d.values === "object" ? d.values : {};
    let pop = 0, nul = 0;
    for (const k of Object.keys(vals)) {
      const v = vals[k] && Object.prototype.hasOwnProperty.call(vals[k], "value") ? vals[k].value : undefined;
      if (v === null || v === undefined) nul++; else pop++;
    }
    const lv = d && d.lastVerified ? d.lastVerified : "-";
    const missing = (required ? required.split(",").filter(Boolean) : [])
      .filter((a) => !Object.prototype.hasOwnProperty.call(vals, a));
    const status = missing.length > 0 ? "MISSING_ATTRS" : "ok";
    process.stdout.write(`${id}\t${status}\t${lv}\t${pop}\t${nul}\t${missing.join(",") || "-"}\n`);
  ' "$id" "$file" "$required"
done
