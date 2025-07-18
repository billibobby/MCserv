#!/bin/bash

# MCServ Server Download Script
echo "MCServ Server Download Tool"

# Check if curl is available
if ! command -v curl &> /dev/null; then
    echo "Error: curl is not installed. Please install curl first."
    exit 1
fi

# Create minecraft-server directory if it doesn't exist
mkdir -p minecraft-server

# Function to download vanilla server
download_vanilla() {
    local version=$1
    echo "Downloading Minecraft Vanilla Server $version..."
    
    local url="https://piston-data.mojang.com/v1/objects/$(curl -s "https://launchermeta.mojang.com/mc/game/version_manifest.json" | grep -o "\"id\": \"$version\"" -A 10 | grep -o "\"url\": \"[^\"]*\"" | cut -d'"' -f4 | head -1)"
    
    if [ -z "$url" ]; then
        echo "Error: Could not find download URL for version $version"
        return 1
    fi
    
    local jar_url=$(curl -s "$url" | grep -o "\"url\": \"[^\"]*server.jar[^\"]*\"" | cut -d'"' -f4)
    
    if [ -z "$jar_url" ]; then
        echo "Error: Could not find server.jar URL for version $version"
        return 1
    fi
    
    echo "Downloading from: $jar_url"
    curl -L -o "minecraft-server/server-$version.jar" "$jar_url"
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully downloaded Minecraft Server $version"
        echo "File saved as: minecraft-server/server-$version.jar"
    else
        echo "❌ Failed to download Minecraft Server $version"
        return 1
    fi
}

# Function to download Forge server
download_forge() {
    local version=$1
    local forge_version=$2
    
    echo "Downloading Minecraft Forge Server $version-$forge_version..."
    
    # This is a simplified version - in practice you'd need to use the Forge installer
    echo "Forge download requires manual installation."
    echo "Please visit: https://files.minecraftforge.net/"
    echo "And download the appropriate Forge installer for version $version"
}

# Main menu
echo ""
echo "Available options:"
echo "1) Download Vanilla Server (1.20.1)"
echo "2) Download Vanilla Server (1.19.4)"
echo "3) Download Vanilla Server (1.18.2)"
echo "4) Download Forge Server"
echo "5) Exit"
echo ""

read -p "Choose an option (1-5): " choice

case $choice in
    1)
        download_vanilla "1.20.1"
        ;;
    2)
        download_vanilla "1.19.4"
        ;;
    3)
        download_vanilla "1.18.2"
        ;;
    4)
        echo "Forge download requires manual installation."
        echo "Please visit: https://files.minecraftforge.net/"
        ;;
    5)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid option. Please choose 1-5."
        exit 1
        ;;
esac 