import { useState, useEffect } from 'react';
import { RecyclableItem, UserStats } from '../types';
import { itemApi } from '../api/mockApi';

interface PendingPickup extends RecyclableItem {
  acceptedAt: Date;
}

export function useRecyclerApp(currentUser: { id: string; username: string }) {
  const [items, setItems] = useState<RecyclableItem[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalPickups: 0,
    rating: 0,
    completedToday: 0
  });
  const [pendingPickups, setPendingPickups] = useState<PendingPickup[]>([]);
  const [activeTab, setActiveTab] = useState('map');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fetchedItems, fetchedStats] = await Promise.all([
          itemApi.getAvailableItems(),
          itemApi.getUserStats(currentUser.id)
        ]);
        
        setItems(fetchedItems);
        if (fetchedStats) {
          setUserStats(fetchedStats);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser.id]);

  const acceptItem = async (itemId: string) => {
    try {
      const acceptedItem = await itemApi.acceptItem(itemId, currentUser.username);
      if (acceptedItem) {
        const item = items.find(i => i.id === itemId);
        if (item) {
          const pendingPickup: PendingPickup = {
            ...item,
            acceptedAt: new Date()
          };
          
          setPendingPickups(prev => [...prev, pendingPickup]);
          setItems(prev => prev.filter(i => i.id !== itemId));
        }
      }
    } catch (error) {
      console.error('Error accepting item:', error);
    }
  };

  const rejectItem = (itemId: string) => {
    // Remove from available items
    setItems(prev => prev.filter(i => i.id !== itemId));
  };

  const completePickup = async (itemId: string) => {
    try {
      const completedItem = await itemApi.completePickup(itemId, currentUser.id);
      if (completedItem) {
        // Update user stats
        setUserStats(prev => ({
          ...prev,
          completedToday: prev.completedToday + 1,
          totalPickups: prev.totalPickups + 1
        }));
        
        setPendingPickups(prev => prev.filter(p => p.id !== itemId));
      }
    } catch (error) {
      console.error('Error completing pickup:', error);
    }
  };

  const cancelPickup = (itemId: string) => {
    setPendingPickups(prev => prev.filter(p => p.id !== itemId));
  };

  const refreshItems = async () => {
    setIsLoading(true);
    try {
      const fetchedItems = await itemApi.getAvailableItems();
      setItems(fetchedItems);
    } catch (error) {
      console.error('Error refreshing items:', error);
    } finally {
      setIsLoading(false);
    }
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