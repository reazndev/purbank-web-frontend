#!/bin/sh
set -e

# Default values if not provided
API_URL=${API_URL:-"https://ebanking.purbank.ch/api/v1"}

echo "Generating runtime configuration..."
echo "API_URL: ${API_URL}"

# Generate the config.json file with runtime environment variables
cat > /usr/share/nginx/html/assets/config.json <<EOF
{
  "apiUrl": "${API_URL}"
}
EOF

echo "Runtime configuration generated successfully"
cat /usr/share/nginx/html/assets/config.json

# Execute the main command (start nginx)
exec "$@"