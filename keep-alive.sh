#!/bin/bash

# MCServ Ngrok Keep-Alive Script
echo "🔄 MCServ Ngrok Keep-Alive"

# Check if ngrok is running
if ! pgrep -x "ngrok" > /dev/null; then
    echo "❌ Ngrok is not running. Starting ngrok..."
    ./start-ngrok.sh
else
    echo "✅ Ngrok is running"
fi

# Keep the script running and restart ngrok if it dies
while true; do
    if ! pgrep -x "ngrok" > /dev/null; then
        echo "🔄 Ngrok stopped. Restarting..."
        ./start-ngrok.sh
    fi
    
    # Wait 30 seconds before checking again
    sleep 30
done 