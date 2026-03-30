import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiMenu, FiX, FiClock, FiCheckCircle, FiAward, FiSettings, FiStar } from 'react-icons/fi';
import { useState } from 'react';

const links = [
  { to: '/admin', label: 'Pending', fullLabel: 'Pending Deals', icon: <FiClock /> },
  { to: '/admin/accepted', label: 'Accepted', fullLabel: 'Accepted Deals', icon: <FiCheckCircle /> },
  { to: '/admin/completed', label: 'Completed', fullLabel: 'Completed Deals', icon: <FiAward /> },
  { to: '/admin/metals', label: 'Metals', fullLabel: 'Manage Metals', icon: <FiSettings /> },
  { to: '/admin/reviews', label: 'Reviews', fullLabel: 'Reviews', icon: <FiStar /> },
];

export default function AdminNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="text-lg sm:text-xl font-bold text-orange-400">⚙️ Admin Panel</span>
        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-3 text-sm font-medium">
          {links.map((l) => (
            <Link key={l.to} to={l.to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition
                ${location.pathname === l.to ? 'bg-slate-700 text-orange-400' : 'hover:bg-slate-800 hover:text-orange-400'}`}>
              {l.icon} {l.fullLabel}
            </Link>
          ))}
          <button onClick={handleLogout}
            className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 px-3 py-1.5 rounded-lg transition ml-2">
            <FiLogOut /> Logout
          </button>
        </div>
        {/* Mobile hamburger */}
        <button className="lg:hidden p-2 rounded-lg hover:bg-slate-800 transition" onClick={() => setOpen(!open)}>
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>
      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-slate-800 border-t border-slate-700 px-4 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition
                ${location.pathname === l.to ? 'bg-slate-700 text-orange-400' : 'hover:bg-slate-700'}`}>
              <span className="text-orange-400">{l.icon}</span> {l.fullLabel}
            </Link>
          ))}
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-700 transition mt-1">
            <FiLogOut /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
