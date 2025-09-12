import React, { useState } from 'react';
import { Package, Filter, Plus } from 'lucide-react';
import { RecyclableItem } from '../types';

interface PendingPickup extends RecyclableItem {
  acceptedAt: Date;
}

interface MyBagsViewProps {
  pendingPickups: PendingPickup[];
  onCompletePickup: (itemId: string) => void;
  onCancelPickup: (itemId: string) => void;
}

type FilterType = 'all' | 'ready' | 'collected';

export default function MyBagsView({ 
  pendingPickups, 
  onCompletePickup, 
  onCancelPickup 
}: MyBagsViewProps) {
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Mock data to match the reference image
  const mockBags = [
    {
      id: '1',
      type: 'Plastic',
      weight: '5kg',
      status: 'Ready',
      date: '2024-01-15',
      points: 85,
      category: 'plastic'
    },
    {
      id: '2',
      type: 'Glass',
      weight: '3kg',
      status: 'Ready',
      date: '2024-01-10',
      points: 60,
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

  const filteredBags = mockBags.filter(bag => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'ready') return bag.status === 'Ready';
    if (activeFilter === 'collected') return bag.status === 'Collected';
    return true;
  });

  const getStatusColor = (status: string) => {
    if (status === 'Ready') return 'text-green-600 bg-green-100';
    if (status === 'Collected') return 'text-gray-600 bg-gray-100';
    return 'text-blue-600 bg-blue-100';
  };

  return (
    <div className="h-full bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="w-6 h-6" />
            <h2 className="text-lg font-bold">My Bags</h2>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'ready', label: 'Ready' },
            { id: 'collected', label: 'Collected' }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as FilterType)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeFilter === filter.id
                  ? 'bg-green-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
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
              No bags found
            </h3>
            <p className="text-gray-400">
              {activeFilter === 'ready' && 'No bags are ready for collection'}
              {activeFilter === 'collected' && 'No bags have been collected yet'}
              {activeFilter === 'all' && 'Start by creating your first bag'}
            </p>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {filteredBags.map((bag) => (
              <div key={bag.id} className="bg-gray-800 rounded-lg p-4">
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
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bag.status)}`}>
                      {bag.status}
                      {bag.status === 'Ready' && <span className="ml-1">🎯</span>}
                    </div>
                    {bag.status === 'Collected' && (
                      <div className="text-sm text-gray-400 mt-1">
                        {bag.points} pts
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-6">
        <button className="w-14 h-14 bg-green-600 hover:bg-green-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110">
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}