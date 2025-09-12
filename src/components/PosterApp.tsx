import React, { useState } from 'react';
import { useEffect } from 'react';
import PosterHeader from './PosterHeader';
import CreateItemForm from './CreateItemForm';
import PostedItemCard from './PostedItemCard';
import Navigation from './Navigation';
import RankingView from './RankingView';
import StatsView from './StatsView';
import MessagesView from './MessagesView';
import MyBagsView from './MyBagsView';
import ProfileView from './ProfileView';
import PointsCelebrationModal from './PointsCelebrationModal';
import { itemApi } from '../api/mockApi';
import { appEventEmitter } from '../utils/eventEmitter';
import { PostedItem, RecyclableItem, PosterStats } from '../types';
import { User } from '../types';

interface PosterAppProps {
  currentUser: User;
  onLogout: () => void;
}

export default function PosterApp({ currentUser, onLogout }: PosterAppProps) {
  const [posterStats, setPosterStats] = useState<PosterStats>({
    totalPosts: 0,
    totalRecycled: 0,
    rating: 0,
    activeItems: 0,
    totalPoints: 0,
    pointsThisWeek: 0
  });
  const [postedItems, setPostedItems] = useState<PostedItem[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showCelebration, setShowCelebration] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [pendingCelebrations, setPendingCelebrations] = useState<PostedItem[]>([]);
  const [currentCelebrationIndex, setCurrentCelebrationIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedItems, fetchedStats] = await Promise.all([
          itemApi.getPostedItems(currentUser.id),
          itemApi.getPosterStats(currentUser.id)
        ]);
        
        setPostedItems(fetchedItems);
        if (fetchedStats) {
          setPosterStats(fetchedStats);
        }

        // Check for items that were completed while user was away
        const lastLoginKey = `ecociclo_last_login_${currentUser.id}`;
        const lastLogin = localStorage.getItem(lastLoginKey);
        const now = new Date();
        
        if (lastLogin) {
          const lastLoginDate = new Date(lastLogin);
          const completedWhileAway = fetchedItems.filter(item => 
            item.status === 'completed' && 
            item.completedAt && 
            item.completedAt > lastLoginDate
          );
          
          if (completedWhileAway.length > 0) {
            setPendingCelebrations(completedWhileAway);
            setCurrentCelebrationIndex(0);
            // Show first celebration after a short delay
            setTimeout(() => {
              if (completedWhileAway.length > 0) {
                setEarnedPoints(completedWhileAway[0].points);
                setShowCelebration(true);
              }
            }, 1000);
          }
        }
        
        // Update last login time
        localStorage.setItem(lastLoginKey, now.toISOString());
      } catch (error) {
        console.error('Error fetching poster data:', error);
      }
    };

    fetchData();
  }, [currentUser.id]);

  useEffect(() => {
    // Listen for item collection events
    const handleItemCollected = (collectedItem: PostedItem) => {
      // Update posted items status
      setPostedItems(prev => prev.map(item => 
        item.id === collectedItem.id 
          ? { ...item, status: 'completed', completedAt: collectedItem.completedAt }
          : item
      ));
      
      // Update poster stats
      setPosterStats(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + collectedItem.points,
        pointsThisWeek: prev.pointsThisWeek + collectedItem.points,
        totalRecycled: prev.totalRecycled + 1,
        activeItems: Math.max(0, prev.activeItems - 1)
      }));
      
      // Show celebration modal for points earned from collection
      setEarnedPoints(collectedItem.points);
      setShowCelebration(true);
    };

    appEventEmitter.on('itemCollected', handleItemCollected);

    return () => {
      appEventEmitter.off('itemCollected', handleItemCollected);
    };
  }, []);

  const handleCelebrationClose = () => {
    setShowCelebration(false);
    
    // Check if there are more pending celebrations
    if (pendingCelebrations.length > 0 && currentCelebrationIndex < pendingCelebrations.length - 1) {
      const nextIndex = currentCelebrationIndex + 1;
      setCurrentCelebrationIndex(nextIndex);
      
      // Show next celebration after a short delay
      setTimeout(() => {
        setEarnedPoints(pendingCelebrations[nextIndex].points);
        setShowCelebration(true);
      }, 500);
    } else {
      // All celebrations shown, clear pending list
      setPendingCelebrations([]);
      setCurrentCelebrationIndex(0);
    }
  };
  const handleCreateItem = async (itemData: Omit<RecyclableItem, 'id' | 'postedAt'>) => {
    try {
      const newItem = await itemApi.createItem(itemData, currentUser.id);
      setPostedItems(prev => [newItem, ...prev]);
      setShowCreateForm(false);
      
      // Update poster stats (but don't award points yet - they get points when collected)
      setPosterStats(prev => ({
        ...prev,
        totalPosts: prev.totalPosts + 1,
        activeItems: prev.activeItems + 1
      }));
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const handleCreateItemClick = () => {
    // Always navigate to items tab before showing create form
    if (activeTab !== 'bags') {
      setActiveTab('bags');
    }
    setShowCreateForm(true);
  };

  const handleOpenMessages = () => {
    setActiveTab('messages');
  };

  if (activeTab === 'rankings') {
    return (
      <div className="min-h-screen bg-gray-50">
        <PosterHeader 
          username={currentUser.username}
          displayPhoto={currentUser.displayPhoto}
          posterStats={posterStats} 
          onOpenMessages={handleOpenMessages}
        />
        <main className="max-w-md mx-auto pb-20">
          <RankingView posterStats={posterStats} />
        </main>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} userType="poster" />
      </div>
    );
  }

  if (activeTab === 'bags') {
    return (
      <div className="min-h-screen bg-gray-50">
        <PosterHeader 
          username={currentUser.username}
          displayPhoto={currentUser.displayPhoto}
          posterStats={posterStats} 
          onOpenMessages={handleOpenMessages}
        />
        <main className="max-w-md mx-auto pb-20">
          <MyBagsView onCreateItem={handleCreateItemClick} postedItems={postedItems} />
        </main>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} userType="poster" />
        {showCreateForm && (
          <CreateItemForm
            onClose={() => setShowCreateForm(false)}
            onSubmit={handleCreateItem}
          />
        )}
      </div>
    );
  }

  if (activeTab === 'profile') {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-md mx-auto pb-20">
          <ProfileView 
            username={currentUser.username}
            displayPhoto={currentUser.displayPhoto}
            onLogout={onLogout}
          />
        </main>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} userType="poster" />
      </div>
    );
  }

  if (activeTab === 'messages') {
    return (
      <div className="min-h-screen bg-gray-50">
        <PosterHeader 
          username={currentUser.username}
          displayPhoto={currentUser.displayPhoto}
          posterStats={posterStats} 
          onOpenMessages={handleOpenMessages}
        />
        <main className="max-w-md mx-auto pb-20">
          <MessagesView userType="poster" />
        </main>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} userType="poster" />
      </div>
    );
  }

  // Home tab (default) - shows statistics content
  return (
    <div className="min-h-screen bg-gray-50">
      <PosterHeader 
        username={currentUser.username}
        displayPhoto={currentUser.displayPhoto}
        posterStats={posterStats} 
        onOpenMessages={handleOpenMessages}
      />
      
      <main className="max-w-md mx-auto pb-20">
        <StatsView userType="poster" stats={posterStats} />
      </main>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} userType="poster" />
      
      {showCelebration && (
        <PointsCelebrationModal
          points={earnedPoints}
          onClose={handleCelebrationClose}
        />
      )}
    </div>
  );
}