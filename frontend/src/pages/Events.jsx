import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchPublicEvents } from '../api/temple'
import DiyaRow from '../components/DiyaRow'

const sampleEvents = [
  { id: 1, title: 'Monthly Pooja', event_date: new Date(Date.now() + 3*86400000).toISOString(), event_type: 'Pooja', description: 'Monthly family pooja and offerings' },
  { id: 2, title: 'Vishu Celebrations', event_date: new Date(Date.now() + 14*86400000).toISOString(), event_type: 'Festival', description: 'Vishu Kani and Vishukkaineetam ceremony' },
  { id: 3, title: 'Thulabharam', event_date: new Date(Date.now() + 30*86400000).toISOString(), event_type: 'Ritual', description: 'Annual Thulabharam ritual for family blessings' },
  { id: 4, title: 'Navaratri Celebrations', event_date: new Date(Date.now() + 60*86400000).toISOString(), event_type: 'Festival', description: 'Nine nights of devotion to Goddess Bhagavathi' },
]

export default function Events() {
  const [events, setEvents] = useState(sampleEvents)
  useEffect(() => { fetchPublicEvents().then(d => { if(d?.length) setEvents(d) }).catch(() => {}) }, [])

  return (
    <div className="bg-temple-gradient min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        <motion.h1 className="shimmer-text text-4xl font-black tracking-widest text-center mb-4" style={{ fontFamily: 'Cinzel' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          EVENTS & FESTIVALS
        </motion.h1>
        <DiyaRow />
        <div className="space-y-4 mt-8">
          {events.map((event, i) => (
            <motion.div key={event.id} className="glass-card p-6 flex flex-col md:flex-row gap-4 items-start md:items-center"
              initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              whileHover={{ x: 5 }}>
              <div className="text-4xl">🎉</div>
              <div className="flex-1">
                <h3 className="text-yellow-400 font-bold text-lg">{event.title}</h3>
                <p className="text-amber-200/70 text-sm mt-1">{event.description}</p>
              </div>
              <div className="text-right">
                <div className="text-orange-300 font-bold">{new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                <div className="text-amber-200/50 text-xs">{new Date(event.event_date).getFullYear()}</div>
                <span className="text-xs bg-yellow-900/40 text-yellow-300 px-2 py-0.5 rounded mt-1 inline-block">{event.event_type}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
