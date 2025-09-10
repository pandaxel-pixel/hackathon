import React from 'react';
import { Clock, MapPin, Weight, User, CheckCircle, AlertCircle } from 'lucide-react';
import { PostedItem } from '../types';

interface PostedItemCardProps {
  item: PostedItem;
  onEdit?: () => void;
  onDelete?: () => void;
}

const getStatusInfo = (status: PostedItem['status']) => {
  switch (status) {
    case 'active':
      return {
        color: 'text-blue-600 bg-blue-100',
        icon: AlertCircle,
        text: 'Activo'
      };
    case 'accepted':
      return {
        color: 'text-yellow-600 bg-yellow-100',
        icon: Clock,
        text: 'Aceptado'
      };
    case 'completed':
      return {
        color: 'text-green-600 bg-green-100',
        icon: CheckCircle,
        text: 'Completado'
      };
  }
};

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

export default function PostedItemCard({ item }: PostedItemCardProps) {
  const statusInfo = getStatusInfo(item.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
      <div className="relative">
        <img 
          src={item.image} 
          alt={item.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3 flex space-x-2">
          <span className="text-xl bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
            {getCategoryIcon(item.category)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${statusInfo.color}`}>
            <StatusIcon className="w-3 h-3" />
            <span>{statusInfo.text}</span>
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-end">
            <div className="flex items-center text-gray-500 text-sm">
              <Weight className="w-4 h-4 mr-1" />
              {item.weight}kg
            </div>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
            <span>{item.location.address}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">🚲 {item.transport}</span>
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {formatTimeAgo(item.postedAt)}
            </div>
          </div>
        </div>

        {item.status === 'accepted' && item.acceptedBy && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
            <div className="flex items-center text-yellow-800 text-sm">
              <User className="w-4 h-4 mr-2" />
              <span>Aceptado por <strong>{item.acceptedBy}</strong></span>
            </div>
            {item.acceptedAt && (
              <div className="text-xs text-yellow-600 mt-1">
                {formatTimeAgo(item.acceptedAt)}
              </div>
            )}
          </div>
        )}

        {item.status === 'completed' && item.acceptedBy && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
            <div className="flex items-center text-green-800 text-sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>Completado por <strong>{item.acceptedBy}</strong></span>
            </div>
            {item.completedAt && (
              <div className="text-xs text-green-600 mt-1">
                {formatTimeAgo(item.completedAt)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}