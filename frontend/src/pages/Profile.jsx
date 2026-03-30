import { useState } from 'react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import { LuUser, LuBuilding2, LuMapPin, LuPhone, LuMail, LuLock, LuSave } from 'react-icons/lu';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    companyName:    user?.companyName    || '',
    companyAddress: user?.companyAddress || '',
    phone:          user?.phone          || '',
    currentPassword: '',
    newPassword:    '',
  });
  const [saving, setSaving] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        companyName:    form.companyName,
        companyAddress: form.companyAddress,
        phone:          form.phone,
      };
      if (showPwd && form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword     = form.newPassword;
      }
      const { data } = await authAPI.updateProfile(payload);
      updateUser(data);
      setForm((f) => ({ ...f, currentPassword: '', newPassword: '' }));
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="page-title flex items-center gap-2">
          <LuUser className="text-orange-500" size={28} /> My Profile
        </h1>
        <p className="page-subtitle">Update your company details and password</p>
      </div>

      <div className="max-w-lg">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-[#1E293B] rounded-2xl border border-white/5">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-black text-2xl shrink-0">
            {user?.companyName?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-white">{user?.companyName}</p>
            <p className="text-slate-400 text-sm">{user?.email}</p>
            <span className="text-xs bg-orange-500/15 text-orange-400 px-2 py-0.5 rounded-full font-medium capitalize">{user?.role}</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="bg-[#1E293B] rounded-2xl border border-white/5 p-5 sm:p-6 space-y-4">
          <div>
            <label className="label-dark">Company Name</label>
            <div className="relative">
              <LuBuilding2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="input-dark pl-10" placeholder="ABC Metals Ltd." />
            </div>
          </div>

          <div>
            <label className="label-dark">Company Address</label>
            <div className="relative">
              <LuMapPin size={15} className="absolute left-3.5 top-3.5 text-slate-500" />
              <textarea value={form.companyAddress}
                onChange={(e) => setForm({ ...form, companyAddress: e.target.value })}
                rows={2} className="input-dark pl-10 resize-none" placeholder="123 Industrial Area" />
            </div>
          </div>

          <div>
            <label className="label-dark">Phone Number</label>
            <div className="relative">
              <LuPhone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="tel" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input-dark pl-10" placeholder="+91 98765 43210" />
            </div>
          </div>

          {/* Email — read only */}
          <div>
            <label className="label-dark">Email Address</label>
            <div className="relative">
              <LuMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="email" value={user?.email} readOnly
                className="input-dark pl-10 opacity-50 cursor-not-allowed" />
            </div>
          </div>

          {/* Change password toggle */}
          <div className="border-t border-white/5 pt-4">
            <button type="button" onClick={() => setShowPwd(!showPwd)}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-orange-400 transition">
              <LuLock size={14} />
              {showPwd ? 'Cancel password change' : 'Change Password'}
            </button>

            {showPwd && (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="label-dark">Current Password</label>
                  <input type="password" value={form.currentPassword}
                    onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                    className="input-dark" placeholder="••••••••" />
                </div>
                <div>
                  <label className="label-dark">New Password</label>
                  <input type="password" value={form.newPassword}
                    onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                    className="input-dark" placeholder="••••••••" />
                </div>
              </div>
            )}
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : <><LuSave size={16} /> Save Changes</>}
          </button>
        </form>
      </div>
    </Layout>
  );
}
