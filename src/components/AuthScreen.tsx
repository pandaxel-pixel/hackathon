import React, { useState } from 'react';
import { Recycle, Package, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface AuthScreenProps {
  onAuth: (user: User) => void;
}

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [selectedRole, setSelectedRole] = useState<'collector' | 'poster' | null>(null);
  const [isRegistering, setIsRegistering] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim() || !selectedRole) return;

    setIsLoading(true);

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!isRegistering) {
      // Simulate login validation
      const existingUsers = JSON.parse(localStorage.getItem('ecociclo_users') || '[]');
      const existingUser = existingUsers.find((u: User) => 
        u.username === username.trim() && u.password === password && u.role === selectedRole
      );
      
      if (existingUser) {
        setIsLoading(false);
        onAuth(existingUser);
        return;
      } else {
        // Simulate login error
        alert('Usuario o contraseña incorrectos');
        setIsLoading(false);
        return;
      }
    }

    const user: User = {
      id: Date.now().toString(),
      username: username.trim(),
      password: password, // In production, this should be hashed
      role: selectedRole,
      displayPhoto: '🐱',
      createdAt: new Date()
    };

    // Store user in localStorage (for registration)
    localStorage.setItem('ecociclo_user', JSON.stringify(user));
    
    // Also store in users list for login simulation
    const existingUsers = JSON.parse(localStorage.getItem('ecociclo_users') || '[]');
    const updatedUsers = [...existingUsers, user];
    localStorage.setItem('ecociclo_users', JSON.stringify(updatedUsers));

    setIsLoading(false);
    onAuth(user);
  };

  const roleInfo = {
    collector: {
      icon: Recycle,
      title: 'Soy Recolector',
      description: 'Encuentra elementos para reciclar cerca de ti',
      color: 'green'
    },
    poster: {
      icon: Package,
      title: 'Tengo Reciclaje',
      description: 'Publica elementos, gana puntos y ayuda al medio ambiente',
      color: 'blue'
    }
  };

  if (selectedRole) {
    const role = roleInfo[selectedRole];
    const RoleIcon = role.icon;

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className={`w-20 h-20 bg-gradient-to-r ${
              selectedRole === 'collector' ? 'from-green-600 to-green-700' : 'from-blue-600 to-blue-700'
            } rounded-full flex items-center justify-center mx-auto mb-4`}>
              <RoleIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">EcoCiclo</h1>
            <p className="text-gray-600">{role.title}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-center mb-6">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setIsRegistering(true)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    isRegistering
                      ? `${selectedRole === 'collector' ? 'bg-green-600' : 'bg-blue-600'} text-white`
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Registrarse
                </button>
                <button
                  onClick={() => setIsRegistering(false)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    !isRegistering
                      ? `${selectedRole === 'collector' ? 'bg-green-600' : 'bg-blue-600'} text-white`
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Iniciar Sesión
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
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  selectedRole === 'collector'
                    ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'
                    : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400'
                } text-white disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{isRegistering ? 'Registrando...' : 'Verificando credenciales...'}</span>
                  </div>
                ) : (
                  `${isRegistering ? 'Registrarse' : 'Iniciar Sesión'} como ${role.title.toLowerCase()}`
                )}
              </button>
            </form>

            <button
              onClick={() => setSelectedRole(null)}
              className="w-full mt-4 py-2 text-gray-600 hover:text-gray-900 text-sm transition-colors"
              disabled={isLoading}
            >
              ← Cambiar rol
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {isRegistering ? 'Crea tu cuenta con usuario y contraseña' : 'Ingresa tus credenciales'} para usar EcoCiclo
            </p>
          </div>
        </div>
      </div>
    );
  }

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
            onClick={() => setSelectedRole('collector')}
            className="w-full bg-white hover:bg-green-50 border-2 border-green-200 hover:border-green-300 rounded-2xl p-6 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-100 group-hover:bg-green-200 rounded-xl flex items-center justify-center transition-colors">
                <Recycle className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Soy Recolector</h3>
                <p className="text-gray-600 text-sm">
                  Encuentra elementos para reciclar cerca de ti
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedRole('poster')}
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