import { useState, useEffect } from 'react';
import { supabase, handleSupabaseError, OperationType } from '@/src/lib/supabase';
import Layout from '@/src/components/Layout';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useThemeStore } from '@/src/store/useThemeStore';
import { Search, MapPin, Truck, Scale, Phone, MessageCircle, Calendar, Hash, MoreVertical } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface Load {
  id: string;
  providerId: string;
  pickupCity: string;
  dropCity: string;
  pickupAddress: string;
  deliveryAddress: string;
  weight: string;
  truckTypeRequired: string;
  productType: string;
  priceOffer: number;
  description: string;
  status: string;
  createdAt: any;
  providerName?: string;
  providerPhone?: string;
}

export default function FindLoads() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    pickup: '',
    drop: '',
    truckType: ''
  });

  const { theme } = useThemeStore();
  const { profile } = useAuthStore();

  const fetchLoads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('loads')
        .select('*')
        .eq('status', 'available')
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      setLoads((data as Load[]) || []);
    } catch (error) {
      handleSupabaseError(error, OperationType.LIST, 'loads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoads();
  }, []);

  const filteredLoads = loads.filter(load => {
    return (
      (filters.pickup === '' || load.pickupCity.toLowerCase().includes(filters.pickup.toLowerCase())) &&
      (filters.drop === '' || load.dropCity.toLowerCase().includes(filters.drop.toLowerCase())) &&
      (filters.truckType === '' || load.truckTypeRequired.includes(filters.truckType))
    );
  });

  const handleWhatsApp = (phone: string, load: Load) => {
    const text = encodeURIComponent(`Hi, I am interested in your load from ${load.pickupCity} to ${load.dropCity} (${load.productType}). Is it still available?`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  return (
    <Layout className="py-24 px-4 bg-gold-600/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Find Loads</h1>
            <p className="opacity-60">Browse available shipments across Pakistan.</p>
          </div>
          
          <div className="flex flex-wrap gap-4 bg-white dark:bg-black/40 p-4 rounded-3xl border border-black/5 dark:border-white/5 shadow-xl">
             <div className="flex items-center gap-2 px-4 border-r border-black/10 dark:border-white/10">
               <MapPin size={18} className="text-gold-600" />
               <input 
                 placeholder="Pickup City" 
                 className="bg-transparent border-none focus:ring-0 text-sm w-32"
                 value={filters.pickup}
                 onChange={(e) => setFilters({...filters, pickup: e.target.value})}
               />
             </div>
             <div className="flex items-center gap-2 px-4 border-r border-black/10 dark:border-white/10">
               <MapPin size={18} className="text-gold-600" />
               <input 
                 placeholder="Drop City" 
                 className="bg-transparent border-none focus:ring-0 text-sm w-32"
                 value={filters.drop}
                 onChange={(e) => setFilters({...filters, drop: e.target.value})}
               />
             </div>
             <div className="flex items-center gap-2 px-4">
               <Truck size={18} className="text-gold-600" />
               <select 
                 className="bg-transparent border-none focus:ring-0 text-sm cursor-pointer"
                 value={filters.truckType}
                 onChange={(e) => setFilters({...filters, truckType: e.target.value})}
               >
                 <option value="">All Trucks</option>
                 <option value="Pickup">Pickup</option>
                 <option value="Mazda">Mazda</option>
                 <option value="6 Wheeler">6 Wheeler</option>
                 <option value="Trailer">Trailer</option>
               </select>
             </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-black/5 dark:bg-white/5 rounded-[40px] animate-pulse" />
            ))}
          </div>
        ) : filteredLoads.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-black/20 rounded-[40px] border border-dashed border-black/10 dark:border-white/10">
            <Truck size={48} className="mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-bold mb-2">No Loads Found</h3>
            <p className="opacity-50">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLoads.map((load) => (
              <motion.div
                key={load.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "p-8 rounded-[40px] border relative group transition-all duration-500",
                  theme === 'dark' ? "bg-black/40 border-white/10 hover:border-gold-600/50" : "bg-white border-black/5 hover:border-gold-600/50"
                )}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="px-3 py-1 bg-gold-600/10 text-gold-600 rounded-full text-[10px] uppercase font-bold tracking-widest border border-gold-600/20">
                    {load.status}
                  </div>
                  <div className="text-sm font-bold text-gold-600">PKR {load.priceOffer.toLocaleString()}</div>
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-3 h-3 rounded-full border-2 border-gold-600 bg-white dark:bg-black" />
                    <div className="w-0.5 h-8 bg-gold-600/20" />
                    <div className="w-3 h-3 rounded-full bg-gold-600" />
                  </div>
                  <div className="flex flex-col gap-5">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest font-bold opacity-40">Pickup</div>
                      <div className="font-bold">{load.pickupCity}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest font-bold opacity-40">Destination</div>
                      <div className="font-bold">{load.dropCity}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-2 text-sm opacity-70">
                    <Truck size={16} className="text-gold-600" />
                    <span>{load.truckTypeRequired}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm opacity-70">
                    <Scale size={16} className="text-gold-600" />
                    <span>{load.weight}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm opacity-70">
                    <Calendar size={16} className="text-gold-600" />
                    <span>{new Date(load.createdAt).toLocaleDateString()}</span>
                  </div>
                   <div className="flex items-center gap-2 text-sm opacity-70">
                    <Hash size={16} className="text-gold-600" />
                    <span>{load.productType}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-black/5 dark:border-white/5">
                  <button 
                    onClick={() => handleCall(load.providerPhone || '')}
                    className="flex-1 bg-black dark:bg-white text-white dark:text-black py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm hover:scale-105 active:scale-95 transition-all"
                  >
                    <Phone size={16} /> Call Now
                  </button>
                  <button 
                   onClick={() => handleWhatsApp(load.providerPhone || '', load)}
                    className="flex-1 bg-green-500 text-white py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm hover:scale-105 active:scale-95 transition-all"
                  >
                    <MessageCircle size={16} /> WhatsApp
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
