import React, { useState, useEffect } from 'react';
import { X, QrCode, Printer, Star } from 'lucide-react';
import { Bag } from '../types';

interface PosterQRPickupModalProps {
  item: Bag;
  mode: 'generate-qr' | 'review-collector';
  onClose: () => void;
  onAction: (itemId: string, data?: any) => void;
}

export default function PosterQRPickupModal({ item, mode, onClose, onAction }: PosterQRPickupModalProps) {
  const [qrCode, setQrCode] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState(5);
  const [showPrintScreen, setShowPrintScreen] = useState(false);

  useEffect(() => {
    if (mode === 'generate-qr') {
      // Generate QR code when modal opens
      const generateQR = () => {
        const qrData = `ECOCICLO-POSTER-${item.id}-${Date.now()}`;
        setQrCode(qrData);
      };
      generateQR();
    }
  }, [item.id, mode]);

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

  const handlePrintQR = () => {
    setShowPrintScreen(true);
    
    // Simulate printing delay
    setTimeout(() => {
      onAction(item.id);
      onClose();
    }, 2000);
  };

  const handleSubmitRating = () => {
    onAction(item.id, selectedRating);
    onClose();
  };

  const qrPattern = generateQRPattern();

  if (showPrintScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-sm w-full">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Imprimiendo QR</h2>
          </div>

          <div className="p-6 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Printer className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Imprimiendo código QR...
              </h3>
              <p className="text-gray-600 mb-4">
                Tu código QR se está imprimiendo
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                📋 <strong>Instrucciones:</strong>
              </p>
              <p className="text-xs text-blue-700 mt-2">
                1. Pega el código QR en tu bolsa de {item.type.toLowerCase()}
              </p>
              <p className="text-xs text-blue-700">
                2. Coloca la bolsa en el lugar acordado
              </p>
              <p className="text-xs text-blue-700">
                3. El recolector escaneará el código al recogerla
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'generate-qr' ? 'Código QR Generado' : 'Califica al Recolector'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {mode === 'generate-qr' && (
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
                  Imprime este código QR y pégalo en tu bolsa
                </p>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Código de entrega:</div>
                  <div className="font-mono text-sm text-gray-900 break-all">
                    {qrCode}
                  </div>
                </div>
              </div>

              <button
                onClick={handlePrintQR}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Printer className="w-5 h-5" />
                <span>Imprimir QR</span>
              </button>
            </div>
          )}

          {mode === 'review-collector' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ¿Cómo fue tu experiencia?
                </h3>
                <p className="text-gray-600 mb-6">
                  Califica al recolector que recogió tu {item.type.toLowerCase()}
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

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-800">Elemento:</span>
                  <span className="font-medium text-gray-900">{item.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-800">Peso:</span>
                  <span className="font-medium text-gray-900">{item.weight}kg</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-800">Puntos ganados:</span>
                  <span className="font-bold text-green-900">{item.points} pts</span>
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