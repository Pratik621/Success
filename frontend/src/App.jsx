import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/ProtectedRoute';

import Login        from './pages/Login';
import Signup       from './pages/Signup';
import Dashboard    from './pages/Dashboard';
import BookDeal     from './pages/BookDeal';
import MyDeals      from './pages/MyDeals';
import Reminders    from './pages/Reminders';
import ReferCompany from './pages/ReferCompany';
import Profile      from './pages/Profile';
import Invoice      from './pages/Invoice';

import AdminLogin      from './pages/admin/AdminLogin';
import PendingDeals    from './pages/admin/PendingDeals';
import AcceptedDeals   from './pages/admin/AcceptedDeals';
import CompletedDeals  from './pages/admin/CompletedDeals';
import ManageMetals    from './pages/admin/ManageMetals';
import ManageReviews   from './pages/admin/ManageReviews';
import AdminReminders  from './pages/admin/AdminReminders';
import AdminReferrals  from './pages/admin/AdminReferrals';
import ManageContact   from './pages/admin/ManageContact';
import AdminStats      from './pages/admin/AdminStats';
import ResetUserPassword from './pages/admin/ResetUserPassword';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          {/* Public */}
          <Route path="/"            element={<Navigate to="/login" replace />} />
          <Route path="/login"       element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/signup"      element={<GuestRoute><Signup /></GuestRoute>} />
          <Route path="/admin/login" element={<GuestRoute><AdminLogin /></GuestRoute>} />

          {/* User Protected */}
          <Route path="/dashboard"   element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/book-deal"   element={<ProtectedRoute><BookDeal /></ProtectedRoute>} />
          <Route path="/my-deals"    element={<ProtectedRoute><MyDeals /></ProtectedRoute>} />
          <Route path="/reminders"   element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
          <Route path="/refer"       element={<ProtectedRoute><ReferCompany /></ProtectedRoute>} />
          <Route path="/profile"     element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/invoice/:id" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />

          {/* Admin Protected */}
          <Route path="/admin"              element={<AdminRoute><PendingDeals /></AdminRoute>} />
          <Route path="/admin/accepted"     element={<AdminRoute><AcceptedDeals /></AdminRoute>} />
          <Route path="/admin/completed"    element={<AdminRoute><CompletedDeals /></AdminRoute>} />
          <Route path="/admin/metals"       element={<AdminRoute><ManageMetals /></AdminRoute>} />
          <Route path="/admin/reviews"      element={<AdminRoute><ManageReviews /></AdminRoute>} />
          <Route path="/admin/reminders"    element={<AdminRoute><AdminReminders /></AdminRoute>} />
          <Route path="/admin/referrals"    element={<AdminRoute><AdminReferrals /></AdminRoute>} />
          <Route path="/admin/contact"      element={<AdminRoute><ManageContact /></AdminRoute>} />
          <Route path="/admin/stats"        element={<AdminRoute><AdminStats /></AdminRoute>} />
          <Route path="/admin/reset-password" element={<AdminRoute><ResetUserPassword /></AdminRoute>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
