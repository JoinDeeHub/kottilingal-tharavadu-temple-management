import { motion } from 'framer-motion'
import DiyaRow from '../components/DiyaRow'

export default function Contact() {
  return (
    <div className="bg-temple-gradient min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <motion.h1 className="shimmer-text text-4xl font-black tracking-widest text-center mb-4" style={{ fontFamily: 'Cinzel' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          CONTACT US
        </motion.h1>
        <DiyaRow />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="glass-card p-8 space-y-6">
            <h2 className="text-yellow-400 font-bold text-xl tracking-wider" style={{ fontFamily: 'Cinzel' }}>TEMPLE DETAILS</h2>
            {[
              { icon: '🛕', label: 'Temple', value: 'Kottilingal Tharavadu Bhagavathi Temple' },
              { icon: '📍', label: 'Location', value: 'Palakkad, Kerala, India' },
              { icon: '🕐', label: 'Morning Pooja', value: '6:00 AM daily' },
              { icon: '🕛', label: 'Noon Pooja', value: '12:00 PM daily' },
              { icon: '🕕', label: 'Evening Pooja', value: '6:00 PM daily' },
              { icon: '🕗', label: 'Deeparadhana', value: '8:00 PM daily' },
            ].map((item, i) => (
              <motion.div key={i} className="flex gap-3 items-start"
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-amber-200/50 text-xs">{item.label}</p>
                  <p className="text-amber-100">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="glass-card p-8">
            <h2 className="text-yellow-400 font-bold text-xl tracking-wider mb-6" style={{ fontFamily: 'Cinzel' }}>MONTHLY POOJA</h2>
            <div className="space-y-4 text-amber-200/80 text-sm leading-relaxed">
              <p>Every family of the Kottilingal Tharavadu contributes to the monthly pooja offerings.</p>
              <p>To register your family or make a monthly contribution, please reach out to the temple admin.</p>
              <div className="glass-card p-4 mt-4 border border-yellow-700/30">
                <p className="text-yellow-400 font-semibold mb-2">📱 WhatsApp Reminders</p>
                <p className="text-amber-200/70 text-xs">Monthly pooja reminder notifications are sent via WhatsApp to all registered families. Contact admin to register your number.</p>
              </div>
              <div className="glass-card p-4 border border-yellow-700/30">
                <p className="text-yellow-400 font-semibold mb-2">💰 Transparent Finances</p>
                <p className="text-amber-200/70 text-xs">All donations and expenses are recorded and auditable. Family members may request a financial report from the admin.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="glass-card p-4 mt-8 text-center" data-aos="fade-up">
          <div className="bg-[#1a0800] rounded-lg h-48 flex items-center justify-center">
            <div>
              <p className="text-4xl mb-2">📍</p>
              <p className="text-amber-200/70">Palakkad, Kerala, India</p>
              <a href="https://maps.google.com/?q=Palakkad,Kerala" target="_blank" rel="noopener noreferrer"
                className="text-yellow-400 text-sm hover:underline mt-2 inline-block">Open in Google Maps →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
