/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import { useAuthStore } from '@/src/store/useAuthStore';
import ProtectedRoute from '@/src/components/ProtectedRoute';

// Pages
import Home from '@/src/pages/Home';
import Login from '@/src/pages/Login';
import Signup from '@/src/pages/Signup';
import CarrierDashboard from '@/src/pages/CarrierDashboard';
import ProviderDashboard from '@/src/pages/ProviderDashboard';
import FindLoads from '@/src/pages/FindLoads';
import PostLoad from '@/src/pages/PostLoad';
import Tracking from '@/src/pages/Tracking';
import VehicleTypes from '@/src/pages/VehicleTypes';
import About from '@/src/pages/About';
import Contact from '@/src/pages/Contact';
import AdminPanel from '@/src/pages/AdminPanel';

export default function App() {
  const { setUser, setProfile, setLoading } = useAuthStore();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const fetchProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setProfile, setLoading]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/find-loads" element={<FindLoads />} />
        <Route path="/vehicle-types" element={<VehicleTypes />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Protected Routes */}
        <Route 
          path="/carrier-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['carrier']}>
              <CarrierDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/provider-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['company']}>
              <ProviderDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/provider/post-load" 
          element={
            <ProtectedRoute allowedRoles={['company']}>
              <PostLoad />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/tracking/:loadId" element={<Tracking />} />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

