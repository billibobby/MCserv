#!/bin/bash

echo "🎮 Welcome to MCServ Setup!"
echo "================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first:"
    echo "   macOS: brew install git"
    echo "   Ubuntu/Debian: sudo apt-get install git"
    echo "   Windows: Download from https://git-scm.com/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   Download from https://nodejs.org/"
    exit 1
fi

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java first:"
    echo "   Download from https://adoptium.net/"
    exit 1
fi

echo "✅ All requirements are installed!"
echo ""

# Ask user where to install MCServ
echo "Where would you like to install MCServ?"
echo "1. Current directory (./mcserv)"
echo "2. Home directory (~/mcserv)"
echo "3. Custom location"
read -p "Choose option (1-3): " choice

case $choice in
    1)
        INSTALL_DIR="./mcserv"
        ;;
    2)
        INSTALL_DIR="$HOME/mcserv"
        ;;
    3)
        read -p "Enter custom path: " INSTALL_DIR
        ;;
    *)
        echo "Invalid choice. Using current directory."
        INSTALL_DIR="./mcserv"
        ;;
esac

echo ""
echo "📥 Downloading MCServ from GitHub..."

# Clone the repository
if git clone https://github.com/billibobby/MCserv.git "$INSTALL_DIR"; then
    echo "✅ MCServ downloaded successfully!"
else
    echo "❌ Failed to download MCServ. Please check your internet connection."
    exit 1
fi

# Navigate to the directory
cd "$INSTALL_DIR"

echo ""
echo "📦 Installing dependencies..."

# Install dependencies
if npm install; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies. Please try running 'npm install' manually."
    exit 1
fi

echo ""
echo "🎉 MCServ is ready to use!"
echo ""
echo "To start MCServ:"
echo "   cd $INSTALL_DIR"
echo "   node server.js"
echo ""
echo "Then open your browser to: http://localhost:3000"
echo ""
echo "💡 MCServ will automatically check for updates and notify you when new versions are available!"
echo "   You can also manually update by clicking the 'Update MCServ' button in the Settings tab."
echo ""
echo "Happy hosting! 🎮" 