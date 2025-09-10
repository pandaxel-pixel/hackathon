import React from 'react';
import { Recycle } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <Recycle className="w-12 h-12 text-green-600 animate-spin" />
        <div className="absolute inset-0 w-12 h-12 border-2 border-green-200 rounded-full animate-ping"></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">Buscando elementos cerca de ti...</p>
      <p className="text-sm text-gray-500 mt-1">Esto puede tomar unos segundos</p>
    </div>
  );
}