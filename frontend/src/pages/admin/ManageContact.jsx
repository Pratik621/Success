import { useEffect, useState } from 'react';
import { contactAPI } from '../../services/api';
import Layout from '../../components/Layout';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import { LuHeadphones, LuPhone, LuMail, LuMapPin, LuMessageCircle, LuSave } from 'react-icons/lu';

export default function ManageContact() {
  const [form, setForm] = useState({ phone: '', email: '', address: '', whatsapp: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    contactAPI.get()
      .then(({ data }) => setForm({
        phone:    data.phone    || '',
        email:    data.email    || '',
        address:  data.address  || '',
        whatsapp: data.whatsapp || '',
      }))
      .catch(() => toast.error('Failed to load contact info'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await contactAPI.update(form);
      toast.success('Contact info updated! All users will see the new details.');
    } catch {
      toast.error('Failed to save contact info');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Layout isAdmin><Spinner /></Layout>;

  return (
    <Layout isAdmin>
      <div className="mb-6">
        <h1 className="page-title flex items-center gap-2">
          <LuHeadphones className="text-orange-500" size={28} /> Help & Contact Info
        </h1>
        <p className="page-subtitle">This info is shown to all users in the Help section</p>
      </div>

      <div className="max-w-lg">
        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-5 sm:p-6">
          <form onSubmit={handleSave} className="space-y-4">

            <div>
              <label className="label-dark">Phone Number</label>
              <div className="relative">
                <LuPhone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="tel" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-dark pl-10" placeholder="+91 98765 43210" />
              </div>
            </div>

            <div>
              <label className="label-dark">WhatsApp Number</label>
              <div className="relative">
                <LuMessageCircle size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="tel" value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  className="input-dark pl-10" placeholder="+91 98765 43210" />
              </div>
            </div>

            <div>
              <label className="label-dark">Email Address</label>
              <div className="relative">
                <LuMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-dark pl-10" placeholder="support@scrapmetals.com" />
              </div>
            </div>

            <div>
              <label className="label-dark">Office Address</label>
              <div className="relative">
                <LuMapPin size={15} className="absolute left-3.5 top-3.5 text-slate-500" />
                <textarea value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  rows={3} className="input-dark pl-10 resize-none"
                  placeholder="123 Industrial Area, City, State - 400001" />
              </div>
            </div>

            <div className="border-t border-white/5 pt-2">
              <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <><LuSave size={16} /> Save Contact Info</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Preview */}
        {(form.phone || form.email || form.address || form.whatsapp) && (
          <div className="mt-4 bg-[#1E293B] rounded-2xl border border-white/5 p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">Preview (what users see)</p>
            <div className="space-y-2">
              {form.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <LuPhone size={14} className="text-green-400 shrink-0" />
                  <span className="text-white">{form.phone}</span>
                </div>
              )}
              {form.whatsapp && (
                <div className="flex items-center gap-2 text-sm">
                  <LuMessageCircle size={14} className="text-green-400 shrink-0" />
                  <span className="text-white">{form.whatsapp}</span>
                </div>
              )}
              {form.email && (
                <div className="flex items-center gap-2 text-sm">
                  <LuMail size={14} className="text-blue-400 shrink-0" />
                  <span className="text-white">{form.email}</span>
                </div>
              )}
              {form.address && (
                <div className="flex items-start gap-2 text-sm">
                  <LuMapPin size={14} className="text-orange-400 shrink-0 mt-0.5" />
                  <span className="text-white leading-snug">{form.address}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
