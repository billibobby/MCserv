import React, { useState, useEffect } from 'react';

function ServerControl({ socket }) {
  const [serverStatus, setServerStatus] = useState('stopped');
  const [serverType, setServerType] = useState('vanilla');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    socket.on('serverStatus', (status) => {
      setServerStatus(status);
      setIsLoading(false);
    });

    return () => {
      socket.off('serverStatus');
    };
  }, [socket]);

  const startServer = () => {
    setIsLoading(true);
    socket.emit('startServer', { type: serverType });
  };

  const stopServer = () => {
    setIsLoading(true);
    socket.emit('stopServer');
  };

  const restartServer = () => {
    setIsLoading(true);
    socket.emit('restartServer');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Server Control</h2>
        
        {/* Server Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Server Type
          </label>
          <select
            value={serverType}
            onChange={(e) => setServerType(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="vanilla">Vanilla</option>
            <option value="forge">Forge</option>
          </select>
        </div>

        {/* Status Display */}
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              serverStatus === 'running' ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="text-lg font-medium">
              Status: {serverStatus === 'running' ? 'Running' : 'Stopped'}
            </span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={startServer}
            disabled={serverStatus === 'running' || isLoading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            {isLoading ? 'Starting...' : 'Start Server'}
          </button>
          
          <button
            onClick={stopServer}
            disabled={serverStatus === 'stopped' || isLoading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            {isLoading ? 'Stopping...' : 'Stop Server'}
          </button>
          
          <button
            onClick={restartServer}
            disabled={serverStatus === 'stopped' || isLoading}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            {isLoading ? 'Restarting...' : 'Restart Server'}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-colors">
            <div className="text-2xl mb-2">🌐</div>
            <div className="font-medium">Public Sharing</div>
            <div className="text-sm text-gray-300">Share with friends</div>
          </button>
          
          <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center transition-colors">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium">Performance</div>
            <div className="text-sm text-gray-300">Monitor resources</div>
          </button>
          
          <button className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg text-center transition-colors">
            <div className="text-2xl mb-2">🔧</div>
            <div className="font-medium">Settings</div>
            <div className="text-sm text-gray-300">Configure server</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServerControl; 