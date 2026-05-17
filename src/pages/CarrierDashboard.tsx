import { useState, useEffect } from 'react';
import { supabase, handleSupabaseError, OperationType } from '@/src/lib/supabase';
import Layout from '@/src/components/Layout';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useThemeStore } from '@/src/store/useThemeStore';
import { Truck, Package, CheckCircle, Wallet, List, Compass, ChevronRight, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Link } from 'react-router-dom';

export default function CarrierDashboard() {
  const [stats, setStats] = useState({
    available: 0,
    active: 0,
    completed: 0,
    earnings: 0
  });
  const [recentLoads, setRecentLoads] = useState<any[]>([]);
  const { profile } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch total available loads
        const { count, error: countError } = await supabase
          .from('loads')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'available');
        
        if (countError) throw countError;

        // Mocking some carrier specific stats since we don't have full trip logic yet
        setStats({
          available: count || 0,
          active: 2,
          completed: 12,
          earnings: 145000
        });

        // Fetch 3 most recent loads
        const { data: recentData, error: recentError } = await supabase
          .from('loads')
          .select('*')
          .eq('status', 'available')
          .order('createdAt', { ascending: false })
          .limit(3);
        
        if (recentError) throw recentError;
        setRecentLoads(recentData || []);

      } catch (error) {
        handleSupabaseError(error, OperationType.GET, 'dashboard');
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { label: "Available Loads", value: stats.available, icon: <Compass />, color: "gold" },
    { label: "Active Trips", value: stats.active, icon: <Truck />, color: "blue" },
    { label: "Completed", value: stats.completed, icon: <CheckCircle />, color: "green" },
    { label: "Total Earnings", value: `PKR ${stats.earnings.toLocaleString()}`, icon: <Wallet />, color: "purple" },
  ];

  return (
    <Layout className="py-24 px-4 bg-gold-600/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-1">Assalam-o-Alaikum, {profile?.fullName?.split(' ')[0]}!</h1>
            <p className="opacity-60 text-sm">Welcome back to your carrier dashboard.</p>
          </div>
          <button className="p-3 bg-white dark:bg-black/40 rounded-2xl border border-black/5 dark:border-white/5 relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-black" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "p-6 rounded-[32px] border shadow-sm",
                theme === 'dark' ? "bg-black/40 border-white/5" : "bg-white border-black/5"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center mb-4",
                "bg-gold-600/10 text-gold-600"
              )}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs uppercase tracking-widest font-bold opacity-40">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recent Opportunities</h2>
              <Link to="/carrier/find-loads" className="text-gold-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                View All Loads <ChevronRight size={16} />
              </Link>
            </div>
            
            {recentLoads.length === 0 ? (
               <div className="p-12 text-center bg-white dark:bg-black/20 rounded-[40px] border border-dashed border-black/10 dark:border-white/10">
                <Truck size={40} className="mx-auto mb-4 opacity-10" />
                <p className="opacity-40">No loads found matching your profile.</p>
              </div>
            ) : (
              recentLoads.map((load) => (
                <Link 
                  key={load.id}
                  to={`/carrier/find-loads`}
                  className={cn(
                    "flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-[32px] border transition-all hover:scale-[1.01] hover:shadow-xl group",
                    theme === 'dark' ? "bg-black/40 border-white/5" : "bg-white border-black/5"
                  )}
                >
                  <div className="w-16 h-16 rounded-2xl bg-gold-600/10 text-gold-600 flex items-center justify-center shrink-0">
                    <Package size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">{load.pickupCity}</span>
                      <ChevronRight size={14} className="opacity-30" />
                      <span className="font-bold">{load.dropCity}</span>
                    </div>
                    <div className="text-xs opacity-50">{load.productType} • {load.weight} • {load.truckTypeRequired}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gold-600 mb-1">PKR {load.priceOffer.toLocaleString()}</div>
                    <div className="text-[10px] uppercase font-bold opacity-30">Apply Now</div>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="space-y-8">
            <h2 className="text-xl font-bold">My Status</h2>
            <div className={cn(
              "p-8 rounded-[40px] border flex flex-col items-center text-center",
              theme === 'dark' ? "bg-black/40 border-white/5" : "bg-white border-black/5"
            )}>
               <div className="w-20 h-20 rounded-full border-4 border-gold-600/20 border-t-gold-600 flex items-center justify-center mb-6">
                 <span className="text-sm font-bold">75%</span>
               </div>
               <h3 className="font-bold mb-2">Complete Profile</h3>
               <p className="text-xs opacity-50 mb-6 leading-relaxed">Fill in your remaining details to unlock priority load notifications and premium features.</p>
               <button className="w-full py-3 rounded-2xl bg-gold-600/10 text-gold-600 font-bold text-sm hover:bg-gold-600 hover:text-white transition-all">
                 Update Profile
               </button>
            </div>

            <div className={cn(
              "p-6 rounded-[32px] border",
              theme === 'dark' ? "bg-black/40 border-white/5" : "bg-white border-black/5"
            )}>
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <Bell size={18} className="text-gold-600" /> Notifications
              </h4>
              <div className="space-y-4">
                <div className="pb-4 border-b border-black/5 dark:border-white/5 last:border-0 last:pb-0">
                  <div className="text-[10px] font-bold opacity-30 uppercase tracking-widest mb-1">System • 2h ago</div>
                  <p className="text-xs">Welcome to ZeeLoad PK! You can now start applying for loads.</p>
                </div>
                <div className="pb-4 border-b border-black/5 dark:border-white/5 last:border-0 last:pb-0">
                  <div className="text-[10px] font-bold opacity-30 uppercase tracking-widest mb-1">Load Board • 5h ago</div>
                  <p className="text-xs">3 new loads available from {profile?.city}.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
