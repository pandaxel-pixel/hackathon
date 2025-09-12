import React from 'react';
import { User, LogOut, Settings, HelpCircle, Shield, Bell } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileViewProps {
  currentUser: UserType;
  onLogout: () => void;
}

export default function ProfileView({ currentUser, onLogout }: ProfileViewProps) {
  return (
    <div className="h-full bg-gray-50">
      {/* Profile Header */}
      <div className="bg-green-600 text-white p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-3xl">{currentUser.displayPhoto}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">{currentUser.username}</h2>
            <p className="text-green-200 capitalize">{currentUser.role}</p>
          </div>
        </div>
      </div>

      {/* Profile Options */}
      <div className="p-4 space-y-4">
        {/* Account Section */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Cuenta</h3>
          </div>
          <div className="divide-y divide-gray-200">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">Configuración</span>
              </div>
              <span className="text-gray-400">›</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">Notificaciones</span>
              </div>
              <span className="text-gray-400">›</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">Privacidad</span>
              </div>
              <span className="text-gray-400">›</span>
            </button>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Soporte</h3>
          </div>
          <div className="divide-y divide-gray-200">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">Centro de Ayuda</span>
              </div>
              <span className="text-gray-400">›</span>
            </button>
          </div>
        </div>

        {/* Logout Section */}
        <div className="bg-white rounded-xl shadow-sm">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <LogOut className="w-5 h-5 text-red-500" />
              <span className="text-red-500 font-medium">Cerrar Sesión</span>
            </div>
          </button>
        </div>

        {/* App Info */}
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">EcoCiclo v1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">Connecting smart recycling</p>
        </div>
      </div>
    </div>
  );
}