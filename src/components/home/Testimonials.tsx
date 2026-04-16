import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const STATIC_REVIEWS = [
  {
    name: "Michael Chen",
    rating: 5,
    comment: "The best local spot for grilled fish! The ambiance is amazing and the staff treated us like family.",
    role: "Regular Guest"
  },
  {
    name: "Sarah Williams",
    rating: 5,
    comment: "Delicious food, fast service, and great prices. The Jollof Rice is definitely the best in the city!",
    role: "Food Blogger"
  },
  {
    name: "Dr. Adebanjo",
    rating: 4,
    comment: "Impressive attention to detail. Perfect place for our team dinner. Highly recommended.",
    role: "Business Professional"
  }
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % STATIC_REVIEWS.length);
  const prev = () => setIndex((prev) => (prev - 1 + STATIC_REVIEWS.length) % STATIC_REVIEWS.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-secondary py-24 overflow-hidden">
      <div className="section-container relative">
        <div className="absolute top-0 left-0 -translate-x-10 -translate-y-10 opacity-5">
          <Quote size={300} className="text-white" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-12">
            <span className="text-primary font-bold uppercase tracking-widest text-sm block mb-4">Happy Diners</span>
            <h2 className="text-4xl md:text-5xl text-white italic">
               What Our <span className="not-italic">Guests Say</span>
            </h2>
          </div>

          <div className="min-h-[300px] flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex justify-center gap-1">
                  {[...Array(STATIC_REVIEWS[index].rating)].map((_, i) => (
                    <Star key={i} size={20} className="text-primary fill-primary" />
                  ))}
                </div>
                
                <p className="text-2xl md:text-3xl text-white/90 leading-relaxed font-medium tracking-tight">
                  "{STATIC_REVIEWS[index].comment}"
                </p>

                <div className="pt-4">
                  <h4 className="text-xl font-bold text-white">{STATIC_REVIEWS[index].name}</h4>
                  <p className="text-primary text-sm font-medium uppercase tracking-widest mt-1">
                    {STATIC_REVIEWS[index].role}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-4 mt-12">
            <button 
              onClick={prev}
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={next}
              className="w-12 h-12 rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-transform text-white shadow-lg shadow-primary/30"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
