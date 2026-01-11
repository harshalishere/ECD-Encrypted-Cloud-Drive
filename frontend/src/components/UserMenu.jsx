import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, PieChart, HelpCircle, FileText, LogOut, ChevronRight, Moon, Sun, 
  Camera, Lock, Shield, Smartphone, Palette, CreditCard, ChevronLeft, Globe, Zap 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnalyticsModal from './AnalyticsModal';
import AvatarModal from './AvatarModal';
import SupportModal from './SupportModal';
import SecurityModal from './SecurityModal';
import { fetchStorageStats } from '../services/api';
import toast from 'react-hot-toast';

const UserMenu = () => {
  const navigate = useNavigate();
  
  // --- STATE DEFINITIONS (Must be present!) ---
  const [isOpen, setIsOpen] = useState(false);
  const [menuView, setMenuView] = useState('main'); // 'main', 'security', 'support', 'themes', 'account'
  const [stats, setStats] = useState(null);
  const [isDark, setIsDark] = useState(false);
  
  // FIX: Avatar State with Safe Initializer
  const [avatar, setAvatar] = useState(() => {
    return localStorage.getItem('userAvatar') || 'https://api.dicebear.com/9.x/notionists/svg?seed=Felix';
  });
  
  // Real User Data
  const [deviceInfo, setDeviceInfo] = useState({ browser: 'Unknown', os: 'Unknown', ip: 'Loading...' });

  // Modals
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [supportView, setSupportView] = useState('support'); 
  const [showSecurity, setShowSecurity] = useState(false);

  const menuRef = useRef(null);

  // --- 1. DATA & THEME SETUP ---
  useEffect(() => {
    // A. Detect Dark Mode
    if (document.documentElement.classList.contains('dark')) setIsDark(true);
    
    // B. Restore Color Theme
    const savedTheme = localStorage.getItem('appTheme') || 'theme-mustard';
    const isDarkMode = document.documentElement.classList.contains('dark');
    document.documentElement.className = isDarkMode ? `dark ${savedTheme}` : savedTheme;

    // C. Get Real Data (Browser/IP)
    const getRealData = async () => {
      const userAgent = navigator.userAgent;
      let browser = "Chrome"; 
      if (userAgent.includes("Firefox")) browser = "Firefox";
      else if (userAgent.includes("Safari")) browser = "Safari";
      else if (userAgent.includes("Edge")) browser = "Edge";

      let os = "Windows";
      if (userAgent.includes("Mac")) os = "MacOS";
      else if (userAgent.includes("Linux")) os = "Linux";
      else if (userAgent.includes("Android")) os = "Android";
      else if (userAgent.includes("iPhone")) os = "iOS";

      let ip = "127.0.0.1";
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        ip = data.ip;
      } catch (e) { console.log("IP fetch blocked"); }

      setDeviceInfo({ browser, os, ip });
    };
    getRealData();
  }, []);

  // --- 2. CLICK OUTSIDE & STATS ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        setTimeout(() => setMenuView('main'), 200); 
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) loadStats();
  }, [isOpen]);

  const loadStats = async () => {
    try {
      const data = await fetchStorageStats();
      setStats(data);
    } catch (err) { console.error("Failed to load stats"); }
  };

  // --- 3. ACTIONS ---
  const toggleThemeMode = () => {
    const html = document.documentElement;
    const currentTheme = localStorage.getItem('appTheme') || 'theme-mustard';
    
    if (isDark) {
      html.className = currentTheme; 
      setIsDark(false);
    } else {
      html.className = `dark ${currentTheme}`; 
      setIsDark(true);
    }
  };

  const applyColorTheme = (themeClass) => {
    localStorage.setItem('appTheme', themeClass);
    const isDarkMode = document.documentElement.classList.contains('dark');
    document.documentElement.className = isDarkMode ? `dark ${themeClass}` : themeClass;
    toast.success("Theme Updated!");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  // FIX: Save Avatar to LocalStorage properly
  const handleAvatarSave = (newAvatar) => {
    setAvatar(newAvatar);
    localStorage.setItem('userAvatar', newAvatar);
  };

  // --- HELPER COMPONENTS ---
  const MenuHeader = ({ title }) => (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-white/10">
      <button 
        onClick={() => setMenuView('main')} 
        className="p-1 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10"
      >
        <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
      </button>
      <span className="font-bold text-slate-800 dark:text-white">{title}</span>
    </div>
  );

  const MenuItem = ({ icon: Icon, label, onClick, danger, rightArrow, subtext }) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors group ${
        danger 
          ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10' 
          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${danger ? 'text-red-500' : 'text-slate-500 dark:text-slate-400 group-hover:text-accent transition-colors'}`} />
        <div className="text-left">
          <span className="block font-semibold text-slate-800 dark:text-slate-100">{label}</span>
          {subtext && <span className="text-xs text-slate-500 font-medium">{subtext}</span>}
        </div>
      </div>
      {rightArrow && <ChevronRight className="w-4 h-4 text-slate-400" />}
    </button>
  );

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full ring-2 ring-accent shadow-lg hover:scale-105 transition-transform overflow-hidden relative bg-white"
      >
        <img src={avatar} alt="User" className="w-full h-full object-cover" />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence mode='wait'>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-3 w-80 bg-white dark:bg-architect-navy rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden z-50 origin-top-right max-h-[85vh] flex flex-col"
          >
            
            {/* VIEW: MAIN */}
            {menuView === 'main' && (
              <motion.div 
                key="main"
                initial={{ x: -20, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Profile Header */}
                <div className="p-5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-center relative">
                   <div className="relative w-20 h-20 mx-auto mb-3 group cursor-pointer" onClick={() => { setIsOpen(false); setShowAvatarModal(true); }}>
                      <img src={avatar} alt="User" className="w-full h-full object-cover rounded-full border-4 border-white dark:border-slate-700 shadow-md" />
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <Camera className="w-6 h-6 text-white" />
                      </div>
                   </div>
                   <h3 className="font-bold text-lg text-slate-800 dark:text-white">My Account</h3>
                   <p className="text-xs font-medium text-slate-500 mb-3">Free Tier • {stats?.total_used_mb || 0} MB Used</p>
                </div>

                {/* Main Options */}
                <div className="py-2">
                  <MenuItem icon={Shield} label="Security" rightArrow onClick={() => setMenuView('security')} />
                  <MenuItem icon={Palette} label="Personalisation" rightArrow onClick={() => setMenuView('themes')} />
                  <MenuItem icon={HelpCircle} label="Support & Help" rightArrow onClick={() => setMenuView('support')} />
                  <MenuItem icon={User} label="Account Details" rightArrow onClick={() => setMenuView('account')} />
                  
                  <div className="mt-2 border-t border-slate-200 dark:border-white/10 pt-2">
                    <MenuItem icon={LogOut} label="Log Out" danger onClick={handleLogout} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW: SECURITY */}
            {menuView === 'security' && (
              <motion.div 
                key="security"
                initial={{ x: 20, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MenuHeader title="Security" />
                <div className="py-2">
                   {/* Real Info Card */}
                   <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 mx-4 rounded-xl mb-2 border border-blue-100 dark:border-blue-800">
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-2">Current Session</p>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white">
                         <Globe className="w-4 h-4 text-green-500" />
                         {deviceInfo.ip}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">
                         <Smartphone className="w-3 h-3" />
                         {deviceInfo.browser} on {deviceInfo.os}
                      </div>
                   </div>

                   <MenuItem icon={Lock} label="Encryption Settings" subtext="AES-256 Active" onClick={() => { setIsOpen(false); setShowSecurity(true); }} />
                   <MenuItem icon={Shield} label="Login Activity" onClick={() => { setIsOpen(false); setShowSecurity(true); }} />
                </div>
              </motion.div>
            )}

            {/* VIEW: THEMES */}
            {menuView === 'themes' && (
              <motion.div 
                key="themes"
                initial={{ x: 20, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
              >
                <MenuHeader title="Personalisation" />
                <div className="py-2">
                  <MenuItem icon={isDark ? Sun : Moon} label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"} onClick={toggleThemeMode} />
                  
                  <div className="px-4 py-4">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-3">Accent Color</p>
                    <div className="grid grid-cols-5 gap-3">
                      <button onClick={() => applyColorTheme('theme-mustard')} className="w-8 h-8 rounded-full bg-[#ffc636] ring-2 ring-offset-2 ring-transparent hover:ring-slate-300 transition-all shadow-sm" title="Mustard"></button>
                      <button onClick={() => applyColorTheme('theme-ocean')}   className="w-8 h-8 rounded-full bg-[#3b82f6] ring-2 ring-offset-2 ring-transparent hover:ring-slate-300 transition-all shadow-sm" title="Ocean"></button>
                      <button onClick={() => applyColorTheme('theme-forest')}  className="w-8 h-8 rounded-full bg-[#10b981] ring-2 ring-offset-2 ring-transparent hover:ring-slate-300 transition-all shadow-sm" title="Forest"></button>
                      <button onClick={() => applyColorTheme('theme-royal')}   className="w-8 h-8 rounded-full bg-[#8b5cf6] ring-2 ring-offset-2 ring-transparent hover:ring-slate-300 transition-all shadow-sm" title="Royal"></button>
                      <button onClick={() => applyColorTheme('theme-sunset')}  className="w-8 h-8 rounded-full bg-[#f97316] ring-2 ring-offset-2 ring-transparent hover:ring-slate-300 transition-all shadow-sm" title="Sunset"></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW: SUPPORT */}
            {menuView === 'support' && (
               <motion.div 
                 key="support"
                 initial={{ x: 20, opacity: 0 }} 
                 animate={{ x: 0, opacity: 1 }}
                 exit={{ x: 20, opacity: 0 }}
               >
                 <MenuHeader title="Support" />
                 <div className="py-2">
                   <MenuItem icon={HelpCircle} label="FAQs & Contact" onClick={() => { setSupportView('support'); setShowSupport(true); setIsOpen(false); }} />
                   <MenuItem icon={FileText} label="Privacy Policy" onClick={() => { setSupportView('docs'); setShowSupport(true); setIsOpen(false); }} />
                   <div className="px-4 py-4 mt-2">
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                         <p className="text-xs text-indigo-700 dark:text-indigo-300 font-bold mb-1">Need urgent help?</p>
                         <div className="flex items-center gap-2">
                            <Zap className="w-3 h-3 text-indigo-500" />
                            <p className="text-[10px] text-indigo-600 dark:text-indigo-400">dhawanharshal77@gmail.com</p>
                         </div>
                      </div>
                   </div>
                 </div>
               </motion.div>
            )}

            {/* VIEW: ACCOUNT */}
            {menuView === 'account' && (
              <motion.div 
                key="account"
                initial={{ x: 20, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
              >
                <MenuHeader title="Account" />
                <div className="py-2">
                   <MenuItem icon={PieChart} label="Storage Analytics" onClick={() => { setShowAnalytics(true); setIsOpen(false); }} />
                   <MenuItem icon={CreditCard} label="Premium Plan" subtext="Coming Soon" onClick={() => toast.success("Premium Coming Soon!")} />
                </div>
              </motion.div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

      {/* MODALS */}
      <AvatarModal isOpen={showAvatarModal} onClose={() => setShowAvatarModal(false)} onSave={handleAvatarSave} />
      <AnalyticsModal isOpen={showAnalytics} onClose={() => setShowAnalytics(false)} stats={stats} />
      <SupportModal isOpen={showSupport} onClose={() => setShowSupport(false)} view={supportView} />
      <SecurityModal isOpen={showSecurity} onClose={() => setShowSecurity(false)} />

    </div>
  );
};

export default UserMenu;