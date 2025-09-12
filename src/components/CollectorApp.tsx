import React from 'react';
import Header from './Header';
import ItemCard from './ItemCard';
import Navigation from './Navigation';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';
import MapView from './MapView';
import StatsView from './StatsView';
import MessagesView from './MessagesView';
import PendingPickupsView from './PendingPickupsView';
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

  if (activeTab === 'map') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          username={currentUser.username}
          displayPhoto={currentUser.displayPhoto}
          userStats={userStats} 
          onLogout={onLogout}
        />
        <main className="max-w-md mx-auto pb-20">
          <MapView userType="collector" />
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
          onLogout={onLogout}
        />
        <main className="max-w-md mx-auto pb-20">
          <PendingPickupsView 
            pendingPickups={pendingPickups}
            onCompletePickup={completePickup}
            onCancelPickup={cancelPickup}
          />
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
          onLogout={onLogout}
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
          onLogout={onLogout}
        />
        <main className="max-w-md mx-auto pb-20">
          <MessagesView userType="collector" />
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
        onLogout={onLogout}
      />
      
      <main className="p-4 max-w-md mx-auto pb-20">
        {isLoading ? (
          <LoadingSpinner />
        ) : currentItem ? (
          <ItemCard 
            item={currentItem}
            onAccept={acceptItem}
            onReject={rejectItem}
          />
        ) : (
          <EmptyState onRefresh={refreshItems} />
        )}
      </main>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} userType="collector" />
    </div>
  );
}