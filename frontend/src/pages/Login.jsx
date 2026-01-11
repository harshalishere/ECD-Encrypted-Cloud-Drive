import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, Loader2, Moon, Sun } from 'lucide-react'; 
import { loginUser } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false); 

  // Initialize Theme Check
  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) setIsDark(true);
  }, []);

  // Theme Toggle Function
  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove('dark');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      setIsDark(true);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await loginUser(formData.email, formData.password);
      
      // 1. Save Token
      localStorage.setItem('token', data.access_token);
      
      // 2. Navigate to Dashboard 
      // (The ProtectedRoute in App.jsx will now allow this)
      navigate('/dashboard');

    } catch (err) {
      console.error(err); // Good for debugging
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-architect-ice dark:bg-architect-navy flex items-center justify-center p-4 transition-colors duration-300 relative">
      
      {/* --- PUBLIC THEME TOGGLE (Floating Top Right) --- */}
      <button 
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 bg-white dark:bg-white/10 rounded-full shadow-lg text-architect-navy dark:text-architect-ice hover:scale-110 transition-transform"
        title="Toggle Theme"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white dark:bg-black/20 w-full max-w-md rounded-3xl shadow-2xl p-8 border border-architect-steel/10"
      >
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-architect-mustard rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-architect-mustard/30">
              <ShieldCheck className="w-8 h-8 text-architect-navy" />
            </div>
            <h1 className="text-3xl font-extrabold text-architect-navy dark:text-white tracking-tight">Welcome Back</h1>
            <p className="text-architect-steel mt-2">Sign in to your secure vault</p>
        </div>

        {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-200 p-3 rounded-xl text-sm mb-6 text-center font-medium border border-red-100 dark:border-red-800/30">
              {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-architect-navy dark:text-architect-ice ml-1 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-architect-steel" />
                <input 
                  type="email" 
                  name="email"
                  required
                  className="w-full bg-architect-ice dark:bg-white/5 border-2 border-transparent focus:border-architect-mustard dark:focus:border-architect-mustard rounded-xl py-3 pl-12 pr-4 outline-none text-architect-navy dark:text-white font-medium transition-all placeholder:text-architect-steel/50"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-architect-navy dark:text-architect-ice ml-1 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-architect-steel" />
                <input 
                  type="password" 
                  name="password"
                  required
                  className="w-full bg-architect-ice dark:bg-white/5 border-2 border-transparent focus:border-architect-mustard dark:focus:border-architect-mustard rounded-xl py-3 pl-12 pr-4 outline-none text-architect-navy dark:text-white font-medium transition-all placeholder:text-architect-steel/50"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-architect-navy dark:bg-white text-white dark:text-architect-navy font-bold py-4 rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
            </button>
        </form>

        <p className="text-center mt-8 text-architect-steel text-sm">
            Don't have an account? 
            {/* UPDATED LINK: /register -> /signup */}
            <Link to="/signup" className="text-architect-mustard font-bold hover:underline ml-1">Create Access</Link>
        </p>

      </motion.div>
    </div>
  );
};

export default Login;