import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Download, FileText, AlertCircle } from 'lucide-react';
import api from '../services/api'; // Direct axios access for custom blob handling

const FilePreviewModal = ({ file, isOpen, onClose }) => {
  const [contentUrl, setContentUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && file) {
      loadFile();
    } else {
      // Cleanup URL to free memory when closed
      if (contentUrl) URL.revokeObjectURL(contentUrl);
      setContentUrl(null);
      setError(null);
    }
  }, [isOpen, file]);

  const loadFile = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Request the file as a BLOB (Binary Large Object)
      const response = await api.get(`/files/${file.id}/download`, {
        responseType: 'blob'
      });

      // 2. Create a temporary URL for the browser to render it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setContentUrl(url);
    } catch (err) {
      console.error(err);
      setError("Failed to decrypt or load file preview.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !file) return null;

  // Determine File Type
  const ext = file.filename.split('.').pop().toLowerCase();
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
  const isVideo = ['mp4', 'webm', 'mov'].includes(ext);
  const isPDF = ['pdf'].includes(ext);
  const isSupported = isImage || isVideo || isPDF;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full h-full max-w-6xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center text-white mb-4 px-2">
          <div className="flex items-center gap-3">
            <div className="bg-architect-mustard p-2 rounded-lg text-architect-navy">
              {isSupported ? (isImage ? "Image" : isVideo ? "Video" : "Document") : "File"}
            </div>
            <div>
              <h3 className="font-bold text-lg">{file.filename}</h3>
              <p className="text-xs opacity-70">Secure Decrypted Preview</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Download Button */}
            {contentUrl && (
              <a 
                href={contentUrl} 
                download={file.filename}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                title="Download Original"
              >
                <Download className="w-5 h-5" />
              </a>
            )}
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Preview Content Area */}
        <div className="flex-1 bg-black/50 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden relative">
          
          {loading && (
            <div className="flex flex-col items-center gap-3 text-architect-mustard">
              <Loader2 className="w-10 h-10 animate-spin" />
              <p className="text-sm font-bold animate-pulse">Decrypting content...</p>
            </div>
          )}

          {error && (
            <div className="text-center text-red-400">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-80" />
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && contentUrl && (
            <>
              {isImage && (
                <img src={contentUrl} alt="Preview" className="max-w-full max-h-full object-contain shadow-2xl" />
              )}

              {isVideo && (
                <video controls autoPlay className="max-w-full max-h-full rounded-lg shadow-2xl">
                  <source src={contentUrl} type={`video/${ext === 'mov' ? 'mp4' : ext}`} />
                  Your browser does not support the video tag.
                </video>
              )}

              {isPDF && (
                <iframe src={contentUrl} className="w-full h-full rounded-lg bg-white" title="PDF Preview" />
              )}

              {!isSupported && (
                <div className="text-center text-white/50">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Preview not available for this file type.</p>
                  <p className="text-sm mt-2">Please download to view.</p>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FilePreviewModal;