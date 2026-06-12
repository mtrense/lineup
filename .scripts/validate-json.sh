#!/usr/bin/env bash
# Validate that each given file parses as JSON.
#
# Replaces ad-hoc `python3 -m json.tool <file> && echo "VALID JSON"` calls with
# a single allow-listed command. Shared by the JSON-writing skills (add-candidate,
# discover-candidates, extend-comparison, gather-data, scaffold-type) and the
# gather-data-worker subagent; also handy to run by hand:
#   bash .scripts/validate-json.sh data/<type>/<candidate>.json
#
# Output: one tab-separated line per file:
#   <file>\tVALID
#   <file>\tINVALID\t<parse error>
#   <file>\tMISSING
# Exit status: 0 when every file is valid, 1 otherwise.
#
# Usage: ./validate-json.sh <file.json> [...]
set -uo pipefail

if [[ $# -eq 0 ]]; then
  echo "Error: at least one file required (usage: validate-json.sh <file.json> ...)" >&2
  exit 1
fi

status=0
for file in "$@"; do
  if [[ ! -f "$file" ]]; then
    printf '%s\tMISSING\n' "$file"
    status=1
    continue
  fi
  if err=$(python3 -m json.tool "$file" 2>&1 >/dev/null); then
    printf '%s\tVALID\n' "$file"
  else
    printf '%s\tINVALID\t%s\n' "$file" "${err//$'\n'/ }"
    status=1
  fi
done
exit $status
