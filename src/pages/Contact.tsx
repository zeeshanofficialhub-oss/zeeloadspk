import Layout from '@/src/components/Layout';
import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useThemeStore } from '@/src/store/useThemeStore';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const { theme } = useThemeStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Message sent successfully! Our team will contact you soon.');
    }, 1500);
  };

  return (
    <Layout className="py-24 px-4 bg-gold-600/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Contact Our Team</h1>
          <p className="opacity-60 max-w-2xl mx-auto">Have questions about the platform or need help with a shipment? We're here 24/7 to support Pakistan's transport network.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-8">
            <div className="p-8 bg-white dark:bg-black/20 rounded-[40px] border border-black/5 dark:border-white/5">
               <div className="w-12 h-12 rounded-2xl bg-gold-600/10 text-gold-600 flex items-center justify-center mb-6">
                 <Phone size={24} />
               </div>
               <h3 className="font-bold mb-2">Call Support</h3>
               <p className="text-sm opacity-60 mb-4">Urgent help with loads or carriers.</p>
               <a href="tel:+923000000000" className="text-gold-600 font-bold block">+92 300 0000000</a>
            </div>

            <div className="p-8 bg-white dark:bg-black/20 rounded-[40px] border border-black/5 dark:border-white/5">
               <div className="w-12 h-12 rounded-2xl bg-gold-600/10 text-gold-600 flex items-center justify-center mb-6">
                 <Mail size={24} />
               </div>
               <h3 className="font-bold mb-2">Email Us</h3>
               <p className="text-sm opacity-60 mb-4">General inquiries and partnerships.</p>
               <a href="mailto:support@zeeload.pk" className="text-gold-600 font-bold block">support@zeeload.pk</a>
            </div>

            <div className="p-8 bg-white dark:bg-black/20 rounded-[40px] border border-black/5 dark:border-white/5">
               <div className="w-12 h-12 rounded-2xl bg-gold-600/10 text-gold-600 flex items-center justify-center mb-6">
                 <MapPin size={24} />
               </div>
               <h3 className="font-bold mb-2">Head Office</h3>
               <p className="text-sm opacity-60 mb-4">DHA Phase 6, Karachi, Pakistan</p>
               <span className="text-gold-600 font-bold block">Mon - Sat: 9am - 6pm</span>
            </div>
          </div>

          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className={cn(
              "p-10 md:p-12 rounded-[50px] border shadow-2xl",
              theme === 'dark' ? "bg-black/40 border-white/10" : "bg-white border-black/10"
            )}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold opacity-40 ml-2">Your Name</label>
                    <input required placeholder="Ali Mohammad" className="w-full px-6 py-4 rounded-2xl border bg-transparent focus:ring-2 focus:ring-gold-600/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold opacity-40 ml-2">Email Address</label>
                    <input required type="email" placeholder="ali@gmail.com" className="w-full px-6 py-4 rounded-2xl border bg-transparent focus:ring-2 focus:ring-gold-600/50" />
                  </div>
               </div>

               <div className="space-y-2 mb-8">
                  <label className="text-xs uppercase tracking-widest font-bold opacity-40 ml-2">Message Type</label>
                  <select className="w-full px-6 py-4 rounded-2xl border bg-transparent focus:ring-2 focus:ring-gold-600/50 appearance-none cursor-pointer">
                    <option className="dark:bg-black">General Inquiry</option>
                    <option className="dark:bg-black">Support Request</option>
                    <option className="dark:bg-black">Account issue</option>
                    <option className="dark:bg-black">Partnership</option>
                  </select>
               </div>

               <div className="space-y-2 mb-8">
                  <label className="text-xs uppercase tracking-widest font-bold opacity-40 ml-2">Your Message</label>
                  <textarea rows={6} placeholder="How can we help you today?" className="w-full px-6 py-4 rounded-2xl border bg-transparent focus:ring-2 focus:ring-gold-600/50" />
               </div>

               <button
                type="submit"
                disabled={loading}
                className="w-full gold-gradient text-white py-5 rounded-[24px] font-bold shadow-2xl shadow-gold-900/40 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all text-xl disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Send Message <Send size={20} /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
