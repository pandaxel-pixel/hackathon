import React from 'react';
import { LogOut, User, Settings, HelpCircle, Shield } from 'lucide-react';

interface ProfileViewProps {
  username: string;
  displayPhoto: string;
  onLogout: () => void;
}

export default function ProfileView({ username, displayPhoto, onLogout }: ProfileViewProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-blue-600 text-white p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-3xl">{displayPhoto}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">{username}</h2>
            <p className="text-blue-200">Publicador</p>
          </div>
        </div>
      </div>

      {/* Profile Options */}
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 space-y-1">
            <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Editar Perfil</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Configuración</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <HelpCircle className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Ayuda y Soporte</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <Shield className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Privacidad</span>
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
      </div>
    </div>
  );
}