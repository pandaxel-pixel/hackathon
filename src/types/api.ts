/**
 * API Service Interfaces for Backend Integration
 * 
 * These interfaces define the contract between the frontend and backend.
 * Backend developers should implement these interfaces to replace the mock implementations.
 */

import { User, RecyclableItem, PostedItem, UserStats, PosterStats } from './index';

/**
 * Authentication Service Interface
 * Handles user authentication, registration, and role management
 */
export interface AuthService {
  /**
   * Authenticate user with username and password
   * @param username - User's username
   * @param password - User's password
   * @returns Promise<User | null> - User object if authentication successful, null otherwise
   */
  login(username: string, password: string): Promise<User | null>;

  /**
   * Register a new user account
   * @param username - Desired username (must be unique)
   * @param password - User's password
   * @returns Promise<User> - Newly created user object
   * @throws Error if username already exists
   */
  register(username: string, password: string): Promise<User>;

  /**
   * Update user's role (collector or poster)
   * @param userId - User's unique identifier
   * @param role - Role to assign ('collector' | 'poster')
   * @returns Promise<User | null> - Updated user object or null if user not found
   */
  updateUserRole(userId: string, role: 'collector' | 'poster'): Promise<User | null>;

  /**
   * Get current authenticated user
   * @returns Promise<User | null> - Current user object or null if not authenticated
   */
  getCurrentUser(): Promise<User | null>;
}

/**
 * Item Management Service Interface
 * Handles recyclable items, posted items, and pickup operations
 */
export interface ItemService {
  /**
   * Create a new recyclable item posting
   * @param itemData - Item data without id, postedAt, and status
   * @param userId - ID of the user creating the item
   * @returns Promise<PostedItem> - Created item with generated ID and metadata
   */
  createItem(itemData: Omit<PostedItem, 'id' | 'postedAt' | 'status'>, userId: string): Promise<PostedItem>;

  /**
   * Get all available items for collectors
   * @returns Promise<RecyclableItem[]> - Array of items available for pickup
   */
  getAvailableItems(): Promise<RecyclableItem[]>;

  /**
   * Get all items posted by a specific user
   * @param userId - ID of the user whose items to retrieve
   * @returns Promise<PostedItem[]> - Array of items posted by the user
   */
  getPostedItems(userId: string): Promise<PostedItem[]>;

  /**
   * Accept an item for pickup (collector action)
   * @param itemId - ID of the item to accept
   * @param collectorUsername - Username of the collector accepting the item
   * @returns Promise<PostedItem | null> - Updated item or null if not found/already accepted
   */
  acceptItem(itemId: string, collectorUsername: string): Promise<PostedItem | null>;

  /**
   * Complete a pickup (mark item as collected)
   * @param itemId - ID of the item that was picked up
   * @param collectorUserId - ID of the collector completing the pickup
   * @returns Promise<PostedItem | null> - Updated item or null if not found
   */
  completePickup(itemId: string, collectorUserId: string): Promise<PostedItem | null>;

  /**
   * Get collector statistics
   * @param userId - ID of the collector
   * @returns Promise<UserStats | null> - Collector stats or null if not found
   */
  getUserStats(userId: string): Promise<UserStats | null>;

  /**
   * Get poster statistics
   * @param userId - ID of the poster
   * @returns Promise<PosterStats | null> - Poster stats or null if not found
   */
  getPosterStats(userId: string): Promise<PosterStats | null>;

  /**
   * Reset application data (development/testing only)
   * @returns Promise<void>
   */
  resetApp(): Promise<void>;
}

/**
 * API Response Wrapper
 * Standard response format for all API calls
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * API Error Types
 * Standard error codes for consistent error handling
 */
export enum ApiErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  SERVER_ERROR = 'SERVER_ERROR'
}

/**
 * API Error Interface
 * Standard error format for API responses
 */
export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: any;
}