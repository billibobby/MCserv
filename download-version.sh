#!/bin/bash

# MCServ Version Download Script
echo "🎮 MCServ Version Download Tool"

# This script downloads specific Minecraft versions
# Usage: ./download-version.sh <version>

VERSION=${1:-"1.20.1"}

if [ -z "$1" ]; then
    echo "Usage: $0 <version>"
    echo "Example: $0 1.20.1"
    echo "Available versions: 1.8.0, 1.12.2, 1.16.5, 1.18.2, 1.19.4, 1.20.1, 1.21.8"
    exit 1
fi

# Create minecraft-server directory
mkdir -p minecraft-server

echo "📥 Downloading Minecraft Server version $VERSION..."

# Download the server
curl -L -o "minecraft-server/server-$VERSION.jar" "https://piston-data.mojang.com/v1/objects/$(curl -s "https://launchermeta.mojang.com/mc/game/version_manifest.json" | grep -o "\"id\": \"$VERSION\"" -A 10 | grep -o "\"url\": \"[^\"]*\"" | cut -d'"' -f4 | head -1)"

if [ $? -eq 0 ]; then
    echo "✅ Successfully downloaded Minecraft Server $VERSION"
    echo "📁 File saved as: minecraft-server/server-$VERSION.jar"
else
    echo "❌ Failed to download Minecraft Server $VERSION"
    exit 1
fi 