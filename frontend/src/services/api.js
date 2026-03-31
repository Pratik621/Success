import axios from 'axios';

const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Request interceptor: Add token to all requests
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
    console.log('✅ Token added to request:', config.url);
  } else {
    console.warn('⚠️ No token found for request:', config.url);
  }
  return config;
});

// Response interceptor: Handle token expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 (token expired), clear localStorage and redirect to login
    if (error.response?.status === 401) {
      console.warn('⚠️ Token expired. Clearing user data.');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup:             (data) => API.post('/auth/signup', data),
  login:              (data) => API.post('/auth/login', data),
  adminLogin:         (data) => API.post('/auth/admin/login', data),
  updateProfile:      (data) => API.put('/auth/profile', data),
  getNotifCounts:     ()     => API.get('/auth/admin/notifs'),
  adminResetPassword: (data) => API.put('/auth/admin/reset-password', data),
};

export const dealAPI = {
  book:           (data)         => API.post('/deals', data),
  getMyDeals:     (params)       => API.get('/deals/my', { params }),
  getAllDeals:     (status)       => API.get(`/deals${status ? `?status=${status}` : ''}`),
  getOne:         (id)           => API.get(`/deals/${id}`),
  updateStatus:   (id, status)   => API.put(`/deals/${id}/status`, { status }),
  counterOffer:   (id, data)     => API.put(`/deals/${id}/counter`, data),
  respondCounter: (id, accept)   => API.put(`/deals/${id}/respond-counter`, { accept }),
  getAdminStats:  ()             => API.get('/deals/admin/stats'),
};

export const metalAPI = {
  getAll:          ()         => API.get('/metals'),
  add:             (data)     => API.post('/metals', data),
  update:          (id, data) => API.put(`/metals/${id}`, data),
  delete:          (id)       => API.delete(`/metals/${id}`),
  getPriceHistory: (id)       => API.get(`/metals/${id}/price-history`),
  getAllHistory:    ()         => API.get('/metals/price-history/all'),
};

export const reviewAPI = {
  getAll:        ()              => API.get('/reviews'),
  add:           (data)          => API.post('/reviews', data),
  getAdmin:      ()              => API.get('/reviews/admin'),
  updateStatus:  (id, status)    => API.put(`/reviews/${id}/status`, { status }),
  delete:        (id)            => API.delete(`/reviews/${id}`),
};

export const reminderAPI = {
  create:   (data) => API.post('/reminders', data),
  getMy:    ()     => API.get('/reminders/my'),
  deleteMy: (id)   => API.delete(`/reminders/${id}`),
  getAdmin: ()     => API.get('/reminders/admin'),
  markDone: (id)   => API.put(`/reminders/${id}/done`),
};

export const referralAPI = {
  create:       (data)       => API.post('/referrals', data),
  getMy:        ()           => API.get('/referrals/my'),
  getAll:       ()           => API.get('/referrals'),
  updateStatus: (id, status) => API.put(`/referrals/${id}/status`, { status }),
};

export const contactAPI = {
  get:    () => API.get('/contact'),
  update: (data) => API.put('/contact', data),
};

export default API;
