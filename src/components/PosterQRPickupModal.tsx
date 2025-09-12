import React, { useState, useEffect } from 'react';
import { X, QrCode, CheckCircle, Camera, Loader, Star } from 'lucide-react';
import { Bag } from '../types';

interface PosterQRPickupModalProps {
  item: Bag;
  onClose: () => void;
  onConfirmPickup: (itemId: string, rating: number) => void;
}

export default function PosterQRPickupModal({ item, onClose, onConfirmPickup }: PosterQRPickupModalProps) {
  const [step, setStep] = useState<'generate' | 'scanning' | 'confirmed' | 'rating'>('generate');
  const [qrCode, setQrCode] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedRating, setSelectedRating] = useState(5);

  useEffect(() => {
    // Generate QR code when modal opens
    const generateQR = () => {
      const qrData = `ECOCICLO-POSTER-${item.id}-${Date.now()}`;
      setQrCode(qrData);
    };
    generateQR();
  }, [item.id]);

  useEffect(() => {
    if (step === 'generate') {
      // Auto-start scanning simulation after 2 seconds
      const timer = setTimeout(() => {
        handleStartScan();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleStartScan = () => {
    setStep('scanning');
    setIsScanning(true);
    setScanProgress(0);

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setStep('confirmed');
          return 100;
        }
        return prev + 8;
      });
    }, 150);
  };

  const handleConfirmPickup = () => {
    setStep('rating');
  };

  const handleSubmitRating = () => {
    onConfirmPickup(item.id, selectedRating);
    onClose();
  };

  const generateQRPattern = () => {
    // Generate a simple QR-like pattern for visual simulation
    const size = 12;
    const pattern = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        // Create a pseudo-random pattern based on item ID and position
        const seed = item.id.charCodeAt(0) + i * j;
        row.push(seed % 3 === 0);
      }
      pattern.push(row);
    }
    return pattern;
  };

  const qrPattern = generateQRPattern();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {step === 'generate' && 'Código QR Generado'}
            {step === 'scanning' && 'Recolector Escaneando'}
            {step === 'confirmed' && 'Recolección Confirmada'}
            {step === 'rating' && 'Califica al Recolector'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 'generate' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-48 h-48 bg-white border-2 border-gray-300 rounded-lg mx-auto p-4 flex items-center justify-center">
                  <div className="grid grid-cols-12 gap-px">
                    {qrPattern.map((row, i) =>
                      row.map((cell, j) => (
                        <div
                          key={`${i}-${j}`}
                          className={`w-3 h-3 ${cell ? 'bg-black' : 'bg-white'}`}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.type} - {item.weight}kg
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Muestra este código QR al recolector para confirmar la entrega
                </p>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Código de entrega:</div>
                  <div className="font-mono text-sm text-gray-900 break-all">
                    {qrCode}
                  </div>
                </div>
              </div>

              <div className="text-sm text-blue-600 flex items-center justify-center space-x-2">
                <Loader className="w-4 h-4 animate-spin" />
                <span>Esperando al recolector...</span>
              </div>
            </div>
          )}

          {step === 'scanning' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-48 h-48 bg-gray-900 rounded-lg mx-auto flex items-center justify-center relative overflow-hidden">
                  <Camera className="w-16 h-16 text-white" />
                  {isScanning && (
                    <div className="absolute inset-0 border-4 border-blue-500 rounded-lg animate-pulse"></div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                  <span className="text-lg font-semibold text-gray-900">
                    Recolector escaneando...
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600">
                  {scanProgress}% completado
                </div>
              </div>

              <p className="text-sm text-gray-600">
                El recolector está verificando tu código QR
              </p>
            </div>
          )}

          {step === 'confirmed' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ¡Recolección Completada!
                </h3>
                <p className="text-gray-600 mb-4">
                  Tu elemento ha sido recolectado exitosamente
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-800">Elemento:</span>
                  <span className="font-medium text-green-900">{item.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-green-800">Peso:</span>
                  <span className="font-medium text-green-900">{item.weight}kg</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-green-800">Estado:</span>
                  <span className="font-bold text-green-900">✓ Recolectado</span>
                </div>
              </div>

              <button
                onClick={handleConfirmPickup}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200"
              >
                Continuar
              </button>
            </div>
          )}

          {step === 'rating' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ¡Gracias por usar EcoCiclo!
                </h3>
                <p className="text-gray-600 mb-6">
                  ¿Cómo fue tu experiencia con el recolector?
                </p>
              </div>

              <div className="mb-6">
                <div className="flex justify-center space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setSelectedRating(star)}
                      className={`p-2 rounded-full transition-colors ${
                        star <= selectedRating
                          ? 'text-yellow-500'
                          : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    >
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  {selectedRating === 5 && 'Excelente servicio'}
                  {selectedRating === 4 && 'Muy buen servicio'}
                  {selectedRating === 3 && 'Buen servicio'}
                  {selectedRating === 2 && 'Servicio regular'}
                  {selectedRating === 1 && 'Servicio mejorable'}
                </div>
              </div>

              <button
                onClick={handleSubmitRating}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200"
              >
                Enviar Calificación
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}