// src/app/admin/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { collection, query, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getCurrentUser } from '../firebase/auth';

export default function AdminPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const user = getCurrentUser();
        
        if (!user) {
          router.push('/auth');
          return;
        }
        
        // Check if user is admin
        const userDoc = await getDocs(query(
          collection(db, 'admins'),
          where('uid', '==', user.uid)
        ));
        
        if (userDoc.empty) {
          router.push('/dashboard');
          return;
        }
        
        setIsAdmin(true);
        
        // Fetch users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersData);
        
        // Fetch reports
        const reportsSnapshot = await getDocs(collection(db, 'reports'));
        const reportsData = reportsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReports(reportsData);
      } catch (err: any) {
        setError(err.message || t('admin.fetchError'));
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [router, t]);
  
  const handleSuspendUser = async (userId: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        suspended: true,
        updatedAt: new Date()
      });
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, suspended: true } : user
      ));
      
      setSuccess(t('admin.userSuspended'));
    } catch (err: any) {
      setError(err.message || t('admin.actionError'));
    }
  };
  
  const handleUnsuspendUser = async (userId: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        suspended: false,
        updatedAt: new Date()
      });
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, suspended: false } : user
      ));
      
      setSuccess(t('admin.userUnsuspended'));
    } catch (err: any) {
      setError(err.message || t('admin.actionError'));
    }
  };
  
  const handleResolveReport = async (reportId: string) => {
    try {
      await updateDoc(doc(db, 'reports', reportId), {
        status: 'resolved',
        resolvedAt: new Date()
      });
      
      setReports(prev => prev.map(report => 
        report.id === reportId ? { ...report, status: 'resolved' } : report
      ));
      
      setSuccess(t('admin.reportResolved'));
    } catch (err: any) {
      setError(err.message || t('admin.actionError'));
    }
  };
  
  const handleDeleteReport = async (reportId: string) => {
    try {
      await deleteDoc(doc(db, 'reports', reportId));
      
      setReports(prev => prev.filter(report => report.id !== reportId));
      
      setSuccess(t('admin.reportDeleted'));
    } catch (err: any) {
      setError(err.message || t('admin.actionError'));
    }
  };
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <main>
      <Navbar />
      
      <div className="py-16 bg-cream-50 min-h-screen">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {t('admin.title')}
          </h1>
          
          {error && (
            <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          {success && (
            <div className="max-w-4xl mx-auto bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-700"></div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {/* User Management */}
              <div className="bg-white rounded-xl shadow-md p-8 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {t('admin.userManagement')}
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.user')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.email')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.status')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map(user => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                                {user.photoURL ? (
                                  <img 
                                    src={user.photoURL} 
                                    alt={user.displayName} 
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-sm text-gray-500">{user.displayName?.charAt(0) || user.email.charAt(0)}</span>
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {user.displayName || t('admin.noName')}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {t('admin.joined')}: {new Date(user.createdAt?.toDate()).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.suspended 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {user.suspended ? t('admin.suspended') : t('admin.active')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {user.suspended ? (
                              <button
                                onClick={() => handleUnsuspendUser(user.id)}
                                className="text-teal-600 hover:text-teal-900"
                              >
                                {t('admin.unsuspend')}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSuspendUser(user.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                {t('admin.suspend')}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Reports */}
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {t('admin.reports')}
                </h2>
                
                {reports.length > 0 ? (
                  <div className="space-y-6">
                    {reports.map(report => (
                      <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {t('admin.reportType')}: {report.type}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {t('admin.reportedBy')}: {report.reporterName || report.reporterId}
                            </p>
                            <p className="text-sm text-gray-500">
                              {t('admin.reportedUser')}: {report.reportedName || report.reportedUserId}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${
                            report.status === 'resolved' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {report.status === 'resolved' ? t('admin.resolved') : t('admin.pending')}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-4">
                          {report.description}
                        </p>
                        
                        <div className="flex space-x-2">
                          {report.status !== 'resolved' && (
                            <Button
                              variant="secondary"
                              onClick={() => handleResolveReport(report.id)}
                              size="sm"
                            >
                              {t('admin.markResolved')}
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            onClick={() => handleDeleteReport(report.id)}
                            size="sm"
                          >
                            {t('admin.deleteReport')}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>{t('admin.noReports')}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
