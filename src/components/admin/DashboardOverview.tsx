import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Reservation, MenuItem, ContactMessage } from '../../types';
import { motion } from 'motion/react';
import { 
  Users, 
  Utensils, 
  CalendarCheck, 
  TrendingUp,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    reservations: 0,
    dishes: 0,
    messages: 0,
    pendingReservations: 0
  });
  const [recentReservations, setRecentReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const reservationsSnap = await getDocs(collection(db, 'reservations'));
        const menuSnap = await getDocs(collection(db, 'menu_items'));
        const messagesSnap = await getDocs(collection(db, 'contacts'));
        const pendingSnap = await getDocs(query(collection(db, 'reservations'), where('status', '==', 'pending')));

        setStats({
          reservations: reservationsSnap.size,
          dishes: menuSnap.size,
          messages: messagesSnap.size,
          pendingReservations: pendingSnap.size
        });

        const recentQ = query(collection(db, 'reservations'), orderBy('created_at', 'desc'), limit(5));
        const recentSnap = await getDocs(recentQ);
        setRecentReservations(recentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation)));

      } catch (err) {
        console.error("Error fetching stats:", err);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Bookings', value: stats.reservations, icon: CalendarCheck, color: 'bg-primary' },
    { name: 'Menu Items', value: stats.dishes, icon: Utensils, color: 'bg-blue-500' },
    { name: 'Unread Inquiries', value: stats.messages, icon: TrendingUp, color: 'bg-purple-500' },
    { name: 'Pending Approvals', value: stats.pendingReservations, icon: Users, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-12">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((card, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={card.name} 
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center space-x-6"
          >
            <div className={`w-16 h-16 rounded-2xl ${card.color} flex items-center justify-center text-white shadow-lg`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-xs uppercase font-black tracking-widest text-gray-400 mb-1">{card.name}</p>
              <h3 className="text-3xl font-black text-secondary">{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Recent Reservations Table */}
        <div className="xl:col-span-2 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold text-secondary">Recent Bookings</h3>
            <button className="text-xs font-black uppercase tracking-widest text-primary hover:underline">View All</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 text-xs text-gray-400 uppercase tracking-widest">
                  <th className="pb-4 font-black">Guest</th>
                  <th className="pb-4 font-black">Date & Time</th>
                  <th className="pb-4 font-black text-center">Guests</th>
                  <th className="pb-4 font-black text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentReservations.map((res) => (
                  <tr key={res.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-6 pr-4">
                      <p className="font-bold text-secondary">{res.name}</p>
                      <p className="text-xs text-gray-400">{res.phone}</p>
                    </td>
                    <td className="py-6 pr-4">
                      <p className="text-sm font-medium">{res.date}</p>
                      <p className="text-xs text-gray-400 flex items-center">
                        <Clock size={12} className="mr-1" /> {res.time}
                      </p>
                    </td>
                    <td className="py-6 px-4 text-center">
                      <span className="text-sm font-bold text-secondary">{res.guests}</span>
                    </td>
                    <td className="py-6 text-right">
                      <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        res.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' : 
                        res.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                        'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Tips */}
        <div className="space-y-8">
           <div className="bg-primary rounded-[3rem] p-10 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-white/10 rounded-full blur-[40px] group-hover:bg-white/20 transition-all"></div>
              <h3 className="text-2xl font-black italic mb-4 leading-tight">Master Chef Tip</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-8 italic">
                "Keep your menu fresh by rotating popular dishes weekly. Highlight seasonal ingredients to drive more reservations."
              </p>
              <button className="bg-white text-primary px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">
                Update Menu
              </button>
           </div>

           <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
             <h4 className="font-bold text-secondary mb-6">Today's Schedule</h4>
             <div className="space-y-6">
               <div className="flex items-center space-x-4 border-l-4 border-primary pl-4">
                 <div className="flex-1">
                   <p className="text-sm font-bold">Lunch Rush</p>
                   <p className="text-xs text-gray-400">12:00 PM - 03:00 PM</p>
                 </div>
                 <span className="text-[10px] font-black uppercase text-primary">Active</span>
               </div>
                <div className="flex items-center space-x-4 border-l-4 border-gray-100 pl-4">
                 <div className="flex-1">
                   <p className="text-sm font-bold">Dinner Service</p>
                   <p className="text-xs text-gray-400">07:00 PM - 11:00 PM</p>
                 </div>
                 <span className="text-[10px] font-black uppercase text-gray-300">Upcoming</span>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
