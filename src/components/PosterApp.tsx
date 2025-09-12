import React, { useState } from 'react';
import PosterHeader from './PosterHeader';
import CreateItemForm from './CreateItemForm';
import PostedItemCard from './PostedItemCard';
import Navigation from './Navigation';
import RankingView from './RankingView';
import StatsView from './StatsView';
import MessagesView from './MessagesView';
import MyBagsView from './MyBagsView';
import ProfileView from './ProfileView';
import { PostedItem, RecyclableItem, PosterStats } from '../types';
import { mockPosterStats, mockPostedItems } from '../data/mockData';
import { User } from '../types';

interface PosterAppProps {
  currentUser: User;
  onLogout: () => void;
}

export default function PosterApp({ currentUser, onLogout }: PosterAppProps) {
  const [posterStats] = useState<PosterStats>(mockPosterStats);
  const [postedItems, setPostedItems] = useState<PostedItem[]>(mockPostedItems);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const handleCreateItem = (itemData: Omit<RecyclableItem, 'id' | 'postedAt'>) => {
    const newItem: PostedItem = {
      ...itemData,
      id: Date.now().toString(),
      postedAt: new Date(),
      status: 'active'
    };
    
    setPostedItems(prev => [newItem, ...prev]);
    setShowCreateForm(false);
    
    // Simulate earning points for posting
    // In real app, this would be handled by backend
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
          <MyBagsView onCreateItem={handleCreateItemClick} />
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
        <StatsView 
          userType="poster" 
          stats={posterStats} 
          onQuickAction={(action) => setActiveTab(action)}
        />
      </main>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} userType="poster" />
    </div>
  );
}