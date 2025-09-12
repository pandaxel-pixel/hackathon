import React, { useState } from 'react';
import { Plus, QrCode } from 'lucide-react';
import { Bag } from '../types';
import PosterQRPickupModal from './PosterQRPickupModal';

interface MyBagsViewProps {
  onCreateItem: () => void;
}

export default function MyBagsView({ onCreateItem }: MyBagsViewProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'ready' | 'collected'>('all');
  const [selectedBagForQR, setSelectedBagForQR] = useState<Bag | null>(null);

  // Mock data for user's bags
  const [bags, setBags] = useState<Bag[]>([
    {
      id: '1',
      type: 'Plástico',
      weight: 5,
      status: 'ready',
      createdAt: new Date('12/09/2025'),
      image: 'https://static.vecteezy.com/system/resources/thumbnails/027/537/094/small/plastic-water-bottles-waiting-to-be-recycled-photo.jpg'
    },
    {
      id: '2',
      type: 'Vidrio',
      weight: 3,
      status: 'ready',
      createdAt: new Date('11/09/2025'),
      image: 'https://www.leeglass.com/wp-content/uploads/2019/08/iStock-1081866910-1024x683.jpg'
    },
    {
      id: '3',
      type: 'Papel',
      weight: 2,
      status: 'collected',
      createdAt: new Date('11/09/2025'),
      collectedAt: new Date('11/09/2025'),
      points: 10,
      image: 'https://bristolwastecompany.co.uk/wp-content/uploads/2022/08/Full-blue-bag-image-and-text.png'
    },
    {
      id: '4',
      type: 'Metal',
      weight: 1,
      status: 'collected',
      createdAt: new Date('10/09/2025'),
      collectedAt: new Date('10/09/2025'),
      points: 5,
      image: 'https://i.ytimg.com/vi/vyCEw974Nas/oar2.jpg'
    }
  ]);

  const filteredBags = bags.filter(bag => {
    if (activeFilter === 'all') return true;
    return bag.status === activeFilter;
  });

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleConfirmPickup = (itemId: string, rating: number) => {
    setBags(prev => prev.map(bag => 
      bag.id === itemId 
        ? { 
            ...bag, 
            status: 'collected' as const, 
            collectedAt: new Date(),
            rating: rating,
            points: Math.round(bag.weight * 10) // Calculate points based on weight
          }
        : bag
    ));
    setSelectedBagForQR(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 relative pb-20">
      {/* Filter Tabs */}
      <div className="p-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setActiveFilter('ready')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'ready'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Listos
          </button>
          <button
            onClick={() => setActiveFilter('collected')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'collected'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Recolectados
          </button>
        </div>
      </div>

      {/* Bags List */}
      <div className="px-4 pb-4 space-y-3">
        {filteredBags.map((bag) => (
          <div key={bag.id} className="bg-white rounded-lg p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={bag.image} 
                  alt={bag.type}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {bag.type} - {bag.weight}kg
                </h3>
                <p className="text-sm text-gray-600">
                  {bag.status === 'collected' && bag.collectedAt
                    ? `Recolectado el ${formatDate(bag.collectedAt)}`
                    : `Creado el ${formatDate(bag.createdAt)}`
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {bag.status === 'ready' ? (
                <>
                  <button
                    onClick={() => setSelectedBagForQR(bag)}
                    className="flex items-center space-x-2 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-full transition-colors"
                  >
                    <span className="font-medium text-sm">Listo</span>
                    <QrCode className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="text-right">
                  <div className="text-gray-900 font-medium">{bag.points} pts</div>
                  <div className="text-xs text-gray-600">Recolectado</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={onCreateItem}
        className="fixed bottom-20 right-4 w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg transition-colors"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>
      </div>

      {/* QR Pickup Modal */}
      {selectedBagForQR && (
        <PosterQRPickupModal
          item={selectedBagForQR}
          onClose={() => setSelectedBagForQR(null)}
          onConfirmPickup={handleConfirmPickup}
        />
      )}
    </>
  );
}