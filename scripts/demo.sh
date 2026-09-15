#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
project_dir="$(cd "$script_dir/.." && pwd)"
cd "$project_dir"

if [ ! -d node_modules ]; then
  npm install
fi

echo "Starting the AIDOS presentation at http://localhost:5173"
echo "Open docs/DEMO_SCRIPT.md for the five-minute walkthrough."
npm run demo
