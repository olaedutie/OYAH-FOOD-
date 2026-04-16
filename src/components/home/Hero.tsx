import { motion } from 'motion/react';
import { ArrowRight, Play } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/restaurant/1920/1080" 
          alt="OYAH Signature Dish" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-transparent"></div>
      </div>

      <div className="section-container relative z-10 w-full pt-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="overflow-hidden rounded-[24px] relative"
          >
            {/* Inner Content Card */}
            <div className="bg-secondary relative min-h-[500px] flex flex-col justify-center px-10 md:px-16 py-16 overflow-hidden">
               {/* Background Image inside card to match design */}
               <img 
                 src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1024" 
                 alt="Sleek Food" 
                 className="absolute inset-0 w-full h-full object-cover z-0"
                 referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/70 to-transparent z-10"></div>
               
               <div className="relative z-20 max-w-xl">
                 <h1 className="text-5xl md:text-7xl lg:text-[72px] text-white leading-[1.1] font-bold mb-6 tracking-tight">
                    Where Flavor<br />Meets Comfort
                 </h1>
                 <p className="text-[18px] text-white/90 mb-10 leading-relaxed max-w-md opacity-90">
                    Fresh meals prepared by experts. Experience the perfect blend of fast service and unforgettable taste.
                 </p>
                 
                 <div className="flex flex-wrap gap-4">
                    <a 
                      href="#book-a-table"
                      className="sleek-btn bg-primary text-white"
                    >
                      Book a Table
                    </a>
                    <a 
                      href="#menu"
                      className="sleek-btn bg-transparent border-2 border-white text-white"
                    >
                      View Full Menu
                    </a>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white rounded-full"></div>
        </div>
      </motion.div>
    </div>
  );
}
