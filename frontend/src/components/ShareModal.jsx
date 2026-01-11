import { useState } from 'react';
import { X, Copy, QrCode, Lock, Clock, Check } from 'lucide-react';
import QRCode from 'react-qr-code';
import { createShareLink } from '../services/api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ShareModal = ({ file, isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [expiry, setExpiry] = useState('60'); 
  const [result, setResult] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      const data = await createShareLink(file.id, password || null, parseInt(expiry));
      
      // UPDATED: Use '/s/' for the public link
      const fullUrl = `${window.location.origin}/s/${data.hash}`;
      
      setResult({ ...data, fullUrl });
      toast.success("Link generated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate link. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.fullUrl);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setResult(null);
    setPassword('');
    setCopied(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-architect-navy w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-architect-steel/20"
      >
        {/* Header */}
        <div className="bg-architect-mustard p-4 flex justify-between items-center">
          <h3 className="font-bold text-architect-navy flex items-center gap-2">
            <QrCode className="w-5 h-5" /> Share Securely
          </h3>
          <button onClick={reset} className="p-1 hover:bg-black/10 rounded-full transition-colors">
            <X className="w-5 h-5 text-architect-navy" />
          </button>
        </div>

        <div className="p-6">
          {!result ? (
            // FORM STATE
            <div className="space-y-4">
              <p className="text-sm text-architect-steel">
                Sharing <strong>{file.filename}</strong>
              </p>

              <div>
                <label className="block text-xs font-bold uppercase text-architect-steel mb-1">Optional Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-architect-steel" />
                  <input 
                    type="password"
                    placeholder="Leave empty for public link"
                    className="w-full pl-9 pr-3 py-2 bg-architect-ice dark:bg-black/20 border border-architect-steel/30 rounded-lg text-architect-navy dark:text-architect-ice focus:ring-2 focus:ring-architect-mustard outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-architect-steel mb-1">Expiration</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 w-4 h-4 text-architect-steel" />
                  <select 
                    className="w-full pl-9 pr-3 py-2 bg-architect-ice dark:bg-black/20 border border-architect-steel/30 rounded-lg text-architect-navy dark:text-architect-ice focus:ring-2 focus:ring-architect-mustard outline-none appearance-none"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  >
                    <option value="60">1 Hour</option>
                    <option value="1440">1 Day</option>
                    <option value="10080">7 Days</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={handleCreate}
                disabled={isLoading}
                className="w-full py-3 bg-architect-navy dark:bg-architect-ice text-white dark:text-architect-navy font-bold rounded-xl mt-4 hover:opacity-90 transition-opacity"
              >
                {isLoading ? "Generating Keys..." : "Generate Secure Link"}
              </button>
            </div>
          ) : (
            // RESULT STATE
            <div className="text-center space-y-6">
              <div className="bg-white p-4 rounded-xl inline-block border-4 border-architect-mustard">
                <QRCode value={result.fullUrl} size={150} />
              </div>
              
              <div className="text-left bg-architect-ice dark:bg-black/20 p-3 rounded-lg border border-architect-steel/20 flex items-center justify-between gap-2">
                <code className="text-sm text-architect-navy dark:text-architect-steel truncate flex-1">
                  {result.fullUrl}
                </code>
                <button 
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-architect-steel" />}
                </button>
              </div>

              <p className="text-xs text-architect-steel">
                This link works for anyone until it expires.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ShareModal;