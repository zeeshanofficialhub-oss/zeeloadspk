import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, handleSupabaseError, OperationType } from '@/src/lib/supabase';
import Layout from '@/src/components/Layout';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useThemeStore } from '@/src/store/useThemeStore';
import { MapPin, Truck, Scale, Hash, DollarSign, FileText, Loader2, Send } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const CITIES = ["Karachi", "Lahore", "Islamabad", "Peshawar", "Quetta", "Multan", "Faisalabad", "Sialkot", "Gujranwala"];
const TRUCK_TYPES = ["Pickup", "Shahzor", "Mazda", "6 Wheeler", "Cargo Truck", "Trailer", "High Roof"];

export default function PostLoad() {
  const [formData, setFormData] = useState({
    pickupCity: '',
    dropCity: '',
    pickupAddress: '',
    deliveryAddress: '',
    weight: '',
    truckTypeRequired: '',
    productType: '',
    priceOffer: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { theme } = useThemeStore();
  const { profile, user } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError('');

    try {
      const loadData = {
        ...formData,
        priceOffer: Number(formData.priceOffer),
        providerId: user.id,
        providerName: profile?.companyName || profile?.fullName || 'Anonymous',
        providerPhone: profile?.phoneNumber || '',
        status: 'available',
        createdAt: new Date().toISOString(),
      };

      const { error: insertError } = await supabase.from('loads').insert([loadData]);
      if (insertError) throw insertError;

      navigate('/provider-dashboard');
    } catch (err) {
      handleSupabaseError(err, OperationType.CREATE, 'loads');
      setError('Failed to post load. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="py-24 px-4 bg-gold-600/5">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Post a New Load</h1>
          <p className="opacity-60">Fill in the details to find the best carrier for your shipment.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={cn(
          "p-8 md:p-12 rounded-[40px] border shadow-2xl",
          theme === 'dark' ? "bg-black/40 border-white/10" : "bg-white border-black/5"
        )}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold opacity-40 ml-2">Pickup City</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 text-gold-600" size={18} />
                  <select
                    required
                    value={formData.pickupCity}
                    onChange={(e) => setFormData({...formData, pickupCity: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-transparent focus:ring-2 focus:ring-gold-600/50 appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select Pickup City</option>
                    {CITIES.map(c => <option key={c} value={c} className="dark:bg-black">{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold opacity-40 ml-2">Pickup Address</label>
                <input
                  required
                  value={formData.pickupAddress}
                  onChange={(e) => setFormData({...formData, pickupAddress: e.target.value})}
                  placeholder="Street, Warehouse, Area"
                  className="w-full px-5 py-4 rounded-2xl border bg-transparent focus:ring-2 focus:ring-gold-600/50"
                />
              </div>
            </div>

            <div className="space-y-6">
               <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold opacity-40 ml-2">Drop City</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 text-gold-600" size={18} />
                  <select
                    required
                    value={formData.dropCity}
                    onChange={(e) => setFormData({...formData, dropCity: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-transparent focus:ring-2 focus:ring-gold-600/50 appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select Drop City</option>
                    {CITIES.map(c => <option key={c} value={c} className="dark:bg-black">{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold opacity-40 ml-2">Delivery Address</label>
                <input
                  required
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                  placeholder="Street, Site, Receiving Point"
                  className="w-full px-5 py-4 rounded-2xl border bg-transparent focus:ring-2 focus:ring-gold-600/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold opacity-40 ml-2">Weight / Quantity</label>
              <div className="relative">
                <Scale className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 text-gold-600" size={18} />
                <input
                  required
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  placeholder="e.g. 10 Tons, 500 Boxes"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-transparent focus:ring-2 focus:ring-gold-600/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold opacity-40 ml-2">Truck Type Required</label>
              <div className="relative">
                <Truck className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 text-gold-600" size={18} />
                <select
                  required
                  value={formData.truckTypeRequired}
                  onChange={(e) => setFormData({...formData, truckTypeRequired: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-transparent focus:ring-2 focus:ring-gold-600/50 appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select Truck Type</option>
                  {TRUCK_TYPES.map(t => <option key={t} value={t} className="dark:bg-black">{t}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold opacity-40 ml-2">Product Type</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 text-gold-600" size={18} />
                <input
                  required
                  value={formData.productType}
                  onChange={(e) => setFormData({...formData, productType: e.target.value})}
                  placeholder="e.g. FMCG, Textiles, Construction"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-transparent focus:ring-2 focus:ring-gold-600/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold opacity-40 ml-2">Budget / Offer (PKR)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 text-gold-600" size={18} />
                <input
                  required
                  type="number"
                  value={formData.priceOffer}
                  onChange={(e) => setFormData({...formData, priceOffer: e.target.value})}
                  placeholder="e.g. 45000"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-transparent focus:ring-2 focus:ring-gold-600/50"
                />
              </div>
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-xs uppercase tracking-widest font-bold opacity-40 ml-2">Additional Description</label>
              <div className="relative">
                <FileText className="absolute left-4 top-6 opacity-30 text-gold-600" size={18} />
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Any specific requirements, time constraints, or handling instructions..."
                  rows={4}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-transparent focus:ring-2 focus:ring-gold-600/50"
                />
              </div>
            </div>

            <div className="col-span-2 pt-6">
               <button
                type="submit"
                disabled={loading}
                className="w-full gold-gradient text-white py-5 rounded-[24px] font-bold shadow-2xl shadow-gold-900/40 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all text-xl disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Post Load Now <Send size={20} /></>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
