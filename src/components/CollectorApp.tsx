import React from 'react';
import Header from './Header';
import ItemCard from './ItemCard';
import Navigation from './Navigation';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';
import MapView from './MapView';
import StatsView from './StatsView';
import MessagesView from './MessagesView';
import { useRecyclerApp } from '../hooks/useRecyclerApp';

export default function CollectorApp() {
  const {
    currentItem,
    userStats,
    activeTab,
    isLoading,
    acceptItem,
    rejectItem,
    refreshItems,
    setActiveTab
  } = useRecyclerApp();

  if (activeTab === 'map') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header userStats={userStats} />
        <main className="max-w-md mx-auto pb-20">
          <MapView userType="collector" />
        </main>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} userType="collector" />
      </div>
    );
  }

  if (activeTab === 'stats') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header userStats={userStats} />
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
        <Header userStats={userStats} />
        <main className="max-w-md mx-auto pb-20">
          <MessagesView userType="collector" />
        </main>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} userType="collector" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userStats={userStats} />
      
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