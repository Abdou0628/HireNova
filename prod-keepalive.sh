#!/bin/bash
cd /home/z/my-project
while true; do
  node --max-old-space-size=512 .next/standalone/server.js >> /home/z/my-project/dev.log 2>&1
  echo "$(date): prod server died, restarting in 1s..." >> /home/z/my-project/dev.log
  sleep 1
done
