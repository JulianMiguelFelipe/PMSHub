import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function ProductDashboard() {
  const { profile, hasRight } = useAuth();
  const [products, setProducts] = useState([]);
  const [rights, setRights] = useState({ canAdd: false, canEdit: false, canDel: false });

  // Section 2.3: Logic for Stamp Visibility
  const showStamps = profile?.user_type === 'SUPERADMIN' || profile?.user_type === 'ADMIN';

  useEffect(() => {
    fetchProducts();
    checkRights();
  }, []);

  const checkRights = async () => {
    // Check specific Right_IDs from Section 2.2
    setRights({
      canAdd: await hasRight('PRD_ADD'),
      canEdit: await hasRight('PRD_EDIT'),
      canDel: await hasRight('PRD_DEL')
    });
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from('product').select('*');
    setProducts(data || []);
  };

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Product Management</h1>
          <p className="text-slate-500 text-sm">Manage inventory and product details</p>
        </div>
        
        {/* Section 2.2: Add Product button visible to all types per matrix */}
        {rights.canAdd && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
            + Add New Product
          </button>
        )}
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Product Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              
              {/* Section 2.3 Rule: Omit stamp column if USER */}
              {showStamps && (
                <th className="px-6 py-4 text-xs font-bold uppercase text-blue-600">
                  Audit Stamp
                </th>
              )}
              
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((prod) => (
              <tr key={prod.id} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-medium text-slate-900">{prod.name}</td>
                <td className="px-6 py-4 text-slate-600">₱{prod.price}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">
                    {prod.record_status}
                  </span>
                </td>

                {/* Section 2.3 Rule: Render stamp data for ADMIN/SUPERADMIN only */}
                {showStamps && (
                  <td className="px-6 py-4 text-[11px] font-mono text-slate-400">
                    {prod.stamp}
                  </td>
                )}

                <td className="px-6 py-4 text-right space-x-2">
                  {rights.canEdit && (
                    <button className="text-blue-600 hover:underline font-semibold text-sm">Edit</button>
                  )}
                  
                  {/* Section 2.2: PRD_DEL is 0 for ADMIN and USER. Only SUPERADMIN sees this. */}
                  {rights.canDel && (
                    <button className="text-red-500 hover:underline font-semibold text-sm">Delete</button>
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