import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  // Check system preference or localStorage
  const [isDark, setIsDark] = useState(() => {
    if (localStorage.getItem('theme')) {
      return localStorage.getItem('theme') === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="relative p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-yellow-400 transition-colors duration-300 focus:outline-none"
      title="Toggle Theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180  }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-orange-500" />}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;