import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const { profile, hasRight } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col p-4">
      <div className="mb-10 px-2">
        <h2 className="text-xl font-bold tracking-tighter">HOPE, INC.</h2>
        <p className="text-[10px] text-slate-400 font-mono">{profile?.user_type}</p>
      </div>

      <nav className="flex-1 space-y-1">
        {/* Product Module - Available to all ACTIVE users */}
        <Link to="/products" className="block px-4 py-2.5 rounded-lg hover:bg-slate-800 transition">
          📦 Product Module
        </Link>

        {/* Report Module - Section 2.2: Restricted if Right_value = 0 */}
        {hasRight('REP_001') && (
          <Link to="/reports" className="block px-4 py-2.5 rounded-lg hover:bg-slate-800 transition">
            📊 Reports Module
          </Link>
        )}

        {/* Admin Module - Section 2.2: Only for SUPERADMIN and ADMIN */}
        {hasRight('ADM_USER') && (
          <div className="pt-4 mt-4 border-t border-slate-800">
            <p className="px-4 text-[10px] font-bold text-slate-500 uppercase mb-2">Administration</p>
            <Link to="/admin/users" className="block px-4 py-2.5 rounded-lg hover:bg-slate-800 transition text-amber-400">
              🛡️ User Management
            </Link>
          </div>
        )}
      </nav>

      <div className="mt-auto border-t border-slate-800 pt-4">
        <div className="px-4 py-2 mb-2">
          <p className="text-sm font-medium truncate">{profile?.username}</p>
          <p className="text-xs text-slate-500 truncate">{profile?.firstName} {profile?.lastName}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-950/30 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}