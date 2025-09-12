import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapViewProps {
  userType: 'collector' | 'poster';
}

export default function MapView({ userType }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const isCollector = userType === 'collector';
  
  const mockLocations = [
    { id: 1, lat: 19.4326, lng: -99.1332, type: 'plastic', urgent: true },
    { id: 2, lat: 19.4356, lng: -99.1302, type: 'paper', urgent: false },
    { id: 3, lat: 19.4296, lng: -99.1362, type: 'metal', urgent: true },
    { id: 4, lat: 19.4346, lng: -99.1372, type: 'glass', urgent: false },
    { id: 5, lat: 19.4306, lng: -99.1292, type: 'electronic', urgent: true },
    { id: 6, lat: 19.4366, lng: -99.1342, type: 'plastic', urgent: false },
    { id: 7, lat: 19.4286, lng: -99.1322, type: 'paper', urgent: true },
    { id: 8, lat: 19.4336, lng: -99.1382, type: 'metal', urgent: false }
  ];

  const getMarkerColor = (type: string, urgent: boolean) => {
    if (urgent) return '#ef4444'; // red-500
    switch (type) {
      case 'plastic': return '#3b82f6'; // blue-500
      case 'paper': return '#eab308'; // yellow-500
      case 'metal': return '#6b7280'; // gray-500
      case 'glass': return '#22c55e'; // green-500
      case 'electronic': return '#a855f7'; // purple-500
      default: return '#6b7280'; // gray-500
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

  useEffect(() => {
    // Check if Mapbox token is available
    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example';
    
    // Only initialize map if we have a valid token (not the placeholder)
    if (mapboxToken === 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example') {
      console.warn('Mapbox token not configured. Please set VITE_MAPBOX_TOKEN environment variable.');
      return;
    }
    
    mapboxgl.accessToken = mapboxToken;

    if (map.current) return; // Initialize map only once

    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12', // Satellite view with street labels
        center: [-99.1332, 19.4326], // Mexico City coordinates [lng, lat]
        zoom: 13,
        pitch: 0,
        bearing: 0
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add user location marker (blue dot)
      const userMarker = new mapboxgl.Marker({
        color: '#3b82f6',
        scale: 0.8
      })
        .setLngLat([-99.1332, 19.4326])
        .addTo(map.current);

      // Add recyclable item markers
      mockLocations.forEach((location) => {
        const markerColor = getMarkerColor(location.type, location.urgent);
        const icon = getTypeIcon(location.type);

        // Create custom marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.style.cssText = `
          width: 32px;
          height: 32px;
          background-color: ${markerColor};
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        `;
        markerElement.innerHTML = icon;

        // Add urgent indicator
        if (location.urgent) {
          const urgentIndicator = document.createElement('div');
          urgentIndicator.style.cssText = `
            position: absolute;
            top: -2px;
            right: -2px;
            width: 12px;
            height: 12px;
            background-color: #ef4444;
            border: 1px solid white;
            border-radius: 50%;
            animation: pulse 2s infinite;
          `;
          markerElement.appendChild(urgentIndicator);
        }

        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 8px;">
            <strong>${location.type.charAt(0).toUpperCase() + location.type.slice(1)}</strong>
            ${location.urgent ? '<br><span style="color: #ef4444;">⚡ Urgente</span>' : ''}
          </div>
        `);

        // Add marker to map
        new mapboxgl.Marker(markerElement)
          .setLngLat([location.lng, location.lat])
          .setPopup(popup)
          .addTo(map.current!);
      });
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

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

      {/* Mapbox Map Container */}
      <div 
        ref={mapContainer} 
        className="h-96 w-full"
        style={{ minHeight: '400px' }}
      />

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

      {/* Important Notice */}
      <div className="p-4 bg-yellow-50 border-t border-yellow-200">
        <div className="text-center">
          <p className="text-sm text-yellow-800 font-medium">
            ⚠️ Mapbox Token Required
          </p>
          <p className="text-xs text-yellow-700 mt-1">
            Get your free token at{' '}
            <a 
              href="https://account.mapbox.com/access-tokens/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-yellow-900"
            >
              mapbox.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}