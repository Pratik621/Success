import { useState, useEffect } from 'react';
import { LuX, LuPhone, LuMapPin, LuMail, LuMessageCircle } from 'react-icons/lu';
import { contactAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function ContactModal({ isOpen, onClose }) {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchContact();
    }
  }, [isOpen]);

  const fetchContact = async () => {
    try {
      setLoading(true);
      const { data } = await contactAPI.get();
      setContact(data);
    } catch (err) {
      console.error('Error fetching contact:', err);
      toast.error('Failed to load contact info');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#1E293B] rounded-2xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/5 bg-[#0F172A]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <LuPhone size={24} className="text-orange-500" />
            Contact Us
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition rounded-lg"
          >
            <LuX size={20} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
            </div>
          ) : contact ? (
            <>
              {/* Help Message */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-blue-200">
                  Forgot your password? Contact us for assistance and we'll help you regain access to your account.
                </p>
              </div>

              {/* Phone */}
              {contact.phone && (
                <div className="group">
                  <div className="flex items-center gap-3 p-4 bg-[#0F172A] rounded-lg hover:bg-[#1a2332] transition cursor-pointer border border-white/5 hover:border-orange-500/30">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition">
                      <LuPhone size={20} className="text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Phone</p>
                      <a href={`tel:${contact.phone}`} className="text-white font-semibold group-hover:text-orange-400 transition">
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* WhatsApp */}
              {contact.whatsapp && (
                <div className="group">
                  <div className="flex items-center gap-3 p-4 bg-[#0F172A] rounded-lg hover:bg-[#1a2332] transition cursor-pointer border border-white/5 hover:border-green-500/30">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition">
                      <LuMessageCircle size={20} className="text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">WhatsApp</p>
                      <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-white font-semibold group-hover:text-green-400 transition">
                        {contact.whatsapp}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Email */}
              {contact.email && (
                <div className="group">
                  <div className="flex items-center gap-3 p-4 bg-[#0F172A] rounded-lg hover:bg-[#1a2332] transition cursor-pointer border border-white/5 hover:border-blue-500/30">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition">
                      <LuMail size={20} className="text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Email</p>
                      <a href={`mailto:${contact.email}`} className="text-white font-semibold group-hover:text-blue-400 transition truncate">
                        {contact.email}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Address */}
              {contact.address && (
                <div className="group">
                  <div className="flex items-center gap-3 p-4 bg-[#0F172A] rounded-lg hover:bg-[#1a2332] transition cursor-pointer border border-white/5 hover:border-purple-500/30">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition">
                      <LuMapPin size={20} className="text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Address</p>
                      <p className="text-white font-semibold text-sm">
                        {contact.address}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <a
                  href={`tel:${contact.phone}`}
                  className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                >
                  <LuPhone size={18} />
                  Call Now
                </a>
                {contact.whatsapp && (
                  <a
                    href={`https://wa.me/${contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <LuMessageCircle size={18} />
                    WhatsApp
                  </a>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400">No contact information available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
