import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ContactMessage } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Trash2, Calendar, User, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function ContactManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'contacts'), orderBy('created_at', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this message?')) {
      await deleteDoc(doc(db, 'contacts', id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-primary/5 rounded-[3rem] p-10 border border-primary/10 flex items-center justify-between mb-12">
        <div>
          <h2 className="text-2xl font-black text-secondary leading-tight">Visitor Inquiries</h2>
          <p className="text-sm text-gray-500 mt-1">Manage and respond to customer feedback and questions.</p>
        </div>
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-primary shadow-xl">
           <MessageCircle size={28} />
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div 
              layout
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-secondary/5 transition-all group"
            >
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-64 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-secondary">
                          <User size={18} />
                       </div>
                       <div>
                         <p className="text-[10px] font-black uppercase text-gray-400">Sender</p>
                         <p className="text-sm font-bold text-secondary truncate max-w-[150px]">{msg.name}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-secondary">
                          <Mail size={18} />
                       </div>
                       <div>
                         <p className="text-[10px] font-black uppercase text-gray-400">Email</p>
                         <p className="text-sm font-bold text-primary truncate max-w-[150px]">{msg.email}</p>
                       </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-50">
                     <p className="text-[10px] font-black uppercase text-gray-400 mb-2 flex items-center">
                        <Calendar size={12} className="mr-1" /> {msg.created_at ? format(new Date(msg.created_at), 'MMM dd, yyyy') : 'Unknown Date'}
                     </p>
                  </div>
                </div>

                <div className="flex-1 bg-surface p-8 rounded-3xl border border-gray-50 relative">
                   <p className="text-secondary leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                   <button 
                    onClick={() => handleDelete(msg.id!)}
                    className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-lg"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {messages.length === 0 && !loading && (
        <div className="py-24 text-center bg-white rounded-[3rem] border border-gray-100 text-gray-400 italic">
          No messages received yet.
        </div>
      )}
    </div>
  );
}
