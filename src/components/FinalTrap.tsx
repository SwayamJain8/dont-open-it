import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { recordTroll, recordActualOpen, getAppAttempts } from '../utils/storage'
import { playSound } from '../utils/sounds'
import type { AppInfo } from '../utils/apps'

interface Props {
  app: AppInfo
  onReset: () => void
}

export function FinalTrap({ app, onReset }: Props) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [clicks, setClicks] = useState(0)
  const [msg, setMsg] = useState('')
  const [decided, setDecided] = useState(false)
  const attempts = getAppAttempts(app.id)

  const trollMsgs = [
    "Oh, you actually want to open it? How predictable.",
    "This is your last chance to be productive today.",
    "Once you click, there's no going back (to being a functional human).",
    `You've tried to open ${app.name} ${attempts} times. That's... a lot.`,
    "Are you SURE sure? Like, REALLY sure?",
  ]

  const evade = useCallback(() => {
    if (Math.random() > 0.45 && clicks < 3) {
      playSound('whoosh')
      setPos({
        x: (Math.random() - 0.5) * 250,
        y: (Math.random() - 0.5) * 150,
      })
      setMsg("Nope! Try again 😏")
      return true
    }
    return false
  }, [clicks])

  const handleClick = () => {
    playSound('click')
    setClicks((c) => c + 1)
    if (clicks === 0 && Math.random() > 0.3) {
      if (evade()) return
    }
    if (clicks < 2) {
      setMsg(trollMsgs[Math.floor(Math.random() * trollMsgs.length)])
      return
    }

    setDecided(true)
    const willTroll = Math.random() > 0.35

    setTimeout(() => {
      if (willTroll) {
        playSound('troll')
        recordTroll()
        window.open(app.trollUrl, '_blank')
        setMsg("Redirecting you to something actually useful 😈")
      } else {
        playSound('slowclap')
        recordActualOpen()
        window.open(app.url, '_blank')
        setMsg("Fine. Go. But I'm disappointed. 😤")
      }
      setTimeout(onReset, 1200)
    }, 700)
  }

  const handleGoBack = () => {
    playSound('success')
    setMsg("SMART CHOICE! There's hope for you yet! 🎉")
    setTimeout(onReset, 1000)
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 bg-[#0a0014]/97"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="text-center max-w-lg w-full"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <motion.div
          className="text-6xl sm:text-7xl mb-5"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ⚠️
        </motion.div>

        <h3 className="text-white text-3xl sm:text-4xl font-black mb-3">Last Chance</h3>
        <p className="text-white/40 text-base sm:text-lg mb-10 leading-relaxed">
          You've made it past all the challenges.<br />
          The button is right there. But should you really click it?
        </p>

        <div className="flex flex-col gap-4 items-center">
          <motion.button
            className="px-10 py-5 rounded-2xl font-bold text-white cursor-pointer relative overflow-hidden text-lg sm:text-xl w-full max-w-sm"
            style={{
              background: `linear-gradient(135deg, ${app.color}, ${app.color}88)`,
              boxShadow: `0 0 30px ${app.color}44`,
            }}
            animate={{ x: pos.x, y: pos.y }}
            whileHover={{ scale: 1.04, boxShadow: `0 0 50px ${app.color}55` }}
            whileTap={{ scale: 0.94 }}
            onMouseEnter={() => { if (clicks === 0 && Math.random() > 0.5) evade() }}
            onClick={handleClick}
            transition={{ type: 'spring', damping: 15 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            <span className="relative z-10">
              {decided ? '🎰 Opening...' : `Open ${app.name} ${app.icon}`}
            </span>
          </motion.button>

          <motion.button
            className="px-10 py-5 rounded-2xl font-bold text-white cursor-pointer text-lg sm:text-xl w-full max-w-sm"
            style={{
              background: 'linear-gradient(135deg, #39ff14, #00f0ff)',
              boxShadow: '0 0 30px rgba(57,255,20,0.25)',
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleGoBack}
          >
            🏃 Nah, I Choose Life
          </motion.button>
        </div>

        {msg && (
          <motion.p
            key={msg}
            className="text-white/50 mt-8 text-base sm:text-lg"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {msg}
          </motion.p>
        )}

        {clicks > 0 && !decided && (
          <motion.p className="mt-3 text-white/20 text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Click count: {clicks}/3
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  )
}
