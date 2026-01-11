import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api'; // Import our new API tool

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear errors when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Send data to Backend
      await api.post('/register', {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password
      });

      // 2. On Success, redirect to Login
      alert("Account created! Please log in.");
      navigate('/login');

    } catch (err) {
      // 3. Handle Errors
      console.error(err);
      if (err.response && err.response.data.detail) {
        setError(err.response.data.detail); // Server error (e.g. "Email already exists")
      } else {
        setError("Something went wrong. Is the backend running?");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-architect-navy border border-architect-steel/20 p-8 rounded-2xl shadow-xl w-full max-w-md transition-colors duration-300"
      >
        <div className="text-center mb-8">
          <div className="bg-architect-mustard/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transform rotate-3">
            <User className="w-8 h-8 text-architect-mustard" />
          </div>
          <h2 className="text-3xl font-bold text-architect-navy dark:text-architect-ice mb-2">Create Account</h2>
          <p className="text-architect-steel">Start storing files securely today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 flex items-start gap-3 rounded-r-lg">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-architect-navy dark:text-architect-ice mb-2 ml-1">Full Name</label>
            <div className="relative group">
              <User className="w-5 h-5 text-architect-steel absolute left-3 top-3 group-focus-within:text-architect-mustard transition-colors" />
              <input
                type="text"
                name="full_name"
                required
                className="w-full pl-10 pr-4 py-3 bg-architect-ice dark:bg-black/20 border border-architect-steel/30 rounded-xl focus:ring-2 focus:ring-architect-mustard/50 focus:border-architect-mustard outline-none transition-all dark:text-white"
                placeholder="John Doe"
                value={formData.full_name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-architect-navy dark:text-architect-ice mb-2 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="w-5 h-5 text-architect-steel absolute left-3 top-3 group-focus-within:text-architect-mustard transition-colors" />
              <input
                type="email"
                name="email"
                required
                className="w-full pl-10 pr-4 py-3 bg-architect-ice dark:bg-black/20 border border-architect-steel/30 rounded-xl focus:ring-2 focus:ring-architect-mustard/50 focus:border-architect-mustard outline-none transition-all dark:text-white"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-architect-navy dark:text-architect-ice mb-2 ml-1">Password</label>
            <div className="relative group">
              <Lock className="w-5 h-5 text-architect-steel absolute left-3 top-3 group-focus-within:text-architect-mustard transition-colors" />
              <input
                type="password"
                name="password"
                required
                className="w-full pl-10 pr-4 py-3 bg-architect-ice dark:bg-black/20 border border-architect-steel/30 rounded-xl focus:ring-2 focus:ring-architect-mustard/50 focus:border-architect-mustard outline-none transition-all dark:text-white"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-architect-mustard hover:bg-[#e0a615] text-architect-navy font-bold py-3.5 rounded-xl shadow-lg shadow-architect-mustard/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Create Account"
            )}
          </motion.button>
        </form>

        <p className="text-center mt-8 text-sm text-architect-steel">
          Already have an account?{' '}
          <Link to="/login" className="text-architect-mustard hover:text-[#e0a615] font-bold underline decoration-2 underline-offset-4">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;