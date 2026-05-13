import { useEffect } from 'react'
import { motion } from 'framer-motion'
import DiyaRow from '../components/DiyaRow'
import ScrollReveal from '../components/ScrollReveal'

const PLACEHOLDER = {
  deity: 'Sree Bhagavathi (Goddess of Power & Prosperity)',
  established: 'Over 100 years ago — exact year being confirmed',
  tradition: 'Kerala Tantric Agama',
  festivals: [
    { name: 'Annual Uthsavam', when: 'To be confirmed', desc: 'The grand annual festival of the temple — details being collected from the family.' },
    { name: 'Vishu Kani', when: 'Medam (April)', desc: 'Auspicious first sight of the new year — special puja and Kani darshan at the temple.' },
    { name: 'Navaratri', when: 'Kanni (Sep–Oct)', desc: 'Nine nights of devotion to the Goddess — special pujas on all nine days.' },
    { name: 'Thiruvonam', when: 'Chingam (Aug–Sep)', desc: 'Onam celebrations with special offerings and family gathering at the tharavadu.' },
    { name: 'Ashtami Rohini', when: 'Monthly', desc: 'Monthly Ashtami puja — one of the most sacred days for Bhagavathi worship.' },
  ],
  subDeities: [
    { name: 'Ganapathi', desc: 'Lord of beginnings — invoked before all rituals' },
    { name: 'Nagaraja', desc: 'Serpent deity — sacred to Kerala family temples' },
    { name: 'Sastha', desc: 'Guardian deity — protector of the tharavadu' },
  ]
}

export default function About() {
  return (
    <div className="bg-temple-gradient min-h-screen pt-24 relative z-10">

      {/* Hero */}
      <section className="py-20 px-4 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <p className="text-gold text-sm tracking-[0.4em] uppercase mb-4" style={{ color: 'var(--gold-dim)' }}>Est. Kottilinghal, Palakkad</p>
          <h1 className="shimmer-text text-5xl md:text-7xl font-black tracking-widest mb-4" style={{ fontFamily: 'Cinzel' }}>
            THE TEMPLE
          </h1>
          <p className="text-3xl md:text-4xl" style={{ color: 'var(--ivory-dim)', fontFamily: 'Cormorant Garamond', fontStyle: 'italic' }}>
            Kottilingal Tharavadu Bhagavathi
          </p>
        </motion.div>
        <DiyaRow count={7} />
      </section>

      {/* Story */}
      <section className="py-16 px-4 max-w-3xl mx-auto">
        <ScrollReveal>
          <div className="ornament">✦</div>
          <h2 className="text-center text-gradient-gold text-2xl font-bold tracking-widest mb-8" style={{ fontFamily: 'Cinzel' }}>OUR SACRED HISTORY</h2>
          <div className="glass-card p-8 space-y-5">
            <p className="text-lg leading-relaxed" style={{ color: 'var(--ivory)', fontFamily: 'Cormorant Garamond', fontSize: '1.2rem' }}>
              The <strong style={{ color: 'var(--gold)' }}>Kottilingal Tharavadu Bhagavathi Temple</strong> stands as the spiritual heart
              of the Kottilingal family — a sacred space where generations have gathered to offer prayers,
              celebrate festivals, and maintain the divine covenant with the Goddess.
            </p>
            <p className="leading-relaxed" style={{ color: 'var(--ivory-dim)', fontSize: '1.1rem' }}>
              Located in the serene village of Kottilinghal (Ho), Thrikkadeeri, Munnurcode, the temple
              follows the <em>Kerala Tantric Agama</em> tradition — a living lineage of ritual knowledge
              passed from generation to generation within the tharavadu.
            </p>
            <p className="leading-relaxed" style={{ color: 'var(--ivory-dim)', fontSize: '1.1rem' }}>
              Daily poojas, monthly Ashtami rituals, and annual festivals are conducted with unwavering
              devotion, ensuring the sacred flame of tradition never dims.
            </p>
            <div className="mt-4 p-4 rounded-lg text-center" style={{ background: 'rgba(139,0,0,0.15)', border: '1px solid rgba(201,168,76,0.15)' }}>
              <p className="text-sm tracking-wider" style={{ color: 'var(--gold-dim)' }}>✦ More history being gathered from tharavadu elders — check back soon ✦</p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Deity cards */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <ScrollReveal>
          <h2 className="text-center text-gradient-gold text-2xl font-bold tracking-widest mb-10" style={{ fontFamily: 'Cinzel' }}>PRESIDING DEITY & SHRINES</h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main deity */}
          <ScrollReveal delay={0} direction="left">
            <div className="glass-card p-6 flex gap-4 items-start col-span-1 md:col-span-2">
              <span className="text-4xl">🛕</span>
              <div>
                <h3 className="font-bold mb-1 text-xl" style={{ color: 'var(--gold)', fontFamily: 'Cinzel' }}>SREE BHAGAVATHI</h3>
                <p style={{ color: 'var(--ivory-dim)' }}>Presiding Goddess — Divine Mother of Power, Prosperity and Protection. Worshipped in the Kerala tradition as the supreme feminine force, guardian of the Kottilingal lineage across all generations.</p>
              </div>
            </div>
          </ScrollReveal>
          {PLACEHOLDER.subDeities.map((d, i) => (
            <ScrollReveal key={i} delay={i * 120} direction="up">
              <div className="glass-card p-5 flex gap-4 items-start">
                <span className="text-3xl">🪔</span>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: 'var(--gold)', fontFamily: 'Cinzel' }}>{d.name.toUpperCase()}</h3>
                  <p className="text-sm" style={{ color: 'var(--ivory-dim)' }}>{d.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Festivals */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="ornament">✦</div>
          <h2 className="text-center text-gradient-gold text-2xl font-bold tracking-widest mb-10" style={{ fontFamily: 'Cinzel' }}>FESTIVALS & RITUALS</h2>
        </ScrollReveal>
        <div className="space-y-4">
          {PLACEHOLDER.festivals.map((f, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="glass-card p-5 flex gap-5 items-start">
                <div className="shrink-0 w-16 text-center">
                  <div className="text-2xl">🎊</div>
                  <div className="text-xs mt-1 leading-tight" style={{ color: 'var(--gold-dim)' }}>{f.when}</div>
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: 'var(--gold)', fontFamily: 'Cinzel', letterSpacing: '0.05em' }}>{f.name.toUpperCase()}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--ivory-dim)' }}>{f.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Google Maps */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="ornament">✦</div>
          <h2 className="text-center text-gradient-gold text-2xl font-bold tracking-widest mb-10" style={{ fontFamily: 'Cinzel' }}>FIND THE TEMPLE</h2>
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <div className="glass-card overflow-hidden" style={{ borderColor: 'rgba(201,168,76,0.25)' }}>
            <div className="p-4 text-center" style={{ background: 'rgba(139,0,0,0.12)' }}>
              <p className="text-sm tracking-wider" style={{ color: 'var(--gold)' }}>📍 Kottilinghal (Ho), Thrikkadeeri, Munnurcode (Po), Cherppulassery, Palakkad, Kerala – 679502</p>
            </div>
            <div style={{ width: '100%', height: '420px' }}>
              <iframe
                title="Kottilingal Temple Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.0!2d76.3!3d10.85!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCherppulassery%2C+Palakkad%2C+Kerala+679502!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) saturate(0.8) brightness(0.85)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="p-4 text-center">
              <a
                href="https://maps.google.com/?q=Cherppulassery,Palakkad,Kerala,679502"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-temple inline-block text-sm"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  )
}
