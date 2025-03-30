// src/app/deploy.ts
import { getApps, initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase if not already initialized
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const db = getFirestore();
const auth = getAuth();

// Function to set up initial data
export async function setupInitialData() {
  try {
    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@misyarconnect.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
    
    let adminUid;
    
    try {
      // Create admin user
      const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
      adminUid = userCredential.user.uid;
    } catch (error: any) {
      // If user already exists, continue
      if (error.code === 'auth/email-already-in-use') {
        console.log('Admin user already exists');
        // You would need to get the UID from an existing admin
        adminUid = 'admin-uid'; // This would need to be retrieved
      } else {
        throw error;
      }
    }
    
    // Set up admin document
    await setDoc(doc(db, 'admins', adminUid), {
      uid: adminUid,
      email: adminEmail,
      role: 'admin',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    // Set up initial analytics document
    await setDoc(doc(db, 'analytics', 'pageViews'), {
      total: 0,
      updatedAt: serverTimestamp(),
    });
    
    await setDoc(doc(db, 'analytics', 'events'), {
      total: 0,
      updatedAt: serverTimestamp(),
    });
    
    // Set up initial rights options
    const maleRights = [
      'providing_financial_maintenance',
      'providing_housing',
      'living_together_full_time',
      'equal_time_division',
      'regular_visitation',
      'public_announcement',
      'travel_commitments',
      'decision_making_authority'
    ];
    
    const femaleRights = [
      'living_together_full_time',
      'financial_maintenance',
      'equal_time_division',
      'housing_provision',
      'regular_visitation',
      'public_announcement',
      'career_prioritization',
      'decision_making_authority'
    ];
    
    await setDoc(doc(db, 'config', 'rightsOptions'), {
      male: maleRights,
      female: femaleRights,
      updatedAt: serverTimestamp(),
    });
    
    // Set up deployment record
    await setDoc(doc(db, 'deployments', new Date().toISOString()), {
      timestamp: serverTimestamp(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'production',
    });
    
    console.log('Initial data setup complete');
    return { success: true };
  } catch (error) {
    console.error('Error setting up initial data:', error);
    return { success: false, error };
  }
}
