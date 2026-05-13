import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { fetchDashboard, fetchAllFamilies, fetchAllDonations, fetchPendingDonations, createFamily, createDonation, createEvent, createReminder } from '../api/temple'
import toast from 'react-hot-toast'

function AdminHome() {
  const [stats, setStats] = useState({})
  useEffect(() => { fetchDashboard().then(setStats).catch(() => {}) }, [])

  const cards = [
    { icon: '🏠', label: 'Total Families', value: stats.total_families || 0, color: 'from-yellow-900 to-orange-900' },
    { icon: '💰', label: 'Total Collected', value: `₹${(stats.total_collected || 0).toLocaleString()}`, color: 'from-green-900 to-teal-900' },
    { icon: '⏳', label: 'Pending Amount', value: `₹${(stats.pending_amount || 0).toLocaleString()}`, color: 'from-red-900 to-rose-900' },
    { icon: '🤝', label: 'Total Sponsors', value: stats.total_sponsors || 0, color: 'from-purple-900 to-indigo-900' },
  ]

  return (
    <div>
      <h2 className="text-yellow-400 text-2xl font-bold mb-6" style={{ fontFamily: 'Cinzel' }}>DASHBOARD</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((c, i) => (
          <motion.div key={i} className={`bg-gradient-to-br ${c.color} rounded-xl p-5 border border-yellow-900/30`}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div className="text-3xl mb-2">{c.icon}</div>
            <div className="text-yellow-300 font-bold text-lg">{c.value}</div>
            <div className="text-amber-200/60 text-xs mt-1">{c.label}</div>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { to: 'families', icon: '👨‍👩‍👧‍👦', label: 'Manage Families' },
          { to: 'donations', icon: '💵', label: 'Donations' },
          { to: 'events', icon: '📅', label: 'Add Event' },
          { to: 'reminders', icon: '🔔', label: 'Reminders' },
        ].map((item, i) => (
          <Link key={i} to={item.to}>
            <motion.div className="glass-card p-4 text-center hover:border-yellow-500/50 transition-all cursor-pointer"
              whileHover={{ y: -3 }}>
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-amber-200/80 text-sm">{item.label}</div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function AdminFamilies() {
  const [families, setFamilies] = useState([])
  const [form, setForm] = useState({ family_name: '', head_of_family: '', contact_number: '', address: '', is_public: true })
  useEffect(() => { fetchAllFamilies().then(setFamilies).catch(() => {}) }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      const f = await createFamily(form)
      setFamilies([...families, f])
      toast.success('Family added!')
      setForm({ family_name: '', head_of_family: '', contact_number: '', address: '', is_public: true })
    } catch { toast.error('Failed to add family') }
  }

  return (
    <div>
      <h2 className="text-yellow-400 text-2xl font-bold mb-6" style={{ fontFamily: 'Cinzel' }}>FAMILY MANAGEMENT</h2>
      <div className="glass-card p-6 mb-6">
        <h3 className="text-yellow-300 font-semibold mb-4">Add New Family</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[['family_name','Family Name'],['head_of_family','Head of Family'],['contact_number','Contact Number'],['address','Address']].map(([key, label]) => (
            <div key={key}>
              <label className="text-amber-200/60 text-xs block mb-1">{label}</label>
              <input value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})}
                required={key !== 'contact_number' && key !== 'address'}
                className="w-full bg-[#1a0800] border border-yellow-900/30 text-amber-100 rounded px-3 py-2 text-sm focus:border-yellow-500 outline-none" />
            </div>
          ))}
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_public} onChange={e => setForm({...form, is_public: e.target.checked})}
              className="accent-yellow-500" id="public" />
            <label htmlFor="public" className="text-amber-200/70 text-sm">Publicly visible</label>
          </div>
          <button type="submit" className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2 rounded font-semibold transition-colors">Add Family</button>
        </form>
      </div>
      <div className="space-y-2">
        {families.map(f => (
          <div key={f.id} className="glass-card p-4 flex justify-between items-center">
            <div>
              <p className="text-yellow-400 font-semibold">{f.family_name}</p>
              <p className="text-amber-200/60 text-sm">{f.head_of_family} · {f.contact_number}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded ${f.is_public ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
              {f.is_public ? 'Public' : 'Private'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminDonations() {
  const [donations, setDonations] = useState([])
  const [pending, setPending] = useState([])
  const [form, setForm] = useState({ amount: '', donation_type: 'monthly_pooja', donor_name: '', purpose: '', payment_status: 'paid' })

  useEffect(() => {
    fetchAllDonations().then(setDonations).catch(() => {})
    fetchPendingDonations().then(setPending).catch(() => {})
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      const d = await createDonation({...form, amount: parseFloat(form.amount)})
      setDonations([d, ...donations])
      toast.success('Donation recorded!')
    } catch { toast.error('Failed to record donation') }
  }

  return (
    <div>
      <h2 className="text-yellow-400 text-2xl font-bold mb-6" style={{ fontFamily: 'Cinzel' }}>DONATION MANAGEMENT</h2>
      {pending.length > 0 && (
        <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 mb-6">
          <p className="text-red-300 font-semibold">⚠️ {pending.length} pending payment(s) require attention</p>
        </div>
      )}
      <div className="glass-card p-6 mb-6">
        <h3 className="text-yellow-300 font-semibold mb-4">Record Donation</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-amber-200/60 text-xs block mb-1">Amount (₹)</label>
            <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required
              className="w-full bg-[#1a0800] border border-yellow-900/30 text-amber-100 rounded px-3 py-2 text-sm outline-none focus:border-yellow-500" />
          </div>
          <div>
            <label className="text-amber-200/60 text-xs block mb-1">Donor Name</label>
            <input value={form.donor_name} onChange={e => setForm({...form, donor_name: e.target.value})}
              className="w-full bg-[#1a0800] border border-yellow-900/30 text-amber-100 rounded px-3 py-2 text-sm outline-none focus:border-yellow-500" />
          </div>
          <div>
            <label className="text-amber-200/60 text-xs block mb-1">Type</label>
            <select value={form.donation_type} onChange={e => setForm({...form, donation_type: e.target.value})}
              className="w-full bg-[#1a0800] border border-yellow-900/30 text-amber-100 rounded px-3 py-2 text-sm outline-none">
              <option value="monthly_pooja">Monthly Pooja</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="festival">Festival</option>
              <option value="sponsorship">Sponsorship</option>
              <option value="general">General</option>
            </select>
          </div>
          <div>
            <label className="text-amber-200/60 text-xs block mb-1">Status</label>
            <select value={form.payment_status} onChange={e => setForm({...form, payment_status: e.target.value})}
              className="w-full bg-[#1a0800] border border-yellow-900/30 text-amber-100 rounded px-3 py-2 text-sm outline-none">
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <button type="submit" className="md:col-span-2 bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2 rounded font-semibold transition-colors">Record Donation</button>
        </form>
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {donations.map(d => (
          <div key={d.id} className="glass-card p-3 flex justify-between items-center text-sm">
            <div>
              <p className="text-yellow-400">{d.donor_name || 'Anonymous'} — {d.donation_type?.replace('_', ' ')}</p>
              <p className="text-amber-200/50 text-xs">{new Date(d.donation_date || d.created_at).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="text-green-400 font-bold">₹{d.amount?.toLocaleString()}</p>
              <span className={`text-xs px-2 py-0.5 rounded ${d.payment_status === 'paid' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>{d.payment_status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminEvents() {
  const [form, setForm] = useState({ title: '', description: '', event_date: '', event_type: 'Pooja', is_public: true })
  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      await createEvent(form)
      toast.success('Event created!')
      setForm({ title: '', description: '', event_date: '', event_type: 'Pooja', is_public: true })
    } catch { toast.error('Failed to create event') }
  }
  return (
    <div>
      <h2 className="text-yellow-400 text-2xl font-bold mb-6" style={{ fontFamily: 'Cinzel' }}>ADD EVENT</h2>
      <div className="glass-card p-8 max-w-lg">
        <form onSubmit={handleAdd} className="space-y-4">
          {[['title','Event Title','text'],['event_date','Date & Time','datetime-local']].map(([key,label,type]) => (
            <div key={key}>
              <label className="text-amber-200/60 text-xs block mb-1">{label}</label>
              <input type={type} value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})} required
                className="w-full bg-[#1a0800] border border-yellow-900/30 text-amber-100 rounded px-3 py-2 text-sm outline-none focus:border-yellow-500" />
            </div>
          ))}
          <div>
            <label className="text-amber-200/60 text-xs block mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              className="w-full bg-[#1a0800] border border-yellow-900/30 text-amber-100 rounded px-3 py-2 text-sm outline-none h-20 resize-none" />
          </div>
          <div>
            <label className="text-amber-200/60 text-xs block mb-1">Type</label>
            <select value={form.event_type} onChange={e => setForm({...form, event_type: e.target.value})}
              className="w-full bg-[#1a0800] border border-yellow-900/30 text-amber-100 rounded px-3 py-2 text-sm outline-none">
              {['Pooja','Festival','Ritual','Meeting','Special'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-2 rounded font-semibold">Create Event</button>
        </form>
      </div>
    </div>
  )
}

function AdminReminders() {
  const [families, setFamilies] = useState([])
  const [form, setForm] = useState({ family_id: '', message: '', reminder_type: 'monthly_pooja', scheduled_at: '' })
  useEffect(() => { fetchAllFamilies().then(setFamilies).catch(() => {}) }, [])
  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      await createReminder({...form, family_id: parseInt(form.family_id)})
      toast.success('Reminder scheduled!')
    } catch { toast.error('Failed to schedule reminder') }
  }
  return (
    <div>
      <h2 className="text-yellow-400 text-2xl font-bold mb-6" style={{ fontFamily: 'Cinzel' }}>POOJA REMINDERS</h2>
      <div className="glass-card p-6 mb-6">
        <p className="text-amber-200/70 text-sm mb-4">🔔 Schedule monthly pooja reminders for families. WhatsApp integration can be added via Twilio or Meta Cloud API.</p>
        <form onSubmit={handleAdd} className="space-y-4 max-w-lg">
          <div>
            <label className="text-amber-200/60 text-xs block mb-1">Family</label>
            <select value={form.family_id} onChange={e => setForm({...form, family_id: e.target.value})} required
              className="w-full bg-[#1a0800] border border-yellow-900/30 text-amber-100 rounded px-3 py-2 text-sm outline-none">
              <option value="">Select family</option>
              {families.map(f => <option key={f.id} value={f.id}>{f.family_name} — {f.head_of_family}</option>)}
            </select>
          </div>
          <div>
            <label className="text-amber-200/60 text-xs block mb-1">Message</label>
            <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} required
              className="w-full bg-[#1a0800] border border-yellow-900/30 text-amber-100 rounded px-3 py-2 text-sm outline-none h-20 resize-none"
              placeholder="Dear family, your monthly pooja contribution is due..." />
          </div>
          <div>
            <label className="text-amber-200/60 text-xs block mb-1">Schedule Time</label>
            <input type="datetime-local" value={form.scheduled_at} onChange={e => setForm({...form, scheduled_at: e.target.value})} required
              className="w-full bg-[#1a0800] border border-yellow-900/30 text-amber-100 rounded px-3 py-2 text-sm outline-none" />
          </div>
          <button type="submit" className="w-full bg-yellow-600 text-white py-2 rounded font-semibold">🔔 Schedule Reminder</button>
        </form>
      </div>
    </div>
  )
}

export default function Admin() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user])

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: '📊' },
    { to: '/admin/families', label: 'Families', icon: '👨‍👩‍👧‍👦' },
    { to: '/admin/donations', label: 'Donations', icon: '💰' },
    { to: '/admin/events', label: 'Events', icon: '📅' },
    { to: '/admin/reminders', label: 'Reminders', icon: '🔔' },
  ]

  return (
    <div className="bg-temple-gradient min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6 py-4 border-b border-yellow-900/30">
          <h1 className="text-yellow-400 font-black tracking-widest" style={{ fontFamily: 'Cinzel' }}>🛕 TEMPLE ADMIN</h1>
          <button onClick={() => { logout(); navigate('/') }} className="text-red-400 text-sm hover:text-red-300">Logout</button>
        </div>
        <div className="flex gap-2 flex-wrap mb-8">
          {navItems.map(item => (
            <Link key={item.to} to={item.to}
              className="glass-card px-4 py-2 text-sm text-amber-200/80 hover:text-yellow-400 hover:border-yellow-600/50 transition-all">
              {item.icon} {item.label}
            </Link>
          ))}
        </div>
        <Routes>
          <Route index element={<AdminHome />} />
          <Route path="families" element={<AdminFamilies />} />
          <Route path="donations" element={<AdminDonations />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="reminders" element={<AdminReminders />} />
        </Routes>
      </div>
    </div>
  )
}
