export const materialTypes = [
  { 
    id: 'plastic' as const, 
    name: 'Plástico', 
    icon: '🥤', 
    description: 'Botellas, contenedores, empaques',
    weightPerUnit: 0.15 // kg per unit
  },
  { 
    id: 'paper' as const, 
    name: 'Papel', 
    icon: '📄', 
    description: 'Periódicos, revistas',
    weightPerUnit: 0.5 // kg per unit
  },
  { 
    id: 'glass' as const, 
    name: 'Vidrio', 
    icon: '🍶', 
    description: 'Botellas y frascos de vidrio',
    weightPerUnit: 0.4 // kg per unit
  },
  { 
    id: 'metal' as const, 
    name: 'Metal', 
    icon: '🥫', 
    description: 'Latas y contenedores de metal',
    weightPerUnit: 0.08 // kg per unit
  },
  { 
    id: 'electronic' as const, 
    name: 'Electrónico', 
    icon: '📱', 
    description: 'Dispositivos electrónicos pequeños',
    weightPerUnit: 0.3 // kg per unit
  }
];