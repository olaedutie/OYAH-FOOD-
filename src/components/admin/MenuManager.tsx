import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { MenuItem, MenuItemCategory } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, X, Upload, Save, Search } from 'lucide-react';

export default function MenuManager() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: MenuItemCategory.STARTERS,
    image_url: '',
    is_popular: false
  });

  useEffect(() => {
    const q = query(collection(db, 'menu_items'), orderBy('created_at', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem?.id) {
        await updateDoc(doc(db, 'menu_items', editingItem.id), formData);
      } else {
        await addDoc(collection(db, 'menu_items'), {
          ...formData,
          created_at: new Date().toISOString()
        });
      }
      closeModal();
    } catch (err) {
      console.error("Menu save error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this item?')) {
      await deleteDoc(doc(db, 'menu_items', id));
    }
  };

  const openModal = (item: MenuItem | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: MenuItemCategory.STARTERS,
        image_url: '',
        is_popular: false
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 shadow-sm" size={18} />
            <input 
              type="text" 
              placeholder="Search dishes..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-primary text-sm font-medium"
            />
         </div>
         <button 
          onClick={() => openModal()}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 transition-all w-full sm:w-auto justify-center"
        >
          <Plus size={18} /> Add New Dish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {items.map((item) => (
          <motion.div 
            layout
            key={item.id}
            className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden group shadow-sm hover:shadow-xl transition-all"
          >
            <div className="relative h-48">
              <img 
                src={item.image_url || `https://picsum.photos/seed/${item.name}/400/300`} 
                alt={item.name} 
                className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={() => openModal(item)}
                  className="w-10 h-10 rounded-full bg-white text-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-lg"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(item.id!)}
                  className="w-10 h-10 rounded-full bg-white text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors shadow-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-secondary text-lg">{item.name}</h4>
                <span className="text-primary font-black text-lg">${item.price}</span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-6">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">{item.category}</span>
                {item.is_popular && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">Popular Item</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-secondary/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] p-10 lg:p-12 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-secondary tracking-tight">
                  {editingItem ? 'Edit Dish' : 'New Dish'}
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-secondary"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                     <label className="text-xs font-black uppercase tracking-widest text-gray-400">Dish Name</label>
                     <input 
                        required
                        type="text" 
                        className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm font-bold"
                        placeholder="e.g. Grilled Salmon"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                     />
                   </div>
                   <div className="space-y-4">
                     <label className="text-xs font-black uppercase tracking-widest text-gray-400">Price ($)</label>
                     <input 
                        required
                        type="number" 
                        step="0.01"
                        className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm font-bold font-mono"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                     />
                   </div>
                   <div className="space-y-4 md:col-span-2">
                     <label className="text-xs font-black uppercase tracking-widest text-gray-400">Category</label>
                     <select 
                        required
                        className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm font-bold appearance-none"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value as MenuItemCategory})}
                     >
                       {Object.values(MenuItemCategory).map(cat => (
                         <option key={cat} value={cat}>{cat}</option>
                       ))}
                     </select>
                   </div>
                   <div className="space-y-4 md:col-span-2">
                     <label className="text-xs font-black uppercase tracking-widest text-gray-400">Description</label>
                     <textarea 
                        required
                        rows={3}
                        className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm font-medium leading-relaxed"
                        placeholder="Describe the flavors..."
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                     />
                   </div>
                   <div className="space-y-4 md:col-span-2">
                     <label className="text-xs font-black uppercase tracking-widest text-gray-400">Image URL</label>
                     <input 
                        type="url" 
                        className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm font-medium"
                        placeholder="https://..."
                        value={formData.image_url}
                        onChange={e => setFormData({...formData, image_url: e.target.value})}
                     />
                   </div>
                   <div className="md:col-span-2 flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="is_popular"
                        className="w-6 h-6 accent-primary"
                        checked={formData.is_popular}
                        onChange={e => setFormData({...formData, is_popular: e.target.checked})}
                      />
                      <label htmlFor="is_popular" className="text-sm font-bold text-secondary">Mark as Popular Dish</label>
                   </div>
                </div>

                <div className="flex gap-4 pt-4">
                   <button 
                    type="submit"
                    className="flex-1 bg-primary text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 flex items-center justify-center gap-2"
                   >
                     <Save size={18} /> {editingItem ? 'Update Dish' : 'Add to Menu'}
                   </button>
                   <button 
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-100 text-secondary py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-colors hover:bg-gray-200"
                   >
                     Cancel
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
