import React from 'react';

function ActivityFeed({ logs }) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Activity Feed</h2>
        
        {logs.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <div className="text-4xl mb-4">📊</div>
            <p>No activity yet</p>
            <p className="text-sm">Server logs will appear here</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="text-green-400">🟢</div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-300">{log.timestamp}</div>
                    <div className="text-white">{log.message}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityFeed; 