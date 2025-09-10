import React from 'react';
import { Recycle, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  onRefresh: () => void;
}

export default function EmptyState({ onRefresh }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-6">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Recycle className="w-12 h-12 text-green-600" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        ¡Excelente trabajo!
      </h3>
      <p className="text-gray-600 mb-6">
        Has revisado todos los elementos disponibles en tu área. 
        Nuevas oportunidades aparecerán pronto.
      </p>
      
      <button
        onClick={onRefresh}
        className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 mx-auto"
      >
        <RefreshCw className="w-5 h-5" />
        <span>Buscar nuevos elementos</span>
      </button>
      
      <div className="mt-8 text-sm text-gray-500">
        💡 Tip: Los elementos con mayor urgencia aparecen primero
      </div>
    </div>
  );
}