import { useEffect, useState } from 'react';
import { metalAPI, contactAPI } from '../../services/api';
import Layout from '../../components/Layout';
import Spinner from '../../components/Spinner';
import { EmptyState } from '../../components/UI';
import toast from 'react-hot-toast';
import { LuSettings, LuPlus, LuPencil, LuTrash2, LuX, LuPhone, LuMapPin } from 'react-icons/lu';

export default function ManageMetals() {
  const [metals, setMetals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ metalName: '', pricePerKg: '' });
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [contact, setContact] = useState({ phone: '', address: '' });
  const [contactSaving, setContactSaving] = useState(false);
  const [contactSaved, setContactSaved] = useState(false);
  const [contactEditing, setContactEditing] = useState(false);
  const [contactDraft, setContactDraft] = useState({ phone: '', address: '' });

  useEffect(() => {
    contactAPI.get().then(({ data }) => {
      setContact(data);
      setContactSaved(!!(data.phone || data.address));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    metalAPI.getAll()
      .then(({ data }) => setMetals(data))
      .catch(() => toast.error('Failed to load metals'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        const { data } = await metalAPI.update(editId, form);
        setMetals((prev) => prev.map((m) => (m._id === editId ? data : m)));
        toast.success('Metal updated!');
      } else {
        const { data } = await metalAPI.add(form);
        setMetals((prev) => [...prev, data]);
        toast.success('Metal added!');
      }
      setForm({ metalName: '', pricePerKg: '' });
      setEditId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (m) => {
    setEditId(m._id);
    setForm({ metalName: m.metalName, pricePerKg: m.pricePerKg });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this metal?')) return;
    try {
      await metalAPI.delete(id);
      setMetals((prev) => prev.filter((m) => m._id !== id));
      toast.success('Metal deleted');
    } catch {
      toast.error('Failed to delete metal');
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({ metalName: '', pricePerKg: '' });
  };

  const saveContact = async (e) => {
    e.preventDefault();
    setContactSaving(true);
    try {
      const { data } = await contactAPI.update(contactDraft);
      setContact(data);
      setContactSaved(true);
      setContactEditing(false);
      toast.success('Contact info saved!');
    } catch {
      toast.error('Failed to save contact info');
    } finally {
      setContactSaving(false);
    }
  };

  const startEditContact = () => {
    setContactDraft({ phone: contact.phone, address: contact.address });
    setContactEditing(true);
  };

  const cancelEditContact = () => {
    setContactEditing(false);
    setContactDraft({ phone: '', address: '' });
  };

  if (loading) return <Layout isAdmin><Spinner /></Layout>;

  return (
    <Layout isAdmin>
      <div className="mb-6">
        <h1 className="page-title flex items-center gap-2">
          <LuSettings className="text-orange-500" size={28} /> Manage Metals
        </h1>
        <p className="page-subtitle">Add, edit or remove metals and their rates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-5 sm:p-6">
          <h2 className="font-semibold text-white mb-5 flex items-center gap-2 text-sm">
            {editId
              ? <><LuPencil size={15} className="text-orange-400" /> Edit Metal</>
              : <><LuPlus size={15} className="text-orange-400" /> Add New Metal</>}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-dark">Metal Name</label>
              <input type="text" required value={form.metalName}
                onChange={(e) => setForm({ ...form, metalName: e.target.value })}
                className="input-dark" placeholder="e.g. Copper" />
            </div>
            <div>
              <label className="label-dark">Price per kg (₹)</label>
              <input type="number" min="0.01" step="0.01" required value={form.pricePerKg}
                onChange={(e) => setForm({ ...form, pricePerKg: e.target.value })}
                className="input-dark" placeholder="e.g. 450" />
            </div>
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={submitting} className="btn-primary flex-1">
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : editId ? 'Update Metal' : 'Add Metal'}
              </button>
              {editId && (
                <button type="button" onClick={cancelEdit} className="btn-secondary flex items-center gap-1.5">
                  <LuX size={15} /> Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Metals list */}
        <div className="bg-[#1E293B] rounded-2xl border border-white/5 p-5 sm:p-6">
          <h2 className="font-semibold text-white mb-5 text-sm">
            Current Metals
            <span className="ml-2 text-xs bg-orange-500/15 text-orange-400 px-2 py-0.5 rounded-full">{metals.length}</span>
          </h2>
          {metals.length === 0 ? (
            <EmptyState icon="🔩" message="No metals added yet." />
          ) : (
            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {metals.map((m) => (
                <div key={m._id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all
                    ${editId === m._id
                      ? 'bg-orange-500/10 border-orange-500/30'
                      : 'bg-[#0F172A] border-white/5 hover:border-white/10'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-orange-500/10 rounded-xl flex items-center justify-center text-lg shrink-0">🔩</div>
                    <div>
                      <p className="font-semibold text-white text-sm">{m.metalName}</p>
                      <p className="text-orange-400 text-xs font-semibold">₹{m.pricePerKg}/kg</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => handleEdit(m)}
                      className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition">
                      <LuPencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(m._id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition">
                      <LuTrash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="mt-6 bg-[#1E293B] rounded-2xl border border-white/5 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white flex items-center gap-2 text-sm">
            <LuPhone size={15} className="text-orange-400" /> Help & Contact Info
          </h2>
          {contactSaved && !contactEditing && (
            <button onClick={startEditContact}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 px-3 py-1.5 rounded-xl border border-white/5 hover:border-orange-500/20 transition">
              <LuPencil size={13} /> Edit
            </button>
          )}
        </div>

        {/* Saved view */}
        {contactSaved && !contactEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 bg-[#0F172A] border border-white/5 rounded-xl p-4">
              <div className="w-9 h-9 bg-green-500/10 rounded-xl flex items-center justify-center shrink-0">
                <LuPhone size={16} className="text-green-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Phone</p>
                <p className="text-white font-semibold text-sm">{contact.phone || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-[#0F172A] border border-white/5 rounded-xl p-4">
              <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <LuMapPin size={16} className="text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Address</p>
                <p className="text-white font-semibold text-sm leading-relaxed">{contact.address || '—'}</p>
              </div>
            </div>
          </div>
        ) : (
          /* Edit / Add form */
          <form onSubmit={saveContact} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-dark">Phone Number</label>
              <div className="relative">
                <LuPhone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="tel" value={contactDraft.phone}
                  onChange={(e) => setContactDraft({ ...contactDraft, phone: e.target.value })}
                  className="input-dark pl-9" placeholder="e.g. +91 98765 43210" />
              </div>
            </div>
            <div>
              <label className="label-dark">Address</label>
              <div className="relative">
                <LuMapPin size={15} className="absolute left-3.5 top-3.5 text-slate-500" />
                <textarea value={contactDraft.address}
                  onChange={(e) => setContactDraft({ ...contactDraft, address: e.target.value })}
                  rows={2} className="input-dark pl-9 resize-none" placeholder="e.g. 123 Scrap Lane, Mumbai" />
              </div>
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={contactSaving} className="btn-primary">
                {contactSaving ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : 'Save Contact Info'}
              </button>
              {contactEditing && (
                <button type="button" onClick={cancelEditContact} className="btn-secondary flex items-center gap-1.5">
                  <LuX size={15} /> Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}
