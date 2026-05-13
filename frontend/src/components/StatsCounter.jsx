import { useEffect, useState } from 'react'
import CountUp from 'react-countup'
import { fetchDonationSummary, fetchPublicFamilies, fetchPublicSponsors } from '../api/temple'

export default function StatsCounter() {
  const [stats, setStats] = useState({ families: 0, collected: 0, sponsors: 0, years: 25 })

  useEffect(() => {
    Promise.allSettled([
      fetchPublicFamilies(),
      fetchDonationSummary(),
      fetchPublicSponsors()
    ]).then(([fam, don, spon]) => {
      setStats({
        families: fam.status === 'fulfilled' ? fam.value.length : 0,
        collected: don.status === 'fulfilled' ? don.value.total_collected : 0,
        sponsors: spon.status === 'fulfilled' ? spon.value.length : 0,
        years: 25
      })
    })
  }, [])

  const items = [
    { label: 'Families', value: stats.families, suffix: '+', icon: '🏠' },
    { label: 'Total Collected', value: stats.collected, prefix: '₹', suffix: '', icon: '💰' },
    { label: 'Sponsors', value: stats.sponsors, suffix: '+', icon: '🤝' },
    { label: 'Years of Devotion', value: stats.years, suffix: '+', icon: '📿' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
      {items.map((item, i) => (
        <div key={i} className="glass-card p-6 text-center">
          <div className="text-3xl mb-2">{item.icon}</div>
          <div className="text-2xl font-bold text-gradient-gold">
            {item.prefix}<CountUp end={item.value} duration={2.5} separator="," />{item.suffix}
          </div>
          <div className="text-amber-200/70 text-xs mt-1 tracking-wider">{item.label}</div>
        </div>
      ))}
    </div>
  )
}
