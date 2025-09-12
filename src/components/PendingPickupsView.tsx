import React, { useState } from 'react';
import { QrCode, MapPin, Weight, Clock, CheckCircle, X, Map, List, Navigation } from 'lucide-react';
import { RecyclableItem } from '../types';
import QRScanModal from './QRScanModal';

interface PendingPickup extends RecyclableItem {
  acceptedAt: Date;
}

interface MapPoint extends PendingPickup {
  simulatedX: number;
  simulatedY: number;
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
  const [activeSubTab, setActiveSubTab] = useState<'list' | 'map'>('list');

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

  // Generate consistent simulated coordinates based on item ID
  const generateSimulatedCoordinates = (itemId: string): { x: number, y: number } => {
    const hash = itemId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const x = 50 + (hash % 200); // 50-250 range
    const y = 50 + ((hash * 7) % 200); // 50-250 range with different multiplier
    return { x, y };
  };

  // Convert pending pickups to map points
  const mapPoints: MapPoint[] = pendingPickups.map(pickup => {
    const coords = generateSimulatedCoordinates(pickup.id);
    return {
      ...pickup,
      simulatedX: coords.x,
      simulatedY: coords.y
    };
  });

  // Calculate best route using nearest neighbor algorithm
  const calculateBestRoute = (points: MapPoint[]): MapPoint[] => {
    if (points.length <= 1) return points;
    
    const startPoint = { x: 150, y: 150 }; // Center of map
    const unvisited = [...points];
    const route: MapPoint[] = [];
    let currentPoint = startPoint;
    
    while (unvisited.length > 0) {
      let nearestIndex = 0;
      let nearestDistance = Infinity;
      
      unvisited.forEach((point, index) => {
        const distance = Math.sqrt(
          Math.pow(point.simulatedX - currentPoint.x, 2) + 
          Math.pow(point.simulatedY - currentPoint.y, 2)
        );
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });
      
      const nearestPoint = unvisited.splice(nearestIndex, 1)[0];
      route.push(nearestPoint);
      currentPoint = { x: nearestPoint.simulatedX, y: nearestPoint.simulatedY };
    }
    
    return route;
  };

  const optimizedRoute = calculateBestRoute(mapPoints);
  const totalPoints = pendingPickups.reduce((sum, item) => sum + item.points, 0);
  const totalWeight = pendingPickups.reduce((sum, item) => sum + item.totalWeight, 0);

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
            <div className="font-semibold">{pendingPickups.length} elementos</div>
            <div className="text-green-200">{totalWeight.toFixed(1)}kg total</div>
          </div>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveSubTab('list')}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeSubTab === 'list'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="w-4 h-4" />
            <span>Lista</span>
          </button>
          <button
            onClick={() => setActiveSubTab('map')}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeSubTab === 'map'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Mapa</span>
          </button>
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
        <>
          {activeSubTab === 'list' ? (
            <div className="p-4 space-y-4">
              {/* Summary Card */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Resumen de Ruta</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Elementos:</span>
                    <span className="font-bold text-green-600">{pendingPickups.length}</span>
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
                          <span className="text-lg">
                            {item.materials.length > 0 ? getCategoryIcon(item.materials[0].type) : '♻️'}
                          </span>
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
                            {item.totalWeight}kg
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTimeAgo(item.acceptedAt)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
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
          ) : (
            <div className="p-4 space-y-4">
              {/* AI Route Info */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <Navigation className="w-5 h-5" />
                  <h3 className="font-semibold">Ruta Optimizada por IA</h3>
                </div>
                <p className="text-sm opacity-90">
                  Algoritmo de vecino más cercano calculó la ruta más eficiente
                </p>
                <div className="flex items-center justify-between mt-3 text-sm">
                  <span>Distancia estimada: {(optimizedRoute.length * 0.8).toFixed(1)}km</span>
                  <span>Tiempo estimado: {Math.ceil(optimizedRoute.length * 8)} min</span>
                </div>
              </div>

              {/* Simulated Map */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Mapa de Ruta</h3>
                <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                  {/* Grid background */}
                  <div className="absolute inset-0 opacity-20">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={`v-${i}`} className="absolute bg-gray-300" style={{
                        left: `${i * 10}%`,
                        top: 0,
                        width: '1px',
                        height: '100%'
                      }} />
                    ))}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={`h-${i}`} className="absolute bg-gray-300" style={{
                        top: `${i * 12.5}%`,
                        left: 0,
                        height: '1px',
                        width: '100%'
                      }} />
                    ))}
                  </div>

                  {/* Route lines */}
                  <svg className="absolute inset-0 w-full h-full">
                    {/* Line from center to first point */}
                    {optimizedRoute.length > 0 && (
                      <line
                        x1="50%"
                        y1="50%"
                        x2={`${(optimizedRoute[0].simulatedX / 300) * 100}%`}
                        y2={`${(optimizedRoute[0].simulatedY / 300) * 100}%`}
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                    )}
                    {/* Lines between route points */}
                    {optimizedRoute.map((point, index) => {
                      if (index === optimizedRoute.length - 1) return null;
                      const nextPoint = optimizedRoute[index + 1];
                      return (
                        <line
                          key={`line-${index}`}
                          x1={`${(point.simulatedX / 300) * 100}%`}
                          y1={`${(point.simulatedY / 300) * 100}%`}
                          x2={`${(nextPoint.simulatedX / 300) * 100}%`}
                          y2={`${(nextPoint.simulatedY / 300) * 100}%`}
                          stroke="#10b981"
                          strokeWidth="3"
                        />
                      );
                    })}
                  </svg>

                  {/* Center point (user location) */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-blue-600 whitespace-nowrap">
                      Tu ubicación
                    </div>
                  </div>

                  {/* Pickup points */}
                  {optimizedRoute.map((point, index) => {
                    const routeOrder = index + 1;
                    return (
                      <div
                        key={point.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${(point.simulatedX / 300) * 100}%`,
                          top: `${(point.simulatedY / 300) * 100}%`
                        }}
                      >
                        <div className="relative">
                          <div className="w-8 h-8 bg-green-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{routeOrder}</span>
                          </div>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-lg">
                            {point.materials.length > 0 ? getCategoryIcon(point.materials[0].type) : '♻️'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Route sequence */}
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Secuencia de Recolección:</h4>
                  <div className="space-y-2">
                    {optimizedRoute.map((point, index) => (
                      <div key={point.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <span className="text-lg">
                          {point.materials.length > 0 ? getCategoryIcon(point.materials[0].type) : '♻️'}
                        </span>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{point.title}</div>
                          <div className="text-xs text-gray-600">{point.location.address}</div>
                        </div>
                        <button
                          onClick={() => setSelectedItem(point)}
                          className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                        >
                          Escanear
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
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