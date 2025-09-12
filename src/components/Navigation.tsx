import React from 'react';
import { Home, ShoppingBag, MessageCircle, TrendingUp, QrCode, User, Recycle } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userType?: 'collector' | 'poster';
}

export default function Navigation({ activeTab, onTabChange, userType = 'collector' }: NavigationProps) {
  const tabs = userType === 'collector' ? [
    { id: 'map', icon: Home, label: 'Inicio' },
    { id: 'items', icon: Recycle, label: 'Reciclaje' },
    { id: 'pending', icon: QrCode, label: 'Pendientes' },
    { id: 'stats', icon: TrendingUp, label: 'Estadísticas' },
    { id: 'chat', icon: MessageCircle, label: 'Mensajes' }
  ] : [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'bags', icon: ShoppingBag, label: 'Mis Bolsas' },
    { id: 'rankings', icon: TrendingUp, label: 'Rankings' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <footer className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 shadow-lg overflow-x-auto">
      <div className={`flex ${userType === 'collector' ? 'justify-between px-2' : 'justify-around'} py-2 max-w-md mx-auto min-w-max`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center py-2 ${userType === 'collector' ? 'px-2' : 'px-4'} rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-green-600 bg-green-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <tab.icon className={`${userType === 'collector' ? 'w-5 h-5' : 'w-6 h-6'} mb-1`} />
            <span className={`${userType === 'collector' ? 'text-xs' : 'text-xs'} font-medium`}>{tab.label}</span>
          </button>
        ))}
      </div>
    </footer>
  );
}