#!/bin/sh

set -e

# Run database migrations
echo "Running database migrations..."
npm run migrate


echo "Migrations completed."

# Start the Node.js application
echo "Starting Node.js application..."
node ./bundle.js