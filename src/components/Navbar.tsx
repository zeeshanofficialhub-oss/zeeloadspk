import { Link, useNavigate } from 'react-router-dom';
import { Truck, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useThemeStore } from '@/src/store/useThemeStore';
import ThemeToggle from './ThemeToggle';
import { cn } from '@/src/lib/utils';
import { supabase } from '@/src/lib/supabase';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile } = useAuthStore();
  const { theme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const navLinks = [
    { name: 'Find Loads', path: '/find-loads' },
    { name: 'Vehicle Types', path: '/vehicle-types' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 h-16 border-b transition-all duration-300",
      theme === 'dark' 
        ? "bg-[#1a1a1a]/80 border-white/10 backdrop-blur-md" 
        : "bg-[#f5f2ed]/80 border-black/10 backdrop-blur-md"
    )}>
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Truck className="text-gold-600 group-hover:scale-110 transition-transform" size={28} />
          <span className="text-xl font-bold tracking-tight">ZeeLoad <span className="text-gold-600">PK</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className="text-sm font-medium hover:text-gold-600 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="h-6 w-px bg-current opacity-20 mx-2" />
          <ThemeToggle />
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                to={profile?.role === 'carrier' ? '/carrier-dashboard' : '/provider-dashboard'}
                className="text-sm font-medium flex items-center gap-2"
              >
                <User size={18} />
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="text-xs uppercase tracking-widest font-bold text-red-500 hover:text-red-400"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium">Login</Link>
              <Link 
                to="/signup" 
                className="gold-gradient text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-gold-900/20 hover:scale-105 transition-transform"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <button onClick={() => setIsOpen(!isOpen)} className="p-2">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden absolute top-16 left-0 right-0 border-b transition-all duration-300 overflow-hidden",
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        theme === 'dark' ? "bg-[#1a1a1a] border-white/10" : "bg-[#f5f2ed] border-black/10"
      )}>
        <div className="p-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium p-2"
            >
              {link.name}
            </Link>
          ))}
          {!user && (
            <Link 
              to="/signup" 
              onClick={() => setIsOpen(false)}
              className="gold-gradient text-white p-3 rounded-xl text-center font-bold"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
