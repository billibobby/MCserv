const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs').promises;
const { spawn, exec } = require('child_process');
const cors = require('cors');
const https = require('https');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;
const MINECRAFT_PORT = 25565;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Global variables
let minecraftProcess = null;
let serverStatus = 'stopped';
let currentHost = null; // Track current host
let connectedUsers = new Map(); // socketId -> {username, color, isHost}
let userColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
];
let colorIndex = 0;

// Auto-update system
const CURRENT_VERSION = '1.0.0';
const GITHUB_REPO = 'billibobby/MCserv';
let updateCheckInterval = null;

// Utility functions
function getNextColor() {
  const color = userColors[colorIndex];
  colorIndex = (colorIndex + 1) % userColors.length;
  return color;
}

function sanitizeUsername(username) {
  if (!username || username.trim() === '') {
    return 'Anonymous';
  }
  // Allow letters, numbers, spaces, and common characters, but remove special chars
  return username.trim().replace(/[^\w\s-]/g, '').substring(0, 16);
}

async function readLatestLog() {
  try {
    const logPath = path.join(__dirname, 'minecraft-server', 'logs', 'latest.log');
    const data = await fs.readFile(logPath, 'utf8');
    return data;
    } catch (error) {
    return 'No log file found or server not running.';
  }
}

function parseLogLine(line) {
  const timestampMatch = line.match(/^\[(\d{2}:\d{2}:\d{2})\] \[([^\/]+)\/([^\]]+)\]/);
  if (timestampMatch) {
    const [, timestamp, thread, level] = timestampMatch;
    const firstBracket = line.indexOf(']');
    const secondBracket = line.indexOf(']', firstBracket + 1);
    const thirdBracket = line.indexOf(']', secondBracket + 1);
    const message = line.substring(thirdBracket + 1).trim();
    return { timestamp, thread, level, message };
  }
  return { timestamp: '', thread: '', level: 'INFO', message: line };
}

