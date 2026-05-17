import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Phone, MapPin, Truck, Fingerprint, Loader2, ArrowRight, 
  ShieldCheck, CheckCircle2, FileText, Plus, Lock, Mail, Building2,
  Briefcase, Camera, X, MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Layout from '@/src/components/Layout';
import { supabase } from '@/src/lib/supabase';
import { cn } from '@/src/lib/utils';
import { useThemeStore } from '@/src/store/useThemeStore';

const TRUCK_TYPES = [
  "Pickup", "Shahzor", "Mazda", "High Roof", "6 Wheeler", "Cargo Truck", "Trailer"
];

const CITIES = ["Karachi", "Lahore", "Islamabad", "Peshawar", "Quetta", "Multan", "Faisalabad", "Sialkot", "Gujranwala"];

export default function Signup() {
  const [role, setRole] = useState<'carrier' | 'company'>('carrier');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    city: '',
    // Carrier specific
    vehicleType: '',
    vehicleNumber: '',
    // Company specific
    companyName: '',
    businessType: '',
  });

  const [files, setFiles] = useState<{ [key: string]: File[] }>({
    truckPhotos: [],
    cnicImages: [],
    licenseImages: [],
  });
  
  const [previews, setPreviews] = useState<{ [key: string]: string[] }>({
    truckPhotos: [],
    cnicImages: [],
    licenseImages: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const navigate = useNavigate();
  const { theme } = useThemeStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string, multiple = false) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    if (multiple) {
      setFiles(prev => ({ ...prev, [key]: [...(prev[key] || []), ...selectedFiles] }));
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file as Blob));
      setPreviews(prev => ({ ...prev, [key]: [...(prev[key] || []), ...newPreviews] }));
    } else {
      setFiles(prev => ({ ...prev, [key]: [selectedFiles[0]] }));
      const previewUrl = URL.createObjectURL(selectedFiles[0] as Blob);
      setPreviews(prev => ({ ...prev, [key]: [previewUrl] }));
    }
  };

  const removeFile = (key: string, index: number) => {
    setFiles(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index)
    }));
    setPreviews(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email || `${formData.phoneNumber}@zeeloads.pk`,
        password: formData.password,
      });

      if (authError) throw authError;
      const user = authData.user;
      if (!user) throw new Error('Signup failed.');

      const userProfile = {
        id: user.id,
        email: formData.email,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        role: role,
        city: formData.city,
        createdAt: new Date().toISOString(),
        isVerified: true,
        whatsapp: formData.phoneNumber,
        showWhatsapp: true
      };

      const { error: profileError } = await supabase.from('users').insert([userProfile]);
      if (profileError) throw profileError;

      if (role === 'carrier') {
        const carrierDetails = {
          userId: user.id,
          truckType: formData.vehicleType,
          vehicleNumber: formData.vehicleNumber,
        };
        const { error: carrierError } = await supabase.from('carriers').insert([carrierDetails]);
        if (carrierError) throw carrierError;
      } else {
        const companyDetails = {
          userId: user.id,
          companyName: formData.companyName,
          businessType: formData.businessType,
        };
        const { error: companyError } = await supabase.from('companies').insert([companyDetails]);
        if (companyError) throw companyError;
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Layout className="py-20 px-4 flex justify-center bg-gold-600/5 min-h-screen">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "max-w-xl w-full p-12 rounded-[40px] border shadow-2xl text-center",
            theme === 'dark' ? "bg-black/40 border-white/10" : "bg-white border-black/5"
          )}
        >
          <div className="w-24 h-24 rounded-full bg-gold-600/10 text-gold-600 flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-bold mb-4">Registration Successful!</h1>
          <p className="text-lg opacity-60 mb-10 leading-relaxed">
            Welcome to ZeeLoad PK. You can now log in to your dashboard and start using the platform immediately.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full gold-gradient text-white py-5 rounded-2xl font-bold shadow-xl shadow-gold-900/20 hover:scale-[1.02] active:scale-95 transition-all text-lg"
          >
            Login to Dashboard
          </button>
        </motion.div>
      </Layout>
    );
  }

  const FileUpload = ({ label, id, multiple = false }: { label: string, id: string, multiple?: boolean }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    return (
      <div className="space-y-3">
        <label className="text-[11px] uppercase tracking-[0.2em] font-black opacity-40 ml-2">{label}</label>
        <div className="flex flex-wrap gap-4">
          {previews[id].map((url, i) => (
            <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-gold-600/20 group">
              <img src={url} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={() => removeFile(id, i)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cn(
              "w-24 h-24 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gold-600/50 transition-all",
              theme === 'dark' ? "border-white/10 text-white/30" : "border-black/10 text-black/30"
            )}
          >
            <Plus size={24} />
            <span className="text-[10px] uppercase font-black">Upload</span>
          </button>
          <input 
            ref={inputRef}
            type="file" 
            multiple={multiple} 
            onChange={(e) => handleFileChange(e, id, multiple)}
            className="hidden" 
            accept="image/*"
          />
        </div>
      </div>
    );
  };

  return (
    <Layout className="py-12 md:py-20 px-4 flex justify-center bg-gold-600/5 min-h-screen">
      <div className={cn(
        "max-w-3xl w-full p-6 md:p-12 rounded-[40px] border shadow-2xl transition-all duration-500",
        theme === 'dark' ? "bg-black/40 border-white/10" : "bg-white border-black/5"
      )}>
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create Account</h1>
          <p className="text-sm opacity-60 leading-tight">Fill in the details below to join Pakistan's #1 Load Network.</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Role Selection */}
          <div className="space-y-4">
            <label className="text-[11px] uppercase tracking-[0.2em] font-black opacity-40 ml-2">I want to join as</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('carrier')}
                className={cn(
                  "p-6 rounded-[32px] border text-center transition-all group",
                  role === 'carrier' 
                    ? "gold-gradient text-white border-transparent shadow-lg shadow-gold-900/20" 
                    : theme === 'dark' ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
                )}
              >
                <Truck className={cn("mx-auto mb-3", role === 'carrier' ? "text-white" : "text-gold-600")} size={32} />
                <h3 className="font-bold">Carrier / Driver</h3>
              </button>
              <button
                type="button"
                onClick={() => setRole('company')}
                className={cn(
                  "p-6 rounded-[32px] border text-center transition-all group",
                  role === 'company' 
                    ? "gold-gradient text-white border-transparent shadow-lg shadow-gold-900/20" 
                    : theme === 'dark' ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
                )}
              >
                <Building2 className={cn("mx-auto mb-3", role === 'company' ? "text-white" : "text-gold-600")} size={32} />
                <h3 className="font-bold">Load Provider</h3>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BASIC FIELDS */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.2em] font-black opacity-40 ml-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30 px-px" size={20} />
                <input
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  placeholder="Muhammad Ahmed"
                  className={cn(
                    "w-full pl-14 pr-6 py-4 rounded-3xl border bg-transparent focus:outline-none transition-all font-medium",
                    theme === 'dark' ? "border-white/10" : "border-black/10"
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.2em] font-black opacity-40 ml-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30 px-px" size={20} />
                <input
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  placeholder="0300 1234567"
                  className={cn(
                    "w-full pl-14 pr-6 py-4 rounded-3xl border bg-transparent focus:outline-none transition-all font-medium",
                    theme === 'dark' ? "border-white/10" : "border-black/10"
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.2em] font-black opacity-40 ml-2 text-wrap">Email (Optional)</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30 px-px" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="email@example.com"
                  className={cn(
                    "w-full pl-14 pr-6 py-4 rounded-3xl border bg-transparent focus:outline-none transition-all font-medium",
                    theme === 'dark' ? "border-white/10" : "border-black/10"
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.2em] font-black opacity-40 ml-2">City</label>
              <div className="relative">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30 px-px" size={20} />
                <select
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className={cn(
                    "w-full pl-14 pr-10 py-4 rounded-3xl border bg-transparent focus:outline-none transition-all appearance-none cursor-pointer",
                    theme === 'dark' ? "border-white/10" : "border-black/10"
                  )}
                >
                  <option value="" disabled className="dark:bg-[#111]">Select City</option>
                  {CITIES.map(c => <option key={c} value={c} className="dark:bg-[#111]">{c}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.2em] font-black opacity-40 ml-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30 px-px" size={20} />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className={cn(
                    "w-full pl-14 pr-6 py-4 rounded-3xl border bg-transparent focus:outline-none transition-all font-medium",
                    theme === 'dark' ? "border-white/10" : "border-black/10"
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.2em] font-black opacity-40 ml-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30 px-px" size={20} />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  placeholder="••••••••"
                  className={cn(
                    "w-full pl-14 pr-6 py-4 rounded-3xl border bg-transparent focus:outline-none transition-all font-medium",
                    theme === 'dark' ? "border-white/10" : "border-black/10"
                  )}
                />
              </div>
            </div>

            {/* CONDITIONAL CARRIER FIELDS */}
            {role === 'carrier' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4"
              >
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-[0.2em] font-black opacity-40 ml-2">Vehicle Type</label>
                  <select
                    required
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
                    className={cn(
                      "w-full px-6 py-4 rounded-3xl border bg-transparent focus:outline-none transition-all",
                      theme === 'dark' ? "border-white/10" : "border-black/10"
                    )}
                  >
                    <option value="" disabled className="dark:bg-[#111]">Select Type</option>
                    {TRUCK_TYPES.map(t => <option key={t} value={t} className="dark:bg-[#111]">{t}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-[0.2em] font-black opacity-40 ml-2">Vehicle Number</label>
                  <input
                    required
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
                    placeholder="ABC-123"
                    className={cn(
                      "w-full px-6 py-4 rounded-3xl border bg-transparent focus:outline-none transition-all uppercase font-bold",
                      theme === 'dark' ? "border-white/10" : "border-black/10"
                    )}
                  />
                </div>
                
                <div className="md:col-span-2 space-y-8">
                  <FileUpload label="Truck Photos (+)" id="truckPhotos" multiple />
                  <FileUpload label="CNIC Images (+)" id="cnicImages" multiple />
                  <FileUpload label="Driving License Images (+)" id="licenseImages" />
                </div>
              </motion.div>
            )}

            {/* CONDITIONAL COMPANY FIELDS */}
            {role === 'company' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4"
              >
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-[0.2em] font-black opacity-40 ml-2">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30 px-px" size={20} />
                    <input
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      placeholder="e.g. Al-Hamd Logistics"
                      className={cn(
                        "w-full pl-14 pr-6 py-4 rounded-3xl border bg-transparent focus:outline-none transition-all",
                        theme === 'dark' ? "border-white/10" : "border-black/10"
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-[0.2em] font-black opacity-40 ml-2">Business Type</label>
                  <div className="relative">
                    <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30 px-px" size={20} />
                    <input
                      required
                      value={formData.businessType}
                      onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                      placeholder="e.g. Manufacturing / Trading"
                      className={cn(
                        "w-full pl-14 pr-6 py-4 rounded-3xl border bg-transparent focus:outline-none transition-all",
                        theme === 'dark' ? "border-white/10" : "border-black/10"
                      )}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full gold-gradient text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-gold-900/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all text-lg disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Register Now <ArrowRight size={24} /></>}
            </button>
          </div>
        </form>

        {/* CONTACT SECTION */}
        <div className="mt-12 pt-12 border-t border-gold-600/10 text-center space-y-4">
          <p className="text-[10px] uppercase tracking-widest font-black opacity-30">Need Help? Contact Us</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <a href="mailto:Zeeshan.officialhub@gmail.com" className="flex items-center gap-3 hover:text-gold-600 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gold-600/5 flex items-center justify-center">
                <Mail size={18} className="text-gold-600" />
              </div>
              <span className="text-sm font-bold">Zeeshan.officialhub@gmail.com</span>
            </a>
            <a href="https://wa.me/923483707858" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-green-500 transition-colors">
              <div className="w-10 h-10 rounded-full bg-green-500/5 flex items-center justify-center">
                <MessageCircle size={18} className="text-green-500" />
              </div>
              <span className="text-sm font-bold">03483707858</span>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
