import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-architect-navy w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-red-500/30"
      >
        {/* Header */}
        <div className="bg-red-50 dark:bg-red-900/20 p-4 flex justify-between items-center border-b border-red-100 dark:border-red-900/30">
          <h3 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> {title}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-full transition-colors">
            <X className="w-5 h-5 text-red-600 dark:text-red-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-architect-navy dark:text-architect-ice mb-6">
            {message}
          </p>

          <div className="flex gap-3 justify-end">
            <button 
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-architect-steel hover:bg-architect-ice dark:hover:bg-white/5 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold shadow-lg shadow-red-500/20 transition-all flex items-center gap-2"
            >
              {isDeleting ? "Deleting..." : "Yes, Delete It"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmModal;