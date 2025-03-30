// src/app/types/user.ts
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  age: number;
  gender: 'male' | 'female';
  location: string;
  occupation: string;
  religiousPractice: 'very practicing' | 'moderately practicing' | 'somewhat practicing';
  bio: string;
  createdAt: Date;
  updatedAt: Date;
  isProfileComplete: boolean;
  profileCompletionPercentage: number;
}

export interface RightsAdjustment {
  livingTogether: boolean;
  financialMaintenance: boolean;
  equalTimeDivision: boolean;
  housingProvision: boolean;
  regularVisitation: boolean;
  publicAnnouncement: boolean;
  physicalIntimacy: boolean;
  childBearing: boolean;
  explanation: string;
}

export interface UserPreferences {
  ageRange: {
    min: number;
    max: number;
  };
  location: string[];
  education: string[];
  religiousPractice: ('very practicing' | 'moderately practicing' | 'somewhat practicing')[];
  marriageTimeline: string;
}

export interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  compatibilityScore: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: Date;
}
