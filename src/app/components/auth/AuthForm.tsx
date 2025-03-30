'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';

type AuthMode = 'login' | 'signup' | 'forgotPassword';

interface AuthFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<AuthMode>('login');

  const loginSchema = z.object({
    email: z.string().email(t('validation.emailRequired')),
    password: z.string().min(6, t('validation.passwordLength')),
  });

  const signupSchema = z.object({
    email: z.string().email(t('validation.emailRequired')),
    password: z.string().min(6, t('validation.passwordLength')),
    confirmPassword: z.string().min(6, t('validation.passwordLength')),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('validation.passwordsMatch'),
    path: ['confirmPassword'],
  });

  const forgotPasswordSchema = z.object({
    email: z.string().email(t('validation.emailRequired')),
  });

  const activeSchema =
    mode === 'login' ? loginSchema :
    mode === 'signup' ? signupSchema :
    forgotPasswordSchema;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(activeSchema),
  });

  const handleFormSubmit = (data: any) => {
    onSubmit({ ...data, mode });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-card p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {mode === 'login' ? t('auth.login') :
           mode === 'signup' ? t('auth.createAccount') :
           t('auth.forgotPassword')}
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.email')}
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message as string}</p>
            )}
          </div>

          {/* Password */}
          {(mode === 'login' || mode === 'signup') && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.password')}
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message as string}</p>
              )}
            </div>
          )}

          {/* Confirm Password */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.confirmPassword')}
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message as string}</p>
              )}
            </div>
          )}

          {/* Forgot Password Link */}
          {mode === 'login' && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setMode('forgotPassword')}
                className="text-sm text-teal-700 hover:text-teal-800"
              >
                {t('auth.forgotPassword')}
              </button>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3
