#!/bin/bash
# GroundChiFlow — run in browser (mobile simulation)
# Use this when Expo Go on phone has issues. Opens at http://localhost:8081

cd "$(dirname "$0")"

# Free port 8081 if in use
if lsof -i :8081 >/dev/null 2>&1; then
  echo "Freeing port 8081..."
  lsof -i :8081 | awk 'NR>1 {print $2}' | xargs -r kill 2>/dev/null
  sleep 2
fi

echo "Starting GroundChiFlow (web)..."
echo "Open http://localhost:8081 in your browser"
echo "Tap 'Skip for now' on the login screen"
echo ""
exec npm run web
