// src/app/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { MatchCard } from '../components/matching/MatchCard';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getCurrentUser } from '../firebase/auth';
import { findPotentialMatches } from '../components/matching/MatchingAlgorithm';
import { UserProfile, RightsAdjustment, UserPreferences } from '../types/user';

export default function DashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [matches, setMatches] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const user = getCurrentUser();
        
        if (!user) {
          router.push('/auth');
          return;
        }
        
        // Get current user profile
        const userProfileDoc = await getDocs(query(
          collection(db, 'profiles'),
          where('uid', '==', user.uid)
        ));
        
        if (userProfileDoc.empty) {
          router.push('/profile/create');
          return;
        }
        
        const userProfile = userProfileDoc.docs[0].data() as UserProfile;
        
        // Get current user rights adjustments
        const userRightsDoc = await getDocs(query(
          collection(db, 'rightsAdjustments'),
          where('uid', '==', user.uid)
        ));
        
        if (userRightsDoc.empty) {
          router.push('/profile/create');
          return;
        }
        
        const userRights = userRightsDoc.docs[0].data() as RightsAdjustment;
        
        // Get current user preferences
        const userPreferencesDoc = await getDocs(query(
          collection(db, 'preferences'),
          where('uid', '==', user.uid)
        ));
        
        let userPreferences: UserPreferences = {
          ageRange: { min: 18, max: 65 },
          location: ['any'],
          religiousPractice: ['very practicing', 'moderately practicing', 'somewhat practicing']
        };
        
        if (!userPreferencesDoc.empty) {
          userPreferences = userPreferencesDoc.docs[0].data() as UserPreferences;
        }
        
        // Get potential matches
        const potentialMatchesQuery = query(
          collection(db, 'profiles'),
          where('gender', '!=', userProfile.gender)
        );
        
        const potentialMatchesSnapshot = await getDocs(potentialMatchesQuery);
        
        const potentialMatches: Array<UserProfile & { rightsAdjustment: RightsAdjustment }> = [];
        
        for (const doc of potentialMatchesSnapshot.docs) {
          const profile = doc.data() as UserProfile;
          
          // Skip if it's the current user
          if (profile.uid === user.uid) continue;
          
          // Get rights adjustments for this potential match
          const rightsDoc = await getDocs(query(
            collection(db, 'rightsAdjustments'),
            where('uid', '==', profile.uid)
          ));
          
          if (!rightsDoc.empty) {
            const rights = rightsDoc.docs[0].data() as RightsAdjustment;
            potentialMatches.push({
              ...profile,
              rightsAdjustment: rights
            });
          }
        }
        
        // Calculate matches
        const matchResults = findPotentialMatches(
          {
            ...userProfile,
            rightsAdjustment: userRights,
            preferences: userPreferences
          },
          potentialMatches
        );
        
        // Get full profile data for matches
        const matchesWithProfiles = await Promise.all(
          matchResults.map(async (match) => {
            const profileDoc = await getDocs(query(
              collection(db, 'profiles'),
              where('uid', '==', match.matchedUserId)
            ));
            
            if (!profileDoc.empty) {
              const profile = profileDoc.docs[0].data() as UserProfile;
              return {
                ...match,
                profile
              };
            }
            return null;
          })
        );
        
        setMatches(matchesWithProfiles.filter(Boolean));
      } catch (err: any) {
        setError(err.message || t('dashboard.fetchError'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMatches();
  }, [router, t]);
  
  const handleViewProfile = (userId: string) => {
    router.push(`/profile/${userId}`);
  };
  
  const handleExpressInterest = async (userId: string) => {
    try {
      const user = getCurrentUser();
      
      if (!user) {
        router.push('/auth');
        return;
      }
      
      // Create interest document
      await setDoc(doc(db, 'interests', `${user.uid}_${userId}`), {
        fromUserId: user.uid,
        toUserId: userId,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      // Update UI to reflect interest
      setMatches(prev => 
        prev.map(match => 
          match.profile.uid === userId 
            ? { ...match, hasExpressedInterest: true } 
            : match
        )
      );
    } catch (err: any) {
      setError(err.message || t('dashboard.interestError'));
    }
  };
  
  return (
    <main>
      <Navbar />
      
      <div className="py-16 bg-cream-50 min-h-screen">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {t('dashboard.title')}
          </h1>
          
          {error && (
            <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-700"></div>
            </div>
          ) : matches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match) => (
                <MatchCard
                  key={match.profile.uid}
                  user={{
                    id: match.profile.uid,
                    displayName: match.profile.displayName,
                    age: match.profile.age,
                    location: match.profile.location,
                    occupation: match.profile.occupation,
                    religiousPractice: match.profile.religiousPractice,
                    bio: match.profile.bio,
                    photoURL: match.profile.photoURL,
                  }}
                  compatibilityScore={match.compatibilityScore}
                  onViewProfile={() => handleViewProfile(match.profile.uid)}
                  onExpressInterest={() => handleExpressInterest(match.profile.uid)}
                  isBlurred={!match.hasExpressedInterest}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h2 className="text-xl font-medium text-gray-700 mb-2">{t('dashboard.noMatches')}</h2>
              <p className="text-gray-500 max-w-md mx-auto">{t('dashboard.noMatchesDescription')}</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
