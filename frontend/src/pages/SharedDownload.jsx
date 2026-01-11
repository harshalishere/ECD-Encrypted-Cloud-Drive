import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Shield, FileText, Lock, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { getShareInfo, downloadSharedFile } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

const SharedDownload = () => {
  const { hash } = useParams(); // Get the unique code from URL
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [downloading, setDownloading] = useState(false);

  // 1. Fetch File Info on Load
  useEffect(() => {
    const loadInfo = async () => {
      try {
        const data = await getShareInfo(hash);
        setInfo(data);
      } catch (err) {
        setError(err.response?.status === 410 ? "This link has expired." : "Invalid or broken link.");
      } finally {
        setLoading(false);
      }
    };
    loadInfo();
  }, [hash]);

  // 2. Handle Download
  const handleDownload = async (e) => {
    e.preventDefault();
    setDownloading(true);
    const toastId = toast.loading("Decrypting file...");

    try {
      const response = await downloadSharedFile(hash, password);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', info.filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      toast.success("Download started!", { id: toastId });
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Incorrect Password", { id: toastId });
      } else {
        toast.error("Download failed", { id: toastId });
      }
    } finally {
      setDownloading(false);
    }
  };

  // RENDER: Loading State
  if (loading) return (
    <div className="min-h-screen bg-architect-navy flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-architect-mustard animate-spin" />
    </div>
  );

  // RENDER: Error State (Expired/Invalid)
  if (error) return (
    <div className="min-h-screen bg-architect-navy flex items-center justify-center p-4">
      <div className="bg-white dark:bg-black/20 border border-red-500/50 p-8 rounded-2xl text-center max-w-md">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-red-500 mb-2">Link Unavailable</h2>
        <p className="text-architect-steel">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-architect-ice dark:bg-architect-navy flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff' } }} />

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-lg bg-white dark:bg-black/20 border border-architect-steel/20 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-architect-mustard p-6 text-center">
          <div className="w-16 h-16 bg-black/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Shield className="w-8 h-8 text-architect-navy" />
          </div>
          <h1 className="text-2xl font-bold text-architect-navy">Secure Transfer</h1>
          <p className="text-architect-navy/70 font-medium text-sm mt-1">Zero-Knowledge Encrypted</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          
          {/* File Details */}
          <div className="flex items-center gap-4 p-4 bg-architect-ice dark:bg-white/5 rounded-xl border border-architect-steel/10">
            <div className="p-3 bg-white dark:bg-architect-navy rounded-lg shadow-sm">
              <FileText className="w-6 h-6 text-architect-mustard" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-architect-navy dark:text-architect-ice truncate">{info.filename}</h3>
              <p className="text-xs text-architect-steel uppercase tracking-wider">{info.size} • {new Date(info.upload_date).toLocaleDateString()}</p>
            </div>
          </div>

          <form onSubmit={handleDownload} className="space-y-4">
            {info.is_protected && (
              <div>
                <label className="block text-xs font-bold text-architect-steel uppercase mb-2 ml-1">Password Required</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-architect-steel" />
                  <input 
                    type="password" 
                    required
                    placeholder="Enter file password"
                    className="w-full pl-10 pr-4 py-3 bg-architect-ice dark:bg-black/40 border-2 border-transparent focus:border-architect-mustard rounded-xl outline-none text-architect-navy dark:text-white transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={downloading}
              className="w-full py-4 bg-architect-navy dark:bg-architect-ice hover:opacity-90 text-white dark:text-architect-navy font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {downloading ? <Loader2 className="animate-spin" /> : <Download className="w-5 h-5" />}
              {downloading ? "Decrypting..." : "Download File"}
            </button>
          </form>

          <div className="text-center">
            <p className="text-xs text-architect-steel flex items-center justify-center gap-1">
              <CheckCircle className="w-3 h-3" /> Scanned for malware
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SharedDownload;