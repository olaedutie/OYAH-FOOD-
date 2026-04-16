import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Post, PostStatus } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, X, Save, Image as ImageIcon, Eye } from 'lucide-react';

export default function PostManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState<Partial<Post>>({
    title: '',
    content: '',
    image: '',
    status: PostStatus.DRAFT
  });

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('created_at', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPost?.id) {
        await updateDoc(doc(db, 'posts', editingPost.id), formData);
      } else {
        await addDoc(collection(db, 'posts'), {
          ...formData,
          created_at: new Date().toISOString()
        });
      }
      closeModal();
    } catch (err) {
      console.error("Post save error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this post?')) {
      await deleteDoc(doc(db, 'posts', id));
    }
  };

  const openModal = (post: Post | null = null) => {
    if (post) {
      setEditingPost(post);
      setFormData(post);
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        content: '',
        image: '',
        status: PostStatus.DRAFT
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPost(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-secondary">Content Management</h2>
        <button 
          onClick={() => openModal()}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 transition-all"
        >
          <Plus size={18} /> New Post
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {posts.map((post) => (
          <motion.div 
            layout
            key={post.id}
            className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex gap-8 items-start group"
          >
            <div className="w-32 h-32 rounded-3xl overflow-hidden shrink-0">
               <img 
                src={post.image || `https://picsum.photos/seed/${post.title}/200/200`} 
                alt={post.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
               />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                 <h4 className="font-bold text-lg text-secondary truncate pr-4">{post.title}</h4>
                 <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                   post.status === 'published' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-100'
                 }`}>
                   {post.status}
                 </span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-6">{post.content}</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => openModal(post)}
                  className="text-xs font-black uppercase text-secondary hover:text-primary transition-colors flex items-center gap-1"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(post.id!)}
                  className="text-xs font-black uppercase text-red-400 hover:text-red-500 transition-colors flex items-center gap-1"
                >
                  <Trash2 size={14} /> Delete
                </button>
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
              className="relative w-full max-w-3xl bg-white rounded-[3rem] p-10 lg:p-12 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-secondary tracking-tight">
                  {editingPost ? 'Edit Post' : 'New Post / Event'}
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-secondary"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Post Title</label>
                  <input 
                    required
                    type="text" 
                    className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary font-bold"
                    placeholder="e.g. New Special: Grilled Lobster Night"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Content</label>
                  <textarea 
                    required
                    rows={8}
                    className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary font-medium"
                    placeholder="Write the full story..."
                    value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                     <label className="text-xs font-black uppercase tracking-widest text-gray-400">Image Asset URL</label>
                     <div className="relative">
                       <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                       <input 
                          type="url" 
                          className="w-full p-5 pl-12 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary text-sm font-medium"
                          placeholder="https://..."
                          value={formData.image}
                          onChange={e => setFormData({...formData, image: e.target.value})}
                       />
                     </div>
                   </div>
                   <div className="space-y-4">
                     <label className="text-xs font-black uppercase tracking-widest text-gray-400">Visibility Status</label>
                     <select 
                        required
                        className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary font-bold appearance-none"
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value as PostStatus})}
                     >
                       <option value={PostStatus.PUBLISHED}>Published (Public)</option>
                       <option value={PostStatus.DRAFT}>Draft (Private)</option>
                     </select>
                   </div>
                </div>

                <div className="flex gap-4 pt-4">
                   <button 
                    type="submit"
                    className="flex-1 bg-primary text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 flex items-center justify-center gap-2"
                   >
                     <Save size={18} /> {editingPost ? 'Update Content' : 'Publish Content'}
                   </button>
                   <button 
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-100 text-secondary py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest"
                   >
                     Discard
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
