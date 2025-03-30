// src/app/types/index.ts
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
}

export interface Profile {
  uid: string;
  displayName: string;
  gender: 'male' | 'female';
  age: number;
  location: string;
  bio: string;
  photoURL?: string;
  education?: string;
  occupation?: string;
  religiousLevel?: 'practicing' | 'moderate' | 'cultural';
  languages: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RightsAdjustment {
  uid: string;
  gender: 'male' | 'female';
  adjustedRights: string[];
  explanation: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  createdAt: Date;
  updatedAt: Date;
}

export interface Match {
  id: string;
  users: string[];
  status: 'pending' | 'accepted' | 'rejected';
  compatibilityScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Preference {
  uid: string;
  ageRange: {
    min: number;
    max: number;
  };
  locations: string[];
  religiousLevel?: 'practicing' | 'moderate' | 'cultural';
  createdAt: Date;
  updatedAt: Date;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

export interface FirebaseError {
  code: string;
  message: string;
  customData?: Record<string, unknown>;
}

export interface AnalyticsEvent {
  eventName: string;
  properties: Record<string, unknown>;
  userId: string;
  timestamp: Date;
  path: string;
}

export type RightOption = {
  id: string;
  label: string;
  description: string;
};

export type MaleRightOptions = {
  [key: string]: RightOption;
};

export type FemaleRightOptions = {
  [key: string]: RightOption;
};
