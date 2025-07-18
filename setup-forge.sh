#!/bin/bash

# MCServ Forge Setup Script
echo "🔧 MCServ Forge Setup"

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Error: Java is not installed. Please install Java 8 or higher first."
    exit 1
fi

# Check Java version
java_version=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
if [ "$java_version" -lt 8 ]; then
    echo "❌ Error: Java 8 or higher is required. Current version: $java_version"
    exit 1
fi

echo "✅ Java version: $(java -version 2>&1 | head -n 1)"

# Create minecraft-server directory
mkdir -p minecraft-server

echo "📥 Forge setup requires manual installation."
echo "🌐 Please visit: https://files.minecraftforge.net/"
echo "📋 Download the appropriate Forge installer for your desired version"
echo "🔧 Run the installer and follow the instructions"
echo ""
echo "💡 Tip: Forge versions are typically named like: 1.20.1-47.2.0"
echo "📁 The installer will create the necessary files in minecraft-server/" 