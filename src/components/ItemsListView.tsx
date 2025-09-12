import React from 'react';
import { Clock, MapPin, Weight, CheckCircle, X } from 'lucide-react';
import { RecyclableItem } from '../types';
import EmptyState from './EmptyState';

interface ItemsListViewProps {
  items: RecyclableItem[];
  onAccept: (itemId: string) => void;
  onReject: (itemId: string) => void;
  onRefresh: () => void;
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

export default function ItemsListView({ items, onAccept, onReject, onRefresh }: ItemsListViewProps) {
  if (items.length === 0) {
    return <EmptyState onRefresh={onRefresh} />;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center py-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Elementos Disponibles
        </h2>
        <p className="text-gray-600">
          {items.length} elemento{items.length !== 1 ? 's' : ''} cerca de ti
        </p>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200">
            <div className="flex">
              {/* Image */}
              <div className="w-24 h-24 flex-shrink-0">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {item.materials.length > 0 ? getCategoryIcon(item.materials[0].type) : '♻️'}
                    </span>
                    <h3 className="font-bold text-gray-900 text-sm leading-tight">
                      {item.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{item.points} pts</div>
                    <div className="text-xs text-gray-500">Estimado por IA</div>
                  </div>
                </div>

                <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                  {item.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-3 h-3 mr-1 text-blue-500" />
                      <span>{item.location.address}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Weight className="w-3 h-3 mr-1" />
                      {item.totalWeight}kg
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTimeAgo(item.postedAt)}
                    </div>
                    <div className="text-gray-600">
                      {item.location.distance}km de distancia
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-3">
                  <button 
                    onClick={() => onReject(item.id)}
                    className="flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-1 bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-600 text-sm"
                  >
                    <X className="w-4 h-4" />
                    <span>Pasar</span>
                  </button>
                  <button 
                    onClick={() => onAccept(item.id)}
                    className="flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-1 bg-green-600 hover:bg-green-700 text-white text-sm shadow-md"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Recoger</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Refresh Button */}
      <div className="text-center py-6">
        <button
          onClick={onRefresh}
          className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg"
        >
          Buscar más elementos
        </button>
      </div>
    </div>
  );
}