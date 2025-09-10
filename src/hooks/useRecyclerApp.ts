import { useState, useEffect } from 'react';
import { RecyclableItem, UserStats } from '../types';
import { mockItems, mockUserStats } from '../data/mockData';

export function useRecyclerApp() {
  const [items, setItems] = useState<RecyclableItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [userStats, setUserStats] = useState<UserStats>(mockUserStats);
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
      // Update user stats
      setUserStats(prev => ({
        ...prev,
        totalEarnings: prev.totalEarnings + currentItem.payment,
        completedToday: prev.completedToday + 1,
        totalPickups: prev.totalPickups + 1
      }));

      // Move to next item
      setCurrentItemIndex(prev => prev + 1);

      // TODO: Send acceptance to backend
      console.log('Accepted item:', currentItem.id);
    }
  };

  const rejectItem = () => {
    // Move to next item
    setCurrentItemIndex(prev => prev + 1);

    // TODO: Log rejection for analytics
    console.log('Rejected item:', currentItem?.id);
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
    acceptItem,
    rejectItem,
    refreshItems,
    setActiveTab
  };
}