import { motion } from 'framer-motion'

export default function DiyaRow({ count = 7 }) {
  return (
    <div className="flex justify-center gap-6 py-6">
      {Array(count).fill(null).map((_, i) => (
        <motion.span key={i} className="text-3xl md:text-4xl"
          animate={{ opacity: [1, 0.3, 1], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 1.5 + i * 0.1, repeat: Infinity, delay: i * 0.2 }}>
          🪔
        </motion.span>
      ))}
    </div>
  )
}
