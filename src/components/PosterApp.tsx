import React, { useState } from 'react';
import PosterHeader from './PosterHeader';
import CreateItemForm from './CreateItemForm';
import PostedItemCard from './PostedItemCard';
import Navigation from './Navigation';
import RankingView from './RankingView';
import StatsView from './StatsView';
import MessagesView from './MessagesView';
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
  const [activeTab, setActiveTab] = useState('items');

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
    if (activeTab !== 'items') {
      setActiveTab('items');
    }
    setShowCreateForm(true);
  };

  if (activeTab === 'map') {
    return (
      <div className="min-h-screen bg-gray-50">
        <PosterHeader 
          username={currentUser.username}
          displayPhoto={currentUser.displayPhoto}
          posterStats={posterStats} 
          onCreateItem={handleCreateItemClick} 
          onLogout={onLogout}
        />
        <main className="max-w-md mx-auto pb-20">
          <RankingView posterStats={posterStats} />
        </main>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} userType="poster" />
      </div>
    );
  }

  if (activeTab === 'stats') {
    return (
      <div className="min-h-screen bg-gray-50">
        <PosterHeader 
          username={currentUser.username}
          displayPhoto={currentUser.displayPhoto}
          posterStats={posterStats} 
          onCreateItem={handleCreateItemClick} 
          onLogout={onLogout}
        />
        <main className="max-w-md mx-auto pb-20">
          <StatsView userType="poster" stats={posterStats} />
        </main>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} userType="poster" />
      </div>
    );
  }

  if (activeTab === 'chat') {
    return (
      <div className="min-h-screen bg-gray-50">
        <PosterHeader 
          username={currentUser.username}
          displayPhoto={currentUser.displayPhoto}
          posterStats={posterStats} 
          onCreateItem={handleCreateItemClick} 
          onLogout={onLogout}
        />
        <main className="max-w-md mx-auto pb-20">
          <MessagesView userType="poster" />
        </main>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} userType="poster" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PosterHeader 
        username={currentUser.username}
        displayPhoto={currentUser.displayPhoto}
        posterStats={posterStats} 
        onCreateItem={handleCreateItemClick} 
        onLogout={onLogout}
      />
      
      <main className="p-4 max-w-md mx-auto pb-20">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Mis publicaciones</h2>
          <p className="text-gray-600 text-sm">
            Gestiona tus elementos publicados para reciclaje
          </p>
        </div>

        {postedItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📦</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No tienes publicaciones
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza publicando tu primer elemento para reciclar
            </p>
            <button
              onClick={handleCreateItemClick}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200"
            >
              Publicar elemento
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {postedItems.map((item) => (
              <PostedItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
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