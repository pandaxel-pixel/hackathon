/**
 * MOCK API IMPLEMENTATION - FOR FRONTEND PROTOTYPING ONLY
 * 
 * This file contains mock implementations of the API services defined in src/types/api.ts
 * 
 * BACKEND DEVELOPERS: Replace these implementations with actual HTTP requests to your API endpoints.
 * The interfaces in src/types/api.ts define the expected method signatures and return types.
 * 
 * Current implementation uses localStorage and mock data for demonstration purposes.
 * All data is simulated and will be lost on page refresh (except user sessions).
 */

import mockDatabase, { saveDatabase, resetDatabase } from './mockDatabase';
import { appEventEmitter } from '../utils/eventEmitter';
import { User, RecyclableItem, PostedItem, UserStats, PosterStats } from '../types';
import { AuthService, ItemService } from '../types/api';

/**
 * Simulates network latency for realistic API behavior
 * BACKEND NOTE: Remove this function when implementing real API calls
 */
const simulateNetworkLatency = <T>(data: T): Promise<T> => {
  return new Promise(resolve => 
    setTimeout(() => resolve(data), Math.random() * 500 + 200) // 200-700ms delay
  );
};

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
    // MOCK IMPLEMENTATION - Replace with actual API call
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
    // MOCK IMPLEMENTATION - Replace with actual API call
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
    saveDatabase();
    return simulateNetworkLatency(newUser);
  },

  /**
   * Update user role (collector or poster)
   * BACKEND: PUT /api/auth/users/:userId/role
   * Request body: { role: 'collector' | 'poster' }
   * Response: Updated User object
   */
  updateUserRole: async (userId: string, role: 'collector' | 'poster'): Promise<User | null> => {
    // MOCK IMPLEMENTATION - Replace with actual API call
    const userIndex = mockDatabase.users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
      mockDatabase.users[userIndex].role = role;
      
      // MOCK: Initialize user stats with demo data
      if (role === 'collector') {
        mockDatabase.userStats[userId] = {
          totalPickups: 127,
          rating: 4.8,
          completedToday: 3
        };
      } else {
        // MOCK: Add demo completed items for new poster users to show celebration
        const demoCompletedItems: PostedItem[] = [
          {
            id: `demo-${userId}-1`,
            title: 'Bolsa de botellas PET',
            description: 'Botellas de agua y refrescos limpias',
            image: 'https://static.vecteezy.com/system/resources/thumbnails/027/537/094/small/plastic-water-bottles-waiting-to-be-recycled-photo.jpg',
            points: 85,
            materials: [{ type: 'plastic', quantity: 12, weightPerUnit: 0.175 }],
            totalWeight: 2.1,
            location: { address: 'Col. Roma Norte, CDMX', distance: 1.2 },
            postedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            status: 'completed',
            acceptedBy: 'Carlos M.',
            acceptedAt: new Date(Date.now() - 1000 * 60 * 60),
            completedAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
          },
          {
            id: `demo-${userId}-2`,
            title: 'Cartón doblado',
            description: 'Cajas de Amazon y paquetería',
            image: 'https://bristolwastecompany.co.uk/wp-content/uploads/2022/08/Full-blue-bag-image-and-text.png',
            points: 65,
            materials: [{ type: 'paper', quantity: 6, weightPerUnit: 0.8 }],
            totalWeight: 4.8,
            location: { address: 'Col. Condesa, CDMX', distance: 0.8 },
            postedAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
            status: 'completed',
            acceptedBy: 'Ana L.',
            acceptedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
            completedAt: new Date(Date.now() - 1000 * 60 * 10) // 10 minutes ago
          }
        ];
        
        // MOCK: Add demo items to posted items
        mockDatabase.postedItems.push(...demoCompletedItems);
        
        mockDatabase.posterStats[userId] = {
          totalPosts: 47, // Include demo items
          totalRecycled: 40, // Include demo items
          rating: 4.9,
          activeItems: 5,
          totalPoints: 3000, // Include points from demo items
          pointsThisWeek: 330 // Include points from demo items
        };
      }
      
      saveDatabase();
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
    // MOCK IMPLEMENTATION - Replace with actual API call
    // Currently uses localStorage, backend should use JWT tokens or sessions
    const stored = localStorage.getItem('ecociclo_user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        // MOCK: Verify user still exists in database
        const dbUser = mockDatabase.users.find(u => u.id === user.id);
        return simulateNetworkLatency(dbUser || null);
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    return simulateNetworkLatency(null);
  }
};

