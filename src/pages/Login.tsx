import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import Layout from '@/src/components/Layout';
import { useAuthStore } from '@/src/store/useAuthStore';
import { supabase } from '@/src/lib/supabase';
import { cn } from '@/src/lib/utils';
import { useThemeStore } from '@/src/store/useThemeStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { setUser, setProfile } = useAuthStore();
  const { theme } = useThemeStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      
      const user = authData.user;
      
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw new Error('User profile not found.');

      if (profileData) {
        setUser(user);
        setProfile(profileData);
        
        if (profileData.role === 'admin') navigate('/admin');
        else if (profileData.role === 'carrier') navigate('/carrier-dashboard');
        else if (profileData.role === 'company') navigate('/provider-dashboard');
        else navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="flex items-center justify-center py-20 px-4">
      <div className={cn(
        "max-w-md w-full p-8 md:p-12 rounded-[40px] border shadow-2xl transition-all duration-500",
        theme === 'dark' ? "bg-black/40 border-white/10" : "bg-white border-black/5"
      )}>
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3 tracking-tight">Welcome Back</h1>
          <p className="text-sm opacity-60">Log in to manage your loads and shipments.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold opacity-40 ml-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className={cn(
                  "w-full pl-12 pr-4 py-4 rounded-2xl border bg-transparent focus:outline-none focus:ring-2 focus:ring-gold-600/50 transition-all",
                  theme === 'dark' ? "border-white/10" : "border-black/10"
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold opacity-40 ml-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={cn(
                  "w-full pl-12 pr-4 py-4 rounded-2xl border bg-transparent focus:outline-none focus:ring-2 focus:ring-gold-600/50 transition-all",
                  theme === 'dark' ? "border-white/10" : "border-black/10"
                )}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-xs font-bold text-gold-600 hover:underline">Forgot Password?</button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gold-gradient text-white py-4 rounded-2xl font-bold shadow-xl shadow-gold-900/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all text-lg disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Login <ArrowRight size={20} /></>}
          </button>
        </form>

        <div className="mt-10 text-center text-sm opacity-60">
          Don't have an account? <Link to="/signup" className="font-bold text-gold-600 hover:underline">Join ZeeLoad PK</Link>
        </div>
      </div>
    </Layout>
  );
}
