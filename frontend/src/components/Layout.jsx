import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, createContext, useContext } from 'react';
import { contactAPI, authAPI } from '../services/api';
import {
  LuHouse, LuPackagePlus, LuClipboardList, LuLogOut, LuSettings,
  LuClock, LuTrophy, LuPhone, LuMapPin, LuHeadphones, LuX,
  LuBell, LuUsers, LuMail, LuMessageCircle, LuChartBar, LuUser, LuKeyRound,
} from 'react-icons/lu';

const LogoutModalContext = createContext();
export const useLogoutModal = () => useContext(LogoutModalContext);

const userLinks = [
  { to: '/dashboard',  label: 'Home',     Icon: LuHouse },
  { to: '/book-deal',  label: 'Book',     Icon: LuPackagePlus },
  { to: '/my-deals',   label: 'Deals',    Icon: LuClipboardList },
  { to: '/reminders',  label: 'Remind',   Icon: LuBell },
  { to: '/refer',      label: 'Refer',    Icon: LuUsers },
  { to: '/profile',    label: 'Profile',  Icon: LuUser },
];

const adminLinks = [
  { to: '/admin',              label: 'Pending',   Icon: LuClock },
  { to: '/admin/accepted',     label: 'Accepted',  Icon: LuPackagePlus },
  { to: '/admin/completed',    label: 'Completed', Icon: LuTrophy },
  { to: '/admin/reminders',    label: 'Pickups',   Icon: LuBell },
  { to: '/admin/referrals',    label: 'Referrals', Icon: LuUsers },
  { to: '/admin/metals',       label: 'Metals',    Icon: LuSettings },
  { to: '/admin/stats',          label: 'Stats',   Icon: LuChartBar },
  { to: '/admin/reset-password', label: 'Reset Pwd', Icon: LuKeyRound },
];

const adminDesktopLinks = [
  { to: '/admin',                label: 'Pending',   Icon: LuClock },
  { to: '/admin/accepted',       label: 'Accepted',  Icon: LuPackagePlus },
  { to: '/admin/completed',      label: 'Completed', Icon: LuTrophy },
  { to: '/admin/reminders',      label: 'Pickups',   Icon: LuBell },
  { to: '/admin/referrals',      label: 'Referrals', Icon: LuUsers },
  { to: '/admin/metals',         label: 'Metals',    Icon: LuSettings },
  { to: '/admin/contact',        label: 'Contact',   Icon: LuHeadphones },
  { to: '/admin/stats',          label: 'Stats',     Icon: LuChartBar },
  { to: '/admin/reset-password', label: 'Reset Pwd', Icon: LuKeyRound },
];

