#!/bin/bash

# MCServ Vanilla Server Download Script
echo "🎮 MCServ Vanilla Server Download"

# Check if curl is available
if ! command -v curl &> /dev/null; then
    echo "❌ Error: curl is not installed. Please install curl first."
    exit 1
fi

# Create minecraft-server directory if it doesn't exist
mkdir -p minecraft-server

# Function to download vanilla server
download_vanilla() {
    local version=$1
    echo "📥 Downloading Minecraft Vanilla Server $version..."
    
    # Get the version manifest
    local manifest_url="https://launchermeta.mojang.com/mc/game/version_manifest.json"
    local version_url=$(curl -s "$manifest_url" | grep -o "\"id\": \"$version\"" -A 10 | grep -o "\"url\": \"[^\"]*\"" | cut -d'"' -f4 | head -1)
    
    if [ -z "$version_url" ]; then
        echo "❌ Error: Could not find download URL for version $version"
        return 1
    fi
    
    # Get the server.jar URL
    local jar_url=$(curl -s "$version_url" | grep -o "\"url\": \"[^\"]*server.jar[^\"]*\"" | cut -d'"' -f4)
    
    if [ -z "$jar_url" ]; then
        echo "❌ Error: Could not find server.jar URL for version $version"
        return 1
    fi
    
    echo "🔗 Downloading from: $jar_url"
    curl -L -o "minecraft-server/server-$version.jar" "$jar_url"
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully downloaded Minecraft Server $version"
        echo "📁 File saved as: minecraft-server/server-$version.jar"
    else
        echo "❌ Failed to download Minecraft Server $version"
        return 1
    fi
}

# Main menu
echo ""
echo "Available versions:"
echo "1) 1.21.8 (Latest)"
echo "2) 1.20.1 (Recommended)"
echo "3) 1.19.4"
echo "4) 1.18.2"
echo "5) Exit"
echo ""

read -p "Choose a version (1-5): " choice

case $choice in
    1)
        download_vanilla "1.21.8"
        ;;
    2)
        download_vanilla "1.20.1"
        ;;
    3)
        download_vanilla "1.19.4"
        ;;
    4)
        download_vanilla "1.18.2"
        ;;
    5)
        echo "👋 Exiting..."
        exit 0
        ;;
    *)
        echo "❌ Invalid option. Please choose 1-5."
        exit 1
        ;;
esac 