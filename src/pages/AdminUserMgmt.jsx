import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function AdminUserMgmt() {
  const { profile } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('user')
      .select('*')
      .order('record_status', { ascending: false });
    setUsers(data || []);
    setLoading(false);
  };

  const toggleActivation = async (targetUser) => {
    // SUPERADMIN protection rule (Section 2.1)
    if (targetUser.user_type === 'SUPERADMIN') {
      alert("Security Breach: SUPERADMIN accounts cannot be modified via UI.");
      return;
    }

    const newStatus = targetUser.record_status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    
    const { error } = await supabase
      .from('user')
      .update({ 
        record_status: newStatus,
        stamp: `MODIFIED by ${profile.username} on ${new Date().toLocaleString()}` 
      })
      .eq('userId', targetUser.userId);

    if (!error) fetchUsers();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">User Management</h1>
      <p className="text-slate-500 mb-8">Review registration requests and manage account access.</p>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">User</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Type</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.userId}>
                <td className="px-6 py-4">
                  <div className="font-medium">{u.firstName} {u.lastName}</div>
                  <div className="text-xs text-slate-400">@{u.username}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                    u.user_type === 'SUPERADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {u.user_type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs ${u.record_status === 'ACTIVE' ? 'text-green-600' : 'text-amber-600'}`}>
                    ● {u.record_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {/* Hide toggle button for SUPERADMIN per Section 2.1 */}
                  {u.user_type !== 'SUPERADMIN' ? (
                    <button 
                      onClick={() => toggleActivation(u)}
                      className={`text-sm font-bold ${u.record_status === 'ACTIVE' ? 'text-red-600' : 'text-blue-600'} hover:underline`}
                    >
                      {u.record_status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </button>
                  ) : (
                    <span className="text-xs text-slate-300 italic">Protected</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}