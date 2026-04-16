import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn } from 'lucide-react';

export default function Login() {
  const { user, isAdmin, login, loading } = useAuth();
  const [error, setError] = useState('');

  if (loading) return null;
  if (user && isAdmin) return <Navigate to="/admin" />;

  const handleLogin = async () => {
    try {
      await login();
    } catch (err) {
      setError('Failed to login. Please ensure you are using an authorized administrator account.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-secondary">
       {/* Background Decoration */}
       <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
       <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

       <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] relative z-10 mx-4"
       >
          <div className="text-center mb-10 space-y-4">
            <h1 className="text-4xl font-display font-black tracking-tighter text-white">
              OYAH<span className="text-primary">ADMIN</span>
            </h1>
            <p className="text-white/60 text-sm">Secure access for restaurant management staff.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <button 
            onClick={handleLogin}
            className="w-full bg-primary text-white py-5 rounded-3xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <LogIn size={20} />
            Sign in with Google
          </button>

          <p className="mt-8 text-center text-xs text-white/30">
            For security reasons, only whitelisted administrator emails can access this portal.
          </p>
       </motion.div>
    </div>
  );
}
