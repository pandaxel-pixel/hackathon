/**
 * MOCK API IMPLEMENTATION - FOR MOBILE PROTOTYPING ONLY
 * 
 * This file contains mock implementations of the API services defined in src/types/api.ts
 * 
 * BACKEND DEVELOPERS: Replace these implementations with actual HTTP requests to your API endpoints.
 * The interfaces in src/types/api.ts define the expected method signatures and return types.
 * 
 * Current implementation uses AsyncStorage and mock data for demonstration purposes.
 * All data is simulated and will be lost on app restart (except user sessions).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { appEventEmitter } from '../utils/eventEmitter';
import { User, RecyclableItem, PostedItem, UserStats, PosterStats } from '../types';
import { AuthService, ItemService } from '../types/api';

// Mock database structure
interface MockDatabase {
  users: User[];
  recyclableItems: RecyclableItem[];
  postedItems: PostedItem[];
  userStats: { [userId: string]: UserStats };
  posterStats: { [userId: string]: PosterStats };
}

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
    postedAt: new Date(Date.now() - 1000 * 60 * 30)
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
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
  }
];

const DB_KEY = 'ecociclo_mock_db';

let mockDatabase: MockDatabase = {
  users: [],
  recyclableItems: [...initialMockItems],
  postedItems: [],
  userStats: {},
  posterStats: {}
};

/**
 * Simulates network latency for realistic API behavior
 * BACKEND NOTE: Remove this function when implementing real API calls
 */
const simulateNetworkLatency = <T>(data: T): Promise<T> => {
  return new Promise(resolve => 
    setTimeout(() => resolve(data), Math.random() * 500 + 200)
  );
};

/**
 * Load database from AsyncStorage
 */
const loadDatabase = async (): Promise<void> => {
  try {
    const stored = await AsyncStorage.getItem(DB_KEY);
    if (stored) {
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
      mockDatabase = parsed;
    }
  } catch (error) {
    console.error('Error loading database:', error);
  }
};

/**
 * Save database to AsyncStorage
 */
const saveDatabase = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(DB_KEY, JSON.stringify(mockDatabase));
  } catch (error) {
    console.error('Error saving database:', error);
  }
};

// Initialize database on module load
loadDatabase();

/**
 * Authentication API Implementation
 * BACKEND: Replace with actual HTTP requests to your authentication endpoints
 */
export const authApi: AuthService = {
  /**
   * User login authentication
   * BACKEND: POST /api/auth/login
   * Request body: { username: string, password: string }
   * Response: User object or null
   */
  login: async (username: string, password: string): Promise<User | null> => {
    await loadDatabase();
    const user = mockDatabase.users.find(u => u.username === username && u.password === password);
    return simulateNetworkLatency(user || null);
  },

  /**
   * User registration
   * BACKEND: POST /api/auth/register
   * Request body: { username: string, password: string }
   * Response: User object
   * Throws: Error if username already exists
   */
  register: async (username: string, password: string): Promise<User> => {
    await loadDatabase();
    const existingUser = mockDatabase.users.find(u => u.username === username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      password,
      role: null,
      displayPhoto: '🐱',
      createdAt: new Date(),
    };

    mockDatabase.users.push(newUser);
    await saveDatabase();
    return simulateNetworkLatency(newUser);
  },

  /**
   * Update user role (collector or poster)
   * BACKEND: PUT /api/auth/users/:userId/role
   * Request body: { role: 'collector' | 'poster' }
   * Response: Updated User object
   */
  updateUserRole: async (userId: string, role: 'collector' | 'poster'): Promise<User | null> => {
    await loadDatabase();
    const userIndex = mockDatabase.users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
      mockDatabase.users[userIndex].role = role;
      
      // Initialize user stats with demo data
      if (role === 'collector') {
        mockDatabase.userStats[userId] = {
          totalPickups: 127,
          rating: 4.8,
          completedToday: 3
        };
      } else {
        mockDatabase.posterStats[userId] = {
          totalPosts: 47,
          totalRecycled: 40,
          rating: 4.9,
          activeItems: 5,
          totalPoints: 3000,
          pointsThisWeek: 330
        };
      }
      
      await saveDatabase();
      return simulateNetworkLatency(mockDatabase.users[userIndex]);
    }
    return simulateNetworkLatency(null);
  },

  /**
   * Get current authenticated user
   * BACKEND: GET /api/auth/me
   * Headers: Authorization: Bearer <token>
   * Response: User object or null
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const stored = await AsyncStorage.getItem('ecociclo_user');
      if (stored) {
        const user = JSON.parse(stored);
        await loadDatabase();
        const dbUser = mockDatabase.users.find(u => u.id === user.id);
        return simulateNetworkLatency(dbUser || null);
      }
    } catch (error) {
      console.error('Error parsing stored user:', error);
    }
    return simulateNetworkLatency(null);
  }
};

/**
 * Item Management API Implementation
 * BACKEND: Replace with actual HTTP requests to your item management endpoints
 */
