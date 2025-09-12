import React, { useState } from 'react';
import { Package, Plus } from 'lucide-react';

interface Bag {
  id: string;
  type: string;
  weight: string;
  status: 'Ready' | 'Collected';
  date: string;
  points?: number;
  category: string;
}

interface MyBagsViewProps {
  onCreateBag?: () => void;
}

type FilterType = 'all' | 'ready' | 'collected';

export default function MyBagsView({ onCreateBag }: MyBagsViewProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

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

  // User's personal bags data
  const myBags: Bag[] = [
    {
      id: '1',
      type: 'Plastic',
      weight: '5kg',
      status: 'Ready',
      date: '2024-01-15',
      category: 'plastic'
    },
    {
      id: '2',
      type: 'Glass',
      weight: '3kg',
      status: 'Ready',
      date: '2024-01-10',
      category: 'glass'
    },
    {
      id: '3',
      type: 'Paper',
      weight: '2kg',
      status: 'Collected',
      date: '2024-01-05',
      points: 10,
      category: 'paper'
    },
    {
      id: '4',
      type: 'Metal',
      weight: '1kg',
      status: 'Collected',
      date: '2023-12-20',
      points: 5,
      category: 'metal'
    }
  ];

  const filteredBags = myBags.filter(bag => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'ready') return bag.status === 'Ready';
    if (activeFilter === 'collected') return bag.status === 'Collected';
    return true;
  });

  const getStatusDisplay = (bag: Bag) => {
    if (bag.status === 'Ready') {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-green-400 font-medium">Ready</span>
          <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
            <span className="text-white text-xs">♻</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="text-right">
          <div className="text-white font-medium">{bag.points} pts</div>
          <div className="text-gray-400 text-sm">Collected</div>
        </div>
      );
    }
  };

  return (
    <div className="h-full bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="w-6 h-6" />
            <h2 className="text-lg font-bold">Mis Bolsas</h2>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex space-x-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'ready', label: 'Ready' },
            { id: 'collected', label: 'Collected' }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as FilterType)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bags List */}
      <div className="flex-1 overflow-y-auto">
        {filteredBags.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No se encontraron bolsas
            </h3>
            <p className="text-gray-400">
              {activeFilter === 'ready' && 'No hay bolsas listas para recolección'}
              {activeFilter === 'collected' && 'No se han recolectado bolsas aún'}
              {activeFilter === 'all' && 'Comienza creando tu primera bolsa'}
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {filteredBags.map((bag) => (
              <div key={bag.id} className="bg-gray-800 border-b border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">{getCategoryIcon(bag.category)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{bag.type} - {bag.weight}</h3>
                      <p className="text-sm text-gray-400">
                        {bag.status === 'Collected' ? `Collected on ${bag.date}` : `Created on ${bag.date}`}
                      </p>
                    </div>
                  </div>
                  <div>
                    {getStatusDisplay(bag)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-6">
        <button 
          onClick={onCreateBag}
          className="w-14 h-14 bg-green-600 hover:bg-green-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}