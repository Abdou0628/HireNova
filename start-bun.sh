#!/bin/bash
cd /home/z/my-project/.next/standalone
while true; do
  bun server.js >> /home/z/my-project/dev.log 2>&1
  echo "$(date): bun server exited, restarting" >> /home/z/my-project/dev.log
  sleep 1
done
