import React from 'react';
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

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case 'high': return 'text-red-600 bg-red-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    default: return 'text-green-600 bg-green-100';
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Hace menos de 1h';
  if (diffInHours < 24) return `Hace ${diffInHours}h`;
  return `Hace ${Math.floor(diffInHours / 24)}d`;
};

export default function ItemCard({ item, onAccept, onReject }: ItemCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105">
      <div className="relative">
        <img 
          src={item.image} 
          alt={item.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 left-4 flex space-x-2">
          <span className="text-2xl bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md">
            {getCategoryIcon(item.category)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(item.urgency)}`}>
            {item.urgency === 'high' ? 'Urgente' : item.urgency === 'medium' ? 'Medio' : 'Bajo'}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h2>
        <p className="text-gray-600 text-sm mb-4">{item.description}</p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-green-600">${item.payment} MXN</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">IA</span>
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <Weight className="w-4 h-4 mr-1" />
              {item.weight}kg
            </div>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
            <span>{item.location.address} • {item.location.distance}km</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">🚲 {item.transport}</span>
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {formatTimeAgo(item.postedAt)}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button 
            onClick={onReject}
            className="flex-1 bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-600 py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span className="text-xl">✗</span>
            <span>Pasar</span>
          </button>
          <button 
            onClick={onAccept}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
          >
            <span className="text-xl">✓</span>
            <span>Recoger</span>
          </button>
        </div>
      </div>
    </div>
  );
}