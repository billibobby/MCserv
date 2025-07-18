# Minecraft Server Directory

This directory contains templates and configuration files for running a Minecraft server.

## Template Files

### Configuration Templates
- **`server.properties.template`** - Server configuration template
- **`eula.txt.template`** - EULA agreement template
- **`user_jvm_args.txt.template`** - JVM arguments template

### Script Templates
- **`run.sh.template`** - Linux/macOS server start script
- **`run.bat.template`** - Windows server start script

## Setup Instructions

1. **Copy templates to working files:**
   ```bash
   cp server.properties.template server.properties
   cp eula.txt.template eula.txt
   cp user_jvm_args.txt.template user_jvm_args.txt
   cp run.sh.template run.sh
   cp run.bat.template run.bat
   ```

2. **Edit the configuration files:**
   - Edit `server.properties` with your server settings
   - Edit `eula.txt` and change `eula=false` to `eula=true`
   - Edit `user_jvm_args.txt` with your preferred JVM settings

3. **Download a server JAR:**
   - Use the download scripts in the main directory
   - Or download manually from Mojang/Forge

4. **Make scripts executable (Linux/macOS):**
   ```bash
   chmod +x run.sh
   ```

5. **Start the server:**
   - Linux/macOS: `./run.sh`
   - Windows: `run.bat`

## Important Notes

- **Server JAR files** are not included in this repository (too large)
- **World data** is not included (user-specific)
- **Logs and crash reports** are excluded from Git
- **Player data** (bans, ops, whitelist) is excluded from Git

## File Descriptions

- **`server.jar`** - Symbolic link to the current server JAR
- **`server-*.jar`** - Downloaded server JAR files
- **`forge-*.jar`** - Forge installer and server files
- **`world/`** - Minecraft world data (excluded from Git)
- **`logs/`** - Server logs (excluded from Git)
- **`mods/`** - Installed mods (excluded from Git)
- **`libraries/`** - Minecraft libraries (excluded from Git) 