/**
 * Item Management API Implementation
 * BACKEND: Replace with actual HTTP requests to your item management endpoints
 */
export const itemApi: ItemService = {
  /**
   * Create a new recyclable item posting
   * BACKEND: POST /api/items
   * Request body: ItemData (without id, postedAt, status)
   * Headers: Authorization: Bearer <token>
   * Response: Created PostedItem
   */
  createItem: async (itemData: Omit<PostedItem, 'id' | 'postedAt' | 'status'>, userId: string): Promise<PostedItem> => {
    // MOCK IMPLEMENTATION - Replace with actual API call
    const newItem: PostedItem = {
      ...itemData,
      id: Date.now().toString(),
      postedAt: new Date(),
      status: 'active',
    };

    // MOCK: Add to posted items
    mockDatabase.postedItems.push(newItem);
    
    // MOCK: Add to recyclable items for collectors to see
    mockDatabase.recyclableItems.push(newItem);
    
    // MOCK: Update poster stats
    if (mockDatabase.posterStats[userId]) {
      mockDatabase.posterStats[userId].totalPosts += 1;
      mockDatabase.posterStats[userId].activeItems += 1;
    }
    
    saveDatabase();
    appEventEmitter.emit('itemCreated', newItem);
    
    return simulateNetworkLatency(newItem);
  },

  /**
   * Get all available items for collectors
   * BACKEND: GET /api/items/available
   * Headers: Authorization: Bearer <token>
   * Response: Array of RecyclableItem
   */
  getAvailableItems: async (): Promise<RecyclableItem[]> => {
    // MOCK IMPLEMENTATION - Replace with actual API call
    // BACKEND: Only return items that are active and not accepted by anyone
    const activeItems = mockDatabase.recyclableItems.filter(item => {
      const postedItem = mockDatabase.postedItems.find(p => p.id === item.id);
      return !postedItem || postedItem.status === 'active';
    });
    console.log('Available items for collector:', activeItems.map(item => ({ id: item.id, title: item.title, status: mockDatabase.postedItems.find(p => p.id === item.id)?.status || 'not in posted items' })));
    return simulateNetworkLatency(activeItems);
  },

  /**
   * Get all items posted by a specific user
   * BACKEND: GET /api/items/posted/:userId
   * Headers: Authorization: Bearer <token>
   * Response: Array of PostedItem
   */
  getPostedItems: async (userId: string): Promise<PostedItem[]> => {
    // MOCK IMPLEMENTATION - Replace with actual API call
    // BACKEND: Filter by the user who posted them
    // MOCK: For demo, we return all posted items
    return simulateNetworkLatency([...mockDatabase.postedItems]);
  },

  /**
   * Accept an item for pickup (collector action)
   * BACKEND: PUT /api/items/:itemId/accept
   * Request body: { collectorUsername: string }
   * Headers: Authorization: Bearer <token>
   * Response: Updated PostedItem or null
   */
  acceptItem: async (itemId: string, collectorUsername: string): Promise<PostedItem | null> => {
    // MOCK IMPLEMENTATION - Replace with actual API call
    const itemIndex = mockDatabase.postedItems.findIndex(item => item.id === itemId);
    if (itemIndex > -1 && mockDatabase.postedItems[itemIndex].status === 'active') {
      mockDatabase.postedItems[itemIndex].status = 'accepted';
      mockDatabase.postedItems[itemIndex].acceptedBy = collectorUsername;
      mockDatabase.postedItems[itemIndex].acceptedAt = new Date();
      
      // MOCK: Remove from available recyclable items
      mockDatabase.recyclableItems = mockDatabase.recyclableItems.filter(item => item.id !== itemId);
      
      saveDatabase();
      appEventEmitter.emit('itemAccepted', mockDatabase.postedItems[itemIndex]);
      
      return simulateNetworkLatency(mockDatabase.postedItems[itemIndex]);
    }
    return simulateNetworkLatency(null);
  },

  /**
   * Complete a pickup (mark item as collected)
   * BACKEND: PUT /api/items/:itemId/complete
   * Headers: Authorization: Bearer <token>
   * Response: Updated PostedItem or null
   */
  completePickup: async (itemId: string, collectorUserId: string): Promise<PostedItem | null> => {
    // MOCK IMPLEMENTATION - Replace with actual API call
    const itemIndex = mockDatabase.postedItems.findIndex(item => item.id === itemId);
    if (itemIndex > -1 && mockDatabase.postedItems[itemIndex].status === 'accepted') {
      const item = mockDatabase.postedItems[itemIndex];
      item.status = 'completed';
      item.completedAt = new Date();
      
      // MOCK: Update collector stats
      if (mockDatabase.userStats[collectorUserId]) {
        mockDatabase.userStats[collectorUserId].completedToday += 1;
        mockDatabase.userStats[collectorUserId].totalPickups += 1;
      }
      
      // MOCK: Award points to poster
      // BACKEND: You'll have a userId field on the PostedItem to identify the poster
      // MOCK: For demo, we award points to the first poster we find
      const posterUserId = Object.keys(mockDatabase.posterStats)[0];
      if (posterUserId && mockDatabase.posterStats[posterUserId]) {
        mockDatabase.posterStats[posterUserId].totalPoints += item.points;
        mockDatabase.posterStats[posterUserId].pointsThisWeek += item.points;
        mockDatabase.posterStats[posterUserId].totalRecycled += 1;
        mockDatabase.posterStats[posterUserId].activeItems = Math.max(0, mockDatabase.posterStats[posterUserId].activeItems - 1);
      }
      
      saveDatabase();
      appEventEmitter.emit('itemCollected', item);
      
      return simulateNetworkLatency(item);
    }
    return simulateNetworkLatency(null);
  },

  /**
   * Get collector statistics
   * BACKEND: GET /api/users/:userId/stats
   * Headers: Authorization: Bearer <token>
   * Response: UserStats or null
   */
  getUserStats: async (userId: string): Promise<UserStats | null> => {
    // MOCK IMPLEMENTATION - Replace with actual API call
    return simulateNetworkLatency(mockDatabase.userStats[userId] || null);
  },

  /**
   * Get poster statistics
   * BACKEND: GET /api/users/:userId/poster-stats
   * Headers: Authorization: Bearer <token>
   * Response: PosterStats or null
   */
  getPosterStats: async (userId: string): Promise<PosterStats | null> => {
    // MOCK IMPLEMENTATION - Replace with actual API call
    return simulateNetworkLatency(mockDatabase.posterStats[userId] || null);
  },

  /**
   * Reset application data (development/testing only)
   * BACKEND: DELETE /api/admin/reset (admin only)
   * Headers: Authorization: Bearer <admin-token>
   * Response: void
   */
  resetApp: async (): Promise<void> => {
    // MOCK IMPLEMENTATION - Replace with actual API call
    // BACKEND: This should be an admin-only endpoint for development/testing
    
    // MOCK: Reset the database to initial state
    resetDatabase();
    
    // MOCK: Clear current user session
    localStorage.removeItem('ecociclo_user');
    
    // MOCK: Clear any other app-specific localStorage items
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('ecociclo_')) {
        localStorage.removeItem(key);
      }
    });
    
    return simulateNetworkLatency(undefined);
  }
}