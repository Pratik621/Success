import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { LuMail, LuLock, LuArrowRight, LuShieldCheck, LuHeadphones, LuCircleHelp } from 'react-icons/lu';
import ContactModal from '../../components/ContactModal';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.adminLogin(form);
      login(data);
      toast.success('Welcome, Admin!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4 py-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/8 rounded-full blur-3xl pointer-events-none" />
      
      {/* Contact Button - Mobile */}
      <button
        onClick={() => setContactModalOpen(true)}
        className="fixed bottom-4 right-4 z-40 md:hidden flex items-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition"
      >
        <LuCircleHelp size={20} />
        <span className="text-sm">Help</span>
      </button>

      <div className="w-full max-w-sm relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1E293B] border border-orange-500/30 rounded-2xl shadow-xl mb-4">
            <LuShieldCheck size={26} className="text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin <span className="text-orange-500">Login</span></h1>
          <p className="text-slate-400 text-sm mt-1">Restricted access — Admins only</p>
        </div>
        <div className="bg-[#1E293B] rounded-2xl border border-white/5 shadow-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-dark">Admin Email</label>
              <div className="relative">
                <LuMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-dark pl-10" placeholder="admin@scrapmetals.com" />
              </div>
            </div>
            <div>
              <label className="label-dark">Password</label>
              <div className="relative">
                <LuLock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="password" required value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-dark pl-10" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">Access Admin Panel <LuArrowRight size={16} /></span>
              )}
            </button>
          </form>
          <div className="mt-6 pt-5 border-t border-white/5 text-center space-y-3">
            <Link to="/login" className="text-sm text-slate-400 hover:text-orange-400 transition block">
              Company Login →
            </Link>
            
            {/* Desktop Contact Button */}
            <button
              onClick={() => setContactModalOpen(true)}
              className="hidden md:flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-orange-400 transition text-sm font-medium border border-slate-700 hover:border-orange-500/30 mt-4"
            >
              <LuHeadphones size={16} />
              Forgot Password? Contact Us
            </button>

            {/* Mobile Contact Info Text */}
            <p className="md:hidden text-xs text-slate-500 mt-3">
              Forgot your password? Tap the Help button →
            </p>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
    </div>
  );
}
