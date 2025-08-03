#!/bin/sh
set -e

echo "Waiting for MySQL to be ready..."
for i in $(seq 1 60); do
  if mysqladmin ping -h"mysql" --silent; then
    break
  fi
  echo "Waiting for MySQL to be ready... ($i/60)"
  sleep 1
done

echo "Running database migrations..."
npm run prisma:deploy

echo "Starting the application..."
exec node dist/index.js