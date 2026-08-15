#!/bin/bash
while true; do
  echo "[$(date '+%H:%M:%S')] Starting dev server..."
  bun run dev > dev.log 2>&1
  EXIT_CODE=$?
  echo "[$(date '+%H:%M:%S')] Dev server exited with code $EXIT_CODE, restarting in 2s..."
  sleep 2
done
