#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎮 MCServ Setup Wizard');
console.log('======================\n');

// Check Node.js version
const nodeVersion = process.version;
console.log(`✅ Node.js version: ${nodeVersion}`);

// Check if npm is available
try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    console.log(`✅ npm version: ${npmVersion}`);
} catch (error) {
    console.log('❌ npm not found. Please install npm first.');
    process.exit(1);
}

// Create necessary directories
const directories = ['backups', 'uploads', 'minecraft-server', 'logs'];
directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
    }
});

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
} catch (error) {
    console.log('❌ Failed to install dependencies');
    process.exit(1);
}

// Create config file if it doesn't exist
if (!fs.existsSync('config.js')) {
    if (fs.existsSync('config.example.js')) {
        fs.copyFileSync('config.example.js', 'config.js');
        console.log('📝 Created config.js from template');
        console.log('⚠️  Please edit config.js with your settings');
    }
}

// Make scripts executable
const scripts = ['setup.sh', 'start.sh', 'download-server-new.sh'];
scripts.forEach(script => {
    if (fs.existsSync(script)) {
        try {
            fs.chmodSync(script, '755');
            console.log(`🔧 Made ${script} executable`);
        } catch (error) {
            console.log(`⚠️  Could not make ${script} executable`);
        }
    }
});

console.log('\n🎉 Setup complete!');
console.log('\nNext steps:');
console.log('1. Edit config.js with your settings');
console.log('2. Run ./start.sh to start the server');
console.log('3. Open http://localhost:3000 in your browser');
console.log('\nFor help, see README.md'); 