import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { LuBuilding2, LuMapPin, LuMail, LuPhone, LuLock, LuArrowRight, LuHeadphonesIcon, LuHelpCircle } from 'react-icons/lu';
import ContactModal from '../components/ContactModal';

const fields = [
  { key: 'companyName',    label: 'Company Name',    type: 'text',     placeholder: 'ABC Metals Ltd.',     Icon: LuBuilding2 },
  { key: 'companyAddress', label: 'Company Address', type: 'text',     placeholder: '123 Industrial Area', Icon: LuMapPin },
  { key: 'email',          label: 'Email Address',   type: 'email',    placeholder: 'company@email.com',   Icon: LuMail },
  { key: 'phone',          label: 'Phone Number',    type: 'tel',      placeholder: '+1 234 567 8900',     Icon: LuPhone },
  { key: 'password',       label: 'Password',        type: 'password', placeholder: '••••••••',            Icon: LuLock },
];

export default function Signup() {
  const [form, setForm] = useState({ companyName: '', companyAddress: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.signup(form);
      login(data);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4 py-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Contact Button - Mobile */}
      <button
        onClick={() => setContactModalOpen(true)}
        className="fixed bottom-4 right-4 z-40 md:hidden flex items-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition"
      >
        <LuHelpCircle size={20} />
        <span className="text-sm">Help</span>
      </button>

      <div className="w-full max-w-sm relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-500 rounded-2xl shadow-xl shadow-orange-500/30 mb-4">
            <span className="text-white font-black text-2xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Create <span className="text-orange-500">Account</span></h1>
          <p className="text-slate-400 text-sm mt-1">Register your company on ScrapMetal Pro</p>
        </div>
        <div className="bg-[#1E293B] rounded-2xl border border-white/5 shadow-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ key, label, type, placeholder, Icon }) => (
              <div key={key}>
                <label className="label-dark">{label}</label>
                <div className="relative">
                  <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type={type} required value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="input-dark pl-10" placeholder={placeholder} />
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center gap-2">Create Account <LuArrowRight size={16} /></span>
              )}
            </button>
          </form>
          <div className="mt-6 pt-5 border-t border-white/5 text-center space-y-3">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-orange-400 font-semibold hover:text-orange-300 transition">Sign In</Link>
            </p>
            
            {/* Desktop Contact Button */}
            <button

      {/* Contact Modal */}
      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
              onClick={() => setContactModalOpen(true)}
              className="hidden md:flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-orange-400 transition text-sm font-medium border border-slate-700 hover:border-orange-500/30 mt-4"
            >
              <LuHeadphonesIcon size={16} />
              Need Help? Contact Us
            </button>

            {/* Mobile Contact Info Text */}
            <p className="md:hidden text-xs text-slate-500 mt-3">
              Have questions? Tap the Help button →
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
