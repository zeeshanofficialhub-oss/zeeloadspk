import Layout from '@/src/components/Layout';
import { motion } from 'motion/react';
import { Shield, Target, Users, Truck, Globe, Award } from 'lucide-react';

export default function About() {
  return (
    <Layout className="py-24 px-4 bg-gold-600/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
              Digitizing <span className="serif italic text-gold-600">Pakistan's</span> Logistics Core
            </h1>
            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              ZeeLoad PK was founded with a singular mission: to eliminate the friction in Pakistan's freight market. We noticed that thousands of trucks were returning empty, and companies were struggling to find reliable transporters.
            </p>
            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              Our platform bridges this gap, providing a secure, transparent, and efficient digital load board tailored specifically for the unique needs of the Pakistani transport industry.
            </p>
            <div className="grid grid-cols-2 gap-8">
               <div>
                  <div className="text-3xl font-bold text-gold-600 mb-1">50k+</div>
                  <div className="text-xs uppercase tracking-widest font-bold opacity-40">Monthly Loads</div>
               </div>
               <div>
                  <div className="text-3xl font-bold text-gold-600 mb-1">10k+</div>
                  <div className="text-xs uppercase tracking-widest font-bold opacity-40">Verified Trucks</div>
               </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="aspect-square bg-white dark:bg-black/20 rounded-[60px] border border-black/5 dark:border-white/5 relative overflow-hidden flex items-center justify-center p-12"
          >
             <div className="absolute top-0 right-0 p-12 opacity-5 scale-[2]">
                <Truck size={120} />
             </div>
             <div className="relative z-10 text-center">
                <Truck size={64} className="text-gold-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4">Quality Service Always</h3>
                <p className="text-sm opacity-50 px-12 italic leading-loose">"Efficiency is doing things right; effectiveness is doing the right things for the Pakistani economy."</p>
             </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-32">
           {[
             { icon: <Shield />, title: "Trust & Safety", desc: "Every user on ZeeLoad PK goes through a rigorous manual verification check." },
             { icon: <Target />, title: "Precision Matching", desc: "Our filters ensure you only see loads or trucks that perfectly match your needs." },
             { icon: <Users />, title: "Direct Contact", desc: "No middleman. No hidden fees. Direct WhatsApp and Call connections." },
           ].map((v, i) => (
             <div key={i} className="p-10 bg-white dark:bg-black/20 rounded-[40px] border border-black/5 dark:border-white/5 hover:border-gold-600/50 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-gold-600/10 text-gold-600 flex items-center justify-center mb-6">{v.icon}</div>
                <h4 className="text-xl font-bold mb-4">{v.title}</h4>
                <p className="text-sm opacity-60 leading-relaxed">{v.desc}</p>
             </div>
           ))}
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-16">Our Core Values</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             {[
               { icon: <Globe size={32} />, label: "Pakistan Wide" },
               { icon: <Award size={32} />, label: "Excellence" },
               { icon: <CheckCircle size={32} />, label: "Transparency" },
               { icon: <Users size={32} />, label: "Community" },
             ].map((v, i) => (
               <div key={i} className="p-8 group">
                  <div className="text-gold-600 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all mb-4 flex justify-center">
                    {v.icon}
                  </div>
                  <div className="font-bold text-sm tracking-widest uppercase opacity-40">{v.label}</div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

const CheckCircle = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
