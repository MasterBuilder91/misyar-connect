// src/app/components/analytics/AnalyticsProvider.tsx
'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { getCurrentUser } from '../../firebase/auth';
import { doc, setDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

type AnalyticsContextType = {
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
};

const AnalyticsContext = createContext<AnalyticsContextType>({
  trackEvent: () => {},
});

export const useAnalytics = () => useContext(AnalyticsContext);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Track page view on component mount
    trackPageView();
    
    // Set up navigation tracking
    const handleRouteChange = () => {
      trackPageView();
    };
    
    // Add event listener for route changes
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);
  
  const trackPageView = async () => {
    try {
      const user = getCurrentUser();
      const path = window.location.pathname;
      
      // Track in analytics collection
      await setDoc(doc(db, 'analytics', 'pageViews'), {
        [path]: increment(1),
        total: increment(1),
        updatedAt: serverTimestamp(),
      }, { merge: true });
      
      // If user is logged in, track in user analytics
      if (user) {
        await setDoc(doc(db, 'userAnalytics', user.uid), {
          pageViews: increment(1),
          paths: {
            [path]: increment(1),
          },
          lastActive: serverTimestamp(),
        }, { merge: true });
      }
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  };
  
  const trackEvent = async (eventName: string, properties: Record<string, any> = {}) => {
    try {
      const user = getCurrentUser();
      const timestamp = new Date();
      
      // Track in events collection
      await setDoc(doc(db, 'analytics', 'events'), {
        [eventName]: increment(1),
        total: increment(1),
        updatedAt: serverTimestamp(),
      }, { merge: true });
      
      // Add detailed event
      await setDoc(doc(db, 'events', `${timestamp.getTime()}`), {
        eventName,
        properties,
        userId: user?.uid || 'anonymous',
        timestamp: serverTimestamp(),
        path: window.location.pathname,
      });
      
      // If user is logged in, track in user analytics
      if (user) {
        await setDoc(doc(db, 'userAnalytics', user.uid), {
          events: increment(1),
          eventTypes: {
            [eventName]: increment(1),
          },
          lastActive: serverTimestamp(),
        }, { merge: true });
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };
  
  return (
    <AnalyticsContext.Provider value={{ trackEvent }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
