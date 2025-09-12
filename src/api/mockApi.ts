import mockDatabase, { saveDatabase, resetDatabase } from './mockDatabase';
import { appEventEmitter } from '../utils/eventEmitter';
import { User, RecyclableItem, PostedItem, UserStats, PosterStats } from '../types';

const simulateNetworkLatency = <T>(data: T): Promise<T> => {
  return new Promise(resolve => 
    setTimeout(() => resolve(data), Math.random() * 500 + 200) // 200-700ms delay
  );
};

export const authApi = {
  login: async (username: string, password: string): Promise<User | null> => {
    const user = mockDatabase.users.find(u => u.username === username && u.password === password);
    return simulateNetworkLatency(user || null);
  },

  register: async (username: string, password: string): Promise<User> => {
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

  updateUserRole: async (userId: string, role: 'collector' | 'poster'): Promise<User | null> => {
    const userIndex = mockDatabase.users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
      mockDatabase.users[userIndex].role = role;
      
      // Initialize user stats
      if (role === 'collector') {
        mockDatabase.userStats[userId] = {
          totalPickups: 127,
          rating: 4.8,
          completedToday: 3
        };
      } else {
        // Add some demo completed items for new poster users to show celebration
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
        
        // Add demo items to posted items
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

  getCurrentUser: async (): Promise<User | null> => {
    const stored = localStorage.getItem('ecociclo_user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        // Verify user still exists in database
        const dbUser = mockDatabase.users.find(u => u.id === user.id);
        return simulateNetworkLatency(dbUser || null);
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    return simulateNetworkLatency(null);
  }
};

export const itemApi = {
  createItem: async (itemData: Omit<PostedItem, 'id' | 'postedAt' | 'status'>, userId: string): Promise<PostedItem> => {
    const newItem: PostedItem = {
      ...itemData,
      id: Date.now().toString(),
      postedAt: new Date(),
      status: 'active',
    };

    // Add to posted items
    mockDatabase.postedItems.push(newItem);
    
    // Add to recyclable items for collectors to see
    mockDatabase.recyclableItems.push(newItem);
    
    // Update poster stats (but don't award points yet - they get points when collected)
    if (mockDatabase.posterStats[userId]) {
      mockDatabase.posterStats[userId].totalPosts += 1;
      mockDatabase.posterStats[userId].activeItems += 1;
    }
    
    saveDatabase();
    appEventEmitter.emit('itemCreated', newItem);
    
    return simulateNetworkLatency(newItem);
  },

  getAvailableItems: async (): Promise<RecyclableItem[]> => {
    // Only return items that are active and not accepted by anyone
    const activeItems = mockDatabase.recyclableItems.filter(item => {
      const postedItem = mockDatabase.postedItems.find(p => p.id === item.id);
      return !postedItem || postedItem.status === 'active';
    });
    console.log('Available items for collector:', activeItems.map(item => ({ id: item.id, title: item.title, status: mockDatabase.postedItems.find(p => p.id === item.id)?.status || 'not in posted items' })));
    return simulateNetworkLatency(activeItems);
  },

  getPostedItems: async (userId: string): Promise<PostedItem[]> => {
    // In a real app, you'd filter by the user who posted them
    // For this demo, we'll return all posted items
    return simulateNetworkLatency([...mockDatabase.postedItems]);
  },

  acceptItem: async (itemId: string, collectorUsername: string): Promise<PostedItem | null> => {
    const itemIndex = mockDatabase.postedItems.findIndex(item => item.id === itemId);
    if (itemIndex > -1 && mockDatabase.postedItems[itemIndex].status === 'active') {
      mockDatabase.postedItems[itemIndex].status = 'accepted';
      mockDatabase.postedItems[itemIndex].acceptedBy = collectorUsername;
      mockDatabase.postedItems[itemIndex].acceptedAt = new Date();
      
      // Remove from available recyclable items
      mockDatabase.recyclableItems = mockDatabase.recyclableItems.filter(item => item.id !== itemId);
      
      saveDatabase();
      appEventEmitter.emit('itemAccepted', mockDatabase.postedItems[itemIndex]);
      
      return simulateNetworkLatency(mockDatabase.postedItems[itemIndex]);
    }
    return simulateNetworkLatency(null);
  },

  completePickup: async (itemId: string, collectorUserId: string): Promise<PostedItem | null> => {
    const itemIndex = mockDatabase.postedItems.findIndex(item => item.id === itemId);
    if (itemIndex > -1 && mockDatabase.postedItems[itemIndex].status === 'accepted') {
      const item = mockDatabase.postedItems[itemIndex];
      item.status = 'completed';
      item.completedAt = new Date();
      
      // Update collector stats
      if (mockDatabase.userStats[collectorUserId]) {
        mockDatabase.userStats[collectorUserId].completedToday += 1;
        mockDatabase.userStats[collectorUserId].totalPickups += 1;
      }
      
      // Award points to poster (find the poster by looking for who would have these stats)
      // In a real app, you'd have a userId field on the PostedItem
      // For this demo, we'll award points to the first poster we find
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

  getUserStats: async (userId: string): Promise<UserStats | null> => {
    return simulateNetworkLatency(mockDatabase.userStats[userId] || null);
  },

  getPosterStats: async (userId: string): Promise<PosterStats | null> => {
    return simulateNetworkLatency(mockDatabase.posterStats[userId] || null);
  },

  resetApp: async (): Promise<void> => {
    // Reset the database to initial state
    resetDatabase();
    
    // Clear current user session
    localStorage.removeItem('ecociclo_user');
    
    // Clear any other app-specific localStorage items if they exist
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('ecociclo_')) {
        localStorage.removeItem(key);
      }
    });
    
    return simulateNetworkLatency(undefined);
  }
};