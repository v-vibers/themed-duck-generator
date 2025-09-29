#!/bin/bash
# Auto-generated runtime environment variables
if [ -n "${SUBSCRIBE_DEV_PROJECT_TOKEN}" ]; then
  export VITE_SUBSCRIBE_DEV_PROJECT_TOKEN="${SUBSCRIBE_DEV_PROJECT_TOKEN}"
  echo "✅ Exposed SUBSCRIBE_DEV_PROJECT_TOKEN as VITE_SUBSCRIBE_DEV_PROJECT_TOKEN"
else
  echo "⚠️ SUBSCRIBE_DEV_PROJECT_TOKEN not found in environment"
fi
