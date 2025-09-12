import React, { useState, useMemo } from 'react';
import { X, Camera, MapPin, Minus, Plus, Zap, ArrowLeft } from 'lucide-react';
import { PostedItem, MaterialQuantity } from '../types';

interface CreateItemFormProps {
  onClose: () => void;
  onSubmit: (item: Omit<PostedItem, 'id' | 'postedAt' | 'status'>) => void;
}

const materialTypes = [
  { 
    id: 'plastic' as const, 
    name: 'Plastic', 
    icon: '🥤', 
    description: 'Bottles, containers, packaging',
    weightPerUnit: 0.15 // kg per unit
  },
  { 
    id: 'paper' as const, 
    name: 'Paper', 
    icon: '📄', 
    description: 'Newspapers, magazines',
    weightPerUnit: 0.5 // kg per unit
  },
  { 
    id: 'glass' as const, 
    name: 'Glass', 
    icon: '🍶', 
    description: 'Glass bottles and jars',
    weightPerUnit: 0.4 // kg per unit
  },
  { 
    id: 'metal' as const, 
    name: 'Metal', 
    icon: '🥫', 
    description: 'Cans and metal containers',
    weightPerUnit: 0.08 // kg per unit
  },
  { 
    id: 'electronic' as const, 
    name: 'Electronic', 
    icon: '📱', 
    description: 'Small electronic devices',
    weightPerUnit: 0.3 // kg per unit
  }
];

