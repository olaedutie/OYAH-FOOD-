import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { AppSettings } from '../../types';
import { motion } from 'motion/react';
import { Save, RefreshCw, MapPin, Phone, Mail, Clock, Palette, Settings as SettingsIcon } from 'lucide-react';

export default function SettingsEditor() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'global');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data() as AppSettings);
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSuccess(false);

    try {
      await setDoc(doc(db, 'settings', 'global'), settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
    }
    setSaving(false);
  };

  const updateHours = (day: string, value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      opening_hours: {
        ...settings.opening_hours,
        [day]: value
      }
    });
  };

  if (loading) return <div className="p-10">Loading settings...</div>;
  if (!settings) return <div className="p-10">Failed to load settings.</div>;

  return (
    <div className="max-w-5xl">
       <form onSubmit={handleSave} className="space-y-12">
          {/* General Info */}
          <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm space-y-10">
             <div className="flex items-center gap-4 border-b border-gray-50 pb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                   <SettingsIcon size={24} />
                </div>
                <h3 className="text-xl font-bold text-secondary">General Information</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Restaurant Name</label>
                  <input 
                    type="text" 
                    className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary font-bold"
                    value={settings.restaurant_name}
                    onChange={e => setSettings({...settings, restaurant_name: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contact Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      type="email" 
                      className="w-full p-5 pl-12 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary font-bold"
                      value={settings.email}
                      onChange={e => setSettings({...settings, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      type="tel" 
                      className="w-full p-5 pl-12 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary font-bold font-mono"
                      value={settings.phone}
                      onChange={e => setSettings({...settings, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-4 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      type="text" 
                      className="w-full p-5 pl-12 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary font-bold"
                      value={settings.address}
                      onChange={e => setSettings({...settings, address: e.target.value})}
                    />
                  </div>
                </div>
             </div>
          </div>

          {/* Opening Hours */}
          <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm space-y-10">
             <div className="flex items-center gap-4 border-b border-gray-50 pb-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                   <Clock size={24} />
                </div>
                <h3 className="text-xl font-bold text-secondary">Opening Hours</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.keys(settings.opening_hours).map((day) => (
                   <div key={day} className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{day}</label>
                      <input 
                        type="text" 
                        className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary font-bold font-mono"
                        value={settings.opening_hours[day]}
                        onChange={e => updateHours(day, e.target.value)}
                      />
                   </div>
                ))}
             </div>
          </div>

          {/* Design Settings */}
          <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm space-y-10">
             <div className="flex items-center gap-4 border-b border-gray-50 pb-8">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                   <Palette size={24} />
                </div>
                <h3 className="text-xl font-bold text-secondary">Visual Identity</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Primary Theme Color</label>
                  <div className="flex gap-4 items-center">
                     <div className="w-16 h-16 rounded-2xl shadow-inner border border-gray-100" style={{ backgroundColor: settings.theme_color }}></div>
                     <input 
                        type="text" 
                        className="flex-1 p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary font-bold font-mono"
                        value={settings.theme_color}
                        onChange={e => setSettings({...settings, theme_color: e.target.value})}
                     />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Main Display Font</label>
                  <select 
                    className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary font-bold"
                    value={settings.font}
                    onChange={e => setSettings({...settings, font: e.target.value})}
                  >
                    <option value="Poppins">Poppins</option>
                    <option value="Inter">Inter</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Playfair Display">Playfair Display</option>
                  </select>
                </div>
             </div>
          </div>

          {/* Sticky Fixer */}
          <div className="h-20"></div>

          {/* Action Bar */}
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-40">
             <button 
              type="submit"
              disabled={saving}
              className={`w-full py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl transition-all ${
                success ? 'bg-green-500 text-white' : 'bg-primary text-white shadow-primary/30 hover:scale-[1.05]'
              }`}
             >
               {saving ? <RefreshCw className="animate-spin" size={20} /> : (success ? <Save size={20} /> : <Save size={20} />)}
               {saving ? 'Applying Changes...' : (success ? 'Changes Saved!' : 'Save Settings')}
             </button>
          </div>
       </form>
    </div>
  );
}
