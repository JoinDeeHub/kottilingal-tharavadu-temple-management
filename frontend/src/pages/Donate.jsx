import { useState } from 'react'
import { motion } from 'framer-motion'
import { createDonation } from '../api/temple'
import toast from 'react-hot-toast'
import DiyaRow from '../components/DiyaRow'

export default function Donate() {
  const [form, setForm] = useState({ amount: '', donor_name: '', purpose: '', notes: '', donation_type: 'general' })
  const [lit, setLit] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createDonation({ ...form, amount: parseFloat(form.amount) })
      setLit(true)
      toast.success('🙏 Your offering has been received! May Bhagavathi bless you.')
      setTimeout(() => setLit(false), 3000)
    } catch {
      toast('Please contact admin to record your donation.')
    }
  }

  return (
    <div className="bg-temple-gradient min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        <motion.h1 className="shimmer-text text-4xl font-black tracking-widest text-center mb-4" style={{ fontFamily: 'Cinzel' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          MAKE AN OFFERING
        </motion.h1>
        <DiyaRow />

        <motion.div className="text-center my-8">
          {[...Array(5)].map((_, i) => (
            <motion.span key={i} className="text-5xl mx-2"
              animate={lit ? { scale: [1, 1.5, 1], opacity: [0.5, 1, 0.8] } : { opacity: [1, 0.3, 1], scale: [1, 0.9, 1.1, 1] }}
              transition={{ duration: lit ? 0.5 : 1.5, repeat: lit ? 0 : Infinity, delay: i * 0.2 }}>
              🪔
            </motion.span>
          ))}
        </motion.div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-amber-200/80 text-sm block mb-1">Donor Name</label>
              <input value={form.donor_name} onChange={e => setForm({...form, donor_name: e.target.value})}
                className="w-full bg-[#1a0800] border border-yellow-900/40 text-amber-100 rounded-lg px-4 py-3 focus:border-yellow-500 outline-none"
                placeholder="Your full name" />
            </div>
            <div>
              <label className="text-amber-200/80 text-sm block mb-1">Amount (₹)</label>
              <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required
                className="w-full bg-[#1a0800] border border-yellow-900/40 text-amber-100 rounded-lg px-4 py-3 focus:border-yellow-500 outline-none"
                placeholder="Enter amount" />
            </div>
            <div>
              <label className="text-amber-200/80 text-sm block mb-1">Offering Type</label>
              <select value={form.donation_type} onChange={e => setForm({...form, donation_type: e.target.value})}
                className="w-full bg-[#1a0800] border border-yellow-900/40 text-amber-100 rounded-lg px-4 py-3 focus:border-yellow-500 outline-none">
                <option value="monthly_pooja">Monthly Pooja Contribution</option>
                <option value="infrastructure">Infrastructure Donation</option>
                <option value="festival">Festival Sponsorship</option>
                <option value="sponsorship">General Sponsorship</option>
                <option value="general">General Offering</option>
              </select>
            </div>
            <div>
              <label className="text-amber-200/80 text-sm block mb-1">Purpose / Notes</label>
              <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                className="w-full bg-[#1a0800] border border-yellow-900/40 text-amber-100 rounded-lg px-4 py-3 focus:border-yellow-500 outline-none h-24 resize-none"
                placeholder="For what occasion or purpose..." />
            </div>
            <motion.button type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="w-full py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold rounded-lg text-lg shadow-lg shadow-yellow-900">
              🪔 Light a Diya — Offer Now
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  )
}
