import { useEffect } from 'react'
import { motion } from 'framer-motion'
import AOS from 'aos'
import DiyaRow from '../components/DiyaRow'

export default function About() {
  useEffect(() => { AOS.init({ duration: 1000, once: true }) }, [])

  return (
    <div className="bg-temple-gradient min-h-screen pt-24">
      <section className="py-16 px-4 max-w-4xl mx-auto text-center" data-aos="fade-up">
        <motion.h1 className="shimmer-text text-4xl font-black tracking-widest mb-6" style={{ fontFamily: 'Cinzel' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          ABOUT THE TEMPLE
        </motion.h1>
        <DiyaRow count={5} />
        <div className="glass-card p-8 text-left space-y-4 mt-8">
          <p className="text-amber-200/90 text-lg leading-relaxed">
            The <strong className="text-yellow-400">Kottilingal Tharavadu Bhagavathi Temple</strong> is a sacred family temple located in
            Palakkad, Kerala, dedicated to the divine Goddess Bhagavathi. This temple has been the
            spiritual cornerstone of the Kottilingal Tharavadu family for generations.
          </p>
          <p className="text-amber-200/80 leading-relaxed">
            The temple follows traditional Kerala Tantric rituals and pooja systems, maintaining
            the sacred traditions passed down through the generations. Daily poojas, monthly rituals,
            and annual festivals are conducted with utmost devotion and adherence to Agama Shastra.
          </p>
          <p className="text-amber-200/80 leading-relaxed">
            This digital platform has been created to ensure financial transparency, preserve family
            records, coordinate monthly pooja contributions, and maintain a living history of the
            temple for future generations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10" data-aos="fade-up">
          {[
            { icon: '🛕', title: 'Deity', desc: 'Sree Bhagavathi — Goddess of Power and Prosperity' },
            { icon: '📍', title: 'Location', desc: 'Palakkad District, Kerala, India' },
            { icon: '📿', title: 'Tradition', desc: 'Kerala Tantric Agama — Traditional family rituals' },
            { icon: '👨‍👩‍👧‍👦', title: 'Family', desc: 'Kottilingal Tharavadu — Serving generations' },
          ].map((item, i) => (
            <div key={i} className="glass-card p-5 flex gap-4 items-start">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <h3 className="text-yellow-400 font-bold mb-1">{item.title}</h3>
                <p className="text-amber-200/70 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
