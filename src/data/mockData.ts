import { RecyclableItem, UserStats } from '../types';
import { PosterStats, PostedItem } from '../types';

export const mockItems: RecyclableItem[] = [
  {
    id: '1',
    title: 'Bolsa de botellas PET',
    description: 'Botellas de agua y refrescos limpias, aplastadas para optimizar espacio',
    image: 'https://static.vecteezy.com/system/resources/thumbnails/027/537/094/small/plastic-water-bottles-waiting-to-be-recycled-photo.jpg',
    points: 85,
    materials: [
      { type: 'plastic', quantity: 12, weightPerUnit: 0.175 }
    ],
    totalWeight: 2.1,
    location: {
      address: 'Col. Roma Norte, CDMX',
      distance: 1.2
    },
    postedAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: '2',
    title: 'Cartón doblado',
    description: 'Cajas de Amazon y paquetería, perfectamente dobladas y secas',
    image: 'https://bristolwastecompany.co.uk/wp-content/uploads/2022/08/Full-blue-bag-image-and-text.png',
    points: 45,
    materials: [
      { type: 'paper', quantity: 8, weightPerUnit: 0.6875 }
    ],
    totalWeight: 5.5,
    location: {
      address: 'Col. Condesa, CDMX',
      distance: 0.8
    },
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  },
  {
    id: '3',
    title: 'Latas de aluminio',
    description: '25 latas de bebidas, enjuagadas y sin etiquetas',
    image: 'https://i.ytimg.com/vi/vyCEw974Nas/oar2.jpg',
    points: 120,
    materials: [
      { type: 'metal', quantity: 25, weightPerUnit: 0.072 }
    ],
    totalWeight: 1.8,
    location: {
      address: 'Col. Polanco, CDMX',
      distance: 2.5
    },
    postedAt: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
  },
  {
    id: '4',
    title: 'Botellas de vidrio',
    description: 'Botellas de cerveza y vino, limpias y sin etiquetas',
    image: 'https://brokenarrowglassrecycling.com/cdn/shop/products/image_2e531448-22fd-44cc-bffc-981a632ce56e.jpg?v=1624915801',
    points: 60,
    materials: [
      { type: 'glass', quantity: 6, weightPerUnit: 0.533 }
    ],
    totalWeight: 3.2,
    location: {
      address: 'Col. Del Valle, CDMX',
      distance: 1.7
    },
    postedAt: new Date(Date.now() - 1000 * 60 * 45) // 45 minutes ago
  },
  {
    id: '5',
    title: 'Electrónicos pequeños',
    description: 'Celulares viejos, cables USB y cargadores',
    image: 'https://www.azcentral.com/gcdn/presto/2021/03/25/PPHX/abf44836-000d-41e7-90af-4949d6e812dd-ELECTRONICS_BOX.jpg?width=660&height=495&fit=crop&format=pjpg&auto=webp',
    points: 80, // 4 * 0.2 * 100 = 80 points
    materials: [
      { type: 'electronic', quantity: 4, weightPerUnit: 0.2 }
    ],
    totalWeight: 0.8,
    location: {
      address: 'Col. Narvarte, CDMX',
      distance: 3.1
    },
    postedAt: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
  }
];

export const mockUserStats: UserStats = {
  totalPickups: 127,
  rating: 4.8,
  completedToday: 3
};

export const mockPosterStats: PosterStats = {
  totalPosts: 45,
  totalRecycled: 38,
  rating: 4.9,
  activeItems: 7,
  totalPoints: 2850,
  pointsThisWeek: 180
};

export const mockPostedItems: PostedItem[] = [
  {
    ...mockItems[0],
    status: 'active',
    postedAt: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    ...mockItems[1],
    status: 'accepted',
    acceptedBy: 'Carlos M.',
    acceptedAt: new Date(Date.now() - 1000 * 60 * 15),
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  {
    ...mockItems[2],
    status: 'completed',
    acceptedBy: 'Ana L.',
    acceptedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    completedAt: new Date(Date.now() - 1000 * 60 * 60),
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 4)
  }
];

const materialTypes = [
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