import React, { useEffect, useState } from 'react';
import { Star, Sparkles, Trophy, X } from 'lucide-react';

interface PointsCelebrationModalProps {
  points: number;
  onClose: () => void;
}

export default function PointsCelebrationModal({ points, onClose }: PointsCelebrationModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);
    
    // Show confetti effect
    setTimeout(() => setShowConfetti(true), 300);
    
    // Auto-close after 4 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  // Generate confetti particles
  const confettiParticles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1000,
    color: ['bg-yellow-400', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500'][Math.floor(Math.random() * 5)]
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confettiParticles.map((particle) => (
            <div
              key={particle.id}
              className={`absolute w-3 h-3 ${particle.color} rounded-full animate-bounce`}
              style={{
                left: `${particle.left}%`,
                top: '-10px',
                animationDelay: `${particle.delay}ms`,
                animationDuration: '2s',
                animationFillMode: 'forwards'
              }}
            />
          ))}
        </div>
      )}

      <div className={`bg-white rounded-3xl max-w-sm w-full transform transition-all duration-500 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
      }`}>
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-3xl">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Trophy className="w-10 h-10 text-yellow-300" />
            </div>
            <h2 className="text-2xl font-bold mb-2">¡Felicidades! 🎉</h2>
            <p className="text-blue-100">¡Tu bolsa ha sido recolectada!</p>
          </div>
        </div>

        {/* Points Display */}
        <div className="p-8 text-center">
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="w-8 h-8 text-yellow-500 animate-spin" />
              <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
                +{points}
              </div>
              <Sparkles className="w-8 h-8 text-yellow-500 animate-spin" style={{ animationDirection: 'reverse' }} />
            </div>
            <p className="text-xl font-semibold text-gray-800 mb-2">Puntos Ganados</p>
            <p className="text-gray-600">¡Un recolector recogió tu bolsa mientras no estabas!</p>
          </div>

          {/* Achievement Badges */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-xl text-center">
              <div className="text-2xl mb-1">🌱</div>
              <div className="text-xs font-medium text-green-800">Eco Warrior</div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-xl text-center">
              <div className="text-2xl mb-1">♻️</div>
              <div className="text-xs font-medium text-blue-800">Reciclador</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-3 rounded-xl text-center">
              <div className="text-2xl mb-1">⭐</div>
              <div className="text-xs font-medium text-yellow-800">Estrella</div>
            </div>
          </div>

          {/* Impact Message */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-2xl">🌍</span>
              <span className="font-semibold text-gray-800">Impacto Positivo</span>
            </div>
            <p className="text-sm text-gray-700">
              ¡Gracias por contribuir al reciclaje! Tu bolsa ya está siendo procesada.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              ¡Genial!
            </button>
            <button
              onClick={handleClose}
              className="w-full text-gray-600 hover:text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Ver mis bolsas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}