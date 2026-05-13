import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchPublicSponsors } from '../api/temple'
import DiyaRow from '../components/DiyaRow'

const sampleSponsors = [
  { id: 1, name: 'Kottilingal Family', contribution: 'Annual Festival Sponsor', year: 2026 },
  { id: 2, name: 'Tharavadu Members', contribution: 'Infrastructure Donor', year: 2026 },
  { id: 3, name: 'Devotee Community', contribution: 'Monthly Pooja Sponsor', year: 2025 },
]

export default function Sponsors() {
  const [sponsors, setSponsors] = useState(sampleSponsors)
  useEffect(() => { fetchPublicSponsors().then(d => { if(d?.length) setSponsors(d) }).catch(() => {}) }, [])

  return (
    <div className="bg-temple-gradient min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        <motion.h1 className="shimmer-text text-4xl font-black tracking-widest text-center mb-4" style={{ fontFamily: 'Cinzel' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          OUR BLESSED SPONSORS
        </motion.h1>
        <DiyaRow />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {sponsors.map((s, i) => (
            <motion.div key={s.id} className="glass-card p-6 text-center"
              initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15 }} viewport={{ once: true }}
   