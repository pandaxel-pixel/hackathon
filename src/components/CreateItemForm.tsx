import React, { useState } from 'react';
import { X, Camera, MapPin, Weight, Clock, Zap } from 'lucide-react';
import { RecyclableItem } from '../types';

interface CreateItemFormProps {
  onClose: () => void;
  onSubmit: (item: Omit<RecyclableItem, 'id' | 'postedAt'>) => void;
}

const categories = [
  { id: 'plastic', name: 'Plástico', icon: '🥤', color: 'bg-blue-100 text-blue-800' },
  { id: 'paper', name: 'Papel', icon: '📄', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'metal', name: 'Metal', icon: '🥫', color: 'bg-gray-100 text-gray-800' },
  { id: 'glass', name: 'Vidrio', icon: '🍶', color: 'bg-green-100 text-green-800' },
  { id: 'electronic', name: 'Electrónico', icon: '📱', color: 'bg-purple-100 text-purple-800' }
];

const urgencyLevels = [
  { id: 'low', name: 'Baja', color: 'bg-green-100 text-green-800' },
  { id: 'medium', name: 'Media', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'high', name: 'Alta', color: 'bg-red-100 text-red-800' }
];

export default function CreateItemForm({ onClose, onSubmit }: CreateItemFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'plastic' as RecyclableItem['category'],
    weight: '',
    transport: '',
    urgency: 'medium' as RecyclableItem['urgency'],
    address: ''
  });

  const [selectedImage, setSelectedImage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const item: Omit<RecyclableItem, 'id' | 'postedAt'> = {
      title: formData.title,
      description: formData.description,
      image: selectedImage || 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg',
      payment: Math.round(parseFloat(formData.weight) * 15 + Math.random() * 50), // AI-generated payment
      weight: parseFloat(formData.weight),
      category: formData.category,
      transport: formData.transport,
      location: {
        address: formData.address,
        distance: Math.random() * 3 + 0.5 // Random distance for demo
      },
      urgency: formData.urgency
    };

    onSubmit(item);
  };

  const simulateImageUpload = () => {
    const images = [
      'https://www.aaapolymer.com/wp-content/uploads/2024/02/PXL_20230510_135310276-768x1020.jpg',
      'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg',
      'https://images.pexels.com/photos/3735188/pexels-photo-3735188.jpeg',
      'https://images.pexels.com/photos/3735213/pexels-photo-3735213.jpeg',
      'https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg'
    ];
    setSelectedImage(images[Math.floor(Math.random() * images.length)]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">Publicar elemento</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto del elemento
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {selectedImage ? (
                <div className="relative">
                  <img src={selectedImage} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setSelectedImage('')}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <button
                    type="button"
                    onClick={simulateImageUpload}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Simular subida de foto
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ej. 10 botellas PET limpias"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Describe el estado y detalles del material"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: category.id as RecyclableItem['category'] })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.category === category.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{category.icon}</div>
                  <div className="text-xs font-medium">{category.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Weight className="w-4 h-4 inline mr-1" />
              Peso estimado (kg)
            </label>
            <input
              type="number"
              step="0.1"
              required
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="2.5"
            />
            <p className="text-xs text-gray-500 mt-1">
              <Zap className="w-3 h-3 inline mr-1" />
              El pago será calculado automáticamente por nuestra IA
            </p>
          </div>

          {/* Transport */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transporte recomendado
            </label>
            <input
              type="text"
              required
              value={formData.transport}
              onChange={(e) => setFormData({ ...formData, transport: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ej. Bicicleta, Carrito de mano"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Dirección
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Col. Roma Norte, CDMX"
            />
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Urgencia
            </label>
            <div className="grid grid-cols-3 gap-2">
              {urgencyLevels.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, urgency: level.id as RecyclableItem['urgency'] })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.urgency === level.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`text-xs font-medium px-2 py-1 rounded-full ${level.color}`}>
                    {level.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200"
          >
            Publicar elemento
          </button>
        </form>
      </div>
    </div>
  );
}