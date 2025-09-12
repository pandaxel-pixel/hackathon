import React, { useState } from 'react';
import { useEffect } from 'react';
import { Plus, QrCode, Star } from 'lucide-react';
import { itemApi } from '../api/mockApi';
import { PostedItem } from '../types';
import PosterQRPickupModal from './PosterQRPickupModal';

interface MyBagsViewProps {
  onCreateItem: () => void;
  postedItems?: PostedItem[];
}

export default function MyBagsView({ onCreateItem, postedItems = [] }: MyBagsViewProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'ready' | 'collected'>('all');
  const [selectedBagForModal, setSelectedBagForModal] = useState<PostedItem | null>(null);
  const [modalMode, setModalMode] = useState<'generate-qr' | 'review-collector'>('generate-qr');
  const [bags, setBags] = useState<PostedItem[]>([]);

  useEffect(() => {
    // Use provided items if available, otherwise use current bags state
    if (postedItems.length > 0) {
      setBags(postedItems);
    }
  }, [postedItems]);

  const filteredBags = bags.filter(bag => {
    if (activeFilter === 'all') return true;
    return bag.status === activeFilter;
  });

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getMaterialsDisplay = (materials: any[]) => {
    const typeTranslations = {
      plastic: 'plástico',
      paper: 'papel', 
      glass: 'vidrio',
      metal: 'metal',
      electronic: 'electrónico'
    };
    return materials.map(m => `${m.quantity} ${typeTranslations[m.type] || m.type}`).join(', ');
  };

  const handleModalAction = (itemId: string, data?: any) => {
    if (modalMode === 'generate-qr') {
      // Mark bag as collected after QR generation
      setBags(prev => prev.map(bag => 
        bag.id === itemId 
          ? { 
              ...bag, 
              status: 'completed' as const, 
              completedAt: new Date(),
              points: bag.points // Keep the original calculated points
            }
          : bag
      ));
    } else if (modalMode === 'review-collector') {
      // Update bag rating
      setBags(prev => prev.map(bag => 
        bag.id === itemId 
          ? { ...bag, rating: data }
          : bag
      ));
    }
    setSelectedBagForModal(null);
  };

  const handleGenerateQR = (bag: PostedItem) => {
    setSelectedBagForModal(bag);
    setModalMode('generate-qr');
  };

  const handleReviewCollector = (bag: PostedItem) => {
    setSelectedBagForModal(bag);
    setModalMode('review-collector');
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 relative pb-20">
        {/* Filter Tabs */}
        <div className="p-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveFilter('ready')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === 'ready'
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105'
              }`}
            >
              Listos
            </button>
            <button
              onClick={() => setActiveFilter('collected')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === 'collected'
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105'
              }`}
            >
              Recolectados
            </button>
          </div>
        </div>

        {/* Bags List */}
        <div className="px-4 pb-4 space-y-3">
          {filteredBags.map((bag) => (
            <div key={bag.id} className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-102 border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                  <img 
                    src={bag.image} 
                    alt={bag.type}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {getMaterialsDisplay(bag.materials)} - {bag.totalWeight}kg
                  </h3>
                  <p className="text-sm text-gray-600">
                    {bag.status === 'completed' && bag.completedAt
                      ? `Recolectado el ${formatDate(bag.completedAt)}`
                      : `Creado el ${formatDate(bag.postedAt)}`
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {bag.status === 'active' ? (
                  <button
                    onClick={() => handleGenerateQR(bag)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 text-green-700 px-4 py-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 font-medium"
                  >
                    <span className="text-sm">Listo</span>
                    <QrCode className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-gray-900 font-bold text-lg">{bag.points} pts</div>
                      <div className="text-xs text-gray-600">Recolectado</div>
                    </div>
                    {bag.rating ? (
                      <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-100 to-yellow-200 px-3 py-2 rounded-full shadow-sm">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium text-yellow-700">{bag.rating}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleReviewCollector(bag)}
                        className="flex items-center space-x-1 bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-700 px-3 py-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 font-medium"
                      >
                        <Star className="w-3 h-3" />
                        <span className="text-xs">Calificar</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Floating Add Button */}
        <button
          onClick={onCreateItem}
          className="fixed bottom-20 right-4 w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110"
        >
          <Plus className="w-7 h-7 text-white" />
        </button>
      </div>

      {/* Modal */}
      {selectedBagForModal && (
        <PosterQRPickupModal
          item={selectedBagForModal}
          mode={modalMode}
          onClose={() => setSelectedBagForModal(null)}
          onAction={handleModalAction}
        />
      )}
    </>
  );
}