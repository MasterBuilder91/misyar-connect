'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { Message, Conversation } from '../../types';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  conversation: Conversation;
  otherUserProfile: {
    displayName: string;
    photoURL?: string;
  };
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  conversation,
  otherUserProfile,
}) => {
  const { t } = useTranslation();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          {t('messages.startConversation')}
        </h3>
        <p className="text-gray-500 max-w-sm">
          {t('messages.noMessagesYet', { name: otherUserProfile.displayName })}
        </p>
      </div>
    );
  }
  
  // Group messages by date
  const groupedMessages: { [key: string]: Message[] } = {};
  
  messages.forEach(message => {
    const date = new Date(message.createdAt).toLocaleDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });
  
  return (
    <div className="flex flex-col h-full overflow-y-auto p-4">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="mb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-200 rounded-full px-3 py-1 text-xs text-gray-600">
              {date}
            </div>
          </div>
          
          {dateMessages.map(message => {
            const isCurrentUser = message.senderId === currentUserId;
            
            return (
              <div 
                key={message.id} 
                className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isCurrentUser && (
                  <div className="flex-shrink-0 mr-2">
                    {otherUserProfile.photoURL ? (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden">
                        <Image
                          src={otherUserProfile.photoURL}
                          alt={otherUserProfile.displayName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                        <span className="text-teal-800 font-medium text-sm">
                          {otherUserProfile.displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                <div 
                  className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                    isCurrentUser 
                      ? 'bg-teal-600 text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  <p>{message.content}</p>
                  <div 
                    className={`text-xs mt-1 ${
                      isCurrentUser ? 'text-teal-200' : 'text-gray-500'
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
