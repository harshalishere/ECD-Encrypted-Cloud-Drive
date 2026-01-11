import { useState } from 'react';
import { motion } from 'framer-motion';
import { FolderPlus, X } from 'lucide-react';

const CreateFolderModal = ({ isOpen, onClose, onCreate }) => {
  const [folderName, setFolderName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!folderName.trim()) return;
    onCreate(folderName);
    setFolderName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-architect-navy w-full max-w-sm rounded-2xl shadow-2xl border border-architect-steel/20 overflow-hidden"
      >
        <div className="bg-architect-mustard p-4 flex justify-between items-center">
          <h3 className="font-bold text-architect-navy flex items-center gap-2">
            <FolderPlus className="w-5 h-5" /> New Folder
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-full">
            <X className="w-5 h-5 text-architect-navy" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-architect-steel mb-1">Folder Name</label>
            <input 
              autoFocus
              type="text" 
              className="w-full px-4 py-2 bg-architect-ice dark:bg-black/20 border border-architect-steel/30 rounded-lg text-architect-navy dark:text-architect-ice focus:ring-2 focus:ring-architect-mustard outline-none"
              placeholder="e.g. Project Alpha"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
          </div>
          
          <button 
            type="submit"
            className="w-full py-2 bg-architect-navy dark:bg-architect-ice text-white dark:text-architect-navy font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Create Folder
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateFolderModal;