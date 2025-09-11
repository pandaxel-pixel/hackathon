import { useState, useEffect } from 'react';
import { RecyclableItem, UserStats } from '../types';
import { mockItems, mockUserStats } from '../data/mockData';

interface PendingPickup extends RecyclableItem {
  acceptedAt: Date;
}

export function useRecyclerApp() {
  const [items, setItems] = useState<RecyclableItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [userStats, setUserStats] = useState<UserStats>(mockUserStats);
  const [pendingPickups, setPendingPickups] = useState<PendingPickup[]>([]);
  const [activeTab, setActiveTab] = useState('items');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setItems(mockItems.sort((a, b) => {
        const urgencyOrder = { high: 3, medium: 2, low: 1 };
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      }));
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const currentItem = items[currentItemIndex] || null;

  const acceptItem = () => {
    if (currentItem) {
      // Add to pending pickups instead of immediately completing
      const pendingPickup: PendingPickup = {
        ...currentItem,
        acceptedAt: new Date()
      };
      
      setPendingPickups(prev => [...prev, pendingPickup]);

      // Move to next item
      setCurrentItemIndex(prev => prev + 1);

      // TODO: Send acceptance to backend (but don't complete yet)
      console.log('Accepted item:', currentItem.id);
    }
  };

  const rejectItem = () => {
    // Move to next item
    setCurrentItemIndex(prev => prev + 1);

    // TODO: Log rejection for analytics
    console.log('Rejected item:', currentItem?.id);
  };

  const completePickup = (itemId: string) => {
    const pickup = pendingPickups.find(p => p.id === itemId);
    if (pickup) {
      // Update user stats when QR is scanned
      setUserStats(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + pickup.points,
        pointsThisWeek: prev.pointsThisWeek + pickup.points,
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
    setCurrentItemIndex(0);
    
    // Simulate fetching new items
    setTimeout(() => {
      const newItems = [...mockItems].sort(() => Math.random() - 0.5);
      setItems(newItems);
      setIsLoading(false);
    }, 1500);
  };

  return {
    currentItem,
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