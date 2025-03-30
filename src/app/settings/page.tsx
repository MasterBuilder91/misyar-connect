// src/app/settings/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getCurrentUser, signOut } from '../firebase/auth';

export default function SettingsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [preferences, setPreferences] = useState<any>({
    ageRange: { min: 18, max: 65 },
    location: ['any'],
    religiousPractice: ['very practicing', 'moderately practicing', 'somewhat practicing']
  });
  
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const user = getCurrentUser();
        
        if (!user) {
          router.push('/auth');
          return;
        }
        
        // Get profile
        const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
        
        if (profileDoc.exists()) {
          setProfile(profileDoc.data());
        } else {
          router.push('/profile/create');
          return;
        }
        
        // Get preferences
        const preferencesDoc = await getDoc(doc(db, 'preferences', user.uid));
        
        if (preferencesDoc.exists()) {
          setPreferences(preferencesDoc.data());
        }
      } catch (err: any) {
        setError(err.message || t('settings.fetchError'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [router, t]);
  
  const handlePreferenceChange = (field: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSavePreferences = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const user = getCurrentUser();
      
      if (!user) {
        router.push('/auth');
        return;
      }
      
      // Update preferences
      await updateDoc(doc(db, 'preferences', user.uid), preferences);
      
      setSuccess(t('settings.preferencesUpdated'));
    } catch (err: any) {
      setError(err.message || t('settings.updateError'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (err: any) {
      setError(err.message || t('settings.logoutError'));
    }
  };
  
  return (
    <main>
      <Navbar />
      
      <div className="py-16 bg-cream-50 min-h-screen">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {t('settings.title')}
          </h1>
          
          {error && (
            <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          {success && (
            <div className="max-w-2xl mx-auto bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-700"></div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              {/* Account Settings */}
              <div className="bg-white rounded-xl shadow-md p-8 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {t('settings.accountSettings')}
                </h2>
                
                <div className="flex items-center mb-6">
                  <div className="h-16 w-16 rounded-full overflow-hidden mr-4">
                    {profile?.photoURL ? (
                      <img 
                        src={profile.photoURL} 
                        alt={profile.displayName} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                        <span className="text-lg text-gray-500">{profile?.displayName.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{profile?.displayName}</h3>
                    <p className="text-gray-500">{profile?.email}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button
                    variant="secondary"
                    onClick={() => router.push('/profile/edit')}
                    className="w-full"
                  >
                    {t('settings.editProfile')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full"
                  >
                    {t('settings.logout')}
                  </Button>
                </div>
              </div>
              
              {/* Matching Preferences */}
              <div className="bg-white rounded-xl shadow-md p-8 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {t('settings.matchingPreferences')}
                </h2>
                
                <div className="space-y-6">
                  {/* Age Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('settings.ageRange')}
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        min="18"
                        max="80"
                        value={preferences.ageRange.min}
                        onChange={(e) => handlePreferenceChange('ageRange', {
                          ...preferences.ageRange,
                          min: parseInt(e.target.value)
                        })}
                        className="w-20 rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="number"
                        min="18"
                        max="80"
                        value={preferences.ageRange.max}
                        onChange={(e) => handlePreferenceChange('ageRange', {
                          ...preferences.ageRange,
                          max: parseInt(e.target.value)
                        })}
                        className="w-20 rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('settings.location')}
                    </label>
                    <select
                      multiple
                      value={preferences.location}
                      onChange={(e) => {
                        const options = Array.from(e.target.selectedOptions, option => option.value);
                        handlePreferenceChange('location', options);
                      }}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    >
                      <option value="any">{t('settings.anyLocation')}</option>
                      <option value="Saudi Arabia">{t('locations.saudiArabia')}</option>
                      <option value="UAE">{t('locations.uae')}</option>
                      <option value="Qatar">{t('locations.qatar')}</option>
                      <option value="Kuwait">{t('locations.kuwait')}</option>
                      <option value="Bahrain">{t('locations.bahrain')}</option>
                      <option value="Oman">{t('locations.oman')}</option>
                      <option value="Egypt">{t('locations.egypt')}</option>
                      <option value="Jordan">{t('locations.jordan')}</option>
                      <option value="Turkey">{t('locations.turkey')}</option>
                      <option value="Malaysia">{t('locations.malaysia')}</option>
                      <option value="Indonesia">{t('locations.indonesia')}</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                      {t('settings.holdCtrl')}
                    </p>
                  </div>
                  
                  {/* Religious Practice */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('settings.religiousPractice')}
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences.religiousPractice.includes('very practicing')}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...preferences.religiousPractice, 'very practicing']
                              : preferences.religiousPractice.filter((p: string) => p !== 'very practicing');
                            handlePreferenceChange('religiousPractice', newValue);
                          }}
                          className="h-4 w-4 text-teal-700 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <span className="ml-2">{t('profile.veryPracticing')}</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences.religiousPractice.includes('moderately practicing')}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...preferences.religiousPractice, 'moderately practicing']
                              : preferences.religiousPractice.filter((p: string) => p !== 'moderately practicing');
                            handlePreferenceChange('religiousPractice', newValue);
                          }}
                          className="h-4 w-4 text-teal-700 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <span className="ml-2">{t('profile.moderatelyPracticing')}</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences.religiousPractice.includes('somewhat practicing')}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...preferences.religiousPractice, 'somewhat practicing']
                              : preferences.religiousPractice.filter((p: string) => p !== 'somewhat practicing');
                            handlePreferenceChange('religiousPractice', newValue);
                          }}
                          className="h-4 w-4 text-teal-700 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <span className="ml-2">{t('profile.somewhatPracticing')}</span>
                      </label>
                    </div>
                  </div>
                  
                  <Button
                    variant="primary"
                    onClick={handleSavePreferences}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? t('common.saving') : t('common.saveChanges')}
                  </Button>
                </div>
              </div>
              
              {/* Privacy Settings */}
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {t('settings.privacySettings')}
                </h2>
                
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.privacy?.hideProfile || false}
                      onChange={(e) => {
                        handlePreferenceChange('privacy', {
                          ...preferences.privacy,
                          hideProfile: e.target.checked
                        });
                      }}
                      className="h-4 w-4 text-teal-700 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="ml-2">{t('settings.hideProfile')}</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.privacy?.blurPhotos || true}
                      onChange={(e) => {
                        handlePreferenceChange('privacy', {
                          ...preferences.privacy,
                          blurPhotos: e.target.checked
                        });
                      }}
                      className="h-4 w-4 text-teal-700 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="ml-2">{t('settings.blurPhotos')}</span>
                  </label>
                  
                  <Button
                    variant="primary"
                    onClick={handleSavePreferences}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? t('common.saving') : t('common.saveChanges')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
