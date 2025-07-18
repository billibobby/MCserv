import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

// Components
import ServerControl from './components/ServerControl';
import ModManager from './components/ModManager';
import BackupManager from './components/BackupManager';
import ActivityFeed from './components/ActivityFeed';

const socket = io('http://localhost:3000');

function App() {
  const [activeTab, setActiveTab] = useState('server');
  const [serverStatus, setServerStatus] = useState('stopped');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Socket event listeners
    socket.on('serverStatus', (status) => {
      setServerStatus(status);
    });

    socket.on('log', (log) => {
      setLogs(prev => [...prev, log]);
    });

    socket.on('connect', () => {
      console.log('Connected to MCServ backend');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from MCServ backend');
    });

    return () => {
      socket.off('serverStatus');
      socket.off('log');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const tabs = [
    { id: 'server', name: 'Server Control', icon: '🎮' },
    { id: 'mods', name: 'Mod Manager', icon: '📦' },
    { id: 'backups', name: 'Backups', icon: '💾' },
    { id: 'activity', name: 'Activity', icon: '📊' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-400">MCServ</h1>
              <span className="ml-2 text-sm text-gray-400">Minecraft Server Manager</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                serverStatus === 'running' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
              }`}>
                {serverStatus === 'running' ? '🟢 Running' : '🔴 Stopped'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-400 text-green-400'
                    : 'border-transparent text-gray-300 hover:text-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'server' && <ServerControl socket={socket} />}
        {activeTab === 'mods' && <ModManager socket={socket} />}
        {activeTab === 'backups' && <BackupManager socket={socket} />}
        {activeTab === 'activity' && <ActivityFeed logs={logs} />}
      </main>
    </div>
  );
}

export default App; 