import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fetchUpcomingEvents } from '../api/temple'

const sampleEvents = [
  { id: 1, title: 'Monthly Pooja', event_date: new Date(Date.now() + 3*24*60*60*1000).toISOString(), event_type: 'Pooja' },
  { id: 2, title: 'Vishu Celebrations', event_date: new Date(Date.now() + 14*24*60*60*1000).toISOString(), event_type: 'Festival' },
  { id: 3, title: 'Thulabharam', event_date: new Date(Date.now() + 30*24*60*60*1000).toISOString(), event_type: 'Ritual' },
]

export default function EventsPreview() {
  const [events, setEvents] = useState(sampleEvents)

  useEffect(() => {
    fetchUpcomingEvents().then(data => { if (data?.length) setEvents(data) }).catch(() => {})
  }, [])

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-center text-gradient-gold text-3xl font-bold mb-10 tracking-widest" style={{ fontFamily: 'Cinzel' }}>UPCOMING EVENTS</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.slice(0, 3).map((event, i) => (
          <motion.div key={event.id} className="glass-card p-6"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }} viewport={{ once: true }}
            whileHover={{ y: -5, borderColor: 'rgba(255,215,0,0.5)' }}>
            <div className="text-3xl mb-3">📿</div>
            <h3 className="text-yellow-400 font-bold text-lg mb-1">{event.title}</h3>
            <p className="text-amber-200/70 text-sm">{new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <span className="inline-block mt-2 text-xs bg-yellow-900/40 text-yellow-300 px-2 py-0.5 rounded">{event.event_type}</span>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link to="/events" className="text-yellow-400 border border-yellow-600 px-6 py-2 rounded-full hover:bg-yellow-600/20 transition-all text-sm">View All Events →</Link>
      </div>
    </section>
  )
}
