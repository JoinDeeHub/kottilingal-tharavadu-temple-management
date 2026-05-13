import axios from 'axios'

const API = axios.create({ baseURL: '/api' })

API.interceptors.request.use(config => {
  const token = localStorage.getItem('temple_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const fetchPublicFamilies  = () => API.get('/families/public').then(r => r.data)
export const fetchPublicEvents    = () => API.get('/events/public').then(r => r.data)
export const fetchUpcomingEvents  = () => API.get('/events/upcoming').then(r => r.data)
export const fetchPublicSponsors  = () => API.get('/sponsors/public').then(r => r.data)
export const fetchDonationSummary = () => API.get('/donations/public/summary').then(r => r.data)
export const fetchDashboard       = () => API.get('/reports/dashboard').then(r => r.data)
export const fetchMonthlyReport   = (year) => API.get(`/reports/monthly?year=${year}`).then(r => r.data)
export const fetchAllFamilies     = () => API.get('/families/').then(r => r.data)
export const createFamily         = (d) => API.post('/families/', d).then(r => r.data)
export const updateFamily         = (id, d) => API.put(`/families/${id}`, d).then(r => r.data)
export const deleteFamily         = (id) => API.delete(`/families/${id}`).then(r => r.data)
export const createDonation       = (d) => API.post('/donations/', d).then(r => r.data)
export const fetchAllDonations    = () => API.get('/donations/').then(r => r.data)
export const fetchPendingDonations= () => API.get('/donations/pending').then(r => r.data)
export const createEvent          = (d) => API.post('/events/', d).then(r => r.data)
export const createSponsor        = (d) => API.post('/sponsors/', d).then(r => r.data)
export const fetchReminders       = () => API.get('/reminders/').then(r => r.data)
export const createReminder       = (d) => API.post('/reminders/', d).then(r => r.data)
