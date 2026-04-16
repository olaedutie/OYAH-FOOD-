import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ReservationStatus } from '../../types';
import { Calendar, Clock, Users, Phone, User, CheckCircle2 } from 'lucide-react';

export default function ReservationForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: 2
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await addDoc(collection(db, 'reservations'), {
        ...formData,
        status: ReservationStatus.PENDING,
        created_at: new Date().toISOString()
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Reservation error:", err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="book-a-table" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/reservation-bg/1920/1200" 
          alt="Atmosphere" 
          className="w-full h-full object-cover opacity-10 grayscale"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="section-container relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 sleek-card overflow-hidden">
            {/* Contact Info Side */}
            <div className="lg:col-span-2 bg-secondary text-white p-12 lg:p-14 space-y-10">
              <div className="space-y-4">
                 <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-2">
                   Quick Booking
                </h2>
                <p className="text-white/60 text-[15px] leading-relaxed pt-2">
                  Secure your table instantly. Experience the finest dining OYAH has to offer.
                </p>
              </div>

              <div className="space-y-6 pt-6">
                <div className="flex items-center gap-5 group">
                  <div className="w-11 h-11 rounded-lg bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">Call support</p>
                    <p className="text-base font-bold">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="w-11 h-11 rounded-lg bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">Open Hours</p>
                    <p className="text-base font-bold">10:00 AM - 11:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="lg:col-span-3 bg-white p-12 lg:p-14">
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold uppercase tracking-wide text-muted">Full Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="John Doe"
                        className="w-full p-4 text-[14px] font-medium"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[12px] font-bold uppercase tracking-wide text-muted">Guests</label>
                        <select 
                          className="w-full p-4 text-[14px] font-medium appearance-none"
                          value={formData.guests}
                          onChange={e => setFormData({...formData, guests: parseInt(e.target.value)})}
                        >
                          <option value={2}>2 People</option>
                          <option value={4}>4 People</option>
                          <option value={6}>6+ People</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[12px] font-bold uppercase tracking-wide text-muted">Time</label>
                        <input 
                          required
                          type="time" 
                          className="w-full p-4 text-[14px] font-medium"
                          value={formData.time}
                          onChange={e => setFormData({...formData, time: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[12px] font-bold uppercase tracking-wide text-muted">Date</label>
                      <input 
                        required
                        type="date" 
                        className="w-full p-4 text-[14px] font-medium"
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                      />
                    </div>

                    <div className="pt-4">
                      <button 
                        disabled={isSubmitting}
                        className="w-full sleek-btn bg-primary text-white text-[15px] shadow-lg shadow-primary/20 hover:shadow-primary/30"
                      >
                        {isSubmitting ? 'Confirming...' : 'Confirm Reservation'}
                      </button>
                      <p className="text-[11px] text-center text-muted mt-4 font-medium">Instant confirmation sent to your email.</p>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-6"
                  >
                    <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center">
                      <CheckCircle2 size={48} className="text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-secondary mb-2">Reservation Sent!</h3>
                      <p className="text-gray-500 max-w-xs mx-auto">
                        We've received your request. Our staff will call or email you shortly to confirm your booking.
                      </p>
                    </div>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="text-primary font-bold hover:underline"
                    >
                      Book another table
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
