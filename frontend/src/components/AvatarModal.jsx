import { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { motion } from 'framer-motion';
import { X, Upload, Check, Image as ImageIcon, ZoomIn, Loader2 } from 'lucide-react';
import { getCroppedImg } from '../utils/cropUtils';

// 20 Animal Avatars (High Quality SVGs from DiceBear)
const ANIMAL_AVATARS = Array.from({ length: 20 }).map((_, i) => 
  `https://api.dicebear.com/9.x/notionists/svg?seed=Animal${i}&backgroundColor=e5e7eb`
);

const AvatarModal = ({ isOpen, onClose, onSave }) => {
  // --- 1. HOOKS MUST BE HERE (BEFORE ANY RETURN) ---
  const [activeTab, setActiveTab] = useState('presets');
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setActiveTab('presets');
      setImageSrc(null);
      setZoom(1);
    }
  }, [isOpen]);

  // --- 2. NOW WE CAN RETURN NULL ---
  if (!isOpen) return null;

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result);
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSaveCrop = async () => {
    setIsProcessing(true);
    try {
      if (!imageSrc) return;
      // This now returns a Base64 string (starts with "data:image/jpeg...")
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      onSave(croppedImage); // Send back to UserMenu
      onClose(); // Close modal
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-architect-navy w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header - Uses Dynamic Accent Color */}
        <div className="bg-accent p-4 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-architect-navy flex items-center gap-2">
            <ImageIcon className="w-5 h-5" /> Choose Avatar
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-full">
            <X className="w-5 h-5 text-architect-navy" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-white/10 shrink-0">
          <button onClick={() => setActiveTab('presets')} className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'presets' ? 'border-b-4 border-accent text-slate-800 dark:text-accent' : 'text-slate-500'}`}>
            Animal Avatars
          </button>
          <button onClick={() => setActiveTab('upload')} className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'upload' ? 'border-b-4 border-accent text-slate-800 dark:text-accent' : 'text-slate-500'}`}>
            Upload Photo
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto custom-scrollbar h-96 bg-slate-50 dark:bg-black/20">
          {activeTab === 'presets' ? (
            <div className="grid grid-cols-4 gap-4">
              {ANIMAL_AVATARS.map((url, index) => (
                <button
                  key={index}
                  onClick={() => { onSave(url); onClose(); }}
                  className="aspect-square rounded-full bg-white dark:bg-white/10 shadow-sm border-2 border-transparent hover:border-accent hover:scale-110 transition-all p-1 overflow-hidden"
                >
                  <img src={url} alt={`Avatar ${index}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          ) : (
            !imageSrc ? (
              <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                <Upload className="w-12 h-12 text-slate-400 mb-3" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-4">Select an image to crop</p>
                <label className="bg-accent text-architect-navy px-6 py-2.5 rounded-xl font-bold cursor-pointer hover:brightness-110 shadow-lg">
                  Choose File
                  <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                </label>
              </div>
            ) : (
              <div className="relative h-full w-full rounded-xl overflow-hidden bg-black shadow-inner">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  cropShape="round"
                />
              </div>
            )
          )}
        </div>

        {/* Footer (Zoom Controls for Upload) */}
        {activeTab === 'upload' && imageSrc && (
          <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-architect-navy flex items-center gap-4 shrink-0">
            <ZoomIn className="w-5 h-5 text-slate-500" />
            <input 
              type="range" value={zoom} min={1} max={3} step={0.1} 
              onChange={(e) => setZoom(e.target.value)} 
              className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[var(--accent-color)]" 
            />
            <button 
              onClick={handleSaveCrop} 
              disabled={isProcessing} 
              className="bg-accent text-architect-navy px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:brightness-110 shadow-md"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} 
              Save Avatar
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AvatarModal;