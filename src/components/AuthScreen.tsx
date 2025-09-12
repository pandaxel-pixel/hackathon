import React, { useState } from 'react';
import { Recycle, Package, User as UserIcon, LogIn, UserPlus } from 'lucide-react';
import { User } from '../types';

interface AuthScreenProps {
  onAuth: (user: User) => void;
}

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [isRegistering, setIsRegistering] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setIsLoading(true);

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!isRegistering) {
      // Login flow
      const existingUsers = JSON.parse(localStorage.getItem('ecociclo_users') || '[]');
      const existingUser = existingUsers.find((u: User) => 
        u.username === username.trim() && u.password === password
      );
      
      if (existingUser) {
        if (existingUser.role) {
          // User already has a role, proceed directly
          setIsLoading(false);
          onAuth(existingUser);
          return;
        } else {
          // User exists but needs to select a role
          setLoggedInUser(existingUser);
          setShowRoleSelection(true);
          setIsLoading(false);
          return;
        }
      } else {
        // Login failed
        alert('Usuario o contraseña incorrectos');
        setIsLoading(false);
        return;
      }
    } else {
      // Registration flow
      const existingUsers = JSON.parse(localStorage.getItem('ecociclo_users') || '[]');
      const userExists = existingUsers.find((u: User) => u.username === username.trim());
      
      if (userExists) {
        alert('Este nombre de usuario ya existe');
        setIsLoading(false);
        return;
      }

      const newUser: User = {
        id: Date.now().toString(),
        username: username.trim(),
        password: password,
        role: null, // Role will be selected later
        displayPhoto: '🐱',
        createdAt: new Date()
      };

      // Store user in localStorage
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('ecociclo_users', JSON.stringify(updatedUsers));

      setLoggedInUser(newUser);
      setShowRoleSelection(true);
      setIsLoading(false);
    }
  };

  const handleRoleSelect = async (selectedRole: 'collector' | 'poster') => {
    if (!loggedInUser) return;

    setIsLoading(true);

    // Simulate role selection delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedUser: User = {
      ...loggedInUser,
      role: selectedRole
    };

    // Update user in localStorage
    const existingUsers = JSON.parse(localStorage.getItem('ecociclo_users') || '[]');
    const updatedUsers = existingUsers.map((u: User) => 
      u.id === loggedInUser.id ? updatedUser : u
    );
    localStorage.setItem('ecociclo_users', JSON.stringify(updatedUsers));

    // Store current user
    localStorage.setItem('ecociclo_user', JSON.stringify(updatedUser));

    setIsLoading(false);
    onAuth(updatedUser);
  };

  // Role selection screen
  if (showRoleSelection && loggedInUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Recycle className="w-10 h-10 text-white" />
            </div>
            <div className="w-32 h-20 flex items-center justify-center mx-auto mb-4">
              <img 
                src="/Logo Ecociclo Transparente.png" 
                alt="EcoCiclo Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Bienvenido, {loggedInUser.username}!</h1>
            <p className="text-gray-600">Selecciona cómo quieres usar EcoCiclo</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleRoleSelect('collector')}
              disabled={isLoading}
              className="w-full bg-white hover:bg-green-50 border-2 border-green-200 hover:border-green-300 rounded-2xl p-6 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
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
              onClick={() => handleRoleSelect('poster')}
              disabled={isLoading}
              className="w-full bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-300 rounded-2xl p-6 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
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

          {isLoading && (
            <div className="mt-6 text-center">
              <div className="w-6 h-6 border-2 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Configurando tu cuenta...</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Puedes cambiar tu rol más tarde en la configuración
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Login/Registration screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-32 h-20 flex items-center justify-center mx-auto mb-4">
            <img 
              src="/Logo Ecociclo Transparente.png" 
              alt="EcoCiclo Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-4">¡Bienvenido a EcoCiclo!</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-center mb-6">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setIsRegistering(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${
                  !isRegistering
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Iniciar Sesión</span>
              </button>
              <button
                onClick={() => setIsRegistering(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${
                  isRegistering
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Registrarse</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de usuario
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingresa tu nombre de usuario"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingresa tu contraseña"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={!username.trim() || !password.trim() || isLoading}
              className="w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>
                    {isRegistering ? 'Creando cuenta...' : 'Verificando credenciales...'}
                  </span>
                </div>
              ) : (
                <span>
                  {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {isRegistering 
                ? 'Después de crear tu cuenta, podrás elegir si eres recolector o tienes elementos para reciclar'
                : 'Ingresa tus credenciales para acceder a EcoCiclo'
              }
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Conectamos personas que quieren reciclar con recolectores profesionales
          </p>
        </div>
      </div>
    </div>
  );
}