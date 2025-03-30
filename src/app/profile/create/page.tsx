// src/app/profile/create/page.tsx
'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import ProfileForm from '../../components/profile/ProfileForm';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getCurrentUser } from '../../firebase/auth';

export default function CreateProfilePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');
    
    try {
      const user = getCurrentUser();
      
      if (!user) {
        router.push('/auth');
        return;
      }
      
      // Create profile document
      await setDoc(doc(db, 'profiles', user.uid), {
        uid: user.uid,
        displayName: data.displayName,
        age: data.age,
        gender: data.gender,
        location: data.location,
        occupation: data.occupation,
        religiousPractice: data.religiousPractice,
        bio: data.bio,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      // Create rights adjustment document
      await setDoc(doc(db, 'rightsAdjustments', user.uid), {
        uid: user.uid,
        adjustments: data.selectedRights.reduce((acc: any, right: string) => {
          acc[right] = true;
          return acc;
        }, {}),
        explanation: data.explanation || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      // Update user document to mark profile as complete
      await updateDoc(doc(db, 'users', user.uid), {
        isProfileComplete: true,
        profileCompletionPercentage: 100,
        updatedAt: new Date(),
      });
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || t('profile.createError'));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <main>
      <Navbar />
      
      <div className="py-16 bg-cream-50 min-h-screen">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {t('profile.createTitle')}
          </h1>
          
          {error && (
            <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <ProfileForm 
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
