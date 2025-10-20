#!/bin/bash
# Script to move uploaded files to correct location for production

echo "Moving uploaded files from src/uploads to uploads..."

# Create uploads directory if it doesn't exist
mkdir -p uploads

# Move files if src/uploads exists
if [ -d "src/uploads" ]; then
    echo "Found src/uploads directory"
    cp -r src/uploads/* uploads/ 2>/dev/null || echo "No files to move"
    echo "Files moved successfully"
    ls -la uploads/
else
    echo "src/uploads directory not found"
fi

echo "Upload directory setup complete!"