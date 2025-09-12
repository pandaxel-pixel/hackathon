import React from 'react';
import Header from './Header';
import ItemCard from './ItemCard';
import Navigation from './Navigation';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';
import MyBagsView from './MyBagsView';
import StatsView from './StatsView';
import MessagesView from './MessagesView';
import RankingView from './RankingView';
import ProfileView from './ProfileView';
import { useRecyclerApp } from '../hooks/useRecyclerApp';
import { User } from '../types';

interface CollectorAppProps {
  currentUser: User;
  onLogout: () => void;
}

export default function CollectorApp({ currentUser, onLogout }: CollectorAppProps) {
  const {
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
  } = useRecyclerApp();

  const handleOpenMessages = () => {
    setActiveTab('chat');
  };

  const handleCreateBag = () => {
    // For collectors, this could open a form to create a new collection bag
    console.log('Create new bag');
  };

  if (activeTab === 'items') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          username={currentUser.username}
          displayPhoto={currentUser.displayPhoto}
          userStats={userStats} 
          onOpenMessages={handleOpenMessages}
        />
        <main className="max-w-md mx-auto pb-20">
          <MyBagsView 
            onCreateBag={handleCreateBag}
          />
        </main>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} userType="collector" />
      </div>
    );
  }

  if (activeTab === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          username={currentUser.username}
          displayPhoto={currentUser.displayPhoto}
          userStats={userStats} 
          onOpenMessages={handleOpenMessages}
        />
        <main className="max-w-md mx-auto pb-20">
          <RankingView posterStats={{ totalPoints: 2850, pointsThisWeek: 180, totalPosts: 45, rating: 4.8 }} />
        </main>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} userType="collector" />
      </div>
    );
  }

  if (activeTab === 'stats') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          username={currentUser.username}
          displayPhoto={currentUser.displayPhoto}
          userStats={userStats} 
          onOpenMessages={handleOpenMessages}
        />
        <main className="max-w-md mx-auto pb-20">
          <StatsView userType="collector" stats={userStats} />
        </main>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} userType="collector" />
      </div>
    );
  }

  if (activeTab === 'chat') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          username={currentUser.username}
          displayPhoto={currentUser.displayPhoto}
          userStats={userStats} 
          onOpenMessages={handleOpenMessages}
        />
        <main className="max-w-md mx-auto pb-20">
          <MessagesView userType="collector" />
        </main>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} userType="collector" />
      </div>
    );
  }

  if (activeTab === 'profile') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          username={currentUser.username}
          displayPhoto={currentUser.displayPhoto}
          userStats={userStats} 
          onOpenMessages={handleOpenMessages}
        />
        <main className="max-w-md mx-auto pb-20">
          <ProfileView currentUser={currentUser} onLogout={onLogout} />
        </main>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} userType="collector" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        username={currentUser.username}
        displayPhoto={currentUser.displayPhoto}
        userStats={userStats} 
        onOpenMessages={handleOpenMessages}
      />
      
      <main className="max-w-md mx-auto pb-20">
        {isLoading ? (
          <div className="p-4">
            <LoadingSpinner />
          </div>
        ) : currentItem ? (
          <div className="p-4">
            <ItemCard 
              item={currentItem}
              onAccept={acceptItem}
              onReject={rejectItem}
            />
          </div>
        ) : (
          <div className="p-4">
            <EmptyState onRefresh={refreshItems} />
          </div>
        )}
      </main>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} userType="collector" />
    </div>
  );
}