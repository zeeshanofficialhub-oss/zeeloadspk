import { useState, useEffect } from 'react';
import { supabase, handleSupabaseError, OperationType } from '@/src/lib/supabase';
import Layout from '@/src/components/Layout';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useThemeStore } from '@/src/store/useThemeStore';
import { 
  Users, Truck, Building2, Package, CheckCircle, XCircle, 
  Search, ShieldAlert, BarChart3, MoreVertical, Trash2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Navigate } from 'react-router-dom';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'carriers' | 'providers' | 'loads'>('carriers');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuthStore();
  const { theme } = useThemeStore();

  // Security check: Only admins allowed
  if (profile && profile.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      let result;
      if (activeTab === 'carriers') {
        result = await supabase.from('users').select('*').eq('role', 'carrier');
      } else if (activeTab === 'providers') {
        result = await supabase.from('users').select('*').eq('role', 'company');
      } else {
        result = await supabase.from('loads').select('*').order('createdAt', { ascending: false });
      }

      if (result.error) throw result.error;
      setData(result.data || []);
    } catch (error) {
      console.error("Admin fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleVerify = async (id: string, currentStatus: boolean) => {
    try {
      const table = activeTab === 'loads' ? 'loads' : 'users';
      const { error } = await supabase
        .from(table)
        .update({ isVerified: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      setData(data.map(item => item.id === id ? { ...item, isVerified: !currentStatus } : item));
    } catch (error) {
       handleSupabaseError(error, OperationType.UPDATE, activeTab);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure? This action is irreversible.')) {
      try {
        const table = activeTab === 'loads' ? 'loads' : 'users';
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        setData(data.filter(item => item.id !== id));
      } catch (error) {
        handleSupabaseError(error, OperationType.DELETE, activeTab);
      }
    }
  };

  const tabs = [
    { id: 'carriers', label: 'Carriers', icon: <Truck size={18} /> },
    { id: 'providers', label: 'Providers', icon: <Building2 size={18} /> },
    { id: 'loads', label: 'All Loads', icon: <Package size={18} /> },
  ];

  return (
    <Layout className="py-24 px-4 bg-gold-600/5 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Platform Control</h1>
            <p className="opacity-60 text-sm">Manage users, moderate content, and monitor platform activity.</p>
          </div>
          
          <div className="flex bg-white dark:bg-black/40 p-1.5 rounded-2xl border border-black/5 dark:border-white/5">
             {tabs.map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={cn(
                   "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                   activeTab === tab.id 
                    ? "gold-gradient text-white shadow-xl" 
                    : "hover:bg-black/5 dark:hover:bg-white/5 opacity-60 hover:opacity-100"
                 )}
               >
                 {tab.icon} {tab.label}
               </button>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
           {[
             { label: "Total Carriers", val: "1,240", icon: <Truck />, trend: "+12%" },
             { label: "Active Loads", val: "450", icon: <Package />, trend: "+5%" },
             { label: "Revenue", val: "4.2M", icon: <BarChart3 />, trend: "+18%" },
             { label: "Reports", val: "8", icon: <ShieldAlert />, trend: "-2" },
           ].map((stat, i) => (
             <div key={i} className="p-6 bg-white dark:bg-black/20 rounded-[32px] border border-black/5 dark:border-white/5">
                <div className="flex items-center justify-between mb-4">
                   <div className="p-3 bg-gold-600/10 text-gold-600 rounded-xl">{stat.icon}</div>
                   <div className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">{stat.trend}</div>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.val}</div>
                <div className="text-[10px] uppercase font-bold opacity-30 tracking-widest">{stat.label}</div>
             </div>
           ))}
        </div>

        <div className="bg-white dark:bg-black/20 rounded-[40px] border border-black/5 dark:border-white/5 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-black/5 dark:border-white/5 flex items-center justify-between flex-wrap gap-4">
             <h2 className="text-xl font-bold capitalize">Manage {activeTab}</h2>
             <div className="flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/5 rounded-2xl">
               <Search size={16} className="opacity-30" />
               <input placeholder={`Search ${activeTab}...`} className="bg-transparent border-none focus:ring-0 text-sm" />
             </div>
          </div>

          {loading ? (
            <div className="p-20 text-center flex flex-col items-center">
               <div className="w-10 h-10 border-4 border-gold-600 border-t-transparent rounded-full animate-spin mb-4" />
               <p className="opacity-40">Scanning database...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="p-20 text-center opacity-30">
               <Users size={64} className="mx-auto mb-4" />
               <p>No records found in this category.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-black/5 dark:border-white/5 text-[10px] uppercase tracking-widest font-bold opacity-40">
                      <th className="px-8 py-6">Identity</th>
                      <th className="px-8 py-6">Location</th>
                      <th className="px-8 py-6">Status</th>
                      <th className="px-8 py-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5">
                    {data.map((item) => (
                      <tr key={item.id} className="hover:bg-gold-600/5 transition-colors">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-gold-600/10 text-gold-600 flex items-center justify-center font-bold">
                                {item.fullName?.[0] || item.companyName?.[0]}
                              </div>
                              <div>
                                <div className="font-bold text-sm">{item.fullName || item.companyName}</div>
                                <div className="text-xs opacity-40">{item.phoneNumber || item.email}</div>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="text-sm font-medium">{item.city || 'N/A'}</div>
                           {activeTab === 'loads' && <div className="text-[10px] opacity-40">{item.pickupCity} → {item.dropCity}</div>}
                        </td>
                        <td className="px-8 py-6">
                           <button 
                             onClick={() => handleVerify(item.id, item.isVerified)}
                             className={cn(
                               "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2",
                               item.isVerified 
                                ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                                : "bg-red-500/10 text-red-500 border border-red-500/20"
                             )}
                           >
                              {item.isVerified ? <CheckCircle size={10} /> : <XCircle size={10} />}
                              {item.isVerified ? 'Active' : 'Suspended'}
                           </button>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                             <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg opacity-40 hover:opacity-100 transition-all">
                               <MoreVertical size={18} />
                             </button>
                             <button 
                               onClick={() => handleDelete(item.id)}
                               className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg opacity-40 hover:opacity-100 transition-all"
                             >
                                <Trash2 size={18} />
                             </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

