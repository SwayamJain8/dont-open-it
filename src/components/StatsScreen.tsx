import { useState } from 'react'
import { motion } from 'framer-motion'
import { getStats, resetStats } from '../utils/storage'
import { getStatsRoast } from '../utils/challenges'
import { APPS } from '../utils/apps'
import { playSound } from '../utils/sounds'

interface Props {
  onClose: () => void
}

export function StatsScreen({ onClose }: Props) {
  const [stats, setStats] = useState(getStats)
  const [showReset, setShowReset] = useState(false)

  const handleReset = () => {
    resetStats()
    setStats(getStats())
    setShowReset(false)
    playSound('success')
  }

  const sortedApps = APPS
    .map((a) => ({ ...a, count: stats.attempts[a.id] || 0 }))
    .filter((a) => a.count > 0)
    .sort((a, b) => b.count - a.count)

  const roast = getStatsRoast(stats.totalAttempts)
  const trollRate = stats.totalAttempts > 0 ? Math.round((stats.trollCount / stats.totalAttempts) * 100) : 0

  const cards = [
    { label: 'Total Attempts', value: stats.totalAttempts, emoji: '🎯', sub: stats.totalAttempts > 10 ? "That's not usage. That's commitment." : 'Room for growth (in addiction)' },
    { label: 'Challenges Beaten', value: stats.completedChallenges, emoji: '🏆', sub: 'Your perseverance... at procrastinating' },
    { label: 'Times Trolled', value: stats.trollCount, emoji: '😈', sub: `Troll rate: ${trollRate}%` },
    { label: 'Actually Opened', value: stats.actualOpens, emoji: '📱', sub: stats.actualOpens === 0 ? 'Impressive! (or lazy?)' : 'Weakness detected' },
  ]

  return (
    <motion.div
      className="fixed inset-0 z-40 overflow-y-auto"
      style={{ background: 'rgba(5,0,8,0.98)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="min-h-screen flex flex-col items-center py-12 sm:py-16 px-5">
        <motion.button
          className="fixed top-5 left-5 glass rounded-full px-5 py-2.5 text-white/40 text-sm sm:text-base cursor-pointer hover:text-white/60 z-50 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playSound('click')
            onClose()
          }}
        >
          ← Back
        </motion.button>

        <motion.div className="text-center mb-10" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-3">
            📊 Your Shame Dashboard
          </h2>
          <p className="text-white/40 text-base sm:text-lg">{roast}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full mb-8">
          {cards.map((c, i) => (
            <motion.div
              key={c.label}
              className="glass rounded-3xl p-6 sm:p-7"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-3xl sm:text-4xl mb-2">{c.emoji}</div>
              <div className="text-4xl sm:text-5xl font-black text-white mb-1">{c.value}</div>
              <div className="text-white/60 text-base sm:text-lg font-medium">{c.label}</div>
              <div className="text-white/30 text-xs sm:text-sm mt-1">{c.sub}</div>
            </motion.div>
          ))}
        </div>

        {sortedApps.length > 0 && (
          <motion.div
            className="glass rounded-3xl p-6 sm:p-8 max-w-2xl w-full mb-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-white font-bold text-xl sm:text-2xl mb-5">🏅 Most Wanted Apps</h3>
            <div className="space-y-4">
              {sortedApps.map((a, i) => (
                <div key={a.id} className="flex items-center gap-3">
                  <span className="text-white/30 text-sm w-7 font-bold">#{i + 1}</span>
                  <span className="text-2xl sm:text-3xl">{a.icon}</span>
                  <span className="text-white/80 text-base sm:text-lg font-medium flex-1">{a.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-20 sm:w-36 h-2.5 bg-white/8 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${a.color}, ${a.color}88)` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(a.count / (sortedApps[0]?.count || 1)) * 100}%` }}
                        transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
                      />
                    </div>
                    <span className="text-white/50 text-base font-bold w-8 text-right">{a.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {stats.lastReason && (
          <motion.div
            className="glass rounded-3xl p-6 sm:p-8 max-w-2xl w-full mb-8 text-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-white/30 text-sm mb-2">Your last excuse:</p>
            <p className="text-white text-xl sm:text-2xl font-bold">"{stats.lastReason}"</p>
            <p className="text-white/15 text-xs sm:text-sm mt-2">We're keeping receipts. 🧾</p>
          </motion.div>
        )}

        <motion.div className="flex gap-4 mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          {!showReset ? (
            <motion.button
              className="glass rounded-full px-6 py-3 text-red-400/50 text-sm sm:text-base cursor-pointer hover:text-red-400/80 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReset(true)}
            >
              🗑️ Reset All Data
            </motion.button>
          ) : (
            <div className="flex gap-3">
              <motion.button
                className="bg-red-500/15 border border-red-500/25 rounded-full px-6 py-3 text-red-400 text-sm sm:text-base cursor-pointer"
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
              >
                Yes, wipe my shame
              </motion.button>
              <motion.button
                className="glass rounded-full px-6 py-3 text-white/40 text-sm sm:text-base cursor-pointer"
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowReset(false)}
              >
                Nah, keep it
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
