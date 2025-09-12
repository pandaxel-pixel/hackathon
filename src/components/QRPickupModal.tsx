import React, { useState, useEffect } from 'react';
import { X, QrCode, CheckCircle, Camera, Loader } from 'lucide-react';
import { RecyclableItem } from '../types';

interface QRPickupModalProps {
  item: RecyclableItem;
  onClose: () => void;
  onConfirmPickup: () => void;
}

export default function QRPickupModal({ item, onClose, onConfirmPickup }: QRPickupModalProps) {
  const [step, setStep] = useState<'generate' | 'scan' | 'confirm'>('generate');
  const [qrCode, setQrCode] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    // Generate QR code when modal opens
    const generateQR = () => {
      const qrData = `ECOCICLO-${item.id}-${Date.now()}`;
      setQrCode(qrData);
    };
    generateQR();
  }, [item.id]);

  const handleStartScan = () => {
    setStep('scan');
    setIsScanning(true);
    setScanProgress(0);

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setStep('confirm');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleConfirmPickup = () => {
    onConfirmPickup();
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
            {step === 'scan' && 'Escaneando QR'}
            {step === 'confirm' && 'Recolección Confirmada'}
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
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Muestra este código QR al publicador para confirmar la recolección
                </p>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Código de recolección:</div>
                  <div className="font-mono text-sm text-gray-900 break-all">
                    {qrCode}
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartScan}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Camera className="w-5 h-5" />
                <span>Simular Escaneo</span>
              </button>
            </div>
          )}

          {step === 'scan' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-48 h-48 bg-gray-900 rounded-lg mx-auto flex items-center justify-center relative overflow-hidden">
                  <Camera className="w-16 h-16 text-white" />
                  {isScanning && (
                    <div className="absolute inset-0 border-4 border-green-500 rounded-lg animate-pulse"></div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Loader className="w-5 h-5 text-green-600 animate-spin" />
                  <span className="text-lg font-semibold text-gray-900">
                    Escaneando código QR...
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-200"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600">
                  {scanProgress}% completado
                </div>
              </div>

              <p className="text-sm text-gray-600">
                Apunta la cámara hacia el código QR del publicador
              </p>
            </div>
          )}

          {step === 'confirm' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ¡Recolección Verificada!
                </h3>
                <p className="text-gray-600 mb-4">
                  El código QR ha sido escaneado exitosamente
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-800">Elemento:</span>
                  <span className="font-medium text-green-900">{item.title}</span>
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
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200"
              >
                Confirmar Recolección
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}