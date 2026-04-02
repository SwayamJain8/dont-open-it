import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PERSONALITY_MODES, getRandomPersonalityResponse } from '../utils/challenges'
import { getStats, setPersonalityMode } from '../utils/storage'
import { playSound } from '../utils/sounds'
import type { AppInfo } from '../utils/apps'

interface Props {
  app: AppInfo
  onComplete: () => void
}

export function PersonalityResponse({ app, onComplete }: Props) {
  const stats = getStats()
  const [mode, setMode] = useState(stats.personalityMode || 'toxic')
  const [response, setResponse] = useState('')
  const [showResponse, setShowResponse] = useState(false)
  const [picked, setPicked] = useState(false)

  const handlePick = (m: string) => {
    playSound('click')
    setMode(m)
    setPersonalityMode(m)
    setResponse(getRandomPersonalityResponse(m))
    setShowResponse(true)
    setPicked(true)
    setTimeout(() => playSound('bruh'), 400)
  }

  useEffect(() => {
    if (showResponse) {
      const t = setTimeout(onComplete, 4000)
      return () => clearTimeout(t)
    }
  }, [showResponse, onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 bg-[#0a0014]/97"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AnimatePresence mode="wait">
        {!picked ? (
          <motion.div
            key="picker"
            className="text-center max-w-2xl w-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
          >
            <h3 className="text-white/60 text-xl sm:text-2xl font-bold mb-2">
              Choose who roasts you for opening {app.name}
            </h3>
            <p className="text-white/30 text-sm sm:text-base mb-8">Pick your punishment style</p>

            <div className="flex flex-col sm:flex-row gap-4">
              {Object.entries(PERSONALITY_MODES).map(([key, val]) => (
                <motion.button
                  key={key}
                  className="glass rounded-3xl p-6 sm:p-7 flex-1 text-center cursor-pointer"
                  style={{
                    border: mode === key ? '1.5px solid rgba(191,0,255,0.4)' : '1px solid rgba(255,255,255,0.06)',
                  }}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(191,0,255,0.25)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePick(key)}
                >
                  <div className="text-4xl sm:text-5xl mb-3">
                    {key === 'toxic' ? '🐍' : key === 'indianMom' ? '👩🏽' : '🧘'}
                  </div>
                  <div className="text-white font-bold text-base sm:text-lg">{val.name}</div>
                  <div className="text-white/30 text-xs sm:text-sm mt-1">
                    {key === 'toxic' ? 'Passive aggressive bestie' : key === 'indianMom' ? 'Guilt trip supreme' : 'Enlightened shade'}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="response"
            className="text-center max-w-lg w-full"
            initial={{ scale: 0.2, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12 }}
          >
            <motion.div
              className="text-6xl sm:text-7xl mb-6"
              animate={{ rotate: [0, -12, 12, -6, 6, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              {mode === 'toxic' ? '🐍' : mode === 'indianMom' ? '👩🏽' : '🧘'}
            </motion.div>

            <div className="glass rounded-3xl p-7 sm:p-10">
              <p className="text-xs sm:text-sm text-white/30 mb-3 uppercase tracking-widest">
                {PERSONALITY_MODES[mode]?.name || 'Toxic Friend'} says:
              </p>
              <motion.p
                className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-relaxed"
                style={{ textShadow: '0 0 20px rgba(191,0,255,0.25)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                "{response}"
              </motion.p>
            </div>

            <motion.p
              className="text-white/20 text-base mt-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              ...preparing your final test...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
