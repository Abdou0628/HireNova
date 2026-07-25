#!/bin/bash
# HireNova — Production Server Startup Script
# Usage: bash start-production.sh
# This script must run in the background to keep the server alive.

set -e
cd /home/z/my-project

echo "[HireNova] Killing any existing servers..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "node.*server.js" 2>/dev/null || true
sleep 1

# Ensure static files are in standalone dir
echo "[HireNova] Syncing static files..."
cp -r .next/static .next/standalone/.next/static 2>/dev/null
cp -r public .next/standalone/public 2>/dev/null

# Start production server
echo "[HireNova] Starting production server on port 3000..."
exec node --max-old-space-size=1024 .next/standalone/server.js
