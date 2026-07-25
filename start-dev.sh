#!/bin/bash
# HireNova — Dev Server Startup Script (Turbopack)
# Usage: bash start-dev.sh
# Better for development: auto-restart on file changes.
# Warning: Uses more RAM (~2GB) than production mode.

set -e
cd /home/z/my-project

echo "[HireNova] Starting dev server with Turbopack..."
exec bun run dev
