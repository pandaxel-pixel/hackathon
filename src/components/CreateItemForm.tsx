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
  const [currentFormStep, setCurrentFormStep] = useState<'initial' | 'confirmMaterial' | 'inputQuantity'>('initial');
  const [aiDetectedMaterial, setAiDetectedMaterial] = useState<string>('');
  const [aiDetectedSuggestions, setAiDetectedSuggestions] = useState<Record<string, number>>({});
  const [manualQuantityInput, setManualQuantityInput] = useState<string>('');

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

    if (!title.trim()) {
      alert('Por favor ingresa un título');
      return;
    }
    // Calculate total weight and points
    const totalWeight = materials.reduce((sum, material) => 
      sum + (material.quantity * material.weightPerUnit), 0
    );
    
    const points = Math.round(totalWeight * 15 + Math.random() * 50);


    const item: Omit<PostedItem, 'id' | 'postedAt' | 'status'> = {
      title: title.trim(),
      description: description.trim() || `Materiales reciclables: ${materials.map(m => {
        const materialType = materialTypes.find(mt => mt.id === m.type);
        return `${m.quantity} ${materialType?.name.toLowerCase()}`;
      }).join(', ')}`,
      image: selectedImage || 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg',
      points,
      materials,
      totalWeight: roundedTotalWeight,
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
      setAiDetectedSuggestions(selectedImage.suggestions);
      setAnalysisStep('¡Análisis completado!');
      
      // Find the most prominent material type
      const primaryMaterial = Object.entries(selectedImage.suggestions)
        .filter(([_, quantity]) => quantity > 0)
        .sort(([, a], [, b]) => b - a)[0];
      
      if (primaryMaterial) {
        setAiDetectedMaterial(primaryMaterial[0]);
        setCurrentFormStep('confirmMaterial');
      }
      
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisStep('');
      }, 1000);
    }, 3600);
  };

  const handleConfirmMaterial = (confirmed: boolean) => {
    if (confirmed) {
      setCurrentFormStep('inputQuantity');
    } else {
      // Reset and go back to initial
      setCurrentFormStep('initial');
      setAiDetectedMaterial('');
      setAiDetectedSuggestions({});
      setSelectedImage('');
    }
  };

  const handleQuantityConfirm = () => {
    const quantity = parseInt(manualQuantityInput) || 0;
    if (quantity > 0) {
      // Update quantities with user input for the confirmed material
      setQuantities(prev => ({
        ...prev,
        [aiDetectedMaterial]: quantity
      }));
    }
    
    // Reset states and go back to initial
    setCurrentFormStep('initial');
    setManualQuantityInput('');
  };

  const getMaterialDisplayName = (materialId: string) => {
    const material = materialTypes.find(m => m.id === materialId);
    return material ? material.name : materialId;
  };

  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const totalWeight = materialTypes.reduce((sum, material) => 
    sum + (quantities[material.id] * material.weightPerUnit), 0
  );
  
  // Round to nearest tenth
  const roundedTotalWeight = Math.round(totalWeight * 10) / 10;

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold">Crear Bolsa</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50 max-h-[calc(90vh-80px)]">
          <div className="p-6">
          {/* Classify your waste */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Clasifica tu residuo</h3>
            
            {/* Camera Classification */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-gray-200">
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
            {/* Material Confirmation Step */}
            {currentFormStep === 'confirmMaterial' && (
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-24 h-24 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">
                      {materialTypes.find(m => m.id === aiDetectedMaterial)?.icon || '♻️'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">
                    This is {getMaterialDisplayName(aiDetectedMaterial).toLowerCase()}, right?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Our AI detected this material type from your photo
                  </p>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleConfirmMaterial(false)}
                    className="flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 bg-gray-200 hover:bg-gray-300 text-gray-700"
                  >
                    No, try again
                  </button>
                  <button
                    onClick={() => handleConfirmMaterial(true)}
                    className="flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Yes, that's right
                  </button>
                </div>
              </div>
            )}

            {/* Quantity Input Step */}
            {currentFormStep === 'inputQuantity' && (
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">
                      {materialTypes.find(m => m.id === aiDetectedMaterial)?.icon || '♻️'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">
                    How much {getMaterialDisplayName(aiDetectedMaterial).toLowerCase()} is it?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Enter the quantity of {getMaterialDisplayName(aiDetectedMaterial).toLowerCase()} items
                  </p>
                </div>
                
                <div className="mb-6">
                  <input
                    type="number"
                    min="1"
                    value={manualQuantityInput}
                    onChange={(e) => setManualQuantityInput(e.target.value)}
                    className="w-32 p-4 text-center text-2xl font-bold bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    autoFocus
                  />
                  <div className="text-sm text-gray-600 mt-2">
                    Number of {getMaterialDisplayName(aiDetectedMaterial).toLowerCase()} items
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => setCurrentFormStep('confirmMaterial')}
                    className="flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 bg-gray-200 hover:bg-gray-300 text-gray-700"
                  >
                    <ArrowLeft className="w-4 h-4 inline mr-2" />
                    Back
                  </button>
                  <button
                    onClick={handleQuantityConfirm}
                    disabled={!manualQuantityInput || parseInt(manualQuantityInput) <= 0}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                      !manualQuantityInput || parseInt(manualQuantityInput) <= 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}

            {/* Initial Form Step */}
            {currentFormStep === 'initial' && (
              <>
                {/* Classify your waste */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Clasifica tu residuo</h3>
                  
                  {/* Camera Classification */}
                  <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-gray-200">
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
                            <div className="text-blue-600 font-medium mb-2">{analysisStep}</div>
                            <div className="text-sm text-gray-600">Nuestro AI está analizando tu imagen...</div>
                          </div>
                        ) : (
                          <div>
                            <div className="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                              <Camera className="w-12 h-12 text-white" />
                            </div>
                            <h4 className="text-lg font-semibold mb-2 text-gray-900">Clasificar con Cámara</h4>
                            <p className="text-gray-600 text-sm mb-4">Usa IA para identificar materiales</p>
                            <button
                              type="button"
                              onClick={simulateImageUpload}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                            >
                              📸 Tomar Foto
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Dirección
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Col. Roma Norte, CDMX"
                  />
                </div>

                {/* Summary */}
                {totalItems > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-700 font-medium">Total elementos:</span>
                      <span className="text-blue-900 font-bold">{totalItems}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-700 font-medium">Peso estimado:</span>
                      <span className="text-blue-900 font-bold">{roundedTotalWeight.toFixed(1)}kg</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700 font-medium">Puntos estimados:</span>
                      <div className="flex items-center space-x-1">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-bold">
                          {points} pts
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
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isAnalyzing ? 'Analizando imagen...' : 'Crear Bolsa'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}