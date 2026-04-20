import { useEffect, useState } from 'react';
import { authAPI } from '../../services/api';
import Layout from '../../components/Layout';
import Spinner from '../../components/Spinner';
import { EmptyState } from '../../components/UI';
import toast from 'react-hot-toast';
import { LuUsers, LuPhone, LuMapPin } from 'react-icons/lu';

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authAPI.getAllUsers()
      .then(({ data }) => setUsers(data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout isAdmin><Spinner /></Layout>;

  return (
    <Layout isAdmin>
      <div className="mb-6">
        <h1 className="page-title flex items-center gap-2">
          <LuUsers className="text-orange-500" size={28} /> All Users
        </h1>
        <p className="page-subtitle">Company name, contact number, and address visible only to administrators.</p>
      </div>

      {users.length === 0 ? (
        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-10">
          <EmptyState icon="👥" message="No users found." />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-white/5 bg-[#0F172A] p-4">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-slate-400 text-[11px] uppercase tracking-[0.2em]">
                <th className="px-4 py-4">Company Name</th>
                <th className="px-4 py-4">Contact Number</th>
                <th className="px-4 py-4">Address</th>
                <th className="px-4 py-4">Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-4 text-white font-medium">{user.companyName}</td>
                  <td className="px-4 py-4 text-slate-300">{user.phone || '—'}</td>
                  <td className="px-4 py-4 text-slate-300">{user.companyAddress || '—'}</td>
                  <td className="px-4 py-4 text-slate-400">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="grid gap-3 mt-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-[#1E293B] p-4">
          <div className="flex items-center gap-3 mb-2">
            <LuUsers className="text-orange-500" size={20} />
            <p className="text-slate-400 text-xs uppercase tracking-[0.2em]">Total users</p>
          </div>
          <p className="text-3xl font-bold text-white">{users.length}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-[#1E293B] p-4">
          <div className="flex items-center gap-3 mb-2">
            <LuPhone className="text-cyan-400" size={20} />
            <p className="text-slate-400 text-xs uppercase tracking-[0.2em]">Contact info included</p>
          </div>
          <p className="text-sm text-slate-300">{users.filter((u) => u.phone).length} users</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-[#1E293B] p-4">
          <div className="flex items-center gap-3 mb-2">
            <LuMapPin className="text-emerald-400" size={20} />
            <p className="text-slate-400 text-xs uppercase tracking-[0.2em]">Addresses listed</p>
          </div>
          <p className="text-sm text-slate-300">{users.filter((u) => u.companyAddress).length} users</p>
        </div>
      </div>
    </Layout>
  );
}
