import React, { useState } from 'react';
import { Clock, MapPin, Weight } from 'lucide-react';
import { RecyclableItem } from '../types';

interface ItemCardProps {
  item: RecyclableItem;
  onAccept: () => void;
  onReject: () => void;
}

const getCategoryIcon = (category: string) => {
  const icons = {
    plastic: '🥤',
    paper: '📄',
    metal: '🥫',
    glass: '🍶',
    electronic: '📱'
  };
  return icons[category as keyof typeof icons] || '♻️';
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Hace menos de 1h';
  if (diffInHours < 24) return `Hace ${diffInHours}h`;
  return `Hace ${Math.floor(diffInHours / 24)}d`;
};

export default function ItemCard({ item, onAccept, onReject }: ItemCardProps) {
  const [swipeDirection, setSwipeDirection] = useState<'none' | 'left' | 'right'>('none');
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div className={`bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 ease-in-out ${
      swipeDirection === 'left' ? 'translate-x-[-120%] rotate-[-15deg] opacity-0' :
      swipeDirection === 'right' ? 'translate-x-[120%] rotate-[15deg] opacity-0' :
      'translate-x-0 rotate-0 opacity-100 hover:scale-105'
    }`}>
      <div className="relative">
        <img 
          src={item.image} 
          alt={item.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 left-4 flex space-x-2">
          <span className="text-2xl bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md">
            {item.materials.length > 0 ? getCategoryIcon(item.materials[0].type) : '♻️'}
          </span>
        </div>
        
        {/* Swipe Indicators */}
        {swipeDirection === 'left' && (
          <div className="absolute inset-0 bg-red-500 bg-opacity-80 flex items-center justify-center">
            <div className="text-white text-6xl font-bold transform rotate-12">
              ✗
            </div>
          </div>
        )}
        {swipeDirection === 'right' && (
          <div className="absolute inset-0 bg-green-500 bg-opacity-80 flex items-center justify-center">
            <div className="text-white text-6xl font-bold transform -rotate-12">
              ✓
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h2>
        <p className="text-gray-600 text-sm mb-4">{item.description}</p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-green-600">{item.points} pts</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Estimado por IA</span>
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <Weight className="w-4 h-4 mr-1" />
              {item.totalWeight}kg
            </div>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
            <span>{item.location.address} • {item.location.distance.toFixed(1)}km</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {item.materials.map(m => `${m.quantity} ${m.type}`).join(', ')}
            </span>
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {formatTimeAgo(item.postedAt)}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button 
            onClick={() => {
              if (isAnimating) return;
              setIsAnimating(true);
              setSwipeDirection('left');
              setTimeout(() => {
                onReject();
                setSwipeDirection('none');
                setIsAnimating(false);
              }, 500);
            }}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
              isAnimating 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-600 hover:scale-105 active:scale-95'
            }`}
            disabled={isAnimating}
          >
            <span className="text-xl">✗</span>
            <span>Pasar</span>
        <button 
          onClick={() => {
            if (isAnimating) return;
            setIsAnimating(true);
            setSwipeDirection('right');
            setTimeout(() => {
              onAccept();
              setSwipeDirection('none');
              setIsAnimating(false);
            }, 500);
          }}
          className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg ${
            isAnimating 
              ? 'bg-gray-400 text-gray-300 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 text-white hover:scale-105 active:scale-95'
          }`}
          disabled={isAnimating}
        >
          <span className="text-xl">✓</span>
          <span>Recoger</span>
        </button>
        </div>
      </div>
    </div>
  );
}
  )
}