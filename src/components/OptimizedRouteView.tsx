import React, { useState, useEffect } from 'react';
import { Route, Navigation, Clock, MapPin, Zap, Play, Pause, RotateCcw } from 'lucide-react';

export default function OptimizedRouteView() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [routeProgress, setRouteProgress] = useState(0);

  const routeStops = [
    {
      id: 'start',
      name: 'Tu ubicación',
      address: 'Col. Roma Norte, CDMX',
      type: 'start',
      estimatedTime: '0 min',
      distance: '0 km',
      icon: '📍'
    },
    {
      id: 1,
      name: 'Botellas PET',
      address: 'Col. Roma Norte, CDMX',
      type: 'plastic',
      estimatedTime: '3 min',
      distance: '0.8 km',
      weight: '2.1kg',
      urgent: true,
      icon: '🥤'
    },
    {
      id: 2,
      name: 'Latas de aluminio',
      address: 'Col. Polanco, CDMX',
      type: 'metal',
      estimatedTime: '8 min',
      distance: '2.1 km',
      weight: '1.8kg',
      urgent: true,
      icon: '🥫'
    },
    {
      id: 3,
      name: 'Electrónicos pequeños',
      address: 'Col. Narvarte, CDMX',
      type: 'electronic',
      estimatedTime: '12 min',
      distance: '1.9 km',
      weight: '0.8kg',
      urgent: true,
      icon: '📱'
    },
    {
      id: 4,
      name: 'Cartón doblado',
      address: 'Col. Condesa, CDMX',
      type: 'paper',
      estimatedTime: '18 min',
      distance: '1.5 km',
      weight: '5.5kg',
      urgent: false,
      icon: '📄'
    },
    {
      id: 5,
      name: 'Botellas de vidrio',
      address: 'Col. Del Valle, CDMX',
      type: 'glass',
      estimatedTime: '25 min',
      distance: '2.3 km',
      weight: '3.2kg',
      urgent: false,
      icon: '🍶'
    }
  ];

  const totalDistance = routeStops.reduce((sum, stop) => {
    const distance = parseFloat(stop.distance.replace(' km', ''));
    return sum + distance;
  }, 0);

  const totalTime = routeStops[routeStops.length - 1].estimatedTime;
  const totalWeight = routeStops
    .filter(stop => stop.weight)
    .reduce((sum, stop) => sum + parseFloat(stop.weight!.replace('kg', '')), 0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isSimulating) {
      interval = setInterval(() => {
        setRouteProgress(prev => {
          if (prev >= 100) {
            setIsSimulating(false);
            return 100;
          }
          return prev + 2;
        });
        
        setCurrentStep(prev => {
          const newStep = Math.floor((routeProgress / 100) * (routeStops.length - 1));
          return Math.min(newStep, routeStops.length - 1);
        });
      }, 200);
    }

    return () => clearInterval(interval);
  }, [isSimulating, routeProgress, routeStops.length]);

  const resetSimulation = () => {
    setIsSimulating(false);
    setCurrentStep(0);
    setRouteProgress(0);
  };

  const getStopStatus = (index: number) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep && isSimulating) return 'current';
    return 'pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'current': return 'bg-blue-500 text-white animate-pulse';
      default: return 'bg-gray-200 text-gray-600';
    }
  };

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Route className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-bold">Ruta Optimizada</h2>
              <p className="text-sm opacity-90">Recorrido eficiente por IA</p>
            </div>
          </div>
          <div className="text-right text-sm">
            <div className="font-semibold">{totalDistance.toFixed(1)} km</div>
            <div className="text-green-200">{totalTime}</div>
          </div>
        </div>
      </div>

      {/* Route Summary */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xl font-bold text-gray-900">{routeStops.length - 1}</div>
            <div className="text-xs text-gray-600">Paradas</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xl font-bold text-gray-900">{totalWeight.toFixed(1)}kg</div>
            <div className="text-xs text-gray-600">Peso total</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xl font-bold text-gray-900">
              {routeStops.filter(s => s.urgent).length}
            </div>
            <div className="text-xs text-gray-600">Urgentes</div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
              isSimulating 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isSimulating ? 'Pausar' : 'Iniciar'} Simulación</span>
          </button>
          <button
            onClick={resetSimulation}
            className="py-2 px-4 rounded-lg font-medium bg-gray-500 hover:bg-gray-600 text-white transition-colors flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>

        {/* Progress Bar */}
        {isSimulating && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progreso de la ruta</span>
              <span>{Math.round(routeProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-200"
                style={{ width: `${routeProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Simulated Map with Route */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Vista del Recorrido</h3>
        <div className="relative bg-gray-100 rounded-lg h-48 overflow-hidden">
          {/* Map Background */}
          <div className="absolute inset-0">
            {/* Base map */}
            <div className="w-full h-full bg-gray-50"></div>
            
            {/* Streets */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-white"></div>
              <div className="absolute top-2/4 left-0 right-0 h-0.5 bg-white"></div>
              <div className="absolute top-3/4 left-0 right-0 h-0.5 bg-white"></div>
              <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-white"></div>
              <div className="absolute left-2/4 top-0 bottom-0 w-0.5 bg-white"></div>
              <div className="absolute left-3/4 top-0 bottom-0 w-0.5 bg-white"></div>
            </div>

            {/* Route Line */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
              <path
                d="M 20 96 Q 60 80 100 96 Q 140 112 180 96 Q 220 80 260 96 Q 300 112 340 96"
                stroke="#10B981"
                strokeWidth="3"
                fill="none"
                strokeDasharray={isSimulating ? "0" : "5,5"}
                className={isSimulating ? "animate-pulse" : ""}
              />
            </svg>

            {/* Route Points */}
            {routeStops.map((stop, index) => {
              const status = getStopStatus(index);
              return (
                <div
                  key={stop.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${10 + (index * 55)}px`,
                    top: `96px`,
                    zIndex: 2
                  }}
                >
                  <div className={`w-8 h-8 rounded-full border-2 border-white ${getStatusColor(status)} flex items-center justify-center text-sm font-bold shadow-lg`}>
                    {stop.id === 'start' ? '🏠' : index}
                  </div>
                  {stop.urgent && status !== 'completed' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full">
                      <Zap className="w-2 h-2 text-white m-0.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Route Steps */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {routeStops.map((stop, index) => {
            const status = getStopStatus(index);
            return (
              <div
                key={stop.id}
                className={`bg-white rounded-lg p-4 border-2 transition-all duration-300 ${
                  status === 'current' 
                    ? 'border-blue-500 shadow-lg' 
                    : status === 'completed'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${getStatusColor(status)} flex items-center justify-center text-lg font-bold`}>
                    {stop.id === 'start' ? '🏠' : stop.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{stop.name}</h3>
                      {stop.urgent && status !== 'completed' && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                          <Zap className="w-3 h-3" />
                          <span>Urgente</span>
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{stop.address}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 text-sm">
                      <div className="flex items-center space-x-4 text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {stop.estimatedTime}
                        </div>
                        <div className="flex items-center">
                          <Navigation className="w-3 h-3 mr-1" />
                          {stop.distance}
                        </div>
                        {stop.weight && (
                          <div className="text-gray-700 font-medium">
                            {stop.weight}
                          </div>
                        )}
                      </div>
                      
                      {status === 'completed' && (
                        <span className="text-green-600 font-medium text-xs">✓ Completado</span>
                      )}
                      {status === 'current' && isSimulating && (
                        <span className="text-blue-600 font-medium text-xs animate-pulse">→ En progreso</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Route Optimization Info */}
      <div className="bg-green-50 border-t border-green-200 p-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-green-600">🤖</span>
          <span className="text-sm font-medium text-green-800">Optimización por IA</span>
        </div>
        <div className="text-xs text-green-700">
          Ruta optimizada considerando urgencia, distancia y eficiencia de combustible.
          Ahorro estimado: 15 minutos y 2.3 km vs. ruta manual.
        </div>
      </div>
    </div>
  );
}