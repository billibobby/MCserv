# MCServ - Minecraft Server Management Tool

A powerful web-based Minecraft server management tool with mod browsing, real-time monitoring, and easy setup.

## Features

- 🎮 **Server Management**: Start, stop, and monitor Minecraft servers
- 📦 **Mod Browser**: Browse and install mods from Modrinth
- 🔄 **Real-time Updates**: Live server logs and status updates
- 🌐 **Public Sharing**: Share your server with friends via ngrok
- 💾 **Backup System**: Automatic world backups
- 🎨 **Beautiful UI**: Modern, user-friendly interface
- ⚡ **Auto-updates**: One-click updates from GitHub

## Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/billibobby/MCserv.git
   cd MCserv
   ```

2. **Run setup**:
   ```bash
   chmod +x setup-new.sh
   ./setup-new.sh
   ```

3. **Start the server**:
   ```bash
   chmod +x start-new.sh
   ./start-new.sh
   ```

4. **Open in browser**:
   Navigate to `http://localhost:3000`

## Configuration

Copy `config-new.example.js` to `config.js` and edit the settings:

```javascript
module.exports = {
    port: 3000,
    minecraftServer: {
        maxMemory: '2G',
        port: 25565
    }
    // ... more options
};
```

## Features in Detail

### Server Management
- Start/stop vanilla and Forge servers
- Real-time server logs with friendly messages
- Memory and performance monitoring
- Automatic crash detection and restart

### Mod Browser
- Browse thousands of mods from Modrinth
- Search by name, category, or Minecraft version
- One-click mod installation
- Version compatibility checking

### Public Sharing
- Share your server with friends via ngrok
- Persistent public URLs
- Connection diagnostics
- Port testing and troubleshooting

### Backup System
- Automatic world backups
- Manual backup creation
- Backup restoration
- Configurable backup intervals

## Development

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Java 8+ (for Minecraft servers)

### Local Development
```bash
npm install
npm run dev
```

### Building for Production
```bash
npm run build
npm start
```

## Troubleshooting

### Common Issues

**Server won't start:**
- Check if Java is installed
- Verify port 25565 is available
- Check server logs in the web interface

**Can't connect from friends:**
- Use the connection diagnostics tool
- Check firewall settings
- Try the public sharing feature

**Mods not loading:**
- Verify Minecraft version compatibility
- Check Forge installation
- Review mod dependencies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- Create an issue on GitHub
- Check the troubleshooting section
- Review the configuration options

---

**MCServ** - Making Minecraft server management simple and beautiful! 🎮✨ 