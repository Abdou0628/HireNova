#!/bin/bash
# Kill all existing next dev processes
pkill -9 -f "next dev" 2>/dev/null
pkill -9 -f "next-server" 2>/dev/null
sleep 2

# Clear cache
rm -rf .next/cache 2>/dev/null

# Start fresh
cd /home/z/my-project
exec bun run dev 2>&1
