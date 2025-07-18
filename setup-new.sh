#!/bin/bash

# MCServ Setup Script
echo "Setting up MCServ..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install npm first."
    exit 1
fi

echo "Installing dependencies..."
npm install

echo "Creating necessary directories..."
mkdir -p backups
mkdir -p uploads
mkdir -p minecraft-server

echo "Setting up configuration..."
if [ ! -f "config.js" ]; then
    cp config.example.js config.js
    echo "Created config.js from template. Please edit it with your settings."
fi

echo "Setup complete! Run './start-new.sh' to start the server." 