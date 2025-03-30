'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { RightsSelector } from '../ui/RightsSelector';
import { useTranslation } from 'react-i18next';
import { Profile, RightsAdjustment } from '../../types';

type FormValues = {
  displayName: string;
  age: number;
  location: string;
  bio: string;
  education: string;
  occupation: string;
  religiousLevel: 'practicing' | 'moderate' | 'cultural';
  languages: string[];
  adjustedRights: string[];
  explanation: string;
};

const schema = z.object({
  displayName: z.string().min(3, 'Name must be at least 3 characters'),
  age: z.number().min(18, 'Must be at least 18 years old').max(100, 'Age must be reasonable'),
  location: z.string().min(2, 'Location is required'),
  bio: z.string().min(10, 'Bio must be at least 10 characters').max(500, 'Bio must be less than 500 characters'),
  education: z.string().optional(),
  occupation: z.string().optional(),
  religiousLevel: z.enum(['practicing', 'moderate', 'cultural']),
  languages: z.array(z.string()).min(1, 'At least one language is required'),
  adjustedRights: z.array(z.string()),
  explanation: z.string().min(20, 'Please provide a more detailed explanation').max(1000, 'Explanation must be less than 1000 characters'),
});

interface ProfileFormProps {
  gender: 'male' | 'female';
  onSubmit: (profile: Partial<Profile>, rightsAdjustment: Partial<RightsAdjustment>) => void;
  initialProfile?: Partial<Profile>;
  initialRightsAdjustment?: Partial<RightsAdjustment>;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  gender,
  onSubmit,
  initialProfile,
  initialRightsAdjustment,
}) => {
  const { t } = useTranslation();
  const [photoURL, setPhotoURL] = useState<string | undefined>(initialProfile?.photoURL);

  const { register, handleSubmit, formState: { errors }, control } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: initialProfile?.displayName || '',
      age: initialProfile?.age || 25,
      location: initialProfile?.location || '',
      bio: initialProfile?.bio || '',
      education: initialProfile?.education || '',
      occupation: initialProfile?.occupation || '',
      religiousLevel: initialProfile?.religiousLevel || 'practicing',
      languages: initialProfile?.languages || ['English'],
      adjustedRights: initialRightsAdjustment?.adjustedRights || [],
      explanation: initialRightsAdjustment?.explanation || '',
    },
  });

  const handleFormSubmit = (data: FormValues) => {
    const profile: Partial<Profile> = {
      displayName: data.displayName,
      age: data.age,
      location: data.location,
      bio: data.bio,
      education: data.education,
      occupation: data.occupation,
      religiousLevel: data.religiousLevel,
      languages: data.languages,
      photoURL,
      gender,
    };

    const rightsAdjustment: Partial<RightsAdjustment> = {
      gender,
      adjustedRights: data.adjustedRights,
      explanation: data.explanation,
    };

    onSubmit(profile, rightsAdjustment);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{t('profile.basicInfo')}</h2>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">{t('profile.name')}</label>
            <input
              {...register('displayName')}
              className="w-full p-2 border rounded-md"
              placeholder={t('profile.namePlaceholder')}
            />
            {errors.displayName && (
              <p className="text-red-500 text-sm mt-1">{errors.displayName.message}</p>
            )}
          </div>

          <div className="w-32">
            <label className="block text-sm font-medium mb-1">{t('profile.age')}</label>
            <input
              type="number"
              {...register('age', { valueAsNumber: true })}
              className="w-full p-2 border rounded-md"
            />
            {errors.age && (
              <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('profile.location')}</label>
          <input
            {...register('location')}
            className="w-full p-2 border rounded-md"
            placeholder={t('profile.locationPlaceholder')}
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('profile.bio')}</label>
          <textarea
            {...register('bio')}
            rows={4}
            className="w-full p-2 border rounded-md"
            placeholder={t('profile.bioPlaceholder')}
          />
          {errors.bio && (
            <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('profile.photo')}</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="w-full p-2 border rounded-md"
          />
          {photoURL && (
            <div className="mt-2">
              <img 
                src={photoURL} 
                alt="Profile preview" 
                className="w-24 h-24 object-cover rounded-full"
              />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{t('profile.additionalInfo')}</h2>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">{t('profile.education')}</label>
            <input
              {...register('education')}
              className="w-full p-2 border rounded-md"
              placeholder={t('profile.educationPlaceholder')}
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">{t('profile.occupation')}</label>
            <input
              {...register('occupation')}
              className="w-full p-2 border rounded-md"
              placeholder={t('profile.occupationPlaceholder')}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('profile.religiousLevel')}</label>
          <select
            {...register('religiousLevel')}
            className="w-full p-2 border rounded-md"
          >
            <option value="practicing">{t('profile.practicing')}</option>
            <option value="moderate">{t('profile.moderate')}</option>
            <option value="cultural">{t('profile.cultural')}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('profile.languages')}</label>
          <div className="flex flex-wrap gap-2">
            {['English', 'Arabic', 'Urdu', 'French', 'Turkish', 'Bahasa'].map((lang) => (
              <label key={lang} className="inline-flex items-center">
                <input
                  type="checkbox"
                  value={lang}
                  {...register('languages')}
                  className="mr-1"
                />
                {lang}
              </label>
            ))}
          </div>
          {errors.languages && (
            <p className="text-red-500 text-sm mt-1">{errors.languages.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{t('profile.rightsAdjustment')}</h2>
        <p className="text-gray-600">{t('profile.rightsDescription')}</p>

        <RightsSelector
          gender={gender}
          control={control}
          name="adjustedRights"
        />

        <div>
          <label className="block text-sm font-medium mb-1">{t('profile.explanation')}</label>
          <textarea
            {...register('explanation')}
            rows={4}
            className="w-full p-2 border rounded-md"
            placeholder={t('profile.explanationPlaceholder')}
          />
          {errors.explanation && (
            <p className="text-red-500 text-sm mt-1">{errors.explanation.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full">
        {initialProfile ? t('profile.updateProfile') : t('profile.createProfile')}
      </Button>
    </form>
  );
};
