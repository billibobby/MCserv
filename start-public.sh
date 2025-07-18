#!/bin/bash

# MCServ Public Start Script
echo "🌍 MCServ Public Server"

# Check if ngrok is available
if command -v ngrok &> /dev/null; then
    echo "✅ Ngrok found - will start public tunnel"
    echo "🚀 Starting MCServ with public access..."
    
    # Start ngrok tunnel
    ./start-ngrok.sh &
    
    # Wait for ngrok to start
    sleep 5
    
    # Start MCServ
    ./start.sh
else
    echo "⚠️  Ngrok not found - starting in local mode only"
    echo "🚀 Starting MCServ locally..."
    ./start.sh
fi 