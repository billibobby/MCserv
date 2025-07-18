import React from 'react';

function BackupManager({ socket }) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Backup Manager</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition-colors">
            <div className="text-2xl mb-2">💾</div>
            <div className="font-medium">Create Backup</div>
            <div className="text-sm text-gray-300">Backup current world</div>
          </button>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-colors">
            <div className="text-2xl mb-2">📋</div>
            <div className="font-medium">View Backups</div>
            <div className="text-sm text-gray-300">List all backups</div>
          </button>
          
          <button className="bg-yellow-600 hover:bg-yellow-700 text-white p-4 rounded-lg text-center transition-colors">
            <div className="text-2xl mb-2">⚙️</div>
            <div className="font-medium">Settings</div>
            <div className="text-sm text-gray-300">Configure backup</div>
          </button>
        </div>
      </div>

      {/* Backup List Placeholder */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Backups</h3>
        <div className="text-center text-gray-400 py-8">
          <div className="text-4xl mb-4">💾</div>
          <p>No backups found</p>
          <p className="text-sm">Create your first backup to get started</p>
        </div>
      </div>
    </div>
  );
}

export default BackupManager; 