import { useState, useEffect } from 'react';
import { supabase, handleSupabaseError, OperationType } from '@/src/lib/supabase';
import Layout from '@/src/components/Layout';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useThemeStore } from '@/src/store/useThemeStore';
import { Plus, Package, Clock, CheckCircle, Search, Trash2, MapPin, ChevronRight, Edit3 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Link } from 'react-router-dom';

export default function ProviderDashboard() {
  const [myLoads, setMyLoads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile, user } = useAuthStore();
  const { theme } = useThemeStore();

  const fetchMyLoads = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('loads')
        .select('*')
        .eq('providerId', user.id)
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      setMyLoads(data || []);
    } catch (error) {
      handleSupabaseError(error, OperationType.LIST, 'my-loads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLoads();
  }, []);

  const handleDelete = async (loadId: string) => {
    if (window.confirm('Are you sure you want to delete this load listing?')) {
      try {
        const { error } = await supabase
          .from('loads')
          .delete()
          .eq('id', loadId);
        
        if (error) throw error;
        setMyLoads(myLoads.filter(l => l.id !== loadId));
      } catch (error) {
        handleSupabaseError(error, OperationType.DELETE, 'loads');
      }
    }
  };

  const stats = [
    { label: "Active Loads", value: myLoads.filter(l => l.status === 'available').length, icon: <Clock /> },
    { label: "In Transit", value: myLoads.filter(l => l.status === 'in-transit').length, icon: <Package /> },
    { label: "Completed", value: myLoads.filter(l => l.status === 'delivered').length, icon: <CheckCircle /> },
  ];

  return (
    <Layout className="py-24 px-4 bg-gold-600/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-1">Company Dashboard</h1>
            <p className="opacity-60 text-sm">Manage your shipments and find carriers.</p>
          </div>
          <Link 
            to="/provider/post-load"
            className="gold-gradient text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-gold-900/40 flex items-center gap-2 hover:scale-105 transition-all"
          >
            <Plus size={20} /> Post New Load
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "p-8 rounded-[32px] border text-center",
                theme === 'dark' ? "bg-black/40 border-white/5" : "bg-white border-black/10 shadow-sm"
              )}
            >
              <div className="w-12 h-12 rounded-2xl bg-gold-600/10 text-gold-600 flex items-center justify-center mx-auto mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs uppercase tracking-widest font-bold opacity-40">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white dark:bg-black/20 rounded-[40px] border border-black/5 dark:border-white/5 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
            <h2 className="text-xl font-bold">My Posted Loads</h2>
            <div className="flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/5 rounded-full">
              <Search size={16} className="opacity-30" />
              <input placeholder="Search your loads..." className="bg-transparent border-none focus:ring-0 text-sm" />
            </div>
          </div>

          {loading ? (
            <div className="p-20 text-center">
              <Loader2 className="animate-spin mx-auto text-gold-600 mb-4" />
              <p className="opacity-40">Loading your shipments...</p>
            </div>
          ) : myLoads.length === 0 ? (
            <div className="p-20 text-center">
              <Package size={48} className="mx-auto mb-6 opacity-10" />
              <h3 className="text-xl font-bold mb-2">No shipments yet</h3>
              <p className="opacity-40 mb-8">Ready to move some freight across Pakistan?</p>
              <Link 
                to="/provider/post-load"
                className="inline-flex items-center gap-2 text-gold-600 font-bold border-b-2 border-gold-600 pb-1"
              >
                Post your first load <ChevronRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-black/5 dark:border-white/5">
              {myLoads.map((load) => (
                <div key={load.id} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gold-600/5 transition-colors group">
                  <div className="flex gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-gold-600/10 text-gold-600 flex items-center justify-center shrink-0">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">{load.pickupCity}</span>
                        <ChevronRight size={14} className="opacity-30" />
                        <span className="font-bold">{load.dropCity}</span>
                      </div>
                      <div className="text-xs opacity-50">{load.productType} • {load.weight} • {load.truckTypeRequired}</div>
                      <div className="text-[10px] mt-2 opacity-30 uppercase font-black tracking-tighter">Posted on {new Date(load.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                     <div className="text-right">
                       <div className="font-bold text-gold-600">PKR {load.priceOffer.toLocaleString()}</div>
                       <div className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gold-600/10 text-gold-600 inline-block mt-1">
                         {load.status}
                       </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <button className="p-3 rounded-xl border border-black/5 dark:border-white/5 hover:bg-gold-600/10 hover:text-gold-600 transition-all">
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(load.id)}
                          className="p-3 rounded-xl border border-black/5 dark:border-white/5 hover:bg-red-500/10 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={cn("animate-spin", className)} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
