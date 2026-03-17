#!/bin/sh

# Wait for the volume to be mounted and requirements.txt to be available
echo "Checking for requirements.txt..."
while [ ! -f requirements.txt ]; do
  echo "requirements.txt not found, waiting..."
  sleep 1
done

echo "Found requirements.txt, installing dependencies..."
pip install --upgrade pip
pip install --no-cache-dir -r requirements.txt

# Execute the provided command (CMD from Dockerfile)
exec "$@"