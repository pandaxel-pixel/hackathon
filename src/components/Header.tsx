import React from 'react';
import { Recycle, User } from 'lucide-react';

interface HeaderProps {
  userStats: {
    totalPoints: number;
    rating: number;
    completedToday: number;
    pointsThisWeek: number;
  };
}

export default function Header({ userStats }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center space-x-2">
          <Recycle className="w-8 h-8" />
          <h1 className="text-xl font-bold">EcoCiclo</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right text-sm">
            <div className="font-semibold">{userStats.totalPoints} pts</div>
            <div className="text-green-200">Semana: +{userStats.pointsThisWeek}</div>
          </div>
          <div className="flex items-center space-x-1">
            <User className="w-5 h-5" />
            <span className="text-sm">{userStats.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </header>
  );
}