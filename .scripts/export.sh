#!/usr/bin/env bash
# Repo-root wrapper for the self-contained HTML export CLI (see PLAN.md,
# milestone 0019). Runs the `export` script defined in app/package.json so
# `pnpm export` also works from the repo root, fitting the existing
# `.scripts/` convention.
#
# Writes only the assembled HTML document to stdout (all logs/build noise
# goes to stderr), so redirection produces a valid file:
#   .scripts/export.sh <comparison-type> > file.html
#
# Usage: ./export.sh <comparison-type>
set -euo pipefail

if [[ $# -eq 0 ]]; then
  echo "Error: comparison type id required (usage: export.sh <type>)" >&2
  exit 1
fi

pnpm --dir app export "$@"
