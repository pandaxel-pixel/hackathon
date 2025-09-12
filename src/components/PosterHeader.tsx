import React from 'react';
import { MessageCircle } from 'lucide-react';

interface PosterHeaderProps {
  username: string;
  displayPhoto: string;
  posterStats: {
    totalRecycled: number;
    rating: number;
    activeItems: number;
    totalPoints: number;
    pointsThisWeek: number;
  };
  onCreateItem: () => void;
  onOpenMessages: () => void;
}

export default function PosterHeader({ username, displayPhoto, posterStats, onCreateItem, onOpenMessages }: PosterHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center space-x-2">
          <img 
            src="/Icono Ecociclo transparente.png" 
            alt="EcoCiclo Icon" 
            className="w-8 h-8"
          />
          <div>
            <h1 className="text-xl font-bold">EcoCiclo</h1>
            <p className="text-xs text-blue-200">Publicar reciclaje</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right text-sm">
            <div className="font-semibold">{posterStats.totalPoints} pts</div>
            <div className="text-blue-200">Esta semana: +{posterStats.pointsThisWeek}</div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{displayPhoto}</span>
              <div className="text-right">
                <div className="text-sm font-medium">{username}</div>
                <div className="text-xs text-blue-200">⭐ {posterStats.rating.toFixed(1)}</div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={onCreateItem}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={onOpenMessages}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-all duration-200"
                title="Mensajes"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>
    );
}
}