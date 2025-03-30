// src/app/auth/page.tsx
'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { AuthForm } from '../components/auth/AuthForm';
import { signUp, signIn, resetPassword } from '../firebase/auth';

export default function AuthPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (data.mode === 'signup') {
        const result = await signUp(data.email, data.password, data.email.split('@')[0]);
        if (result.success) {
          setSuccess(t('auth.signupSuccess'));
          router.push('/profile/create');
        } else {
          setError(result.error || t('auth.genericError'));
        }
      } else if (data.mode === 'login') {
        const result = await signIn(data.email, data.password);
        if (result.success) {
          router.push('/dashboard');
        } else {
          setError(result.error || t('auth.genericError'));
        }
      } else if (data.mode === 'forgotPassword') {
        const result = await resetPassword(data.email);
        if (result.success) {
          setSuccess(t('auth.resetEmailSent'));
        } else {
          setError(result.error || t('auth.genericError'));
        }
      }
    } catch (err: any) {
      setError(err.message || t('auth.genericError'));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <main>
      <Navbar />
      
      <div className="py-16 bg-cream-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                {success}
              </div>
            )}
            
            <AuthForm 
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
