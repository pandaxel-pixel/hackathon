import React from 'react';
import Header from './Header';
import Navigation from './Navigation';
import MapView from './MapView';
import StatsView from './StatsView';
import PendingPickupsView from './PendingPickupsView';
import CollectorProfileView from './CollectorProfileView';
import { useRecyclerApp } from '../hooks/useRecyclerApp';
import { User } from '../types';

interface CollectorAppProps {
  currentUser: User;
  onLogout: () => void;
}

export default function CollectorApp({ currentUser, onLogout }: CollectorAppProps) {
  const {
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
  } = useRecyclerApp(currentUser);

  if (activeTab === 'map') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          username={currentUser.username}
          displayPhoto={currentUser.displayPhoto}
          userStats={userStats} 
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
        />
        <main className="max-w-md mx-auto pb-20">
          <PendingPickupsView 
            pendingPickups={pendingPickups}
            onCompletePickup={completePickup}
            onCancelPickup={cancelPickup}
            items={items}
            isLoading={isLoading}
            onAccept={acceptItem}
            onReject={rejectItem}
            onRefresh={refreshItems}
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
        />
        <main className="max-w-md mx-auto pb-20">
          <StatsView userType="collector" stats={userStats} />
        </main>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} userType="collector" />
      </div>
    );
  }

  if (activeTab === 'profile') {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-md mx-auto pb-20">
          <CollectorProfileView 
            username={currentUser.username}
            displayPhoto={currentUser.displayPhoto}
            onLogout={onLogout}
          />
        </main>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} userType="collector" />
      </div>
    );
  }

  // Default view (items) - now handled in PendingPickupsView
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        username={currentUser.username}
        displayPhoto={currentUser.displayPhoto}
        userStats={userStats} 
      />
      
      <main className="max-w-md mx-auto pb-20">
        <PendingPickupsView 
          pendingPickups={pendingPickups}
          onCompletePickup={completePickup}
          onCancelPickup={cancelPickup}
          items={items}
          isLoading={isLoading}
          onAccept={acceptItem}
          onReject={rejectItem}
          onRefresh={refreshItems}
        />
      </main>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} userType="collector" />
    </div>
  );
}