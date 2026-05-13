import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'
import DiyaRow from '../components/DiyaRow'
import StatsCounter from '../components/StatsCounter'
import EventsPreview from '../components/EventsPreview'

export default function Home() {
  useEffect(() => { AOS.init({ duration: 1000, once: true }) }, [])

  return (
    <div className="bg-temple-gradient min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-orange-900/20 via-transparent to-transparent" />

        {/* Animated Om symbol */}
        <motion.div
          className="text-6xl mb-4 text-yellow-500"
          animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          ॐ
        </motion.div>

        {/* Temple image glow ring */}
        <motion.div
          className="relative mb-8 z-10"
          animate={{ boxShadow: ['0 0 40px #FFD700', '0 0 100px #FF6600', '0 0 40px #FFD700'] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ borderRadius: '50%' }}
        >
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-yellow-500 overflow-hidden bg-[#2d1000]">
            <img src="/temple-hero.jpg" alt="Kottilingal Temple"
              className="w-full h-full object-cover opacity-90"
              onError={(e) => { e.target.style.display='none' }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-6xl">🛕</div>
          </div>
        </motion.div>

        <motion.div className="z-10" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
          <h1 className="shimmer-text text-4xl md:text-6xl font-black tracking-widest mb-2" style={{ fontFamily: 'Cinzel' }}>
            KOTTILINGAL THARAVADU
          </h1>
          <h2 className="text-orange-300 text-2xl md:text-3xl tracking-widest mb-2" style={{ fontFamily: 'Cinzel' }}>
            BHAGAVATHI TEMPLE
          </h2>
          <p className="text-amber-200/80 text-lg mb-1">കോറ്റിലിങ്ങൽ തറവാട് ഭഗവതി ക്ഷേത്രം</p>
          <p className="text-amber-200/60 text-sm tracking-wider mb-8">📍 Palakkad, Kerala</p>

          <div className="flex flex-wrap justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/donate"
                className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold rounded-full shadow-lg shadow-yellow-900 hover:shadow-yellow-500/40 transition-all">
                🪔 Make an Offering
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/events"
                className="px-8 py-3 border border-yellow-600 text-yellow-400 font-bold rounded-full hover:bg-yellow-600/20 transition-all">
                📅 View Events
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <div className="w-6 h-10 border-2 border-yellow-600 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-yellow-500 rounded-full" />
          </div>
        </motion.div>
      </section>

      <DiyaRow count={9} />

      {/* Stats */}
      <section className="py-16 px-4" data-aos="fade-up">
        <h2 className="text-center text-gradient-gold text-3xl font-bold mb-10 tracking-widest" style={{ fontFamily: 'Cinzel' }}>TEMPLE AT A GLANCE</h2>
        <StatsCounter />
      </section>

      <div className="section-divider" />

      {/* Events preview */}
      <EventsPreview />

      <div className="section-divider" />

      {/* Temple photo gallery preview */}
      <section className="py-16 px-4 max-w-6xl mx-auto" data-aos="fade-up">
        <h2 className="text-center text-gradient-gold text-3xl font-bold mb-10 tracking-widest" style={{ fontFamily: 'Cinzel' }}>DIVINE MOMENTS</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[1,2,3,4,5,6].map(i => (
            <motion.div key={i} className="aspect-square glass-card overflow-hidden rounded-lg cursor-pointer"
              whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
              <img src={`/gallery/temple-${i}.jpg`} alt={`Temple ${i}`}
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-5xl">🛕</div>'
                }}
              />
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link to="/gallery" className="text-yellow-400 border border-yellow-600 px-6 py-2 rounded-full hover:bg-yellow-600/20 transition-all text-sm">View Full Gallery →</Link>
        </div>
      </section>

      {/* Mission Banner */}
      <section className="py-16 px-4 text-center bg-gradient-to-r from-transparent via-[#2d1000]/60 to-transparent" data-aos="fade-up">
        <div className="max-w-3xl mx-auto">
          <p className="text-5xl mb-6">🙏</p>
          <blockquote className="text-xl md:text-2xl text-amber-200/90 italic" style={{ fontFamily: 'EB Garamond' }}>
            "Dedicated to preserving the sacred traditions of Kottilingal Tharavadu and ensuring financial transparency, family unity, and divine continuity for generations to come."
          </blockquote>
        </div>
      </section>
    </div>
  )
}
