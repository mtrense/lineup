#!/usr/bin/env bash
# List unchecked candidate names from a comparison type's RESEARCH.md.
#
# Walks data/<type>/RESEARCH.md, finds the "Candidates" section, and prints one
# unchecked candidate per line — the display name only (text after "- [ ] ",
# trimmed at the first " — " so the reason/date suffix is dropped).
#
# Output: one candidate name per line, in declared order.
# Usage: ./list-unchecked.sh <comparison-type>
set -euo pipefail

type="${1:-}"
if [[ -z "$type" ]]; then
  echo "Error: comparison type id required (usage: list-unchecked.sh <type>)" >&2
  exit 1
fi

research_file="data/$type/RESEARCH.md"
if [[ ! -f "$research_file" ]]; then
  echo "Error: $research_file not found" >&2
  exit 1
fi

# Enter the Candidates section on a "## ... Candidates ..." heading, leave it on
# the next "## " heading. Within it, emit each "- [ ] <name>" line, stripping the
# checkbox prefix and any " — <reason>" suffix, then trimming whitespace.
awk '
  /^##[[:space:]]/ {
    in_section = (tolower($0) ~ /candidates/) ? 1 : 0
    next
  }
  in_section && /^[[:space:]]*-[[:space:]]*\[[[:space:]]\][[:space:]]*/ {
    line = $0
    sub(/^[[:space:]]*-[[:space:]]*\[[[:space:]]\][[:space:]]*/, "", line)
    sub(/[[:space:]]+[—-][[:space:]].*$/, "", line)   # drop " — reason" or " - reason"
    gsub(/[*`]/, "", line)                            # strip markdown bold/italic/code markers
    gsub(/^[[:space:]]+|[[:space:]]+$/, "", line)
    if (line != "") print line
  }
' "$research_file"
