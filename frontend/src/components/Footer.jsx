import { motion } from 'framer-motion'

export default function Footer() {
  const diyas = Array(9).fill(null)
  return (
    <footer className="bg-[#0d0500] border-t border-yellow-900/30 pt-12 pb-6">
      <div className="section-divider" />
      <div className="flex justify-center gap-4 mb-8">
        {diyas.map((_, i) => (
          <motion.span key={i} className="text-3xl"
            animate={{ opacity: [1, 0.3, 1], scale: [1, 0.9, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}>
            🪔
          </motion.span>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <div>
          <h3 className="text-yellow-400 font-bold mb-3 tracking-widest" style={{ fontFamily: 'Cinzel' }}>🛕 TEMPLE</h3>
          <p className="text-amber-200/80">Kottilingal Tharavadu Bhagavathi Temple</p>
          <p className="text-amber-200/60 mt-1">Palakkad, Kerala</p>
          <p className="text-amber-200/60">Serving families since generations</p>
        </div>
        <div>
          <h3 className="text-yellow-400 font-bold mb-3 tracking-widest" style={{ fontFamily: 'Cinzel' }}>QUICK LINKS</h3>
          {['Home', 'Events', 'Gallery', 'Donate', 'Contact'].map(l => (
            <a key={l} href={`/${l.toLowerCase()}`} className="block text-amber-200/70 hover:text-yellow-400 transition-colors py-0.5">{l}</a>
          ))}
        </div>
        <div>
          <h3 className="text-yellow-400 font-bold mb-3 tracking-widest" style={{ fontFamily: 'Cinzel' }}>POOJA TIMINGS</h3>
          <div className="space-y-1 text-amber-200/70">
            <p>🌅 Morning Pooja: 6:00 AM</p>
            <p>☀️ Noon Pooja: 12:00 PM</p>
            <p>🌙 Evening Pooja: 6:00 PM</p>
            <p>🕯️ Night Deeparadhana: 8:00 PM</p>
          </div>
        </div>
      </div>

      <div className="section-divider mt-8" />
      <p className="text-center text-amber-200/40 text-xs mt-4">© 2026 Kottilingal Tharavadu Bhagavathi Temple · Built with devotion 🙏</p>
    </footer>
  )
}
