import { motion } from 'framer-motion';
import { X, Shield, Activity, Lock, Smartphone, ToggleRight, ToggleLeft } from 'lucide-react';
import { useState } from 'react';

const SecurityModal = ({ isOpen, onClose }) => {
  // Mock Data
  const [twoFactor, setTwoFactor] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  if (!isOpen) return null;

  // Mock Login Activity (IST Times)
  const activities = [
    { device: "Chrome / Windows 11", location: "Mumbai, Maharashtra", ip: "103.21.12.45", time: "Today, 3:30 PM IST", status: "Active Now" },
    { device: "Safari / iPhone 15", location: "Pune, Maharashtra", ip: "45.112.98.12", time: "Yesterday, 8:15 PM IST", status: "Signed Out" },
    { device: "Firefox / MacOS", location: "Bangalore, Karnataka", ip: "112.45.67.89", time: "Jan 08, 10:00 AM IST", status: "Signed Out" },
  ];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-architect-navy w-full max-w-lg rounded-2xl shadow-2xl border border-architect-steel/20 overflow-hidden"
      >
        <div className="bg-architect-mustard p-4 flex justify-between items-center">
          <h3 className="font-bold text-architect-navy flex items-center gap-2">
            <Shield className="w-5 h-5" /> Security Center
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-full">
            <X className="w-5 h-5 text-architect-navy" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          {/* Encryption Status */}
          <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
              <Lock className="w-5 h-5 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="text-sm font-bold text-green-800 dark:text-green-200">AES-256 Encryption Active</p>
              <p className="text-xs text-green-600 dark:text-green-400">Your files are encrypted before upload.</p>
            </div>
          </div>

          {/* Settings */}
          <div>
            <h4 className="text-xs font-bold text-architect-steel uppercase tracking-wider mb-3">Settings</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-architect-navy dark:text-white">Two-Factor Authentication</span>
                <button onClick={() => setTwoFactor(!twoFactor)} className="text-architect-mustard">
                  {twoFactor ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-architect-steel" />}
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-architect-navy dark:text-white">Login Alerts</span>
                <button onClick={() => setLoginAlerts(!loginAlerts)} className="text-architect-mustard">
                  {loginAlerts ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-architect-steel" />}
                </button>
              </div>
            </div>
          </div>

          {/* Login Activity */}
          <div>
            <h4 className="text-xs font-bold text-architect-steel uppercase tracking-wider mb-3 flex items-center gap-2">
              <Activity className="w-3 h-3" /> Login Activity
            </h4>
            <div className="space-y-3">
              {activities.map((act, idx) => (
                <div key={idx} className="flex justify-between items-start py-2 border-b border-architect-steel/10 last:border-0">
                  <div className="flex gap-3">
                    <Smartphone className="w-5 h-5 text-architect-steel mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-architect-navy dark:text-white">{act.device}</p>
                      <p className="text-xs text-architect-steel">{act.location} • {act.ip}</p>
                      <p className="text-xs text-architect-steel/70">{act.time}</p>
                    </div>
                  </div>
                  {act.status === "Active Now" && (
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Active</span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default SecurityModal;