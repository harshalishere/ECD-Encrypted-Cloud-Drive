import { motion, AnimatePresence } from 'framer-motion';
import { X, HardDrive, File, PieChart as PieIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#FACC15', '#3B82F6', '#EF4444', '#10B981', '#6B7280'];

const AnalyticsModal = ({ isOpen, onClose, stats }) => {
  if (!isOpen) return null;

  // Default empty state if stats fail to load
  const chartData = stats?.chart_data || [];
  const totalUsed = stats?.total_used_mb || 0;
  const fileCount = stats?.file_count || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-architect-navy w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-architect-steel/20"
      >
        {/* Header */}
        <div className="bg-architect-mustard p-4 flex justify-between items-center">
          <h3 className="font-bold text-architect-navy flex items-center gap-2">
            <PieIcon className="w-5 h-5" /> Storage Analytics
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-full">
            <X className="w-5 h-5 text-architect-navy" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 grid md:grid-cols-2 gap-8 items-center">
          
          {/* Left: Text Stats */}
          <div className="space-y-6">
            <div className="bg-architect-ice dark:bg-white/5 p-4 rounded-xl border border-architect-steel/10">
              <p className="text-architect-steel text-xs uppercase font-bold tracking-wider mb-1">Current Plan</p>
              <p className="text-xl font-bold text-architect-navy dark:text-architect-ice">Free Tier</p>
              <p className="text-xs text-architect-steel mt-1">AWS S3 Standard Storage</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-architect-navy dark:text-white">
                <span>Storage Used</span>
                <span>{totalUsed} MB / 5 GB</span>
              </div>
              {/* Progress Bar */}
              <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(totalUsed / 5000) * 100}%` }}
                  className="h-full bg-architect-mustard"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 text-architect-steel text-sm">
              <HardDrive className="w-4 h-4" />
              <span>{fileCount} total files stored</span>
            </div>
          </div>

          {/* Right: The Chart */}
          <div className="h-64 w-full relative">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-architect-steel">
                No data to display
              </div>
            )}
            
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-architect-navy dark:text-architect-ice opacity-20">
                {Math.round((totalUsed / 5000) * 100)}%
              </span>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsModal;