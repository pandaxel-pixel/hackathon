import React, { useState } from 'react';
import { MapPin, Navigation, Zap, Clock, Search, Layers, Plus, Minus } from 'lucide-react';

interface MapViewProps {
  userType: 'collector' | 'poster';
}

export default function MapView({ userType }: MapViewProps) {
  const isCollector = userType === 'collector';
  const [zoomLevel, setZoomLevel] = useState(13);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  
  const mockLocations = [
    { 
      id: 1, 
      lat: 19.4326, 
      lng: -99.1332, 
      type: 'plastic', 
      urgent: true,
      title: 'Botellas PET',
      weight: '2.1kg',
      points: 85,
      address: 'Col. Roma Norte'
    },
    { 
      id: 2, 
      lat: 19.4284, 
      lng: -99.1276, 
      type: 'paper', 
      urgent: false,
      title: 'Cartón doblado',
      weight: '5.5kg',
      points: 45,
      address: 'Col. Condesa'
    },
    { 
      id: 3, 
      lat: 19.4355, 
      lng: -99.1421, 
      type: 'metal', 
      urgent: true,
      title: 'Latas de aluminio',
      weight: '1.8kg',
      points: 120,
      address: 'Col. Polanco'
    },
    { 
      id: 4, 
      lat: 19.4298, 
      lng: -99.1398, 
      type: 'glass', 
      urgent: false,
      title: 'Botellas de vidrio',
      weight: '3.2kg',
      points: 60,
      address: 'Col. Del Valle'
    },
    { 
      id: 5, 
      lat: 19.4312, 
      lng: -99.1289, 
      type: 'electronic', 
      urgent: true,
      title: 'Electrónicos pequeños',
      weight: '0.8kg',
      points: 200,
      address: 'Col. Narvarte'
    }
  ];

  const getMarkerColor = (type: string, urgent: boolean) => {
    if (urgent) return 'bg-red-500 border-red-600';
    switch (type) {
      case 'plastic': return 'bg-blue-500 border-blue-600';
      case 'paper': return 'bg-yellow-500 border-yellow-600';
      case 'metal': return 'bg-gray-500 border-gray-600';
      case 'glass': return 'bg-green-500 border-green-600';
      case 'electronic': return 'bg-purple-500 border-purple-600';
      default: return 'bg-gray-500 border-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      plastic: '🥤',
      paper: '📄',
      metal: '🥫',
      glass: '🍶',
      electronic: '📱'
    };
    return icons[type as keyof typeof icons] || '♻️';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Map Header */}
      <div className={`${isCollector ? 'bg-green-600' : 'bg-blue-600'} text-white p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-bold">
                {isCollector ? 'Elementos Cercanos' : 'Mis Publicaciones'}
              </h2>
              <p className="text-sm opacity-90">Ciudad de México</p>
            </div>
          </div>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-all duration-200">
            <Navigation className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar en el mapa..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative bg-gray-100 overflow-hidden">
        {/* Google Maps-like Background */}
        <div className="absolute inset-0">
          {/* Base map color */}
          <div className="w-full h-full bg-gray-50"></div>
          
          {/* Water areas (simulated) */}
          <div className="absolute top-10 left-10 w-32 h-20 bg-blue-200 rounded-full opacity-60"></div>
          <div className="absolute bottom-20 right-16 w-24 h-16 bg-blue-200 rounded-lg opacity-60"></div>
          
          {/* Parks and green areas */}
          <div className="absolute top-32 right-20 w-28 h-28 bg-green-200 rounded-full opacity-70"></div>
          <div className="absolute bottom-32 left-20 w-20 h-20 bg-green-200 rounded-lg opacity-70"></div>
          
          {/* Street grid pattern */}
          <div className="absolute inset-0 opacity-30">
            {/* Horizontal streets */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`h-${i}`}
                className="absolute left-0 right-0 h-0.5 bg-white"
                style={{ top: `${12.5 * (i + 1)}%` }}
              />
            ))}
            {/* Vertical streets */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`v-${i}`}
                className="absolute top-0 bottom-0 w-0.5 bg-white"
                style={{ left: `${16.66 * (i + 1)}%` }}
              />
            ))}
          </div>

          {/* Major avenues */}
          <div className="absolute top-1/3 left-0 right-0 h-1 bg-yellow-300 opacity-60"></div>
          <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-yellow-300 opacity-60"></div>
        </div>

        {/* Location Markers */}
        {mockLocations.map((location, index) => (
          <div
            key={location.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
            style={{
              left: `${25 + (index * 12)}%`,
              top: `${35 + (index % 3) * 15}%`
            }}
            onClick={() => setSelectedItem(selectedItem === location.id ? null : location.id)}
          >
            {/* Marker */}
            <div className={`relative w-10 h-10 rounded-full border-2 ${getMarkerColor(location.type, location.urgent)} flex items-center justify-center text-white text-lg font-bold shadow-lg group-hover:scale-110 transition-transform`}>
              {getTypeIcon(location.type)}
              {location.urgent && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse">
                  <Zap className="w-2 h-2 text-white m-0.5" />
                </div>
              )}
            </div>

            {/* Info Card */}
            {selectedItem === location.id && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-20">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{location.title}</h3>
                  {location.urgent && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Urgente</span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-2">{location.address}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Peso: {location.weight}</span>
                  {isCollector ? (
                    <span className="text-green-600 font-medium">Disponible</span>
                  ) : (
                    <span className="text-blue-600 font-medium">{location.points} pts</span>
                  )}
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <button className={`w-full py-1 px-3 rounded text-xs font-medium ${
                    isCollector 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  } transition-colors`}>
                    {isCollector ? 'Ir a recoger' : 'Ver detalles'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* User Location */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
          <div className="absolute inset-0 w-4 h-4 bg-blue-600 rounded-full opacity-30 animate-ping"></div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 1, 18))}
            className="block w-10 h-10 flex items-center justify-center hover:bg-gray-50 border-b border-gray-200"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 1, 8))}
            className="block w-10 h-10 flex items-center justify-center hover:bg-gray-50"
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Layers Button */}
        <div className="absolute bottom-4 right-4">
          <button className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors">
            <Layers className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Zoom Level Indicator */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          Zoom: {zoomLevel}
        </div>
      </div>

      {/* Map Stats */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-gray-900">
              {isCollector ? mockLocations.length : '5'}
            </div>
            <div className="text-xs text-gray-600">
              {isCollector ? 'Disponibles' : 'Activos'}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-orange-600">
              {mockLocations.filter(l => l.urgent).length}
            </div>
            <div className="text-xs text-gray-600">Urgentes</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600">
              {isCollector ? '2.1km' : '1.8km'}
            </div>
            <div className="text-xs text-gray-600">Promedio</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 border-t border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Leyenda</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Plástico</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Papel</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span>Metal</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Vidrio</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Electrónico</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Urgente</span>
          </div>
        </div>
      </div>
    </div>
  );
}