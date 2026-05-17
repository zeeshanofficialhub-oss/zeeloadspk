import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import Layout from '@/src/components/Layout';
import { Truck, MapPin, Package, CheckCircle2, User, Phone, MessageCircle, Clock, Map as MapIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function Tracking() {
  const { loadId } = useParams();
  const [load, setLoad] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoad = async () => {
      if (!loadId) return;
      try {
        const { data, error } = await supabase
          .from('loads')
          .select('*')
          .eq('id', loadId)
          .single();
        
        if (error) throw error;
        setLoad(data);
      } catch (error) {
        console.error("Error fetching load:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLoad();
  }, [loadId]);

  const steps = [
    { label: "Pending", status: "completed", date: "22 May, 10:00 AM" },
    { label: "Picked Up", status: "completed", date: "23 May, 02:30 PM" },
    { label: "In Transit", status: "current", date: "Estimated 24 May" },
    { label: "Delivered", status: "upcoming", date: "" },
  ];

  if (loading) return null;

  return (
    <Layout className="bg-cream min-h-screen py-24 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-black/5">
            <Package size={24} className="text-gold-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black">Tracking Shipment</h1>
            <p className="text-xs font-bold text-gold-600 uppercase tracking-widest">ID: #{loadId?.slice(-6).toUpperCase()}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Map Placeholder */}
            <div className="relative aspect-video bg-white rounded-[40px] border border-black/5 shadow-2xl overflow-hidden group">
               <div className="absolute inset-0 bg-[#E5E3DF] flex items-center justify-center">
                  <div className="text-center opacity-20 group-hover:opacity-30 transition-opacity">
                    <MapIcon size={80} className="mx-auto mb-4" />
                    <p className="font-bold uppercase tracking-widest text-sm">Live Map Preview</p>
                  </div>
                  {/* Decorative Elements for Map feel */}
                  <div className="absolute top-1/4 left-1/3 w-20 h-0.5 bg-black/10 rotate-45" />
                  <div className="absolute top-1/2 left-1/2 w-40 h-0.5 bg-black/10 -rotate-12" />
                  <div className="absolute bottom-1/3 right-1/4 w-32 h-0.5 bg-black/10 rotate-90" />
                  
                  {/* Truck Marker */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="p-3 bg-gold-600 rounded-full shadow-2xl text-white relative">
                      <Truck size={24} />
                      <div className="absolute inset-0 bg-gold-600 rounded-full animate-ping opacity-20" />
                    </div>
                  </motion.div>
               </div>
               
               <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/90 backdrop-blur-md rounded-3xl border border-black/5 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold opacity-40 mb-1 tracking-widest">Current Location</div>
                    <div className="font-bold text-sm text-black">Near Moro, Sindh (N-5 Highway)</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold opacity-40 mb-1 tracking-widest">ETA</div>
                    <div className="font-bold text-sm text-black">4 Hours 20 Mins</div>
                  </div>
               </div>
            </div>

            {/* Path Steps */}
            <div className="bg-white p-10 rounded-[40px] border border-black/5 shadow-xl">
               <div className="flex items-center justify-between gap-4">
                 {steps.map((step, i) => (
                   <div key={i} className="flex-1 flex flex-col items-center text-center relative group">
                     {i !== steps.length - 1 && (
                       <div className={cn(
                         "absolute top-5 left-1/2 w-full h-0.5 z-0",
                         step.status === 'completed' ? "bg-gold-600" : "bg-black/10"
                       )} />
                     )}
                     <div className={cn(
                       "w-10 h-10 rounded-full flex items-center justify-center relative z-10 border-2 transition-all group-hover:scale-110",
                       step.status === 'completed' ? "bg-gold-600 border-gold-600 text-white" : 
                       step.status === 'current' ? "bg-white border-gold-600 text-gold-600 ring-4 ring-gold-600/10" : 
                       "bg-white border-black/10 text-black/20"
                     )}>
                       {step.status === 'completed' ? <CheckCircle2 size={18} /> : i + 1}
                     </div>
                     <div className="mt-4">
                       <div className={cn("text-xs font-bold uppercase tracking-widest mb-1", step.status === 'upcoming' ? "opacity-20" : "text-black")}>
                         {step.label}
                       </div>
                       <div className="text-[10px] opacity-40">{step.date}</div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-xl">
               <h3 className="font-bold text-black mb-6">Carrier Information</h3>
               <div className="flex items-center gap-4 mb-8">
                 <div className="w-16 h-16 rounded-full bg-black/5 border border-black/10 flex items-center justify-center text-black/20">
                    <User size={32} />
                 </div>
                 <div>
                   <div className="font-bold text-black">{load?.assignedCarrierName || 'Bilal Ahmed'}</div>
                   <div className="text-xs opacity-50">Verified Carrier • 4.9 ★</div>
                 </div>
               </div>
               
               <div className="p-4 rounded-2xl bg-cream border border-black/5 mb-8">
                 <div className="text-[10px] uppercase font-bold opacity-30 mb-2 leading-none">Vehicle</div>
                 <div className="flex items-center gap-2 font-bold text-sm text-black">
                   <Truck size={16} className="text-gold-600" />
                   {load?.truckTypeRequired} (LEC-5923)
                 </div>
               </div>

               <div className="space-y-3">
                 <button className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-sm shadow-xl">
                   <Phone size={18} /> Call Driver
                 </button>
                 <button className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-sm">
                   <MessageCircle size={18} /> WhatsApp
                 </button>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-xl">
              <h3 className="font-bold text-black mb-6">Shipment Details</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                   <div className="w-10 h-10 rounded-xl bg-gold-600/10 flex items-center justify-center text-gold-600 shrink-0">
                     <MapPin size={20} />
                   </div>
                   <div>
                     <div className="text-[10px] uppercase font-bold opacity-30 mb-1">From</div>
                     <div className="text-sm font-bold text-black">{load?.pickupAddress}, {load?.pickupCity}</div>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="w-10 h-10 rounded-xl bg-gold-600/10 flex items-center justify-center text-gold-600 shrink-0">
                     <MapPin size={20} />
                   </div>
                   <div>
                     <div className="text-[10px] uppercase font-bold opacity-30 mb-1">To</div>
                     <div className="text-sm font-bold text-black">{load?.deliveryAddress}, {load?.dropCity}</div>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="w-10 h-10 rounded-xl bg-gold-600/10 flex items-center justify-center text-gold-600 shrink-0">
                     <Clock size={20} />
                   </div>
                   <div>
                     <div className="text-[10px] uppercase font-bold opacity-30 mb-1">Estimated Delivery</div>
                     <div className="text-sm font-bold text-black">24 May 2026, afternoon</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
