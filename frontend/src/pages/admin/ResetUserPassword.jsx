import { useState } from 'react';
import { authAPI } from '../../services/api';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast';
import { LuKeyRound, LuMail, LuLock, LuShieldCheck } from 'react-icons/lu';

export default function ResetUserPassword() {
  const [form, setForm] = useState({ email: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword)
      return toast.error('Passwords do not match');
    if (form.newPassword.length < 6)
      return toast.error('Password must be at least 6 characters');

    setSaving(true);
    setSuccess('');
    try {
      const { data } = await authAPI.adminResetPassword({
        email: form.email,
        newPassword: form.newPassword,
      });
      setSuccess(data.companyName);
      setForm({ email: '', newPassword: '', confirmPassword: '' });
      toast.success(`Password reset for ${data.companyName}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout isAdmin>
      <div className="mb-6">
        <h1 className="page-title flex items-center gap-2">
          <LuKeyRound className="text-orange-500" size={28} /> Reset User Password
        </h1>
        <p className="page-subtitle">Enter the user's email and set a new password for them</p>
      </div>

      <div className="max-w-md">
        {/* Info banner */}
        <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-6">
          <LuShieldCheck size={18} className="text-blue-400 shrink-0 mt-0.5" />
          <p className="text-blue-300 text-sm leading-relaxed">
            This will immediately reset the user's password. Make sure to share the new password with them securely.
          </p>
        </div>

        {/* Success banner */}
        {success && (
          <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-2xl p-4 mb-6">
            <LuShieldCheck size={18} className="text-green-400 shrink-0" />
            <p className="text-green-300 text-sm font-semibold">
              ✅ Password successfully reset for <span className="text-white">{success}</span>
            </p>
          </div>
        )}

        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="label-dark">User Email Address</label>
              <div className="relative">
                <LuMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-dark pl-10"
                  placeholder="user@company.com" />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="label-dark">New Password</label>
              <div className="relative">
                <LuLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password" required value={form.newPassword}
                  onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                  className="input-dark pl-10"
                  placeholder="Min. 6 characters" />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label-dark">Confirm New Password</label>
              <div className="relative">
                <LuLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password" required value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className={`input-dark pl-10 ${
                    form.confirmPassword && form.newPassword !== form.confirmPassword
                      ? 'border-red-500/50 focus:ring-red-500'
                      : ''
                  }`}
                  placeholder="Re-enter new password" />
              </div>
              {form.confirmPassword && form.newPassword !== form.confirmPassword && (
                <p className="text-red-400 text-xs mt-1.5">Passwords do not match</p>
              )}
            </div>

            <div className="border-t border-white/5 pt-2">
              <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Resetting...
                  </span>
                ) : (
                  <><LuKeyRound size={16} /> Reset Password</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
