import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    q: "Do you offer vegetarian or vegan options?",
    a: "Yes! We have a dedicated section in our menu for vegetarian dishes, and many of our main courses can be customized to be vegan-friendly."
  },
  {
    q: "Is parking available at the restaurant?",
    a: "We have a private parking lot available for our guests, as well as plenty of street parking in the immediate vicinity."
  },
  {
    q: "Do I need to make a reservation in advance?",
    a: "While walk-ins are always welcome, we highly recommend making a reservation, especially for dinner on weekends or for large groups of 6 or more."
  },
  {
    q: "Do you host private events or parties?",
    a: "Absolutely! We have a private dining area and can accommodate parties up to 40 people. Please contact us directly for event packages."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-[#F9F9F9]">
      <div className="section-container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="text-primary font-bold uppercase tracking-widest text-sm block">Got Questions?</span>
            <h2 className="text-4xl md:text-5xl text-secondary tracking-tighter italic">
              Frequently <span className="not-italic">Asked Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div 
                key={i} 
                className={`bg-white rounded-3xl overflow-hidden border border-gray-100 transition-all ${openIndex === i ? 'shadow-xl shadow-secondary/5' : ''}`}
              >
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full p-8 flex justify-between items-center text-left"
                >
                  <span className="text-lg font-bold text-secondary">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${openIndex === i ? 'bg-primary text-white' : 'bg-surface text-gray-400'}`}>
                    {openIndex === i ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-8 pt-0 text-gray-500 leading-relaxed italic">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
