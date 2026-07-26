#!/bin/bash
# Persistent server launcher — reparents to init (PID 1) via setsid
cd /home/z/my-project/.next/standalone
while true; do
  node --max-old-space-size=512 server.js >> /home/z/my-project/dev.log 2>&1
  echo "$(date): server exited, restarting in 1s" >> /home/z/my-project/dev.log
  sleep 1
done
