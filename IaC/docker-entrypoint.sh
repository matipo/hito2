#!/bin/sh
set -e

cat > /usr/share/nginx/html/config.js <<EOF
window.__API_URL__ = "${API_URL:-http://localhost:8080}";
EOF

exec nginx -g "daemon off;"
