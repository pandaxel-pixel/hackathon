import React from 'react';
import { Home, Recycle, MessageCircle, TrendingUp, QrCode, User, ShoppingBag } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userType?: 'collector' | 'poster';
}

export default function Navigation({ activeTab, onTabChange, userType = 'collector' }: NavigationProps) {
  const tabs = userType === 'collector' ? [
    { id: 'stats', icon: Home, label: 'Inicio' },
    { id: 'items', icon: ShoppingBag, label: 'Mis Bolsas' },
    { id: 'pending', icon: QrCode, label: 'Rankings' },
    { id: 'profile', icon: User, label: 'Perfil' }
  ] : [
    { id: 'stats', icon: Home, label: 'Inicio' },
    { id: 'items', icon: ShoppingBag, label: 'Mis Bolsas' },
    { id: 'pending', icon: TrendingUp, label: 'Rankings' },
    { id: 'profile', icon: User, label: 'Perfil' }
  ];

  return (
    <footer className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around py-2 max-w-md mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-green-600 bg-green-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </footer>
  );
}