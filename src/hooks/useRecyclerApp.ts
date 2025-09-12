import { useState, useEffect } from 'react';
import { RecyclableItem, UserStats } from '../types';
import { mockItems, mockUserStats } from '../data/mockData';

interface PendingPickup extends RecyclableItem {
  acceptedAt: Date;
}

export function useRecyclerApp() {
  const [items, setItems] = useState<RecyclableItem[]>([]);
  const [userStats, setUserStats] = useState<UserStats>(mockUserStats);
  const [pendingPickups, setPendingPickups] = useState<PendingPickup[]>([]);
  const [activeTab, setActiveTab] = useState('map');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setItems(mockItems);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const acceptItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      // Add to pending pickups instead of immediately completing
      const pendingPickup: PendingPickup = {
        ...item,
        acceptedAt: new Date()
      };
      
      setPendingPickups(prev => [...prev, pendingPickup]);

      // Remove from available items
      setItems(prev => prev.filter(i => i.id !== itemId));

      // TODO: Send acceptance to backend (but don't complete yet)
      console.log('Accepted item:', itemId);
    }
  };

  const rejectItem = (itemId: string) => {
    // Remove from available items
    setItems(prev => prev.filter(i => i.id !== itemId));

    // TODO: Log rejection for analytics
    console.log('Rejected item:', itemId);
  };

  const completePickup = (itemId: string) => {
    const pickup = pendingPickups.find(p => p.id === itemId);
    if (pickup) {
      // Update user stats when pickup is completed
      setUserStats(prev => ({
        ...prev,
        completedToday: prev.completedToday + 1,
        totalPickups: prev.totalPickups + 1
      }));

      // Remove from pending pickups
      setPendingPickups(prev => prev.filter(p => p.id !== itemId));

      // TODO: Send completion to backend
      console.log('Completed pickup:', itemId);
    }
  };

  const cancelPickup = (itemId: string) => {
    // Remove from pending pickups
    setPendingPickups(prev => prev.filter(p => p.id !== itemId));
    
    // TODO: Send cancellation to backend
    console.log('Cancelled pickup:', itemId);
  };

  const refreshItems = () => {
    setIsLoading(true);
    
    // Simulate fetching new items
    setTimeout(() => {
      const newItems = [...mockItems].sort(() => Math.random() - 0.5);
      setItems(newItems);
      setIsLoading(false);
    }, 1500);
  };

  return {
    items,
    userStats,
    activeTab,
    isLoading,
    pendingPickups,
    acceptItem,
    rejectItem,
    refreshItems,
    setActiveTab,
    completePickup,
    cancelPickup
  };
}