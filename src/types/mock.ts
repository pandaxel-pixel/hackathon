/**
 * MOCK DATABASE TYPES - FOR FRONTEND PROTOTYPING ONLY
 * 
 * These types define the structure of the mock database used for frontend development.
 * 
 * BACKEND DEVELOPERS: These types are for mock data only and will not be needed
 * in your backend implementation. Focus on the types in src/types/index.ts instead.
 * 
 * ⚠️  IMPORTANT: This file will be REMOVED once real backend integration is complete.
 */

import { User, RecyclableItem, PostedItem, UserStats, PosterStats } from './index';

/**
 * Mock database structure for localStorage simulation
 * BACKEND: Your actual database will have a different structure
 */
export interface MockDatabase {
  /** Mock user accounts */
  users: User[];
  /** Mock recyclable items available for pickup */
  recyclableItems: RecyclableItem[];
  /** Mock posted items with status tracking */
  postedItems: PostedItem[];
  /** Mock collector statistics */
  userStats: { [userId: string]: UserStats };
  /** Mock poster statistics */
  posterStats: { [userId: string]: PosterStats };