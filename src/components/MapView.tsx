import React from 'react';
import { MapPin, Navigation, Zap, Clock } from 'lucide-react';

interface MapViewProps {
  userType: 'collector' | 'poster';
}

export default function MapView({ userType }: MapViewProps) {
  const isCollector = userType === 'collector';
  
  const mockLocations = [
    { id: 1, lat: 19.4326, lng: -99.1332, type: 'plastic', urgent: true },
    { id: 2, lat: 19.4284, lng: -99.1276, type: 'paper', urgent: false },
    { id: 3, lat: 19.4355, lng: -99.1421, type: 'metal', urgent: true },
    { id: 4, lat: 19.4298, lng: -99.1398, type: 'glass', urgent: false },
    { id: 5, lat: 19.4312, lng: -99.1289, type: 'electronic', urgent: true }
  ];

  const getMarkerColor = (type: string, urgent: boolean) => {
    if (urgent) return 'bg-red-500';
    switch (type) {
      case 'plastic': return 'bg-blue-500';
      case 'paper': return 'bg-yellow-500';
      case 'metal': return 'bg-gray-500';
      case 'glass': return 'bg-green-500';
      case 'electronic': return 'bg-purple-500';
      default: return 'bg-gray-500';
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
    <div className="h-full">
      {/* Map Header */}
      <div className={`${isCollector ? 'bg-green-600' : 'bg-blue-600'} text-white p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-bold">
                {isCollector ? 'Elementos Cercanos' : 'Mis Publicaciones'}
              </h2>
              <p className="text-sm opacity-90">
                {isCollector ? 'Encuentra reciclaje en tu área' : 'Ubicación de tus elementos'}
              </p>
            </div>
          </div>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-all duration-200">
            <Navigation className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mock Map Area */}
      <div className="relative bg-gray-200 h-96 overflow-hidden">
        {/* Map Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 h-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="border border-gray-300"></div>
            ))}
          </div>
        </div>

        {/* Street Lines */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 right-0 h-1 bg-gray-400 opacity-60"></div>
          <div className="absolute top-3/4 left-0 right-0 h-1 bg-gray-400 opacity-60"></div>
          <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-gray-400 opacity-60"></div>
          <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-gray-400 opacity-60"></div>
        </div>

        {/* Location Markers */}
        {mockLocations.map((location, index) => (
          <div
            key={location.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{
              left: `${20 + (index * 15)}%`,
              top: `${30 + (index % 3) * 20}%`
            }}
          >
            <div className={`w-8 h-8 rounded-full ${getMarkerColor(location.type, location.urgent)} flex items-center justify-center text-white text-sm font-bold shadow-lg group-hover:scale-110 transition-transform`}>
              {getTypeIcon(location.type)}
            </div>
            {location.urgent && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse">
                <Zap className="w-2 h-2 text-white m-0.5" />
              </div>
            )}
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
              {location.type} {location.urgent && '(Urgente)'}
            </div>
          </div>
        ))}

        {/* User Location */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
          <div className="absolute inset-0 w-4 h-4 bg-blue-600 rounded-full opacity-30 animate-ping"></div>
        </div>
      </div>

      {/* Map Stats */}
      <div className="p-4 bg-white">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-gray-900">
              {isCollector ? '12' : '5'}
            </div>
            <div className="text-xs text-gray-600">
              {isCollector ? 'Disponibles' : 'Activos'}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-orange-600">3</div>
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
      <div className="p-4 bg-gray-50">
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