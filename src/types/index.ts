export interface RecyclableItem {
  id: string;
  title: string;
  description: string;
  image: string;
  points: number;
  weight: number;
  category: 'plastic' | 'paper' | 'metal' | 'glass' | 'electronic';
  transport: string;
  location: {
    address: string;
    distance: number; // in km
  };
  postedAt: Date;
  urgency: 'low' | 'medium' | 'high';
}

export interface UserStats {
  totalPickups: number;
  rating: number;
  completedToday: number;
}

export interface PostedItem extends RecyclableItem {
  status: 'active' | 'accepted' | 'completed';
  acceptedBy?: string;
  acceptedAt?: Date;
  completedAt?: Date;
}

export interface PosterStats {
  totalPosts: number;
  totalRecycled: number;
  rating: number;
  activeItems: number;
  totalPoints: number;
  pointsThisWeek: number;
}

export interface User {
  id: string;
  username: string;
  password: string; // For simulation only - never store passwords in plain text in production
  role: 'collector' | 'poster' | null;
  displayPhoto: string;
  createdAt: Date;
}

export interface Bag {
  id: string;
  type: string;
  weight: number;
  status: 'ready' | 'collected';
  createdAt: Date;
  collectedAt?: Date;
  points?: number;
  image: string;
  rating?: number;
}