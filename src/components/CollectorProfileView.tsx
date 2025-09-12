import React from 'react';
import { LogOut, User, Settings, HelpCircle, Shield, RotateCcw } from 'lucide-react';
import { itemApi } from '../api/mockApi';

interface CollectorProfileViewProps {
  username: string;
  displayPhoto: string;
  onLogout: () => void;
}

export default function CollectorProfileView({ username, displayPhoto, onLogout }: CollectorProfileViewProps) {
  const handleResetApp = async () => {
    const confirmed = window.confirm(
      '¿Estás seguro de que quieres restablecer la aplicación? Esto eliminará todos los datos y te regresará al estado inicial.'
    );
    
    if (confirmed) {
      try {
        await itemApi.resetApp();
        // Force a page reload to ensure clean state
        window.location.reload();
      } catch (error) {
        console.error('Error resetting app:', error);
        alert('Error al restablecer la aplicación. Inténtalo de nuevo.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-green-600 text-white p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-3xl">{displayPhoto}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">{username}</h2>
            <p className="text-green-200">Recolector</p>
          </div>
        </div>
      </div>

      {/* Profile Options */}
      <div className="p-4 space-y-4">
        {/* Account Section */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Cuenta</h3>
          </div>
          <div className="p-4 space-y-1">
            <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Editar Perfil</span>
            </button>
            
            <div className="border-b border-gray-100"></div>
            
            <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Configuración</span>
            </button>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Soporte</h3>
          </div>
          <div className="p-4 space-y-1">
            
            <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <HelpCircle className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Ayuda y Soporte</span>
            </button>
            
            <div className="border-b border-gray-100"></div>
            
            <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <Shield className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Privacidad</span>
            </button>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Acerca de</h3>
          </div>
          <div className="p-4 space-y-1">
            <div className="flex items-center justify-between p-3">
              <span className="text-gray-900">Versión</span>
              <span className="text-gray-600">1.0.0</span>
            </div>
            
            <div className="border-b border-gray-100"></div>
            
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <span className="text-gray-900">Términos de Servicio</span>
              <span className="text-gray-400">→</span>
            </button>
            
            <div className="border-b border-gray-100"></div>
            
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <span className="text-gray-900">Política de Privacidad</span>
              <span className="text-gray-400">→</span>
            </button>
            
            <div className="border-b border-gray-100"></div>
            
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <span className="text-gray-900">Calificar App</span>
              <span className="text-gray-400">⭐</span>
            </button>
            
            <div className="border-b border-gray-100"></div>
            
            <button
              onClick={handleResetApp}
              className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-lg transition-colors text-red-600"
            >
              <div className="flex items-center space-x-3">
                <RotateCcw className="w-5 h-5" />
                <span>Restablecer App</span>
              </div>
              <span className="text-red-400">⚠️</span>
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="bg-white rounded-xl shadow-sm">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 p-4 hover:bg-red-50 rounded-xl transition-colors text-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>

        {/* App Info Footer */}
        <div className="text-center py-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <img 
              src="/Logo.png" 
              alt="EcoCiclo Icon" 
              className="h-6 w-auto"
            />
            <span className="text-gray-600 font-medium">EcoCiclo</span>
          </div>
          <p className="text-xs text-gray-500">
            Conectando el reciclaje inteligente
          </p>
          <p className="text-xs text-gray-400 mt-1">
            © 2025 EcoCiclo. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}