import { RecyclableItem, UserStats } from '../types';
import { PosterStats, PostedItem } from '../types';

export const mockItems: RecyclableItem[] = [
  {
    id: '1',
    title: '14 botellas PET',
    description: 'Botellas de agua y refrescos limpias, aplastadas para optimizar espacio',
    image: 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg',
    payment: 85,
    weight: 2.1,
    category: 'plastic',
    transport: 'Bicicleta con remolque',
    location: {
      address: 'Col. Roma Norte, CDMX',
      distance: 1.2
    },
    postedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    urgency: 'medium'
  },
  {
    id: '2',
    title: 'Cartón doblado',
    description: 'Cajas de Amazon y paquetería, perfectamente dobladas y secas',
    image: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg',
    payment: 45,
    weight: 5.5,
    category: 'paper',
    transport: 'Carrito de mano',
    location: {
      address: 'Col. Condesa, CDMX',
      distance: 0.8
    },
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    urgency: 'low'
  },
  {
    id: '3',
    title: 'Latas de aluminio',
    description: '25 latas de bebidas, enjuagadas y sin etiquetas',
    image: 'https://images.pexels.com/photos/3735188/pexels-photo-3735188.jpeg',
    payment: 120,
    weight: 1.8,
    category: 'metal',
    transport: 'Mochila grande',
    location: {
      address: 'Col. Polanco, CDMX',
      distance: 2.5
    },
    postedAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    urgency: 'high'
  },
  {
    id: '4',
    title: 'Botellas de vidrio',
    description: 'Botellas de cerveza y vino, limpias y sin etiquetas',
    image: 'https://images.pexels.com/photos/3735213/pexels-photo-3735213.jpeg',
    payment: 60,
    weight: 3.2,
    category: 'glass',
    transport: 'Caja resistente',
    location: {
      address: 'Col. Del Valle, CDMX',
      distance: 1.7
    },
    postedAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    urgency: 'medium'
  },
  {
    id: '5',
    title: 'Electrónicos pequeños',
    description: 'Celulares viejos, cables USB y cargadores',
    image: 'https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg',
    payment: 200,
    weight: 0.8,
    category: 'electronic',
    transport: 'Bolsa de protección',
    location: {
      address: 'Col. Narvarte, CDMX',
      distance: 3.1
    },
    postedAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    urgency: 'high'
  }
];

export const mockUserStats: UserStats = {
  totalPickups: 127,
  totalEarnings: 3480,
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