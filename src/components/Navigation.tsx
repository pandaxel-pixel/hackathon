import React from 'react';
import { MapPin, Recycle, MessageCircle, TrendingUp, QrCode } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userType?: 'collector' | 'poster';
}

export default function Navigation({ activeTab, onTabChange, userType = 'collector' }: NavigationProps) {
  const tabs = userType === 'collector' ? [
    { id: 'map', icon: MapPin, label: 'Mapa' },
    { id: 'items', icon: Recycle, label: 'Reciclaje' },
    { id: 'route', icon: Navigation, label: 'Ruta' },
    { id: 'pending', icon: QrCode, label: 'Pendientes' },
    { id: 'stats', icon: TrendingUp, label: 'Estadísticas' },
    { id: 'chat', icon: MessageCircle, label: 'Mensajes' }
  ] : [
    { id: 'map', icon: MapPin, label: 'Ranking' },
    { id: 'items', icon: Recycle, label: 'Reciclaje' },
    { id: 'stats', icon: TrendingUp, label: 'Estadísticas' },
    { id: 'chat', icon: MessageCircle, label: 'Mensajes' }
  ];

  return (
    <footer className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 shadow-lg">
      <div className={`flex ${userType === 'collector' ? 'justify-between px-1' : 'justify-around'} py-2 max-w-md mx-auto overflow-x-auto`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center py-2 ${userType === 'collector' ? 'px-1 min-w-0' : 'px-4'} rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-green-600 bg-green-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <tab.icon className={`${userType === 'collector' ? 'w-4 h-4' : 'w-6 h-6'} mb-1`} />
            <span className={`${userType === 'collector' ? 'text-xs' : 'text-xs'} font-medium truncate`}>{tab.label}</span>
          </button>
        ))}
      </div>
    </footer>
  );
}