export const itemApi: ItemService = {
  createItem: async (itemData: Omit<PostedItem, 'id' | 'postedAt' | 'status'>, userId: string): Promise<PostedItem> => {
    await loadDatabase();
    const newItem: PostedItem = {
      ...itemData,
      id: Date.now().toString(),
      postedAt: new Date(),
      status: 'active',
    };

    mockDatabase.postedItems.push(newItem);
    mockDatabase.recyclableItems.push(newItem);
    
    if (mockDatabase.posterStats[userId]) {
      mockDatabase.posterStats[userId].totalPosts += 1;
      mockDatabase.posterStats[userId].activeItems += 1;
    }
    
    await saveDatabase();
    appEventEmitter.emit('itemCreated', newItem);
    
    return simulateNetworkLatency(newItem);
  },

  getAvailableItems: async (): Promise<RecyclableItem[]> => {
    await loadDatabase();
    const activeItems = mockDatabase.recyclableItems.filter(item => {
      const postedItem = mockDatabase.postedItems.find(p => p.id === item.id);
      return !postedItem || postedItem.status === 'active';
    });
    return simulateNetworkLatency(activeItems);
  },

  getPostedItems: async (userId: string): Promise<PostedItem[]> => {
    await loadDatabase();
    return simulateNetworkLatency([...mockDatabase.postedItems]);
  },

  acceptItem: async (itemId: string, collectorUsername: string): Promise<PostedItem | null> => {
    await loadDatabase();
    const itemIndex = mockDatabase.postedItems.findIndex(item => item.id === itemId);
    if (itemIndex > -1 && mockDatabase.postedItems[itemIndex].status === 'active') {
      mockDatabase.postedItems[itemIndex].status = 'accepted';
      mockDatabase.postedItems[itemIndex].acceptedBy = collectorUsername;
      mockDatabase.postedItems[itemIndex].acceptedAt = new Date();
      
      mockDatabase.recyclableItems = mockDatabase.recyclableItems.filter(item => item.id !== itemId);
      
      await saveDatabase();
      appEventEmitter.emit('itemAccepted', mockDatabase.postedItems[itemIndex]);
      
      return simulateNetworkLatency(mockDatabase.postedItems[itemIndex]);
    }
    return simulateNetworkLatency(null);
  },

  completePickup: async (itemId: string, collectorUserId: string): Promise<PostedItem | null> => {
    await loadDatabase();
    const itemIndex = mockDatabase.postedItems.findIndex(item => item.id === itemId);
    if (itemIndex > -1 && mockDatabase.postedItems[itemIndex].status === 'accepted') {
      const item = mockDatabase.postedItems[itemIndex];
      item.status = 'completed';
      item.completedAt = new Date();
      
      if (mockDatabase.userStats[collectorUserId]) {
        mockDatabase.userStats[collectorUserId].completedToday += 1;
        mockDatabase.userStats[collectorUserId].totalPickups += 1;
      }
      
      const posterUserId = Object.keys(mockDatabase.posterStats)[0];
      if (posterUserId && mockDatabase.posterStats[posterUserId]) {
        mockDatabase.posterStats[posterUserId].totalPoints += item.points;
        mockDatabase.posterStats[posterUserId].pointsThisWeek += item.points;
        mockDatabase.posterStats[posterUserId].totalRecycled += 1;
        mockDatabase.posterStats[posterUserId].activeItems = Math.max(0, mockDatabase.posterStats[posterUserId].activeItems - 1);
      }
      
      await saveDatabase();
      appEventEmitter.emit('itemCollected', item);
      
      return simulateNetworkLatency(item);
    }
    return simulateNetworkLatency(null);
  },

  getUserStats: async (userId: string): Promise<UserStats | null> => {
    await loadDatabase();
    return simulateNetworkLatency(mockDatabase.userStats[userId] || null);
  },

  getPosterStats: async (userId: string): Promise<PosterStats | null> => {
    await loadDatabase();
    return simulateNetworkLatency(mockDatabase.posterStats[userId] || null);
  },

  resetApp: async (): Promise<void> => {
    mockDatabase = {
      users: [],
      recyclableItems: [...initialMockItems],
      postedItems: [],
      userStats: {},
      posterStats: {}
    };
    
    await saveDatabase();
    await AsyncStorage.removeItem('ecociclo_user');
    
    return simulateNetworkLatency(undefined);
  }
};