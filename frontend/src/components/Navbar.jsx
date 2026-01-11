import { ShieldCheck, LayoutDashboard } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserMenu from './UserMenu'; // <--- Import the new menu

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bg-white dark:bg-architect-navy border-b border-architect-steel/20 px-6 py-4 flex justify-between items-center transition-colors duration-300 relative z-50">
      {/* Logo */}
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => navigate('/dashboard')}
      >
        <div className="bg-architect-mustard p-2 rounded-lg">
          <ShieldCheck className="w-6 h-6 text-architect-navy" />
        </div>
        <span className="text-xl font-bold text-architect-navy dark:text-architect-ice tracking-tight">
          ECDDrive
        </span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        
        {/* Dashboard Link (Only visible if not on dashboard) */}
        {location.pathname !== '/dashboard' && (
           <button 
             onClick={() => navigate('/dashboard')}
             className="flex items-center gap-2 text-architect-navy dark:text-architect-ice font-bold text-sm hover:opacity-80 transition-opacity mr-2"
           >
             <LayoutDashboard className="w-4 h-4" /> Dashboard
           </button>
        )}

        {/* The New User Profile Menu */}
        <UserMenu /> 

      </div>
    </nav>
  );
};

export default Navbar;