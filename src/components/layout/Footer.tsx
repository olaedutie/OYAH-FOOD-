import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#eee] py-8">
      <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center text-[13px] text-muted gap-6">
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full shadow-sm shadow-[#4CAF50]/40"></div>
           <span className="font-medium text-secondary">Open Now: 11:00 AM — 10:00 PM</span>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center text-center md:text-left text-muted">
          <span>📍 123 Flavor Street, Culinary District, NY</span>
          <span>📞 +1 (555) OYAH-FOOD</span>
        </div>

        <div className="font-[600] text-secondary uppercase tracking-tight">
          OYAH FOOD CENTER &copy; {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
