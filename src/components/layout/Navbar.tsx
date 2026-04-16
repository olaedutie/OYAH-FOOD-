import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/#menu' },
    { name: 'Reservations', path: '/#book-a-table' },
    { name: 'About', path: '/#about' },
  ];

  const isHome = location.pathname === '/';

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20 flex items-center ${
        isScrolled || !isHome ? 'bg-white border-b border-[#eee] py-0' : 'bg-transparent py-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-10 w-full">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className={`text-[24px] font-[800] tracking-[-1px] ${
              isScrolled || !isHome ? 'text-secondary' : 'text-white'
            }`}>
              OYAH<span className="text-primary">FOOD</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className={`text-[14px] font-[600] uppercase tracking-[0.5px] transition-colors hover:text-primary ${
                  isScrolled || !isHome ? 'text-secondary' : 'text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`text-[14px] font-[600] uppercase tracking-[0.5px] transition-colors hover:text-primary ${
                  isScrolled || !isHome ? 'text-secondary' : 'text-white'
                }`}
              >
                Dashboard
              </Link>
            )}
            <a 
              href="#book-a-table"
              className="sleek-btn bg-primary text-white text-[13px] !py-2.5 !px-5 shadow-lg shadow-primary/20"
            >
              Order Online
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
             <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={isScrolled || !isHome ? 'text-secondary' : 'text-white'}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-secondary hover:bg-gray-50 rounded-lg"
                >
                  {link.name}
                </a>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-secondary hover:bg-gray-50 rounded-lg"
                >
                  Dashboard
                </Link>
              )}
              <a
                href="#book-a-table"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center bg-primary text-white py-4 rounded-xl font-bold mt-4"
              >
                Book a Table
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
