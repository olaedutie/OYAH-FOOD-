import Hero from '../components/home/Hero';
import About from '../components/home/About';
import MenuSection from '../components/home/Menu';
import ReservationForm from '../components/home/ReservationForm';
import Testimonials from '../components/home/Testimonials';
import LocationHours from '../components/home/LocationHours';
import FAQ from '../components/home/FAQ';
import { useAppInit } from '../hooks/useAppInit';

export default function Home() {
  useAppInit();

  return (
    <div className="scroll-smooth">
      <Hero />
      <About />
      <MenuSection />
      <ReservationForm />
      <Testimonials />
      <LocationHours />
      <FAQ />
    </div>
  );
}
