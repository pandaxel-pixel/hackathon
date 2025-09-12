import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface Bag {
  id: string;
  type: string;
  weight: number;
  status: 'ready' | 'collected';
  createdAt: Date;
  collectedAt?: Date;
  points?: number;
  image: string;
}

interface MyBagsViewProps {
  onCreateItem: () => void;
}

export default function MyBagsView({ onCreateItem }: MyBagsViewProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'ready' | 'collected'>('all');

  // Mock data for user's bags
  const mockBags: Bag[] = [
    {
      id: '1',
      type: 'Plástico',
      weight: 5,
      status: 'ready',
      createdAt: new Date('2024-01-15'),
      image: 'https://static.vecteezy.com/system/resources/thumbnails/027/537/094/small/plastic-water-bottles-waiting-to-be-recycled-photo.jpg'
    },
    {
      id: '2',
      type: 'Vidrio',
      weight: 3,
      status: 'ready',
      createdAt: new Date('2024-01-10'),
      image: 'https://www.leeglass.com/wp-content/uploads/2019/08/iStock-1081866910-1024x683.jpg'
    },
    {
      id: '3',
      type: 'Papel',
      weight: 2,
      status: 'collected',
      createdAt: new Date('2024-01-05'),
      collectedAt: new Date('2024-01-06'),
      points: 10,
      image: 'https://bristolwastecompany.co.uk/wp-content/uploads/2022/08/Full-blue-bag-image-and-text.png'
    },
    {
      id: '4',
      type: 'Metal',
      weight: 1,
      status: 'collected',
      createdAt: new Date('2023-12-20'),
      collectedAt: new Date('2023-12-21'),
      points: 5,
      image: 'https://i.ytimg.com/vi/vyCEw974Nas/oar2.jpg'
    }
  ];

  const filteredBags = mockBags.filter(bag => {
    if (activeFilter === 'all') return true;
    return bag.status === activeFilter;
  });

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
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
                  <span className="text-green-600 font-medium text-sm">Listo</span>
                  <div className="w-6 h-6 text-green-600">
                    ♻️
                  </div>
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
  );
}