// Auto-update functions
async function checkForUpdates() {
  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;
    const data = await new Promise((resolve, reject) => {
      https.get(url, {
        headers: {
          'User-Agent': 'MCServ-Update-Checker'
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });

    if (data.tag_name && data.tag_name !== `v${CURRENT_VERSION}`) {
      return {
        available: true,
        version: data.tag_name,
        downloadUrl: data.html_url,
        changelog: data.body || 'No changelog available',
        publishedAt: data.published_at
      };
    }
    return { available: false };
  } catch (error) {
    console.error('Error checking for updates:', error);
    return { available: false, error: error.message };
  }
}

function startUpdateChecker() {
  // Check for updates every 6 hours
  updateCheckInterval = setInterval(async () => {
    const updateInfo = await checkForUpdates();
    if (updateInfo.available) {
      io.emit('updateAvailable', updateInfo);
    }
  }, 6 * 60 * 60 * 1000); // 6 hours

  // Also check immediately on startup
  setTimeout(async () => {
    const updateInfo = await checkForUpdates();
    if (updateInfo.available) {
      io.emit('updateAvailable', updateInfo);
    }
  }, 5000); // Check 5 seconds after startup
}

function stopUpdateChecker() {
  if (updateCheckInterval) {
    clearInterval(updateCheckInterval);
    updateCheckInterval = null;
  }
}

// Minecraft server management
async function startMinecraftServer() {
  if (minecraftProcess) {
    return { success: false, message: 'Server is already running' };
  }

  try {
    const serverJar = path.join(__dirname, 'minecraft-server', 'server.jar');
    const serverExists = await fs.access(serverJar).then(() => true).catch(() => false);
    
    if (!serverExists) {
      return { success: false, message: 'Server JAR not found. Please run setup first.' };
    }

    minecraftProcess = spawn('java', ['-Xmx2G', '-Xms1G', '-jar', 'server.jar', 'nogui'], {
      cwd: path.join(__dirname, 'minecraft-server'),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    serverStatus = 'starting';

    minecraftProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('Minecraft:', output);
      
      // Check if server is ready
      if (output.includes('Done') && output.includes('For help, type "help"')) {
        serverStatus = 'running';
        io.emit('serverStatus', { status: serverStatus });
      }
      
      io.emit('serverOutput', { output });
    });

    minecraftProcess.stderr.on('data', (data) => {
      const output = data.toString();
      console.log('Minecraft Error:', output);
      io.emit('serverOutput', { output });
    });

    minecraftProcess.on('close', (code) => {
      console.log(`Minecraft server process exited with code ${code}`);
      minecraftProcess = null;
      serverStatus = 'stopped';
      io.emit('serverStatus', { status: serverStatus });
    });

    return { success: true, message: 'Server starting...' };
  } catch (error) {
    console.error('Error starting server:', error);
    return { success: false, message: error.message };
  }
}

function stopMinecraftServer() {
  if (!minecraftProcess) {
    return { success: false, message: 'Server is not running' };
  }

  try {
    minecraftProcess.stdin.write('stop\n');
    serverStatus = 'stopping';
    io.emit('serverStatus', { status: serverStatus });
    return { success: true, message: 'Stopping server...' };
  } catch (error) {
    console.error('Error stopping server:', error);
    return { success: false, message: error.message };
  }
}

function sendCommand(command) {
  if (!minecraftProcess) {
    return { success: false, message: 'Server is not running' };
  }

  try {
    minecraftProcess.stdin.write(command + '\n');
    return { success: true, message: `Command sent: ${command}` };
  } catch (error) {
    console.error('Error sending command:', error);
    return { success: false, message: error.message };
  }
}

// API Routes
app.get('/api/status', (req, res) => {
  res.json({
    status: serverStatus,
    port: MINECRAFT_PORT,
    uptime: minecraftProcess ? process.uptime() : 0
  });
});

app.get('/api/logs', async (req, res) => {
  try {
    const logContent = await readLatestLog();
    const lines = logContent.split('\n').filter(line => line.trim());
    const parsedLogs = lines.map(parseLogLine).slice(-100); // Last 100 lines
    res.json({ logs: parsedLogs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read logs' });
  }
});

app.post('/api/start', async (req, res) => {
  const result = await startMinecraftServer();
  res.json(result);
});

app.post('/api/stop', (req, res) => {
  const result = stopMinecraftServer();
  res.json(result);
});

app.post('/api/command', (req, res) => {
  const { command } = req.body;
  if (!command) {
    return res.status(400).json({ success: false, message: 'Command is required' });
  }
  const result = sendCommand(command);
  res.json(result);
});

app.get('/api/check-updates', async (req, res) => {
  try {
    const updateInfo = await checkForUpdates();
    res.json(updateInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to check for updates' });
  }
});

app.post('/api/transfer-hosting', (req, res) => {
  const { newHost } = req.body;
  if (!newHost) {
    return res.status(400).json({ success: false, message: 'New host username is required' });
  }
  
  // Find the user with the new host username
  const targetUser = Array.from(connectedUsers.entries()).find(([socketId, user]) => 
    user.username.toLowerCase() === newHost.toLowerCase()
  );
  
  if (!targetUser) {
    return res.status(404).json({ success: false, message: `User '${newHost}' is not connected` });
  }
  
  // Transfer hosting
  const oldHost = currentHost;
  currentHost = newHost;
  
  // Update all users to remove host status
  for (let [socketId, user] of connectedUsers.entries()) {
    user.isHost = false;
  }
  
  // Set new host
  targetUser[1].isHost = true;
  
  console.log(`Hosting transferred from ${oldHost} to ${newHost}`);
  
  // Broadcast updated user list
  const userList = Array.from(connectedUsers.values());
  io.emit('userList', { users: userList });
  
  // Broadcast host update
  io.emit('hostUpdate', { currentHost });
  
  res.json({ success: true, message: `Hosting transferred from ${oldHost} to ${newHost}` });
});

app.post('/api/download-mod', async (req, res) => {
  const { url, filename, modName } = req.body;
  
  if (!url || !filename) {
    return res.status(400).json({ success: false, message: 'URL and filename are required' });
  }
  
  try {
    const https = require('https');
    const fs = require('fs');
    
    // Create mods directory if it doesn't exist
    const modsDir = path.join(__dirname, 'minecraft-server', 'mods');
    await fs.promises.mkdir(modsDir, { recursive: true });
    
    const filePath = path.join(modsDir, filename);
    
    // Download the file
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded mod: ${modName} (${filename})`);
        res.json({ success: true, message: `Successfully downloaded ${modName}` });
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file if download failed
      console.error('Download error:', err);
      res.status(500).json({ success: false, message: 'Failed to download mod' });
    });
    
  } catch (error) {
    console.error('Mod download error:', error);
    res.status(500).json({ success: false, message: 'Failed to download mod' });
  }
});

app.get('/api/ngrok-status', (req, res) => {
  exec('curl -s http://localhost:4040/api/tunnels', (error, stdout) => {
    if (error) {
      return res.json({ 
        running: false, 
        url: null, 
        message: 'Ngrok not running or not accessible' 
      });
    }
    
    try {
      const tunnels = JSON.parse(stdout);
      const httpTunnel = tunnels.tunnels?.find(t => t.proto === 'https');
      res.json({
        running: true,
        url: httpTunnel?.public_url || null,
        message: httpTunnel ? 'Tunnel active' : 'No HTTP tunnel found'
      });
    } catch (e) {
      res.json({ running: false, url: null, message: 'Failed to parse ngrok status' });
    }
  });
});

app.get('/api/connection-test', (req, res) => {
  const net = require('net');
  
  // Test if port 25565 is listening
  const testSocket = new net.Socket();
  let portOpen = false;
  
  testSocket.setTimeout(5000); // 5 second timeout
  
  testSocket.on('connect', () => {
    portOpen = true;
    testSocket.destroy();
  });
  
  testSocket.on('timeout', () => {
    testSocket.destroy();
  });
  
  testSocket.on('error', () => {
    testSocket.destroy();
  });
  
  testSocket.on('close', () => {
    res.json({
      serverRunning: serverStatus === 'running',
      portOpen: portOpen,
      minecraftProcess: minecraftProcess !== null
    });
  });
  
  testSocket.connect(25565, 'localhost');
});

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send current server status
  socket.emit('serverStatus', { status: serverStatus });
  
  // Send current user list
  const userList = Array.from(connectedUsers.values());
  socket.emit('userList', { users: userList });

  socket.on('join', (data) => {
    console.log('Received join event with data:', data);
    const username = sanitizeUsername(data.username || 'Anonymous');
    const color = getNextColor();
    
    // Set first user as host if no host exists
    const isHost = !currentHost;
    if (isHost) {
      currentHost = username;
    }
    
    connectedUsers.set(socket.id, { username, color, isHost });
    
    console.log(`User joined: ${username} (${socket.id}) - Host: ${isHost}`);
    console.log('Current connected users:', Array.from(connectedUsers.values()));
    
    // Broadcast user joined
    io.emit('userJoined', { username, color, isHost });
    
    // Broadcast updated user list
    const userList = Array.from(connectedUsers.values());
    io.emit('userList', { users: userList });
    
    // Broadcast host update
    io.emit('hostUpdate', { currentHost });
  });

  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      console.log(`User left: ${user.username} (${socket.id})`);
      connectedUsers.delete(socket.id);
      
      // If host left, transfer to next user
      if (user.isHost && connectedUsers.size > 0) {
        const nextUser = Array.from(connectedUsers.values())[0];
        currentHost = nextUser.username;
        nextUser.isHost = true;
        console.log(`Host left, transferring to ${nextUser.username}`);
        
        // Broadcast host update
        io.emit('hostUpdate', { currentHost });
      } else if (connectedUsers.size === 0) {
        currentHost = null;
        console.log('No users left, clearing host');
      }
      
      // Broadcast user left
      io.emit('userLeft', { username: user.username });
      
      // Broadcast updated user list
      const userList = Array.from(connectedUsers.values());
      io.emit('userList', { users: userList });
    }
  });

  socket.on('serverCommand', (data) => {
    const { command } = data;
    if (command) {
      const result = sendCommand(command);
      socket.emit('commandResult', result);
    }
  });
});

// Serve the main application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    server: serverStatus, 
    connectedUsers: connectedUsers.size,
    uptime: process.uptime()
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`MCServ backend running on port ${PORT}`);
  console.log(`Web interface: http://localhost:${PORT}`);
  console.log(`Minecraft server port: ${MINECRAFT_PORT}`);
  
  // Start the auto-update checker
  startUpdateChecker();
  console.log('Auto-update checker started');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  if (minecraftProcess) {
    stopMinecraftServer();
  }
  stopUpdateChecker();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\nShutting down...');
  if (minecraftProcess) {
    stopMinecraftServer();
  }
  stopUpdateChecker();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
}); 