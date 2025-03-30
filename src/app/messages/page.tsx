'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ConversationList } from '../components/messaging/ConversationList';
import { MessageList } from '../components/messaging/MessageList';
import { MessageInput } from '../components/messaging/MessageInput';
import { getCurrentUser } from '../firebase/auth';
import { getConversations, getMessages, sendMessage, markConversationAsRead } from '../firebase/messaging';
import { Conversation, Message, Profile, FirebaseError } from '../types';

export default function MessagesPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ uid: string } | null>(null);
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [lastReadMessages, setLastReadMessages] = useState<Record<string, string>>({});
  
  // Check if user is authenticated
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser({ uid: user.uid });
    } else {
      // Redirect to login if not authenticated
      window.location.href = '/auth';
    }
  }, []);
  
  // Load conversations
  useEffect(() => {
    if (!currentUser) return;
    
    const loadConversations = async () => {
      try {
        setLoading(true);
        const result = await getConversations(currentUser.uid);
        setConversations(result.conversations);
        setProfiles(result.profiles);
        setLastReadMessages(result.lastReadMessages);
        
        // Select first conversation if none selected
        if (result.conversations.length > 0 && !selectedConversationId) {
          setSelectedConversationId(result.conversations[0].id);
        }
      } catch (err) {
        const firebaseError = err as FirebaseError;
        setError(firebaseError.message || t('messages.loadError'));
        console.error('Error loading conversations:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadConversations();
    
    // Set up real-time updates for conversations
    // This would typically use Firebase onSnapshot, but we're simplifying for this example
    const intervalId = setInterval(loadConversations, 30000);
    
    return () => clearInterval(intervalId);
  }, [currentUser, t]);
  
  // Load messages for selected conversation
  useEffect(() => {
    if (!currentUser || !selectedConversationId) return;
    
    const loadMessages = async () => {
      try {
        const messagesData = await getMessages(selectedConversationId);
        setMessages(messagesData);
        
        // Mark conversation as read
        await markConversationAsRead(selectedConversationId, currentUser.uid);
        
        // Update last read message in state
        if (messagesData.length > 0) {
          setLastReadMessages(prev => ({
            ...prev,
            [selectedConversationId]: messagesData[messagesData.length - 1].id
          }));
        }
      } catch (err) {
        const firebaseError = err as FirebaseError;
        console.error('Error loading messages:', firebaseError);
      }
    };
    
    loadMessages();
    
    // Set up real-time updates for messages
    // This would typically use Firebase onSnapshot, but we're simplifying for this example
    const intervalId = setInterval(loadMessages, 10000);
    
    return () => clearInterval(intervalId);
  }, [currentUser, selectedConversationId]);
  
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };
  
  const handleSendMessage = async (content: string) => {
    if (!currentUser || !selectedConversationId) return;
    
    try {
      await sendMessage({
        conversationId: selectedConversationId,
        senderId: currentUser.uid,
        content
      });
      
      // Refresh messages
      const messagesData = await getMessages(selectedConversationId);
      setMessages(messagesData);
      
      // Update last read message
      if (messagesData.length > 0) {
        setLastReadMessages(prev => ({
          ...prev,
          [selectedConversationId]: messagesData[messagesData.length - 1].id
        }));
      }
    } catch (err) {
      const firebaseError = err as FirebaseError;
      throw firebaseError;
    }
  };
  
  const getSelectedConversation = (): Conversation | undefined => {
    return conversations.find(c => c.id === selectedConversationId);
  };
  
  const getOtherUserProfile = (): Profile | undefined => {
    const conversation = getSelectedConversation();
    if (!conversation || !currentUser) return undefined;
    
    const otherUserId = conversation.participants.find(id => id !== currentUser.uid);
    if (!otherUserId) return undefined;
    
    return profiles[otherUserId];
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isAuthenticated={!!currentUser} />
      
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="md:grid md:grid-cols-3 md:divide-x h-[calc(100vh-10rem)]">
              {/* Conversations List */}
              <div className="md:col-span-1 border-b md:border-b-0">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">{t('messages.conversations')}</h2>
                </div>
                
                {loading && conversations.length === 0 ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
                    <p className="mt-2 text-gray-500">{t('messages.loading')}</p>
                  </div>
                ) : error ? (
                  <div className="p-4 text-center text-red-500">
                    <p>{error}</p>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="mt-2 text-teal-600 hover:underline"
                    >
                      {t('common.retry')}
                    </button>
                  </div>
                ) : (
                  <ConversationList
                    conversations={conversations}
                    profiles={profiles}
                    currentUserId={currentUser?.uid || ''}
                    selectedConversationId={selectedConversationId || undefined}
                    onSelectConversation={handleSelectConversation}
                    lastReadMessages={lastReadMessages}
                  />
                )}
              </div>
              
              {/* Messages */}
              <div className="md:col-span-2 flex flex-col h-full">
                {selectedConversationId && getOtherUserProfile() ? (
                  <>
                    <div className="p-4 border-b flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        {getOtherUserProfile()?.photoURL ? (
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img
                              src={getOtherUserProfile()?.photoURL}
                              alt={getOtherUserProfile()?.displayName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                            <span className="text-teal-800 font-medium">
                              {getOtherUserProfile()?.displayName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{getOtherUserProfile()?.displayName}</h3>
                        <p className="text-sm text-gray-500">
                          {getOtherUserProfile()?.location}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-hidden flex flex-col">
                      <MessageList
                        messages={messages}
                        currentUserId={currentUser?.uid || ''}
                        conversation={getSelectedConversation() as Conversation}
                        otherUserProfile={{
                          displayName: getOtherUserProfile()?.displayName || '',
                          photoURL: getOtherUserProfile()?.photoURL
                        }}
                      />
                      
                      <MessageInput
                        onSendMessage={handleSendMessage}
                        placeholder={t('messages.typePlaceholder')}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full p-6 text-center">
                    <div>
                      <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {t('messages.selectConversation')}
                      </h3>
                      <p className="text-gray-500 max-w-sm mx-auto">
                        {conversations.length > 0 
                          ? t('messages.selectFromLeft')
                          : t('messages.noConversationsYet')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
