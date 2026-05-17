import Layout from '@/src/components/Layout';
import { motion } from 'motion/react';
import { Truck, Package, Scale, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const versions = [
  { 
    name: "Pickup", 
    image: "🚚", 
    capacity: "1.5 Tons", 
    dimensions: "8ft x 5ft", 
    bestFor: "Furniture, domestic moves, small business delivery.",
    description: "The most versatile vehicle for urban logistics in Pakistan."
  },
  { 
    name: "Shahzor", 
    image: "🚛", 
    capacity: "2.5 Tons", 
    dimensions: "10ft x 6ft", 
    bestFor: "Commercial goods, construction materials, catering.",
    description: "Known for reliability and performance in local transport."
  },
  { 
    name: "Mazda (Small)", 
    image: "🚛", 
    capacity: "3.5 Tons", 
    dimensions: "14ft x 7ft", 
    bestFor: "Wholesale distribution, factory parts, appliance bulk.",
    description: "Great balance between size and urban accessibility."
  },
  { 
    name: "Mazda (Large)", 
    image: "🚛", 
    capacity: "5 Tons", 
    dimensions: "17ft x 7.5ft", 
    bestFor: "Heavy machinery components, event equipment, industrial raw materials.",
    description: "Preferred choice for mid-range intercity freight."
  },
  { 
    name: "6 Wheeler Truck", 
    image: "🚚", 
    capacity: "12 Tons", 
    dimensions: "20ft x 8ft", 
    bestFor: "FMCG bulk, construction heavy items, agricultural produce.",
    description: "The backbone of inter-city logistics in Pakistan."
  },
  { 
    name: "Trailer / Container", 
    image: "🚜", 
    capacity: "25-40 Tons", 
    dimensions: "40ft x 8ft", 
    bestFor: "Import/Export containers, heavy metal, vehicle transport.",
    description: "Long-haul king for port-to-city freight movement."
  },
];

export default function VehicleTypes() {
  return (
    <Layout className="py-24 px-4 bg-gold-600/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Supported Vehicle Fleet</h1>
          <p className="opacity-60 max-w-2xl mx-auto">From small pickups to massive trailers, we connect you with every type of commercial transport vehicle available in Pakistan.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {versions.map((v, i) => (
            <motion.div
              key={v.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white dark:bg-black/40 p-10 rounded-[40px] border border-black/5 dark:border-white/5 hover:border-gold-600/50 transition-all shadow-xl hover:shadow-gold-900/10"
            >
              <div className="text-6xl mb-8 group-hover:scale-110 transition-transform">{v.image}</div>
              <h3 className="text-2xl font-bold mb-4">{v.name}</h3>
              <p className="opacity-60 text-sm mb-6 leading-relaxed">{v.description}</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-gold-600/10 text-gold-600 rounded-lg"><Scale size={16} /></div>
                   <div className="text-sm font-bold opacity-70">Capacity: {v.capacity}</div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-gold-600/10 text-gold-600 rounded-lg"><Package size={16} /></div>
                   <div className="text-sm font-bold opacity-70">Size: {v.dimensions}</div>
                </div>
              </div>

              <div className="pt-6 border-t border-black/5 dark:border-white/5">
                <div className="text-[10px] uppercase font-bold tracking-widest opacity-30 mb-2">Best For</div>
                <p className="text-xs font-medium leading-relaxed">{v.bestFor}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-12 rounded-[40px] gold-gradient text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">Not sure what you need?</h2>
            <p className="opacity-90">Talk to our transport specialist for advice on your shipment.</p>
          </div>
          <Link to="/contact" className="px-8 py-4 bg-white text-black rounded-2xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
            Contact Specialist <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </Layout>
  );
}
