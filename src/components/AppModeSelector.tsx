import React from 'react';
import { Recycle, Package } from 'lucide-react';

interface AppModeSelectorProps {
  onSelectMode: (mode: 'collector' | 'poster') => void;
}

export default function AppModeSelector({ onSelectMode }: AppModeSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Recycle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EcoCiclo</h1>
          <p className="text-gray-600">Conectando el reciclaje inteligente</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onSelectMode('collector')}
            className="w-full bg-white hover:bg-green-50 border-2 border-green-200 hover:border-green-300 rounded-2xl p-6 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-100 group-hover:bg-green-200 rounded-xl flex items-center justify-center transition-colors">
                <Recycle className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Soy Recolector</h3>
                <p className="text-gray-600 text-sm">
                  Encuentra elementos para reciclar cerca de ti y gana dinero
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onSelectMode('poster')}
            className="w-full bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-300 rounded-2xl p-6 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center transition-colors">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Tengo Reciclaje</h3>
                <p className="text-gray-600 text-sm">
                  Publica elementos, gana puntos y ayuda al medio ambiente
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Ayudamos a conectar personas que quieren reciclar con recolectores profesionales
          </p>
        </div>
      </div>
    </div>
  );
}