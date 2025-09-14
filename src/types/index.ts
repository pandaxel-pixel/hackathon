/**
 * Core Data Types for EcoCiclo Application
 * 
 * These interfaces define the shape of data used throughout the application.
 * Backend developers should ensure their API responses match these structures.
 */

/**
 * Material quantity specification for recyclable items
 */
export interface MaterialQuantity {
  /** Type of recyclable material */
  type: 'plastic' | 'paper' | 'glass' | 'metal' | 'electronic';
  /** Number of items of this material type */
  quantity: number;
  /** Weight per individual item in kilograms */
  weightPerUnit: number;
}

/**
 * Base recyclable item structure
 * Used for items available for pickup by collectors
 */
export interface RecyclableItem {
  /** Unique identifier for the item */
  id: string;
  /** Display title for the item */
  title: string;
  /** Detailed description of the item */
  description: string;
  /** URL to item image */
  image: string;
  /** Points awarded for collecting this item */
  points: number;
  /** Array of materials and their quantities */
  materials: MaterialQuantity[];
  /** Total weight of all materials combined (kg) */
  totalWeight: number;
  /** Location information for pickup */
  location: {
    /** Human-readable address */
    address: string;
    /** Distance from collector in kilometers */
    distance: number;
  };
  /** When the item was originally posted */
  postedAt: Date;
}

/**
 * Collector statistics and performance metrics
 */
export interface UserStats {
  /** Total number of successful pickups */
  totalPickups: number;
  /** Average rating from posters (1-5 scale) */
  rating: number;
  /** Number of pickups completed today */
  completedToday: number;
}

/**
 * Posted item with status tracking
 * Extends RecyclableItem with posting-specific fields
 */
export interface PostedItem extends RecyclableItem {
  /** Current status of the posted item */
  status: 'active' | 'accepted' | 'completed';
  /** Username of collector who accepted the item */
  acceptedBy?: string;
  /** When the item was accepted by a collector */
  acceptedAt?: Date;
  /** When the pickup was completed */
  completedAt?: Date;
  /** Rating given to the collector (1-5 scale) */
  rating?: number;
}

/**
 * Poster statistics and achievements
 */
export interface PosterStats {
  /** Total number of items posted */
  totalPosts: number;
  /** Total number of items successfully recycled */
  totalRecycled: number;
  /** Average rating from collectors (1-5 scale) */
  rating: number;
  /** Number of currently active (uncollected) items */
  activeItems: number;
  /** Total points earned from all recycling */
  totalPoints: number;
  /** Points earned in the current week */
  pointsThisWeek: number;
}

/**
 * User account information
 */
export interface User {
  /** Unique user identifier */
  id: string;
  /** User's chosen username */
  username: string;
  /** User's password (MOCK ONLY - never store passwords in plain text in production!) */
  password: string;
  /** User's role in the system */
  role: 'collector' | 'poster' | null;
  /** Emoji or avatar for display */
  displayPhoto: string;
  /** When the user account was created */
  createdAt: Date;
}