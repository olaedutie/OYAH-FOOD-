import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Reservation, ReservationStatus } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Phone, Trash2, Calendar, Users, Filter } from 'lucide-react';

export default function ReservationManager() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ReservationStatus | 'all'>('all');

  useEffect(() => {
    const q = query(collection(db, 'reservations'), orderBy('created_at', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReservations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (id: string, status: ReservationStatus) => {
    try {
      await updateDoc(doc(db, 'reservations', id), { status });
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Remove this reservation from logs?')) {
      await deleteDoc(doc(db, 'reservations', id));
    }
  };

  const filteredReservations = filter === 'all' 
    ? reservations 
    : reservations.filter(r => r.status === filter);

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
         <div className="flex items-center gap-2 text-gray-400 mr-4">
           <Filter size={18} />
           <span className="text-xs font-black uppercase tracking-widest">Filter:</span>
         </div>
         {['all', 'pending', 'confirmed', 'cancelled'].map((f) => (
           <button
             key={f}
             onClick={() => setFilter(f as any)}
             className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
               filter === f 
               ? 'bg-secondary text-white border-secondary' 
               : 'bg-transparent text-gray-400 border-gray-100 hover:border-gray-200'
             }`}
           >
             {f === 'all' ? 'Every Booking' : `${f} only`}
           </button>
         ))}
      </div>

      {/* List */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredReservations.map((res) => (
            <motion.div 
              layout
              key={res.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-secondary/5 transition-all group"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center font-black text-secondary text-xl">
                      {res.name.charAt(0)}
                   </div>
                   <div>
                     <h4 className="text-xl font-bold text-secondary tracking-tight">{res.name}</h4>
                     <p className="text-xs text-secondary font-bold tracking-widest flex items-center text-primary">
                       <Phone size={12} className="mr-1" /> {res.phone}
                     </p>
                   </div>
                </div>
                <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  res.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' : 
                  res.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                  'bg-red-50 text-red-600 border-red-100'
                }`}>
                  {res.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-10 pt-8 border-t border-gray-50">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 flex items-center">
                    <Calendar size={12} className="mr-1" /> Booking Date
                  </p>
                  <p className="text-sm font-bold text-secondary">
                    {res.date} <span className="text-primary ml-1">{res.time}</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 flex items-center">
                    <Users size={12} className="mr-1" /> Size
                  </p>
                  <p className="text-sm font-bold text-secondary">{res.guests} People</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                 {res.status === 'pending' && (
                   <>
                    <button 
                      onClick={() => handleStatusChange(res.id!, ReservationStatus.CONFIRMED)}
                      className="flex-1 bg-green-500 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 hover:scale-[1.03] transition-all"
                    >
                      <Check size={14} /> Approve
                    </button>
                    <button 
                      onClick={() => handleStatusChange(res.id!, ReservationStatus.CANCELLED)}
                      className="flex-1 bg-red-500 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 hover:scale-[1.03] transition-all"
                    >
                      <X size={14} /> Decline
                    </button>
                   </>
                 )}
                 {res.status !== 'pending' && (
                   <button 
                    onClick={() => handleStatusChange(res.id!, ReservationStatus.PENDING)}
                    className="flex-1 bg-gray-100 text-secondary py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-gray-200"
                   >
                     Reset to Pending
                   </button>
                 )}
                 <button 
                    onClick={() => handleDelete(res.id!)}
                    className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-100"
                 >
                    <Trash2 size={18} />
                 </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredReservations.length === 0 && !loading && (
        <div className="py-20 text-center bg-white rounded-[3rem] border border-gray-100 text-gray-400 italic">
          No reservations found for this filter.
        </div>
      )}
    </div>
  );
}
