import React, { useState } from 'react';
import { QrCode, MapPin, Weight, Clock, CheckCircle, X } from 'lucide-react';
import { RecyclableItem } from '../types';
import QRScanModal from './QRScanModal';

interface PendingPickup extends RecyclableItem {
  acceptedAt: Date;
}

interface PendingPickupsViewProps {
  pendingPickups: PendingPickup[];
  onCompletePickup: (itemId: string) => void;
  onCancelPickup: (itemId: string) => void;
}

export default function PendingPickupsView({ 
  pendingPickups, 
  onCompletePickup, 
  onCancelPickup 
}: PendingPickupsViewProps) {
  const [selectedItem, setSelectedItem] = useState<PendingPickup | null>(null);

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
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    return `Hace ${Math.floor(diffInHours / 24)}d`;
  };

  const totalPoints = pendingPickups.reduce((sum, item) => sum + item.points, 0);
  const totalWeight = pendingPickups.reduce((sum, item) => sum + item.weight, 0);

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <QrCode className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-bold">Recolecciones Pendientes</h2>
              <p className="text-sm opacity-90">
                {pendingPickups.length} elementos esperando escaneo QR
              </p>
            </div>
          </div>
          <div className="text-right text-sm">
            <div className="font-semibold">{totalPoints} pts</div>
            <div className="text-green-200">{totalWeight.toFixed(1)}kg total</div>
          </div>
        </div>
      </div>

      {pendingPickups.length === 0 ? (
        <div className="text-center py-16 px-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <QrCode className="w-12 h-12 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No hay recolecciones pendientes
          </h3>
          <p className="text-gray-600">
            Acepta elementos para comenzar a recolectar
          </p>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {/* Summary Card */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Resumen de Ruta</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Total:</span>
                <span className="font-bold text-green-600">{totalPoints} pts</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xl font-bold text-gray-900">{pendingPickups.length}</div>
                <div className="text-xs text-gray-600">Elementos</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xl font-bold text-gray-900">{totalWeight.toFixed(1)}kg</div>
                <div className="text-xs text-gray-600">Peso total</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xl font-bold text-gray-900">
                  {Math.round(pendingPickups.reduce((sum, item) => sum + item.location.distance, 0) / pendingPickups.length * 10) / 10}km
                </div>
                <div className="text-xs text-gray-600">Distancia prom.</div>
              </div>
            </div>
          </div>

          {/* Pending Items */}
          {pendingPickups.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-20 h-20 object-cover"
                />
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getCategoryIcon(item.category)}</span>
                      <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                    </div>
                    <button
                      onClick={() => onCancelPickup(item.id)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-xs mb-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{item.location.address} • {item.location.distance}km</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Weight className="w-3 h-3 mr-1" />
                        {item.weight}kg
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimeAgo(item.acceptedAt)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-green-600">
                        {item.points} pts
                      </span>
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1"
                      >
                        <QrCode className="w-3 h-3" />
                        <span>Escanear</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Batch Scan Button */}
          {pendingPickups.length > 1 && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <button
                onClick={() => {
                  // For demo, we'll just scan the first item
                  if (pendingPickups.length > 0) {
                    setSelectedItem(pendingPickups[0]);
                  }
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <QrCode className="w-5 h-5" />
                <span>Escanear Siguiente ({pendingPickups.length} restantes)</span>
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Escanea los códigos QR uno por uno al recoger cada elemento
              </p>
            </div>
          )}
        </div>
      )}

      {selectedItem && (
        <QRScanModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onConfirmPickup={() => {
            onCompletePickup(selectedItem.id);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
}