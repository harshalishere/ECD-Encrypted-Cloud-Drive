import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, MapPin, Phone, FileText, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQS = [
  { q: "Is my data truly secure?", a: "Yes. We use AES-256 encryption. Files are encrypted on your device before upload." },
  { q: "Can ECDDrive see my files?", a: "No. We operate on a zero-knowledge architecture. We do not have your decryption keys." },
  { q: "How do I reset my password?", a: "Currently, due to encryption security, lost passwords cannot be recovered. Please keep your credentials safe." },
  { q: "What is the storage limit?", a: "Free tier users get 5GB of secure storage. Premium plans coming soon." },
  { q: "Can I share files with non-users?", a: "Yes, you can generate a time-limited, password-protected public link." },
  { q: "Where are servers located?", a: "Our encrypted shards are distributed across secure AWS regions, including Mumbai (ap-south-1)." },
  { q: "Does dark mode sync across devices?", a: "Yes, your preference is saved to your local browser settings." },
  { q: "How do I delete my account?", a: "Please contact support@ecddrive.com for permanent account deletion requests." },
  { q: "Are folders encrypted?", a: "Folder names are encrypted in the database, just like file names." },
  { q: "Why is the upload speed variable?", a: "Encryption happens in your browser (client-side), which depends on your device's CPU speed." }
];

const SupportModal = ({ isOpen, onClose, view = 'support' }) => { // view = 'support' | 'docs'
  const [activeTab, setActiveTab] = useState(view);
  const [expandedFaq, setExpandedFaq] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-architect-navy w-full max-w-2xl rounded-2xl shadow-2xl border border-architect-steel/20 overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="bg-architect-mustard p-4 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-architect-navy flex items-center gap-2">
            {activeTab === 'support' ? <HelpCircle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            {activeTab === 'support' ? 'Help & Support' : 'Documentation'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-full">
            <X className="w-5 h-5 text-architect-navy" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-architect-steel/10 shrink-0">
          <button 
            onClick={() => setActiveTab('support')}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'support' ? 'bg-architect-ice dark:bg-white/10 text-architect-navy dark:text-architect-mustard' : 'text-architect-steel'}`}
          >
            Support & FAQs
          </button>
          <button 
            onClick={() => setActiveTab('docs')}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'docs' ? 'bg-architect-ice dark:bg-white/10 text-architect-navy dark:text-architect-mustard' : 'text-architect-steel'}`}
          >
            Privacy Policy
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {activeTab === 'support' ? (
            <div className="space-y-8">
              {/* Contact Card */}
              <div className="bg-architect-ice/50 dark:bg-white/5 rounded-xl p-5 border border-architect-steel/10">
                <h4 className="font-bold text-architect-navy dark:text-white mb-4">Contact Us</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-architect-mustard mt-1" />
                    <span className="text-architect-steel">123, Tech Plaza, Bandra West,<br/>Mumbai, Maharashtra 400050, India</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-architect-mustard" />
                    <a href="mailto:dhawanharshal77@gmail.com" className="text-architect-steel hover:text-architect-mustard transition-colors">dhawanharshal77@gmail.com</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-architect-mustard" />
                    <span className="text-architect-steel">+91 98765 43210</span>
                  </div>
                </div>
              </div>

              {/* FAQs */}
              <div>
                <h4 className="font-bold text-architect-navy dark:text-white mb-4">Frequently Asked Questions</h4>
                <div className="space-y-2">
                  {FAQS.map((faq, index) => (
                    <div key={index} className="border border-architect-steel/10 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full flex justify-between items-center p-4 text-left bg-white dark:bg-white/5 hover:bg-architect-ice/30 transition-colors"
                      >
                        <span className="font-medium text-sm text-architect-navy dark:text-architect-ice">{faq.q}</span>
                        {expandedFaq === index ? <ChevronUp className="w-4 h-4 text-architect-steel" /> : <ChevronDown className="w-4 h-4 text-architect-steel" />}
                      </button>
                      {expandedFaq === index && (
                        <div className="p-4 bg-architect-ice/30 dark:bg-black/20 text-sm text-architect-steel border-t border-architect-steel/10">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Privacy Policy */
            <div className="prose dark:prose-invert text-sm text-architect-steel max-w-none">
              <h4 className="text-lg font-bold text-architect-navy dark:text-white mb-2">Privacy Policy</h4>
              <p className="mb-4">Last Updated: January 10, 2026</p>
              
              <h5 className="font-bold text-architect-navy dark:text-white mt-4">1. Data Encryption</h5>
              <p>All files are encrypted client-side using AES-256 before being transmitted. We cannot access your file contents.</p>
              
              <h5 className="font-bold text-architect-navy dark:text-white mt-4">2. Data Collection</h5>
              <p>We only collect your email address for authentication. No other personal data is harvested or sold.</p>
              
              <h5 className="font-bold text-architect-navy dark:text-white mt-4">3. Server Locations</h5>
              <p>Data is stored in secure AWS data centers compliant with ISO 27001.</p>

              <h5 className="font-bold text-architect-navy dark:text-white mt-4">4. Cookie Usage</h5>
              <p>We use local storage for session management and theme preferences. No tracking cookies are used.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SupportModal;