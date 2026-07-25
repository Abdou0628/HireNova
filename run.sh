#!/bin/bash
# Startup script for HireNova
cd /home/z/my-project

# Kill any existing server
pkill -f "node.*server.js" 2>/dev/null
pkill -f "next dev" 2>/dev/null
sleep 1

# Copy static files for standalone
cp -r .next/static .next/standalone/.next/static 2>/dev/null
cp -r public .next/standalone/public 2>/dev/null

# Start production server
exec node --max-old-space-size=1024 .next/standalone/server.js
