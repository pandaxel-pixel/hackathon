import React from 'react';
import { Recycle, User, Plus } from 'lucide-react';

interface PosterHeaderProps {
  posterStats: {
    totalRecycled: number;
    rating: number;
    activeItems: number;
    totalPoints: number;
    pointsThisWeek: number;
  };
  onCreateItem: () => void;
}

export default function PosterHeader({ posterStats, onCreateItem }: PosterHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center space-x-2">
          <Recycle className="w-8 h-8" />
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
          <div className="flex items-center space-x-1">
            <User className="w-5 h-5" />
            <span className="text-sm">{posterStats.rating.toFixed(1)}</span>
          </div>
          <button
            onClick={onCreateItem}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}