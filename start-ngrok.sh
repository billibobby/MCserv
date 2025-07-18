#!/bin/bash

# MCServ Ngrok Start Script
echo "🌐 MCServ Ngrok Tunnel"

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ Error: ngrok is not installed."
    echo "📥 Download from: https://ngrok.com/download"
    echo "🔧 Install and authenticate with: ngrok authtoken YOUR_TOKEN"
    exit 1
fi

# Check if ngrok is authenticated
if [ ! -f ~/.ngrok2/ngrok.yml ]; then
    echo "⚠️  Ngrok not authenticated. Please run: ngrok authtoken YOUR_TOKEN"
    exit 1
fi

echo "✅ Ngrok found and authenticated"

# Start HTTP tunnel for MCServ web interface
echo "🚀 Starting HTTP tunnel for MCServ web interface..."
ngrok http 3000 --log=stdout > ngrok-http.log 2>&1 &

# Wait a moment for ngrok to start
sleep 3

# Get the public URL
if [ -f ngrok-http.log ]; then
    PUBLIC_URL=$(grep -o "https://[a-zA-Z0-9]*\.ngrok\.io" ngrok-http.log | head -1)
    if [ ! -z "$PUBLIC_URL" ]; then
        echo "✅ MCServ web interface available at: $PUBLIC_URL"
        echo "🔗 Share this URL with others to access MCServ"
    else
        echo "⚠️  Could not get public URL. Check ngrok-http.log for details."
    fi
else
    echo "⚠️  Ngrok log file not found."
fi

echo "📝 Ngrok logs saved to: ngrok-http.log"
echo "🛑 To stop ngrok, run: pkill ngrok" 