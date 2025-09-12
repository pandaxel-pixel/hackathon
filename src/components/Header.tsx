import React from 'react';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  username: string;
  displayPhoto: string;
  userStats: {
    rating: number;
    completedToday: number;
  };
  onLogout: () => void;
}

export default function Header({ username, displayPhoto, userStats, onLogout }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center space-x-2">
          <img 
            src="/ecociclo-logo.png" 
            alt="EcoCiclo Icon" 
            className="w-8 h-8"
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
            <button
              onClick={onLogout}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}