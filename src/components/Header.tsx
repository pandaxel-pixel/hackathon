import React from 'react';

interface HeaderProps {
  username: string;
  displayPhoto: string;
  userStats: {
    rating: number;
    completedToday: number;
  };
}

export default function Header({ username, displayPhoto, userStats }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center space-x-2">
          <img 
            src="/Logo.png" 
            alt="EcoCiclo Icon" 
            className="h-8 w-auto"
          />
          <div>
            <h1 className="text-xl font-bold">EcoCiclo</h1>
            <p className="text-xs text-green-200">Recolector</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{displayPhoto}</span>
              <div className="text-right">
                <div className="text-sm font-medium">{username}</div>
                <div className="text-xs text-green-200">⭐ {userStats.rating.toFixed(1)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}