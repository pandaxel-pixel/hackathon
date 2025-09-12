import React from 'react';
import { useState, useEffect } from 'react';
import AuthScreen from './components/AuthScreen';
import CollectorApp from './components/CollectorApp';
import PosterApp from './components/PosterApp';
import { User } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to load user from localStorage on app start
    const savedUser = localStorage.getItem('ecociclo_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('ecociclo_user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleAuth = (user: User) => {
    // Ensure user has a role before proceeding
    if (!user.role) {
      console.error('User authenticated but no role selected');
      return;
    }
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('ecociclo_user');
    setCurrentUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando EcoCiclo...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  if (currentUser.role === 'collector') {
    return <CollectorApp currentUser={currentUser} onLogout={handleLogout} />;
  }

  return <PosterApp currentUser={currentUser} onLogout={handleLogout} />;
}

export default App;