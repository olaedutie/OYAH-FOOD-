export default function LocationHours() {
  const hours = [
    { days: "Monday", time: "10:00 AM - 10:00 PM" },
    { days: "Tuesday", time: "10:00 AM - 10:00 PM" },
    { days: "Wednesday", time: "10:00 AM - 10:00 PM" },
    { days: "Thursday", time: "10:00 AM - 10:00 PM" },
    { days: "Friday", time: "10:00 AM - 11:00 PM" },
    { days: "Saturday", time: "11:00 AM - 11:00 PM" },
    { days: "Sunday", time: "11:00 AM - 9:00 PM" },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Map Side */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-primary font-bold uppercase tracking-widest text-sm">Where we are</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl text-secondary tracking-tighter italic leading-[0.9]">
                Find Us <span className="not-italic">Nearby</span>
              </h2>
            </div>
            
            <div className="rounded-[2.5rem] overflow-hidden grayscale contrast-125 border border-gray-100 shadow-xl h-[450px]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15859.355152341235!2d3.3366378499999997!3d6.4147458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8af63c05a301%3A0x109bd3c9993309a7!2sLagos!5e0!3m2!1sen!2sng!4v1713292400000!5m2!1sen!2sng" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="bg-surface p-10 rounded-[2rem] border border-gray-50 flex flex-col md:flex-row justify-between gap-8">
               <div className="space-y-2">
                 <p className="text-xs uppercase font-black tracking-widest text-gray-400">Our Address</p>
                 <p className="text-lg font-bold text-secondary">123 Flavor Street, Culinary City, CC 45678</p>
               </div>
               <div className="space-y-2">
                 <p className="text-xs uppercase font-black tracking-widest text-gray-400">Reservation Line</p>
                 <p className="text-lg font-bold text-primary">+1 (555) 123-4567</p>
               </div>
            </div>
          </div>

          {/* Hours Side */}
          <div className="bg-secondary rounded-[3rem] p-12 lg:p-16 text-white self-center">
             <div className="mb-12">
               <h3 className="text-3xl font-bold mb-4">Opening Hours</h3>
               <p className="text-white/50 text-sm">We welcome you to experience our flavors during these hours.</p>
             </div>

             <div className="space-y-6">
               {hours.map((h, i) => (
                 <div key={i} className="flex justify-between items-center pb-6 border-b border-white/10 last:border-0 last:pb-0">
                    <span className={`text-sm tracking-wide ${i >= 5 ? 'text-primary' : 'text-white'}`}>{h.days}</span>
                    <span className="text-sm font-bold font-mono">{h.time}</span>
                 </div>
               ))}
             </div>

             <div className="mt-12 bg-white/5 p-8 rounded-2xl border border-white/5">
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Special Note</p>
                <p className="text-sm text-white/60 italic leading-relaxed">
                   "We are closed on major public holidays. Please call ahead for private event inquiries."
                </p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
