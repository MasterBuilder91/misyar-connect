'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { Conversation, Profile, Message } from '../../types';

interface ConversationListProps {
  conversations: Conversation[];
  profiles: Record<string, Profile>;
  currentUserId: string;
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  lastReadMessages: Record<string, string>;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  profiles,
  currentUserId,
  selectedConversationId,
  onSelectConversation,
  lastReadMessages,
}) => {
  const { t } = useTranslation();
  const [sortedConversations, setSortedConversations] = useState<Conversation[]>([]);
  
  useEffect(() => {
    // Sort conversations by last message date
    const sorted = [...conversations].sort((a, b) => {
      const dateA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : new Date(a.createdAt).getTime();
      const dateB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
    
    setSortedConversations(sorted);
  }, [conversations]);
  
  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          {t('messages.noConversations')}
        </h3>
        <p className="text-gray-500 max-w-xs mx-auto">
          {t('messages.startByMatching')}
        </p>
      </div>
    );
  }
  
  const getOtherUserId = (conversation: Conversation): string => {
    return conversation.participants.find(id => id !== currentUserId) || '';
  };
  
  const isUnread = (conversation: Conversation): boolean => {
    if (!conversation.lastMessage) return false;
    
    const lastReadMessageId = lastReadMessages[conversation.id] || '';
    return conversation.lastMessage.id !== lastReadMessageId && conversation.lastMessage.senderId !== currentUserId;
  };
  
  const formatMessageTime = (message: Message | undefined): string => {
    if (!message) return '';
    
    const messageDate = new Date(message.createdAt);
    const now = new Date();
    
    // If today, show time
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If this week, show day name
    const diffDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise show date
    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="divide-y overflow-y-auto">
      {sortedConversations.map(conversation => {
        const otherUserId = getOtherUserId(conversation);
        const otherUserProfile = profiles[otherUserId];
        const unread = isUnread(conversation);
        
        if (!otherUserProfile) return null;
        
        return (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`p-4 cursor-pointer transition-colors ${
              selectedConversationId === conversation.id
                ? 'bg-teal-50'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <div className="relative flex-shrink-0 mr-3">
                {otherUserProfile.photoURL ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={otherUserProfile.photoURL}
                      alt={otherUserProfile.displayName}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                    <span className="text-teal-800 font-medium">
                      {otherUserProfile.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                
                {unread && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className={`text-sm font-medium truncate ${unread ? 'text-gray-900' : 'text-gray-700'}`}>
                    {otherUserProfile.displayName}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {formatMessageTime(conversation.lastMessage)}
                  </span>
                </div>
                
                <p className={`text-sm truncate ${
                  unread ? 'text-gray-900 font-medium' : 'text-gray-500'
                }`}>
                  {conversation.lastMessage 
                    ? conversation.lastMessage.content 
                    : t('messages.newMatch')}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
