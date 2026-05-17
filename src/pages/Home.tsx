import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Truck, Search, Shield, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import Layout from '@/src/components/Layout';
import { cn } from '@/src/lib/utils';
import { useThemeStore } from '@/src/store/useThemeStore';

const vehicles = [
  { name: "Pickup", desc: "1-2 Tons", icon: "🚚" },
  { name: "Mazda", desc: "3.5-5 Tons", icon: "🚛" },
  { name: "6 Wheeler", desc: "10-15 Tons", icon: "🚚" },
  { name: "Trailer", desc: "25+ Tons", icon: "🚜" },
  { name: "High Roof", desc: "1-1.5 Tons", icon: "🚐" },
  { name: "Shahzor", desc: "1.5-2 Tons", icon: "🚛" },
];

export default function Home() {
  const { theme } = useThemeStore();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Graphic */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-10 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full text-gold-600 fill-current">
              <path d="M0 0 L100 0 L100 100 L0 100 Z" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="1 1" />
            </svg>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gold-600/5 blur-[120px] rounded-full translate-x-1/4 -translate-y-1/4" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-600/10 text-gold-600 border border-gold-600/20 text-xs font-bold uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-gold-600 animate-pulse" />
              Verified Carriers Across Pakistan
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6 tracking-tight">
              Pakistan’s <span className="serif italic text-gold-600">Smart</span> Load & Carrier Network
            </h1>
            <p className="text-lg md:text-xl opacity-70 mb-10 max-w-lg leading-relaxed">
              Connect carriers and companies across Pakistan quickly and securely. The professional digital bridge for Pakistan’s transport industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/find-loads"
                className="gold-gradient text-white px-8 py-4 rounded-xl flex items-center justify-center gap-3 font-bold shadow-2xl shadow-gold-900/40 hover:scale-105 active:scale-95 transition-all text-lg"
              >
                Find Loads <Search size={20} />
              </Link>
              <Link
                to="/signup"
                className={cn(
                  "px-8 py-4 rounded-xl flex items-center justify-center gap-3 font-bold border transition-all text-lg",
                  theme === 'dark' ? "border-white/10 hover:bg-white/5" : "border-black/10 hover:bg-black/5"
                )}
              >
                Join Now <ArrowRight size={20} />
              </Link>
            </div>
            
            <div className="mt-12 flex items-center gap-6 opacity-60">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#1a1a1a] bg-gold-600" />
                ))}
              </div>
              <span className="text-sm font-medium">5,000+ Verified Carriers</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden md:block relative px-12 py-12"
          >
            <div className="absolute inset-0 bg-gold-600/10 rounded-[60px] rotate-6 scale-95 blur-sm" />
            <div className={cn(
              "relative rounded-[60px] border shadow-2xl overflow-hidden aspect-square flex flex-col justify-end p-12",
              theme === 'dark' ? "bg-black/40 border-white/10" : "bg-white border-black/5"
            )}>
              <div className="absolute top-12 left-12">
                 <Truck size={64} className="text-gold-600 opacity-20" />
              </div>
              <div className="relative z-10">
                <div className="w-20 h-1 gold-gradient mb-6" />
                <h3 className="text-3xl font-bold mb-4">Moving Pakistan</h3>
                <p className="opacity-60 text-lg leading-relaxed">
                  From Karachi to Peshawar, we ensure every shipment finds the right wheels at the right price.
                </p>
              </div>
            </div>
            
            {/* Stats Badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 -right-4 bg-white dark:bg-[#2a2a2a] p-4 rounded-2xl shadow-xl border border-gold-600/20"
            >
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                   <Globe size={24} />
                 </div>
                 <div>
                   <div className="text-xs opacity-50 uppercase font-bold tracking-tighter">Network</div>
                   <div className="text-lg font-bold">100+ Cities</div>
                 </div>
               </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Vehicle Categories */}
      <section className="py-24 bg-gold-600/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Available Vehicle Types</h2>
            <p className="opacity-60 max-w-2xl mx-auto">We support all major transport vehicle categories used in Pakistan for various load requirements.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {vehicles.map((v, i) => (
              <motion.div
                key={v.name}
                whileHover={{ y: -5 }}
                className={cn(
                  "p-6 rounded-2xl border text-center transition-all cursor-pointer group",
                  theme === 'dark' ? "bg-black/40 border-white/5 hover:border-gold-600/50" : "bg-white border-black/5 hover:border-gold-600/50"
                )}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {v.icon}
                </div>
                <h4 className="font-bold text-sm mb-1">{v.name}</h4>
                <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
           <div className="grid md:grid-cols-2 gap-24">
             <div>
               <h3 className="text-xs uppercase tracking-widest font-bold text-gold-600 mb-6">For Carriers</h3>
               <h2 className="text-4xl font-bold mb-12">Grow your business as a Carrier</h2>
               <div className="space-y-12">
                 {[
                   { t: "Sign Up & Verify", d: "Register your vehicle and documents for a safe platform experience." },
                   { t: "Find Loads", d: "Browse hundreds of available loads across Pakistan matching your truck type." },
                   { t: "Deliver & Earn", d: "Contact providers directly via WhatsApp, deliver goods, and build your reputation." }
                 ].map((s, i) => (
                   <div key={i} className="flex gap-6">
                     <div className="flex-shrink-0 w-12 h-12 rounded-full border border-gold-600/50 flex items-center justify-center font-serif italic text-xl text-gold-600">
                       {i + 1}
                     </div>
                     <div>
                       <h4 className="text-xl font-bold mb-2">{s.t}</h4>
                       <p className="opacity-60 leading-relaxed">{s.d}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
             <div>
               <h3 className="text-xs uppercase tracking-widest font-bold text-gold-600 mb-6">For Companies</h3>
               <h2 className="text-4xl font-bold mb-12">Streamline your logistics today</h2>
               <div className="space-y-12">
                 {[
                   { t: "Post Your Load", d: "Enter pickup and destination details along with your desired budget." },
                   { t: "Get Carrier Requests", d: "Receive applications from verified carriers looking for work." },
                   { t: "Track Shipment", d: "Communicate directly and track your freight movement with ease." }
                 ].map((s, i) => (
                   <div key={i} className="flex gap-6">
                     <div className="flex-shrink-0 w-12 h-12 rounded-full border border-gold-600/50 flex items-center justify-center font-serif italic text-xl text-gold-600">
                       {i + 1}
                     </div>
                     <div>
                       <h4 className="text-xl font-bold mb-2">{s.t}</h4>
                       <p className="opacity-60 leading-relaxed">{s.d}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-16">Built for Trust in Pakistan</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: <Shield size={40} />, title: "Verified Profiles", desc: "Every carrier is verified by our admin team manually." },
              { icon: <Truck size={40} />, title: "Real-time Matching", desc: "Instantly find loads that match your vehicle type and route." },
              { icon: <Globe size={40} />, title: "Pakistan Wide", desc: "Service covers all major cities and remote routes across the country." }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <div className="text-gold-500 mb-6 flex justify-center">{item.icon}</div>
                <h4 className="text-xl font-bold mb-4">{item.title}</h4>
                <p className="opacity-60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