export default function CreateItemForm({ onClose, onSubmit }: CreateItemFormProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    plastic: 0,
    paper: 0,
    glass: 0,
    metal: 0,
    electronic: 0
  });

  const [address, setAddress] = useState('');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, number>>({});

  const handleQuantityChange = (materialId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [materialId]: Math.max(0, prev[materialId] + delta)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create materials array from quantities
    const materials: MaterialQuantity[] = materialTypes
      .filter(material => quantities[material.id] > 0)
      .map(material => ({
        type: material.id,
        quantity: quantities[material.id],
        weightPerUnit: material.weightPerUnit
      }));

    if (materials.length === 0) {
      alert('Por favor selecciona al menos un material');
      return;
    }

    // Calculate total weight and points
    const totalWeight = materials.reduce((sum, material) => 
      sum + (material.quantity * material.weightPerUnit), 0
    );
    
    const points = Math.round(totalWeight * 15 + Math.random() * 50);

    // Generate title and description based on materials
    const materialNames = materials.map(m => {
      const materialType = materialTypes.find(mt => mt.id === m.type);
      return `${m.quantity} ${materialType?.name.toLowerCase()}`;
    }).join(', ');

    const item: Omit<PostedItem, 'id' | 'postedAt' | 'status'> = {
      title: `Bolsa con ${materialNames}`,
      description: `Materiales reciclables: ${materialNames}`,
      image: selectedImage || 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg',
      points,
      materials,
      totalWeight,
      location: {
        address,
        distance: Math.random() * 3 + 0.5 // Random distance for demo
      }
    };

    onSubmit(item);
  };

  const simulateImageUpload = () => {
    setIsAnalyzing(true);
    setAnalysisStep('Subiendo imagen...');
    
    const images = [
      { 
        url: 'https://www.aaapolymer.com/wp-content/uploads/2024/02/PXL_20230510_135310276-768x1020.jpg', 
        suggestions: { plastic: 8, paper: 2 }
      },
      { 
        url: 'https://blog-assets.3ds.com/uploads/2022/04/ewaste-global-recycling-day-1024x612-1.jpeg', 
        suggestions: { electronic: 3, metal: 1 }
      },
      { 
        url: 'https://www.leeglass.com/wp-content/uploads/2019/08/iStock-1081866910.jpg', 
        suggestions: { glass: 6 }
      },
      { 
        url: 'https://i0.wp.com/recyclethispgh.com/wp-content/uploads/2019/06/Boxes-in-Boxes-for-Curbside-Pickup.png?ssl=1', 
        suggestions: { paper: 5, plastic: 2 }
      },
      { 
        url: 'https://s3-media0.fl.yelpcdn.com/bphoto/ye_FV2s21xcXFFpHgrDD3Q/1000s.jpg', 
        suggestions: { metal: 12, plastic: 3 }
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
      setAnalysisStep('Contando elementos...');
    }, 2200);
    
    setTimeout(() => {
      setAnalysisStep('Generando sugerencias...');
    }, 2900);
    
    // Generate AI suggestions based on image
    setTimeout(() => {
      setAiSuggestions(selectedImage.suggestions);
      setAnalysisStep('¡Análisis completado!');
      
      // Auto-fill quantities with AI suggestions
      setQuantities(prev => ({
        ...prev,
        ...selectedImage.suggestions
      }));
      
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisStep('');
      }, 1000);
    }, 3600);
  };

  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const totalWeight = materialTypes.reduce((sum, material) => 
    sum + (quantities[material.id] * material.weightPerUnit), 0
  );

  // Calculate points based on material type and weight (memoized to avoid recalculation on address changes)
  const points = useMemo(() => {
    return materialTypes.reduce((sum, material) => {
      const quantity = quantities[material.id];
      if (quantity === 0) return sum;
      
      const weight = quantity * material.weightPerUnit;
      let pointsPerKg = 0;
      
      // Points per kg based on material type (highest to lowest value)
      switch (material.id) {
        case 'electronic':
          pointsPerKg = 100; // Highest value
          break;
        case 'metal':
          pointsPerKg = 80;
          break;
        case 'plastic':
          pointsPerKg = 60;
          break;
        case 'glass':
          pointsPerKg = 40;
          break;
        case 'paper':
          pointsPerKg = 30; // Lowest value
          break;
      }
      
      return sum + Math.round(weight * pointsPerKg);
    }, 0);
  }, [quantities]);

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col z-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center">
        <button
          onClick={onClose}
          className="p-2 hover:bg-blue-700 rounded-full transition-colors mr-3"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold">Crear Bolsa</h2>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-900 text-white">
        <div className="p-6">
          {/* Classify your waste */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-6">Clasifica tu residuo</h3>
            
            {/* Camera Classification */}
            <div className="bg-gray-800 rounded-2xl p-6 mb-6">
              {selectedImage ? (
                <div className="relative">
                  <img src={selectedImage} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-4" />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-3"></div>
                        <div className="text-sm font-medium">{analysisStep}</div>
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedImage('')}
                    className={`absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  {isAnalyzing ? (
                    <div className="text-center">
                      <div className="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-400 rounded-full mx-auto mb-4"></div>
                      <div className="text-blue-400 font-medium mb-2">{analysisStep}</div>
                      <div className="text-sm text-gray-400">Nuestro AI está analizando tu imagen...</div>
                    </div>
                  ) : (
                    <div>
                      <div className="w-24 h-24 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Camera className="w-12 h-12 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold mb-2">Clasificar con Cámara</h4>
                      <p className="text-gray-400 text-sm mb-4">Usa IA para identificar materiales</p>
                      <button
                        type="button"
                        onClick={simulateImageUpload}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                      >
                        📸 Tomar Foto
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {/* AI Analysis Results */}
              {Object.keys(aiSuggestions).length > 0 && !isAnalyzing && (
                <div className="mt-4 p-4 bg-green-900 bg-opacity-50 border border-green-700 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-green-400">🤖</span>
                    <span className="text-sm font-medium text-green-300">AI Analysis Complete</span>
                  </div>
                  <div className="text-xs text-green-400">
                    Quantities have been automatically filled based on image analysis
                  </div>
                </div>
              )}
            </div>

            {/* Manual Classification */}
            <div>
              <h4 className="text-lg font-semibold mb-4">O clasificar manualmente</h4>
              
              <div className="space-y-3">
                {materialTypes.map((material) => (
                  <div key={material.id} className="bg-gray-800 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-xl">{material.icon}</span>
                      </div>
                      <div>
                        <h5 className="font-semibold">{material.name === 'Plastic' ? 'Plástico' : 
                                                        material.name === 'Paper' ? 'Papel' :
                                                        material.name === 'Glass' ? 'Vidrio' :
                                                        material.name === 'Metal' ? 'Metal' :
                                                        material.name === 'Electronic' ? 'Electrónico' : material.name}</h5>
                        <p className="text-sm text-gray-400">{material.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(material.id, -1)}
                        className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
                        disabled={quantities[material.id] === 0}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      
                      <span className="text-xl font-bold w-8 text-center">
                        {quantities[material.id]}
                      </span>
                      
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(material.id, 1)}
                        className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Dirección
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Col. Roma Norte, CDMX"
            />
          </div>

          {/* Summary */}
          {totalItems > 0 && (
            <div className="bg-blue-900 bg-opacity-50 border border-blue-700 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-300 font-medium">Total elementos:</span>
                <span className="text-white font-bold">{totalItems}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-300 font-medium">Peso estimado:</span>
                <span className="text-white font-bold">{totalWeight.toFixed(1)}kg</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-300 font-medium">Puntos estimados:</span>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">
                    {Math.round(totalWeight * 15 + Math.random() * 50)} pts
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Create Bag Button */}
          <button
            onClick={handleSubmit}
            disabled={totalItems === 0 || !address.trim() || isAnalyzing}
            className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
              totalItems === 0 || !address.trim() || isAnalyzing
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {isAnalyzing ? 'Analizando imagen...' : 'Crear Bolsa'}
          </button>
        </div>
      </div>
    </div>
  );
}