import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { playSound } from '../utils/sounds'

interface Props {
  roast: string
  appName: string
  onComplete: () => void
}

export function RoastOverlay({ roast, appName, onComplete }: Props) {
  const [show, setShow] = useState(true)
  const [glitch, setGlitch] = useState(false)

  useEffect(() => {
    playSound('popup')

    const glitchId = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 120)
    }, 1800)

    const timer = setTimeout(() => {
      setShow(false)
      setTimeout(onComplete, 400)
    }, 3200)

    return () => {
      clearTimeout(timer)
      clearInterval(glitchId)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="absolute inset-0 bg-[#0a0014]/96 backdrop-blur-2xl"
          />

          <motion.div
            className="relative z-10 text-center px-6 max-w-xl w-full"
            initial={{ scale: 0.15, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 11, stiffness: 180 }}
          >
            <motion.div
              className="text-7xl sm:text-8xl mb-6"
              animate={{ rotate: [0, -8, 8, -4, 4, 0], scale: [1, 1.2, 1, 1.1, 1] }}
              transition={{ duration: 0.7, repeat: Infinity, repeatDelay: 0.8 }}
            >
              💀
            </motion.div>

            <motion.p
              className="text-white/30 text-sm sm:text-base mb-3 uppercase tracking-widest font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              You tried to open {appName}
            </motion.p>

            <motion.h2
              className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight"
              style={{
                textShadow: glitch
                  ? '4px 0 #ff00ff, -4px 0 #00f0ff'
                  : '0 0 40px rgba(191,0,255,0.5)',
                transform: glitch
                  ? `translate(${Math.random() * 6 - 3}px, ${Math.random() * 6 - 3}px)`
                  : 'none',
              }}
            >
              {roast}
            </motion.h2>

            <motion.p
              className="mt-8 text-white/25 text-base sm:text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              preparing your punishment...
            </motion.p>

            <motion.div
              className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden max-w-sm mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #bf00ff, #00f0ff)' }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.5, delay: 0.5 }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
