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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<{
    title?: string;
    description?: string;
    category?: RecyclableItem['category'];
    weight?: string;
  }>({});

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
    setIsAnalyzing(true);
    setAnalysisStep('Subiendo imagen...');
    
    const images = [
      { 
        url: 'https://www.aaapolymer.com/wp-content/uploads/2024/02/PXL_20230510_135310276-768x1020.jpg', 
        type: 'plastic' 
      },
      { 
        url: 'https://blog-assets.3ds.com/uploads/2022/04/ewaste-global-recycling-day-1024x612-1.jpeg', 
        type: 'electronic' 
      },
      { 
        url: 'https://www.leeglass.com/wp-content/uploads/2019/08/iStock-1081866910.jpg', 
        type: 'glass' 
      },
      { 
        url: 'https://i0.wp.com/recyclethispgh.com/wp-content/uploads/2019/06/Boxes-in-Boxes-for-Curbside-Pickup.png?ssl=1', 
        type: 'paper' 
      },
      { 
        url: 'https://s3-media0.fl.yelpcdn.com/bphoto/ye_FV2s21xcXFFpHgrDD3Q/1000s.jpg', 
        type: 'metal' 
      }
    ];
    
    const selectedImage = images[Math.floor(Math.random() * images.length)];
    
    // Simulate upload progress
    setTimeout(() => {
      setSelectedImage(selectedImage.url);
      setAnalysisStep('Analizando contenido con IA...');
    }, 800);
    
    // Simulate AI analysis steps
    setTimeout(() => {
      setAnalysisStep('Identificando materiales...');
    }, 1500);
    
    setTimeout(() => {
      setAnalysisStep('Calculando peso estimado...');
    }, 2200);
    
    setTimeout(() => {
      setAnalysisStep('Generando descripción...');
    }, 2900);
    
    // Generate AI suggestions based on image
    setTimeout(() => {
      const suggestions = generateAISuggestions(selectedImage.type);
      setAiSuggestions(suggestions);
      setAnalysisStep('¡Análisis completado!');
      
      // Auto-fill form with AI suggestions
      setFormData(prev => ({
        ...prev,
        title: suggestions.title || prev.title,
        description: suggestions.description || prev.description,
        category: suggestions.category || prev.category,
        weight: suggestions.weight || prev.weight
      }));
      
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisStep('');
      }, 1000);
    }, 3600);
  };
  
  const generateAISuggestions = (selectedType: string) => {
    // AI suggestions mapped to specific image types
    const suggestionsByType = {
      plastic: {
        title: 'Botellas PET reciclables',
        description: 'Botellas de plástico transparente, limpias y aplastadas para optimizar espacio',
        category: 'plastic' as RecyclableItem['category'],
        weight: '2.3'
      },
      paper: {
        title: 'Cartón limpio doblado',
        description: 'Cajas de cartón corrugado, secas y perfectamente dobladas',
        category: 'paper' as RecyclableItem['category'],
        weight: '4.1'
      },
      metal: {
        title: 'Latas de aluminio',
        description: 'Latas de bebidas de aluminio, enjuagadas y sin etiquetas',
        category: 'metal' as RecyclableItem['category'],
        weight: '1.8'
      },
      glass: {
        title: 'Botellas de vidrio',
        description: 'Botellas de vidrio transparente, limpias y sin etiquetas',
        category: 'glass' as RecyclableItem['category'],
        weight: '3.2'
      },
      electronic: {
        title: 'Dispositivos electrónicos',
        description: 'Equipos electrónicos pequeños en buen estado para reciclaje',
        category: 'electronic' as RecyclableItem['category'],
        weight: '0.9'
      }
    };
    
    // Return the specific suggestion for the selected image type
    return suggestionsByType[selectedType as keyof typeof suggestionsByType] || suggestionsByType.plastic;
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
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                        <div className="text-sm font-medium">{analysisStep}</div>
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedImage('')}
                    className={`absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  {isAnalyzing ? (
                    <div className="text-center">
                      <div className="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
                      <div className="text-blue-600 font-medium mb-2">{analysisStep}</div>
                      <div className="text-sm text-gray-500">Nuestro AI está analizando tu imagen...</div>
                    </div>
                  ) : (
                    <div>
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <button
                        type="button"
                        onClick={simulateImageUpload}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        📸 Subir foto con análisis IA
                      </button>
                      <div className="text-xs text-gray-500 mt-2">
                        La IA analizará automáticamente tu imagen
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* AI Analysis Results */}
            {aiSuggestions.title && !isAnalyzing && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-green-600">🤖</span>
                  <span className="text-sm font-medium text-green-800">Análisis IA completado</span>
                </div>
                <div className="text-xs text-green-700">
                  Se han rellenado automáticamente los campos basándose en el análisis de la imagen
                </div>
              </div>
            )}
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
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
              isAnalyzing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analizando imagen...' : 'Publicar elemento'}
          </button>
        </form>
      </div>
    </div>
  );
}