module.exports = {
    // Server Configuration
    port: process.env.PORT || 3000,
    
    // Minecraft Server Settings
    minecraftServer: {
        jarPath: './minecraft-server/server.jar',
        maxMemory: '2G',
        minMemory: '1G',
        port: 25565
    },
    
    // Modrinth API Settings
    modrinth: {
        apiUrl: 'https://api.modrinth.com/v2',
        userAgent: 'MCServ/1.0.0'
    },
    
    // Ngrok Settings (for public sharing)
    ngrok: {
        enabled: false,
        authToken: process.env.NGROK_AUTH_TOKEN || '',
        region: 'us'
    },
    
    // Backup Settings
    backup: {
        enabled: true,
        interval: 24 * 60 * 60 * 1000, // 24 hours
        maxBackups: 7
    },
    
    // Logging
    logging: {
        level: 'info',
        file: './logs/mcserv.log'
    }
}; 