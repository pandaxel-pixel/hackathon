import { MockDatabase } from '../types/mock';
import { User, RecyclableItem, PostedItem, UserStats, PosterStats, MaterialQuantity } from '../types';

// Initial mock data
const initialMockItems: RecyclableItem[] = [
  {
    id: '1',
    title: 'Bolsa de botellas PET',
    description: 'Botellas de agua y refrescos limpias, aplastadas para optimizar espacio',
    image: 'https://static.vecteezy.com/system/resources/thumbnails/027/537/094/small/plastic-water-bottles-waiting-to-be-recycled-photo.jpg',
    points: 85,
    materials: [
      { type: 'plastic', quantity: 12, weightPerUnit: 0.175 }
    ],
    totalWeight: Math.round(12 * 0.175 * 10) / 10,
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
    totalWeight: Math.round(8 * 0.6875 * 10) / 10,
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
    totalWeight: Math.round(25 * 0.072 * 10) / 10,
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
    image: 'https://brokenarrowglassrecycling.com/cdn/shop/products/image_2e531248-22fd-44cc-bffc-981a632ce56e.jpg?v=1624915801',
    points: 60,
    materials: [
      { type: 'glass', quantity: 6, weightPerUnit: 0.533 }
    ],
    totalWeight: Math.round(6 * 0.533 * 10) / 10,
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
    points: 80,
    materials: [
      { type: 'electronic', quantity: 4, weightPerUnit: 0.2 }
    ],
    totalWeight: Math.round(4 * 0.2 * 10) / 10,
    location: {
      address: 'Col. Narvarte, CDMX',
      distance: 3.1
    },
    postedAt: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
  }
];

const initialPostedItems: PostedItem[] = [
  {
    ...initialMockItems[0],
    status: 'active',
    postedAt: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    ...initialMockItems[1],
    status: 'accepted',
    acceptedBy: 'Carlos M.',
    acceptedAt: new Date(Date.now() - 1000 * 60 * 15),
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  {
    ...initialMockItems[2],
    status: 'completed',
    acceptedBy: 'Ana L.',
    acceptedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    completedAt: new Date(Date.now() - 1000 * 60 * 60),
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 4)
  }
];

const DB_KEY = 'ecociclo_mock_db';

let mockDatabase: MockDatabase;

const initializeDatabase = (): MockDatabase => {
  const stored = localStorage.getItem(DB_KEY);
  
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      if (parsed.recyclableItems) {
        parsed.recyclableItems = parsed.recyclableItems.map((item: any) => ({
          ...item,
          postedAt: new Date(item.postedAt)
        }));
      }
      if (parsed.postedItems) {
        parsed.postedItems = parsed.postedItems.map((item: any) => ({
          ...item,
          postedAt: new Date(item.postedAt),
          acceptedAt: item.acceptedAt ? new Date(item.acceptedAt) : undefined,
          completedAt: item.completedAt ? new Date(item.completedAt) : undefined
        }));
      }
      if (parsed.users) {
        parsed.users = parsed.users.map((user: any) => ({
          ...user,
          createdAt: new Date(user.createdAt)
        }));
      }
      return parsed;
    } catch (error) {
      console.error('Error parsing stored database:', error);
    }
  }

  // Initialize with default data
  return {
    users: [],
    recyclableItems: [...initialMockItems],
    postedItems: [...initialPostedItems],
    userStats: {},
    posterStats: {}
  };
};

mockDatabase = initializeDatabase();

export const saveDatabase = () => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(mockDatabase));
  } catch (error) {
    console.error('Error saving database:', error);
  }
};

export const getDatabase = (): MockDatabase => mockDatabase;

export const resetDatabase = () => {
  mockDatabase = {
    users: [],
    recyclableItems: [...initialMockItems],
    postedItems: [...initialPostedItems],
    userStats: {},
    posterStats: {}
  };
  saveDatabase();
};

export default mockDatabase;