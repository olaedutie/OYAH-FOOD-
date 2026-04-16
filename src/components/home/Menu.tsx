import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { MenuItem, MenuItemCategory } from '../../types';
import { ShoppingBag } from 'lucide-react';

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<MenuItemCategory>(MenuItemCategory.STARTERS);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'menu_items'), where('category', '==', activeCategory));
        const querySnapshot = await getDocs(q);
        const fetchedItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
        setItems(fetchedItems);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
      setLoading(false);
    };

    fetchItems();
  }, [activeCategory]);

  const categories = Object.values(MenuItemCategory);

  return (
    <section id="menu" className="bg-surface py-24">
      <div className="section-container">
        <div className="text-center space-y-4 mb-16">
          <span className="text-primary font-bold uppercase tracking-widest text-sm">Delicious Selection</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-secondary tracking-tighter italic">
            Chef's <span className="not-italic">Special Menu</span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat 
                ? 'bg-primary text-white shadow-xl shadow-primary/30' 
                : 'bg-white text-secondary hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="min-h-[400px] relative">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-3xl p-6 h-48 animate-pulse shadow-sm"></div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
               >
                 {items.length > 0 ? (
                   items.map((item) => (
                     <motion.div 
                       key={item.id} 
                       className="bg-card p-4 rounded-[--radius-item] shadow-[--shadow-sleek] flex items-center gap-4 transition-all hover:translate-y-[-4px] group"
                     >
                       <div className="w-[60px] h-[60px] rounded-[12px] bg-secondary/5 overflow-hidden flex-shrink-0">
                         <img 
                           src={item.image_url || `https://picsum.photos/seed/${item.name}/120/120`} 
                           alt={item.name} 
                           className="w-full h-full object-cover"
                           referrerPolicy="no-referrer"
                         />
                       </div>
                       <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-start">
                           <h4 className="text-[14px] font-bold text-secondary truncate pr-2 leading-tight">{item.name}</h4>
                           <span className="text-[14px] font-bold text-primary flex-shrink-0">${item.price.toFixed(0)}</span>
                         </div>
                         <p className="text-[12px] text-muted line-clamp-1 mt-0.5 leading-tight">{item.description}</p>
                       </div>
                     </motion.div>
                   ))
                 ) : (
                  <div className="col-span-full text-center py-20 text-gray-400">
                    No items found in this category.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
