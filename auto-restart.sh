#!/bin/bash
# Auto-restart HireNova dev server if it dies
# Called by cron every 2 minutes

cd /home/z/my-project

# Check if next-server is running
if ! pgrep -f "next-server" > /dev/null 2>&1; then
  echo "$(date): next-server not running, restarting..." >> /home/z/my-project/auto-restart.log
  pkill -f "next dev" 2>/dev/null
  pkill -f "bun run dev" 2>/dev/null
  sleep 1
  setsid bash /home/z/my-project/keep-alive.sh < /dev/null > /dev/null 2>&1 &
  echo "$(date): keep-alive restarted" >> /home/z/my-project/auto-restart.log
else
  # Server alive, just log
  echo "$(date): server OK" >> /home/z/my-project/auto-restart.log
fi
