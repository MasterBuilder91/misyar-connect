// src/app/components/matching/MatchCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CompatibilityIndicator } from '../ui/CompatibilityIndicator';
import { Button } from '../ui/Button';

interface MatchCardProps {
  user: {
    id: string;
    displayName: string;
    age: number;
    location: string;
    occupation: string;
    religiousPractice: string;
    bio: string;
    photoURL?: string;
  };
  compatibilityScore: number;
  onViewProfile: () => void;
  onExpressInterest: () => void;
  isBlurred?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  user,
  compatibilityScore,
  onViewProfile,
  onExpressInterest,
  isBlurred = true,
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative">
        {/* Profile Image */}
        <div className="h-48 bg-gray-200 relative">
          {user.photoURL ? (
            <div className={`w-full h-full ${isBlurred ? 'blur-md' : ''}`}>
              <img 
                src={user.photoURL} 
                alt={user.displayName} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
          
          {/* Compatibility Score */}
          <div className="absolute -bottom-6 right-4">
            <CompatibilityIndicator score={compatibilityScore} size="md" />
          </div>
        </div>
        
        {/* User Info */}
        <div className="p-6 pt-8">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{user.displayName}, {user.age}</h3>
              <p className="text-gray-600">{user.location}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500">{user.occupation}</p>
            <p className="text-sm text-gray-500">{t(`profile.${user.religiousPractice.replace(' ', '')}`)}</p>
          </div>
          
          <p className="text-gray-700 mb-6 line-clamp-3">
            {user.bio}
          </p>
          
          <div className="flex space-x-2">
            <Button 
              variant="secondary" 
              onClick={onViewProfile}
              className="flex-1"
            >
              {t('matches.viewProfile')}
            </Button>
            <Button 
              variant="primary" 
              onClick={onExpressInterest}
              className="flex-1"
            >
              {t('matches.expressInterest')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