function LogoutModal({ open, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-[#1E293B] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <button onClick={onCancel} className="absolute top-4 right-4 text-slate-500 hover:text-white transition">
          <LuX size={18} />
        </button>
        <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <LuLogOut size={22} className="text-red-400" />
        </div>
        <h2 className="text-white font-bold text-center text-lg mb-1">Sign Out?</h2>
        <p className="text-slate-400 text-sm text-center mb-6">Are you sure you want to logout?</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
          <button onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 shadow-lg shadow-red-500/20">
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
}

function HelpSheet({ open, onClose, contact }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1E293B] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-base flex items-center gap-2">
            <LuHeadphones size={18} className="text-orange-400" /> Help & Contact
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition p-1">
            <LuX size={18} />
          </button>
        </div>

        {/* Contact items */}
        {!contact?.phone && !contact?.email && !contact?.address && !contact?.whatsapp ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">📞</div>
            <p className="text-slate-400 text-sm">Contact info not set yet.</p>
            <p className="text-slate-500 text-xs mt-1">Admin will update this soon.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {contact?.phone && (
              <a href={`tel:${contact.phone}`}
                className="flex items-center gap-3 bg-[#0F172A] border border-green-500/20 rounded-2xl p-4 active:scale-95 transition-all cursor-pointer">
                <div className="relative w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center shrink-0">
                  <LuPhone size={17} className="text-green-400" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full">
                    <span className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Call Us</p>
                  <p className="text-white font-bold text-sm truncate">{contact.phone}</p>
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
                  <LuPhone size={14} className="text-white" />
                </div>
              </a>
            )}
            {contact?.whatsapp && (
              <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 bg-[#0F172A] border border-green-500/20 rounded-2xl p-4 active:scale-95 transition-all cursor-pointer">
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center shrink-0">
                  <LuMessageCircle size={17} className="text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">WhatsApp</p>
                  <p className="text-white font-bold text-sm truncate">{contact.whatsapp}</p>
                </div>
              </a>
            )}
            {contact?.email && (
              <a href={`mailto:${contact.email}`}
                className="flex items-center gap-3 bg-[#0F172A] border border-blue-500/20 rounded-2xl p-4 active:scale-95 transition-all cursor-pointer">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                  <LuMail size={17} className="text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Email Us</p>
                  <p className="text-white font-bold text-sm truncate">{contact.email}</p>
                </div>
              </a>
            )}
            {contact?.address && (
              <div className="flex items-start gap-3 bg-[#0F172A] border border-white/5 rounded-2xl p-4">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <LuMapPin size={17} className="text-orange-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Address</p>
                  <p className="text-white text-sm leading-relaxed">{contact.address}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Header({ isAdmin, onLogoutClick, notifs }) {
  const { user } = useAuth();
  const links = isAdmin ? adminDesktopLinks : userLinks;
  const totalNotifs = isAdmin ? ((notifs.pendingDeals || 0) + (notifs.pendingReviews || 0) + (notifs.newReferrals || 0)) : 0;

  return (
    <header className="sticky top-0 z-50 bg-[#0F172A]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-500/30">S</div>
          <div className="leading-tight">
            <span className="font-bold text-white text-sm sm:text-base">ScrapMetal</span>
            <span className="font-bold text-orange-500 text-sm sm:text-base"> Pro</span>
            {isAdmin && <span className="ml-1.5 text-xs bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded-md font-medium">Admin</span>}
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5 overflow-x-auto">
          {links.map(({ to, label, Icon }) => (
            <NavItem key={to} to={to} label={label} Icon={Icon}
              badge={isAdmin ? getBadge(to, notifs) : 0} />
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          {isAdmin && totalNotifs > 0 && (
            <span className="w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
              {totalNotifs > 9 ? '9+' : totalNotifs}
            </span>
          )}
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-semibold text-white leading-tight truncate max-w-[120px]">{user?.companyName}</span>
            <span className="text-xs text-slate-500 capitalize">{user?.role}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-sm">
            {user?.companyName?.[0]?.toUpperCase() || 'U'}
          </div>
          <button onClick={onLogoutClick}
            className="hidden sm:flex items-center gap-1.5 text-slate-400 hover:text-red-400 transition text-sm font-medium px-3 py-1.5 rounded-xl hover:bg-red-500/10">
            <LuLogOut size={15} /> Logout
          </button>
        </div>
      </div>
    </header>
  );
}

function getBadge(to, notifs) {
  if (to === '/admin')             return notifs.pendingDeals   || 0;
  if (to === '/admin/reviews')     return notifs.pendingReviews || 0;
  if (to === '/admin/referrals')   return notifs.newReferrals   || 0;
  if (to === '/admin/reminders')   return notifs.todayReminders || 0;
  return 0;
}

function NavItem({ to, label, Icon, badge = 0 }) {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link to={to} className="relative flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap
        ${active ? 'bg-orange-500/15 text-orange-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}"
      style={{ color: active ? '#f97316' : undefined, background: active ? 'rgba(249,115,22,0.15)' : undefined }}>
      <Icon size={14} />{label}
      {badge > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </Link>
  );
}

function BottomNav({ isAdmin, onHelpClick, notifs }) {
  const { pathname } = useLocation();
  const links = isAdmin ? adminLinks : userLinks;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1E293B] border-t border-white/5 px-1 py-1.5">
      <div className="flex items-center justify-around">
        {links.map(({ to, label, Icon }) => {
          const active = pathname === to;
          const badge = isAdmin ? getBadge(to, notifs) : 0;
          return (
            <Link key={to} to={to}
              className={`relative flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all min-w-[44px]
                ${active ? 'text-orange-400' : 'text-slate-500 hover:text-slate-300'}`}>
              <Icon size={19} />
              <span className="text-[9px] font-medium">{label}</span>
              {badge > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full text-white text-[8px] font-bold flex items-center justify-center">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </Link>
          );
        })}
        {!isAdmin && (
          <button onClick={onHelpClick}
            className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-slate-500 hover:text-orange-400 transition min-w-[44px]">
            <LuHeadphones size={19} />
            <span className="text-[9px] font-medium">Help</span>
          </button>
        )}
      </div>
    </nav>
  );
}

export default function Layout({ children, isAdmin = false }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [contact, setContact] = useState(null);
  const [notifs, setNotifs] = useState({});

  useEffect(() => {
    if (!isAdmin) contactAPI.get().then(({ data }) => setContact(data)).catch(() => {});
    if (isAdmin) {
      const fetchNotifs = () => authAPI.getNotifCounts().then(({ data }) => setNotifs(data)).catch(() => {});
      fetchNotifs();
      const interval = setInterval(fetchNotifs, 30000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const confirmLogout = () => {
    logout();
    navigate(isAdmin ? '/admin/login' : '/login');
  };

  return (
    <LogoutModalContext.Provider value={() => setLogoutOpen(true)}>
      <div className="min-h-screen bg-[#0F172A] text-white">
        <Header isAdmin={isAdmin} onLogoutClick={() => setLogoutOpen(true)} notifs={notifs} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-8">
          {children}
        </main>
        <BottomNav isAdmin={isAdmin} onHelpClick={() => setHelpOpen(true)} notifs={notifs} />
        <LogoutModal open={logoutOpen} onConfirm={confirmLogout} onCancel={() => setLogoutOpen(false)} />
        <HelpSheet open={helpOpen} onClose={() => setHelpOpen(false)} contact={contact} />
      </div>
    </LogoutModalContext.Provider>
  );
}
