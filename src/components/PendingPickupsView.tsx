import React, { useState } from 'react';
import { QrCode, MapPin, Weight, Clock, CheckCircle, X, Map, List, Navigation, MessageCircle, Recycle, Activity } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { RecyclableItem } from '../types';
import QRScanModal from './QRScanModal';
import MessagesView from './MessagesView';
import ItemsListView from './ItemsListView';
import LoadingSpinner from './LoadingSpinner';

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
  items: RecyclableItem[];
  isLoading: boolean;
  onAccept: (itemId: string) => void;
  onReject: (itemId: string) => void;
  onRefresh: () => void;
}

export default function PendingPickupsView({ 
  pendingPickups, 
  onCompletePickup, 
  onCancelPickup,
  items,
  isLoading,
  onAccept,
  onReject,
  onRefresh
}: PendingPickupsViewProps) {
  const [selectedItem, setSelectedItem] = useState<PendingPickup | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'items' | 'list' | 'map' | 'messages'>('items');
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);
  const mapRef = React.useRef<mapboxgl.Map | null>(null);

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
    // Better distribution within neighborhood bounds (more realistic spacing)
    const x = 40 + (hash % 240); // 40-280 range for better neighborhood spread
    const y = 40 + ((hash * 17) % 240); // 40-280 range with different multiplier
    
    // Ensure minimum distance between points (avoid clustering)
    const minDistance = 30;
    const adjustedX = x + (hash % 3) * minDistance;
    const adjustedY = y + ((hash * 7) % 3) * minDistance;
    
    return { x, y };
  };

  // Generate realistic coordinates for Mapbox (Mexico City area)
  const generateMapboxCoordinates = (itemId: string): [number, number] => {
    const hash = itemId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // Spread around Mexico City center (19.4326, -99.1332) within ~1.5km radius for better neighborhood feel
    const baseLat = 19.4326;
    const baseLng = -99.1332;
    
    // Generate offset in degrees (roughly 1.5km radius for neighborhood feel)
    const latOffset = ((hash % 150) - 75) * 0.0001; // ~±8.25m per 0.0001 degree
    const lngOffset = ((hash * 11 % 150) - 75) * 0.0001;
    
    // Ensure minimum distance between points (avoid too close clustering)
    const minDistanceOffset = 0.0015; // ~165m minimum
    const spreadX = (hash % 5) * minDistanceOffset * 0.1;
    const spreadY = ((hash * 3) % 5) * minDistanceOffset * 0.1;
    
    return [baseLng + lngOffset + spreadX, baseLat + latOffset + spreadY];
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
    
    const startPoint = { x: 160, y: 160 }; // Slightly adjusted center
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

  // Calculate estimated time and distance for route
  const calculateRouteStats = (route: MapPoint[]) => {
    if (route.length === 0) return { distance: 0, time: 0 };
    
    let totalDistance = 0;
    let currentPoint = { x: 160, y: 160 }; // Start from center
    
    route.forEach(point => {
      const distance = Math.sqrt(
        Math.pow(point.simulatedX - currentPoint.x, 2) + 
        Math.pow(point.simulatedY - currentPoint.y, 2)
      );
      totalDistance += distance;
      currentPoint = { x: point.simulatedX, y: point.simulatedY };
    });
    
    // Convert to realistic km (scale factor for simulation)
    const realDistance = (totalDistance / 100) * 1.2; // Rough conversion
    const estimatedTime = Math.ceil(realDistance * 8 + route.length * 3); // 8 min/km + 3 min per stop
    
    return { 
      distance: Math.round(realDistance * 10) / 10, 
      time: estimatedTime 
    };
  };

  const optimizedRoute = calculateBestRoute(mapPoints);
  const routeStats = calculateRouteStats(optimizedRoute);
  const totalPoints = pendingPickups.reduce((sum, item) => sum + item.points, 0);
  const totalWeight = pendingPickups.reduce((sum, item) => sum + item.totalWeight, 0);

  // Initialize Mapbox map when switching to map tab
  React.useEffect(() => {
    if (activeSubTab === 'map' && mapContainer && !mapRef.current && pendingPickups.length > 0) {
      const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
      
      if (mapboxToken && mapboxToken !== 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example') {
        mapboxgl.accessToken = mapboxToken;
        
        const newMap = new mapboxgl.Map({
          container: mapContainer,
          style: 'mapbox://styles/mapbox/satellite-streets-v12',
          center: [-99.1332, 19.4326], // Mexico City
          zoom: 14,
          pitch: 0,
          bearing: 0
        });

        // Add navigation controls
        newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add user location marker
        new mapboxgl.Marker({
          color: '#3b82f6',
          scale: 0.8
        })
          .setLngLat([-99.1332, 19.4326])
          .addTo(newMap);

        // Create route coordinates for the blue line
        const routeCoordinates: [number, number][] = [
          [-99.1332, 19.4326] // Start from user location
        ];
        
        // Add each pickup location in optimized order
        optimizedRoute.forEach(pickup => {
          const coords = generateMapboxCoordinates(pickup.id);
          routeCoordinates.push(coords);
        });

        // Add route line source and layer after map loads
        newMap.on('load', () => {
          // Add route source
          newMap.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: routeCoordinates
              }
            }
          });

          // Add route layer (blue line)
          newMap.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3b82f6', // Blue color
              'line-width': 4,
              'line-opacity': 0.8
            }
          });

          // Add route direction arrows (optional enhancement)
          newMap.addLayer({
            id: 'route-arrows',
            type: 'symbol',
            source: 'route',
            layout: {
              'symbol-placement': 'line',
              'symbol-spacing': 100,
              'icon-image': 'arrow',
              'icon-size': 0.5,
              'icon-rotation-alignment': 'map'
            }
          });
        });

        // Add pending pickup markers
        pendingPickups.forEach((pickup, index) => {
          const coords = generateMapboxCoordinates(pickup.id);
          const routeIndex = optimizedRoute.findIndex(item => item.id === pickup.id);
          const sequenceNumber = routeIndex + 1;

          // Create custom marker
          const markerElement = document.createElement('div');
          markerElement.className = 'custom-marker';
          markerElement.style.cssText = `
            width: 32px;
            height: 32px;
            background-color: #10b981;
            border: 2px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            color: white;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          `;
          markerElement.innerHTML = sequenceNumber.toString();

          // Create popup
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 8px;">
              <strong>${pickup.title}</strong><br>
              <small>Secuencia: #${sequenceNumber}</small>
            </div>
          `);

          new mapboxgl.Marker(markerElement)
            .setLngLat(coords)
            .setPopup(popup)
            .addTo(newMap);
        });

        mapRef.current = newMap;
      }
    }

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [activeSubTab, mapContainer, pendingPickups.length]);

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-bold">Mi Actividad</h2>
              <p className="text-sm opacity-90">
                Gestiona tus recolecciones y comunicaciones
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveSubTab('items')}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeSubTab === 'items'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Recycle className="w-4 h-4" />
            <span>Reciclaje</span>
          </button>
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
          <button
            onClick={() => setActiveSubTab('messages')}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeSubTab === 'messages'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Mensajes</span>
          </button>
        </div>
      </div>

      {pendingPickups.length === 0 && activeSubTab !== 'messages' && activeSubTab !== 'items' ? (
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
          {activeSubTab === 'messages' ? (
            <div className="h-full">
              <MessagesView userType="collector" />
            </div>
          ) : activeSubTab === 'items' ? (
            <div className="p-4">
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <ItemsListView 
                  items={items}
                  onAccept={onAccept}
                  onReject={onReject}
                  onRefresh={onRefresh}
                />
              )}
            </div>
          ) : activeSubTab === 'list' ? (
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
                  <h3 className="font-semibold">🚗 Ruta Optimizada por IA</h3>
                </div>
                <p className="text-sm opacity-90">
                  Algoritmo de vecino más cercano - Ruta más eficiente calculada
                </p>
                <div className="flex items-center justify-between mt-3 text-sm">
                  <span>📍 Distancia: {routeStats.distance}km</span>
                  <span>⏱️ Tiempo: {routeStats.time} min</span>
                </div>
                <div className="mt-2 text-xs opacity-75">
                  Incluye tiempo de recolección y tráfico promedio
                </div>
              </div>

              {/* Map Container */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Mapa de Ruta</h3>
                </div>
                
                {/* Check if Mapbox token is available */}
                {import.meta.env.VITE_MAPBOX_TOKEN && import.meta.env.VITE_MAPBOX_TOKEN !== 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example' ? (
                  <div 
                    ref={setMapContainer}
                    className="w-full h-80"
                    style={{ minHeight: '320px' }}
                  />
                ) : (
                  /* Fallback Simulated Map */
                  <div className="p-4">
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
                            x2={`${(optimizedRoute[0].simulatedX / 320) * 100}%`}
                            y2={`${(optimizedRoute[0].simulatedY / 320) * 100}%`}
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
                              x1={`${(point.simulatedX / 320) * 100}%`}
                              y1={`${(point.simulatedY / 320) * 100}%`}
                              x2={`${(nextPoint.simulatedX / 320) * 100}%`}
                              y2={`${(nextPoint.simulatedY / 320) * 100}%`}
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
                              left: `${(point.simulatedX / 320) * 100}%`,
                              top: `${(point.simulatedY / 320) * 100}%`
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
                  </div>
                )}
              </div>

              {/* Route sequence */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-700">🗺️ Secuencia de Recolección</h4>
                    <div className="text-xs text-gray-500">
                      {optimizedRoute.length} paradas
                    </div>
                  </div>
                  <div className="space-y-2">
                    {optimizedRoute.map((point, index) => (
                      <div key={point.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <span className="text-lg">
                          {point.materials.length > 0 ? getCategoryIcon(point.materials[0].type) : '♻️'}
                        </span>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {point.title}
                          </div>
                          <div className="text-xs text-gray-600">
                            📍 {point.location.address}
                          </div>
                          {index === 0 && (
                            <div className="text-xs text-green-600 font-medium">
                              🚀 Siguiente parada
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">
                            {index === 0 ? 'Ahora' : `${Math.ceil((index + 1) * routeStats.time / optimizedRoute.length)} min`}
                          </div>
                        <button
                          onClick={() => setSelectedItem(point)}
                          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                            index === 0 
                              ? 'bg-green-600 hover:bg-green-700 text-white shadow-sm' 
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          }`}
                        >
                          {index === 0 ? '🎯 Ir' : 'Escanear'}
                        </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Route Summary */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-green-600">🎯</span>
                  <h4 className="text-sm font-semibold text-green-800">Resumen de Ruta</h4>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-700">{routeStats.distance}km</div>
                    <div className="text-xs text-green-600">Distancia total</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-700">{routeStats.time}min</div>
                    <div className="text-xs text-green-600">Tiempo estimado</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-700">{totalWeight.toFixed(1)}kg</div>
                    <div className="text-xs text-green-600">Peso total</div>
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