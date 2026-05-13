import { useEffect } from 'react'
import { motion } from 'framer-motion'
import AOS from 'aos'
import DiyaRow from '../components/DiyaRow'

const galleryImages = [
  { src: '/gallery/temple-1.jpg', caption: 'Temple Night View' },
  { src: '/gallery/temple-2.jpg', caption: 'Inner Sanctum' },
  { src: '/gallery/temple-3.jpg', caption: 'Festival Illumination' },
  { src: '/gallery/temple-4.jpg', caption: 'Dusk at the Temple' },
  { src: '/gallery/temple-5.jpg', caption: 'Temple Overview' },
  { src: '/gallery/temple-6.jpg', caption: 'Family Gathering' },
]

export default function Gallery() {
  useEffect(() => { AOS.init({ duration: 1000, once: true }) }, [])

  return (
    <div className="bg-temple-gradient min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h1 className="shimmer-text text-4xl font-black tracking-widest text-center mb-4" style={{ fontFamily: 'Cinzel' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          DIVINE GALLERY
        </motion.h1>
        <p className="text-center text-amber-200/60 mb-4">Kottilingal Tharavadu Bhagavathi Temple — Palakkad, Kerala</p>
        <DiyaRow />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {galleryImages.map((img, i) => (
            <motion.div key={i} className="glass-card overflow-hidden rounded-xl group cursor-pointer"
              data-aos="zoom-in" data-aos-delay={i * 100}
              whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src={img.src} alt={img.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.parentElement.innerHTML = `<div class="w-full h-full flex flex-col items-center justify-center bg-[#2d1000]"><span class="text-6xl">\ud83d\uded5</span><p class="text-amber-200/60 text-sm mt-2">${img.caption}</p></div>`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-yellow-300 font-semibold">{img.caption}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="glass-card p-6 mt-10 text-center" data-aos="fade-up">
          <p className="text-amber-200/70 text-sm">📸 To add your photos to this gallery, please contact the temple admin.</p>
          <p className="text-amber-200/50 text-xs mt-1">All images are property of Kottilingal Tharavadu family</p>
        </div>
      </div>
    </div>
  )
}
