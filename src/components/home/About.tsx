import { motion } from 'motion/react';

export default function About() {
  return (
    <section id="about" className="section-container bg-white overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Images Grid */}
        <div className="relative group">
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="pt-12"
            >
              <img 
                src="https://picsum.photos/seed/chef-work/600/800" 
                alt="Chef at Work" 
                className="rounded-3xl object-cover aspect-[3/4] shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <img 
                src="https://picsum.photos/seed/fresh-ingredients/600/800" 
                alt="Fresh Ingredients" 
                className="rounded-3xl object-cover aspect-[3/4] shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
          
          {/* Experience Badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white p-8 rounded-full w-40 h-40 flex flex-col items-center justify-center shadow-xl border-8 border-white">
            <span className="text-4xl font-black">15+</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-center">Years of Passion</span>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="text-primary font-bold uppercase tracking-widest text-sm">Our Story</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-secondary leading-tight tracking-tighter">
              A Legacy of Taste Built on <span className="italic text-primary">Local Roots</span>
            </h2>
          </div>
          
          <p className="text-gray-600 leading-relaxed text-lg">
            Since our founding in 2011, OYAH FOOD CENTER has been more than just a restaurant. We are a gathering place for friends, families, and professionals who appreciate the intersection of high-quality local ingredients and modern culinary techniques.
          </p>

          <div className="bg-surface p-8 rounded-3xl border border-gray-100 flex items-center gap-6">
            <img 
              src="https://picsum.photos/seed/chef-portrait/150/150" 
              alt="Executive Chef Oyah" 
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              referrerPolicy="no-referrer"
            />
            <div>
              <h4 className="text-xl font-bold text-secondary">Chef Oyah Benson</h4>
              <p className="text-primary text-sm font-medium italic">Executive Chef & Founder</p>
              <p className="text-gray-500 text-xs mt-2 italic">"Food is an art form that speaks all languages."</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-4">
             <div>
               <h5 className="text-3xl font-black text-secondary">100%</h5>
               <p className="text-sm text-gray-500">Fresh Ingredients Daily</p>
             </div>
             <div>
               <h5 className="text-3xl font-black text-secondary">50k+</h5>
               <p className="text-sm text-gray-500">Happy Diners Served</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
