import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Image, Music, Video, Download, Trash2, Search, UploadCloud, 
  File, ShieldCheck, Loader2, Share2, Folder, FolderPlus, ChevronRight, Home, Eye 
} from 'lucide-react';
import { fetchFolderContent, createFolder, uploadFile, deleteFile, downloadFile, fetchStorageStats } from '../services/api';
import ShareModal from '../components/ShareModal';
import ConfirmModal from '../components/ConfirmModal';
import CreateFolderModal from '../components/CreateFolderModal'; 
import FilePreviewModal from '../components/FilePreviewModal'; 
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar'; 
import TourGuide from '../components/TourGuide';

const Dashboard = () => {
  // DATA STATES
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]); 
  const [stats, setStats] = useState(null); 
  const [currentFolder, setCurrentFolder] = useState(null); 
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: 'Home' }]); 

  // UI STATES
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  // MODALS
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [fileToShare, setFileToShare] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false); 
  
  // PREVIEW STATES
  const [previewFile, setPreviewFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const fileInputRef = useRef(null);
  const dragCounter = useRef(0); 

  useEffect(() => {
    loadContent();
    loadStats(); 
  }, [currentFolder]); 

  const loadContent = async () => {
    setIsLoading(true);
    try {
      const data = await fetchFolderContent(currentFolder);
      setFiles(data?.files || []);
      setFolders(data?.folders || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load content");
      setFiles([]);
      setFolders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await fetchStorageStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats");
    }
  };

  // --- DRAG & DROP ---
  const handleDragEnter = (e) => {
    e.preventDefault(); e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault(); e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) setIsDragging(false);
  };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = async (e) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(false); dragCounter.current = 0;
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) await processFileUpload(droppedFiles[0]);
  };

  const processFileUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    const loadingToast = toast.loading(`Encrypting & Uploading ${file.name}...`);
    try {
      await uploadFile(file, currentFolder);
      await loadContent();
      await loadStats(); 
      toast.success("File uploaded securely!", { id: loadingToast });
    } catch (err) {
      console.error(err);
      toast.error("Upload failed.", { id: loadingToast });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (e) => processFileUpload(e.target.files[0]);

  // --- NAVIGATION ---
  const handleEnterFolder = (folder) => {
    setBreadcrumbs([...breadcrumbs, { id: folder.id, name: folder.name }]);
    setCurrentFolder(folder.id);
  };

  const handleBreadcrumbClick = (index) => {
    const newPath = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newPath);
    setCurrentFolder(newPath[newPath.length - 1].id);
  };

  const handleCreateFolder = async (name) => {
    try {
      await createFolder(name, currentFolder);
      toast.success("Folder created");
      loadContent(); 
    } catch (err) {
      toast.error("Failed to create folder");
    }
  };

  // --- ACTIONS ---
  const confirmDelete = (file) => { setFileToDelete(file); setIsDeleteOpen(true); };
  const executeDelete = async () => {
    if (!fileToDelete) return;
    setIsDeleting(true);
    try {
      await deleteFile(fileToDelete.id);
      setFiles(files.filter(f => f.id !== fileToDelete.id));
      await loadStats(); 
      toast.success("File deleted");
      setIsDeleteOpen(false);
    } catch (err) {
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(false); setFileToDelete(null);
    }
  };

  const handleDownload = async (id, filename) => {
    const loadingToast = toast.loading("Decrypting...");
    try {
      await downloadFile(id, filename);
      toast.dismiss(loadingToast);
    } catch (err) {
      toast.error("Decryption failed.", { id: loadingToast });
    }
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const className = "w-6 h-6";
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return <Image className={`${className} text-purple-500`} />;
    if (['pdf', 'doc', 'docx'].includes(ext)) return <FileText className={`${className} text-red-500`} />;
    if (['mp4', 'mov'].includes(ext)) return <Video className={`${className} text-blue-500`} />;
    if (['mp3', 'wav'].includes(ext)) return <Music className={`${className} text-architect-mustard`} />;
    return <File className={`${className} text-architect-steel`} />;
  };

  const hasContent = (folders?.length > 0) || (files?.length > 0);

  return (
    <div 
      className="min-h-screen transition-colors duration-300 bg-architect-ice dark:bg-architect-navy relative"
      onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
    >
      <Navbar /> 
      <TourGuide />

      <AnimatePresence>
        {isDragging && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-architect-navy/90 backdrop-blur-sm flex flex-col items-center justify-center border-8 border-architect-mustard border-dashed m-4 rounded-3xl">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white p-8 rounded-full shadow-2xl mb-6">
              <UploadCloud className="w-20 h-20 text-architect-mustard" />
            </motion.div>
            <h2 className="text-4xl font-bold text-white mb-2">Drop to Upload</h2>
            <p className="text-architect-ice/70 text-lg">Your file will be encrypted automatically</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6 md:p-12">
        <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />

        {/* HEADER */}
        <div id="tour-welcome" className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3 text-architect-navy dark:text-architect-ice">
              <ShieldCheck className="w-8 h-8 text-architect-mustard" />
              Secure Storage
            </h1>
            <div className="flex items-center gap-2 mt-4 text-sm font-medium text-architect-steel">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  <button onClick={() => handleBreadcrumbClick(index)} className={`hover:text-architect-mustard transition-colors ${index === breadcrumbs.length - 1 ? 'text-architect-navy dark:text-white font-bold' : ''}`}>
                    {index === 0 ? <Home className="w-4 h-4" /> : crumb.name}
                  </button>
                  {index < breadcrumbs.length - 1 && <ChevronRight className="w-4 h-4 opacity-50" />}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button id="tour-create-folder" onClick={() => setIsCreateFolderOpen(true)} className="bg-architect-ice dark:bg-white/10 text-architect-navy dark:text-white font-bold px-4 py-3 rounded-xl flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/20 transition-all border border-architect-steel/20">
              <FolderPlus className="w-5 h-5" /> <span className="hidden md:inline">New Folder</span>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
            <motion.button id="tour-upload" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => fileInputRef.current.click()} disabled={isUploading} className="bg-architect-mustard text-architect-navy font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl hover:bg-[#ffc636]">
              {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />} <span className="hidden md:inline">{isUploading ? "Uploading..." : "Upload File"}</span>
            </motion.button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="max-w-7xl mx-auto mb-6">
          <div id="tour-search" className="relative group">
            <Search className="absolute left-4 top-3.5 text-architect-steel w-5 h-5" />
            <input type="text" placeholder="Search..." className="w-full bg-white dark:bg-transparent border-2 border-architect-steel/30 text-architect-navy dark:text-architect-ice rounded-xl pl-12 pr-4 py-3 focus:border-architect-mustard outline-none transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {/* CONTENT TABLE */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-7xl mx-auto bg-white dark:bg-transparent border border-architect-steel/20 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-architect-steel/20 bg-architect-steel/10 dark:bg-architect-steel/5">
                <th className="px-6 py-4 text-architect-navy dark:text-architect-ice font-bold text-xs uppercase">Name</th>
                <th className="px-6 py-4 text-architect-navy dark:text-architect-ice font-bold text-xs uppercase hidden md:table-cell">Type</th>
                <th className="px-6 py-4 text-architect-navy dark:text-architect-ice font-bold text-xs uppercase hidden md:table-cell">Uploaded</th>
                <th className="px-6 py-4 text-architect-navy dark:text-architect-ice font-bold text-xs uppercase">Size</th>
                <th className="px-6 py-4 text-right text-architect-navy dark:text-architect-ice font-bold text-xs uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-architect-steel/10">
              {isLoading ? (
                <tr><td colSpan="5" className="text-center py-10 text-architect-steel">Loading content...</td></tr>
              ) : !hasContent ? (
                <tr><td colSpan="5" className="text-center py-16"><div className="flex flex-col items-center justify-center text-architect-steel opacity-50"><UploadCloud className="w-12 h-12 mb-4" /><p className="text-lg font-medium">No files yet</p><p className="text-sm">Drag and drop files here to upload</p></div></td></tr>
              ) : (
                <>
                  {/* FOLDERS */}
                  {folders?.map(folder => (
                    <motion.tr key={`folder-${folder.id}`} whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }} className="cursor-pointer" onClick={() => handleEnterFolder(folder)}>
                      <td className="px-6 py-4"><div className="flex items-center gap-4"><Folder className="w-6 h-6 text-architect-mustard fill-architect-mustard/20" /><span className="font-bold text-architect-navy dark:text-architect-ice truncate">{folder.name}</span></div></td>
                      <td className="px-6 py-4 text-xs font-medium text-architect-navy dark:text-architect-ice uppercase hidden md:table-cell">Folder</td>
                      <td className="px-6 py-4 text-sm font-medium text-architect-navy dark:text-architect-ice hidden md:table-cell">-</td>
                      <td className="px-6 py-4 text-sm font-medium text-architect-navy dark:text-architect-ice">-</td>
                      <td className="px-6 py-4 text-right"><ChevronRight className="w-5 h-5 text-architect-steel ml-auto" /></td>
                    </motion.tr>
                  ))}
                  
                  {/* FILES */}
                  {files?.filter(f => f.filename.toLowerCase().includes(searchTerm.toLowerCase())).map((file) => (
                    <tr key={`file-${file.id}`} className="group hover:bg-architect-ice/50 dark:hover:bg-architect-steel/5 transition-colors">
                      <td className="px-6 py-4"><div className="flex items-center gap-4"><div className="p-2 bg-white dark:bg-transparent dark:border dark:border-architect-steel/30 rounded-lg">{getFileIcon(file.filename)}</div><span className="font-medium text-architect-navy dark:text-architect-ice truncate">{file.filename}</span></div></td>
                      
                      {/* TYPE COLUMN: Fixed Color */}
                      <td className="px-6 py-4 text-xs font-medium text-architect-navy dark:text-architect-ice uppercase hidden md:table-cell">{file.file_type}</td>
                      
                      {/* UPLOADED COLUMN: Fixed Color */}
                      <td className="px-6 py-4 text-sm font-medium text-architect-navy dark:text-architect-ice hidden md:table-cell">{new Date(file.upload_date).toLocaleDateString()}</td>
                      
                      {/* SIZE COLUMN */}
                      <td className="px-6 py-4 text-sm font-medium text-architect-navy dark:text-architect-ice whitespace-nowrap">{file.size}</td>
                      
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={(e) => { e.stopPropagation(); setPreviewFile(file); setIsPreviewOpen(true); }} className="p-2 hover:text-architect-mustard transition-colors" title="Preview"><Eye className="w-5 h-5" /></button>
                          <button onClick={() => { setFileToShare(file); setIsShareOpen(true); }} className="p-2 hover:text-blue-500 transition-colors" title="Share"><Share2 className="w-5 h-5" /></button>
                          <button onClick={() => handleDownload(file.id, file.filename)} className="p-2 hover:text-architect-mustard transition-colors" title="Download"><Download className="w-5 h-5" /></button>
                          <button onClick={() => confirmDelete(file)} className="p-2 hover:text-architect-mauve transition-colors" title="Delete"><Trash2 className="w-5 h-5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </motion.div>
        
        <ShareModal file={fileToShare} isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
        <ConfirmModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={executeDelete} title="Delete Securely?" message={`Permanently delete "${fileToDelete?.filename}"?`} isDeleting={isDeleting} />
        <CreateFolderModal isOpen={isCreateFolderOpen} onClose={() => setIsCreateFolderOpen(false)} onCreate={handleCreateFolder} />
        <FilePreviewModal file={previewFile} isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} />
      </div>
    </div>
  );
};

export default Dashboard;