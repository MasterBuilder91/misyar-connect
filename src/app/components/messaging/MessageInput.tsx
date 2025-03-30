'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FirebaseError } from '../../types';

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
  placeholder?: string;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  placeholder = 'Type a message...',
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || disabled || isSending) {
      return;
    }
    
    setIsSending(true);
    setError(null);
    
    try {
      await onSendMessage(message.trim());
      setMessage('');
    } catch (err) {
      const firebaseError = err as FirebaseError;
      setError(firebaseError.message || t('messages.sendError'));
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="border-t p-3 bg-white">
      {error && (
        <div className="mb-2 text-sm text-red-600 p-2 bg-red-50 rounded">
          {error}
        </div>
      )}
      
      <div className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={disabled ? t('messages.conversationDisabled') : placeholder}
          disabled={disabled || isSending}
          className="flex-1 border rounded-l-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled || isSending}
          className={`bg-teal-600 text-white py-2 px-4 rounded-r-lg ${
            !message.trim() || disabled || isSending
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-teal-700'
          }`}
        >
          {isSending ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
};
