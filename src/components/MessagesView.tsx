import React, { useState } from 'react';
import { MessageCircle, Send, User, Clock, CheckCircle2 } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isFromUser: boolean;
  status: 'sent' | 'delivered' | 'read';
  avatar?: string;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  avatar?: string;
  type: 'collector' | 'poster';
}

interface MessagesViewProps {
  userType: 'collector' | 'poster';
}

export default function MessagesView({ userType }: MessagesViewProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const mockConversations: Conversation[] = [
    {
      id: '1',
      name: userType === 'collector' ? 'María González' : 'Carlos Recolector',
      lastMessage: userType === 'collector' 
        ? '¿A qué hora puedes pasar por las botellas?' 
        : 'Perfecto, paso en 30 minutos',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      unread: 2,
      type: userType === 'collector' ? 'poster' : 'collector'
    },
    {
      id: '2',
      name: userType === 'collector' ? 'Roberto Silva' : 'Ana Recolectora',
      lastMessage: userType === 'collector'
        ? 'Gracias por recoger el cartón tan rápido'
        : '¿Tienes más elementos disponibles?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      unread: 0,
      type: userType === 'collector' ? 'poster' : 'collector'
    },
    {
      id: '3',
      name: userType === 'collector' ? 'Laura Martínez' : 'Diego Recolector',
      lastMessage: userType === 'collector'
        ? 'El metal está listo para recoger'
        : 'Excelente trabajo, 5 estrellas',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      unread: 1,
      type: userType === 'collector' ? 'poster' : 'collector'
    }
  ];

  const mockMessages: Message[] = [
    {
      id: '1',
      sender: userType === 'collector' ? 'María González' : 'Carlos Recolector',
      content: userType === 'collector' 
        ? 'Hola! Vi que aceptaste mis botellas PET. ¿Cuándo puedes pasar?'
        : 'Hola! Acepté tu publicación de botellas PET',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isFromUser: false,
      status: 'read'
    },
    {
      id: '2',
      sender: 'Tú',
      content: userType === 'collector'
        ? 'Hola María! Puedo pasar en aproximadamente 30 minutos. ¿Te parece bien?'
        : 'Perfecto! Estaré disponible toda la tarde',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      isFromUser: true,
      status: 'read'
    },
    {
      id: '3',
      sender: userType === 'collector' ? 'María González' : 'Carlos Recolector',
      content: userType === 'collector'
        ? 'Perfecto! Te espero. Las botellas están en bolsas azules junto a la puerta'
        : 'Genial, las botellas están listas. Son 14 botellas limpias',
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      isFromUser: false,
      status: 'read'
    },
    {
      id: '4',
      sender: 'Tú',
      content: userType === 'collector'
        ? 'Excelente, ya voy en camino. Llego en 10 minutos'
        : 'Perfecto, te doy 5 estrellas por la calidad',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      isFromUser: true,
      status: 'delivered'
    },
    {
      id: '5',
      sender: userType === 'collector' ? 'María González' : 'Carlos Recolector',
      content: userType === 'collector'
        ? '¿A qué hora puedes pasar por las botellas?'
        : 'Perfecto, paso en 30 minutos',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isFromUser: false,
      status: 'sent'
    }
  ];

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m`;
    }
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In real app, send message to backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <CheckCircle2 className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCircle2 className="w-3 h-3 text-blue-500" />;
      case 'read':
        return <CheckCircle2 className="w-3 h-3 text-green-500" />;
    }
  };

  if (selectedConversation) {
    const conversation = mockConversations.find(c => c.id === selectedConversation);
    
    return (
      <div className="h-full flex flex-col">
        {/* Chat Header */}
        <div className={`${userType === 'collector' ? 'bg-green-600' : 'bg-blue-600'} text-white p-4`}>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setSelectedConversation(null)}
              className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded"
            >
              ←
            </button>
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{conversation?.name}</h3>
              <p className="text-sm opacity-90">
                {conversation?.type === 'collector' ? 'Recolector' : 'Publicador'}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {mockMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.isFromUser
                  ? `${userType === 'collector' ? 'bg-green-500' : 'bg-blue-500'} text-white`
                  : 'bg-white text-gray-900 shadow-sm'
              }`}>
                <p className="text-sm">{message.content}</p>
                <div className={`flex items-center justify-end space-x-1 mt-1 ${
                  message.isFromUser ? 'text-white text-opacity-70' : 'text-gray-500'
                }`}>
                  <span className="text-xs">{formatTime(message.timestamp)}</span>
                  {message.isFromUser && getStatusIcon(message.status)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className={`${userType === 'collector' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white p-3 rounded-full transition-colors`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Messages Header */}
      <div className={`${userType === 'collector' ? 'bg-green-600' : 'bg-blue-600'} text-white p-4`}>
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-6 h-6" />
          <div>
            <h2 className="text-lg font-bold">Mensajes</h2>
            <p className="text-sm opacity-90">
              {userType === 'collector' ? 'Coordina tus recolecciones' : 'Habla con recolectores'}
            </p>
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="bg-gray-50 h-full">
        {mockConversations.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No hay mensajes
            </h3>
            <p className="text-gray-600">
              {userType === 'collector' 
                ? 'Acepta elementos para comenzar a chatear con publicadores'
                : 'Publica elementos para conectar con recolectores'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {mockConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className="w-full p-4 text-left hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    {conversation.unread > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {conversation.unread}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {conversation.name}
                      </h3>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(conversation.timestamp)}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {conversation.lastMessage}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        conversation.type === 'collector' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {conversation.type === 'collector' ? 'Recolector' : 'Publicador'}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}