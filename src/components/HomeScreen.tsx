import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { APPS, type AppInfo } from '../utils/apps'
import { getStats } from '../utils/storage'
import { playSound } from '../utils/sounds'

interface AppIconProps {
  app: AppInfo
  index: number
  onClick: (app: AppInfo) => void
}

function AppIcon({ app, index, onClick }: AppIconProps) {
  const [isHovered, setIsHovered] = useState(false)
  const controls = useAnimation()
  const iconRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const evadeCount = useRef(0)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!iconRef.current) return
    const rect = iconRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < 100) {
      const force = (100 - dist) / 100
      setOffset({
        x: -dx * force * (1.1 + Math.random() * 0.7),
        y: -dy * force * (1.1 + Math.random() * 0.7),
      })
      evadeCount.current++
      if (evadeCount.current > 4 && Math.random() > 0.65) {
        playSound('whoosh')
        setOffset({
          x: (Math.random() - 0.5) * 160,
          y: (Math.random() - 0.5) * 160,
        })
        setTimeout(() => setOffset({ x: 0, y: 0 }), 700)
        evadeCount.current = 0
      }
    } else {
      setOffset((p) => ({ x: p.x * 0.85, y: p.y * 0.85 }))
    }
  }, [])

  const handleClick = () => {
    playSound('click')
    controls.start({
      scale: [1, 0.75, 1.25, 0.9, 1.1, 1],
      rotate: [0, -15, 15, -8, 8, 0],
      transition: { duration: 0.5 },
    })
    onClick(app)
  }

  return (
    <motion.div
      ref={iconRef}
      className="relative cursor-pointer select-none"
      animate={{
        rotate: [-2, 2, -1.5, 1.5, 0],
        y: [0, -4, 2, -3, 0],
      }}
      transition={{
        duration: 2.5 + Math.random() * 2,
        repeat: Infinity,
        repeatType: 'reverse',
        delay: index * 0.15,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setOffset({ x: 0, y: 0 })
        evadeCount.current = 0
      }}
      onClick={handleClick}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: 'transform 0.12s ease-out',
      }}
    >
      <motion.div
        animate={controls}
        whileHover={{ scale: 1.12, rotateY: 15, rotateX: -10 }}
        whileTap={{ scale: 0.8 }}
        className="flex flex-col items-center gap-3"
        style={{ perspective: '600px', transformStyle: 'preserve-3d' }}
      >
        <motion.div
          className="w-[62px] h-[62px] sm:w-[80px] sm:h-[80px] rounded-[18px] sm:rounded-[22px] flex items-center justify-center text-[30px] sm:text-[40px] relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${app.color}18, ${app.color}38)`,
            border: `1.5px solid ${app.color}50`,
            boxShadow: isHovered
              ? `0 0 30px ${app.color}55, 0 0 60px ${app.color}22, inset 0 0 20px ${app.color}18`
              : `0 0 15px ${app.color}25`,
          }}
        >
          <span style={{ filter: isHovered ? 'brightness(1.3) saturate(1.2)' : 'none', transition: 'filter 0.2s' }}>
            {app.icon}
          </span>
          {isHovered && (
            <motion.div
              className="absolute inset-0"
              style={{ background: `${app.color}15` }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          )}
        </motion.div>
        <span
          className="text-[13px] sm:text-sm font-semibold text-white/70 text-center leading-tight"
          style={{ textShadow: isHovered ? `0 0 8px ${app.color}` : 'none' }}
        >
          {app.name}
        </span>
      </motion.div>
    </motion.div>
  )
}

interface HomeScreenProps {
  onAppClick: (app: AppInfo) => void
  onOpenStats: () => void
}

export function HomeScreen({ onAppClick, onOpenStats }: HomeScreenProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [time, setTime] = useState('')
  const [memoryMsg, setMemoryMsg] = useState<string | null>(null)

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const s = getStats()
    if (s.lastReason) {
      setMemoryMsg(`Last time you said "${s.lastReason}"... 🤡`)
    } else if (s.totalAttempts > 0) {
      setMemoryMsg(
        `Welcome back! You've tried ${s.totalAttempts} time${s.totalAttempts !== 1 ? 's' : ''} already. 💀`
      )
    }
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      setTilt({
        x: ((e.clientY - cy) / cy) * 5,
        y: ((e.clientX - cx) / cx) * -5,
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className="relative z-10 flex flex-col items-center min-h-screen overflow-y-auto overflow-x-hidden px-5 py-8 sm:py-10 sm:justify-center">

      {/* Title */}
      <motion.div
        className="text-center mb-6 sm:mb-8"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, type: 'spring', damping: 12 }}
      >
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-2 leading-tight"
          style={{
            textShadow: '0 0 50px rgba(191,0,255,0.5), 0 0 100px rgba(0,240,255,0.25)',
          }}
          animate={{
            textShadow: [
              '0 0 50px rgba(191,0,255,0.5), 0 0 100px rgba(0,240,255,0.25)',
              '0 0 70px rgba(191,0,255,0.7), 0 0 120px rgba(0,240,255,0.4)',
              '0 0 50px rgba(191,0,255,0.5), 0 0 100px rgba(0,240,255,0.25)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Don't Open It 😭
        </motion.h1>
        <motion.p
          className="text-white/30 text-base sm:text-lg font-medium tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          your daily dose of self-control training
        </motion.p>
      </motion.div>

      {/* Memory message */}
      {memoryMsg && (
        <motion.div
          className="glass rounded-2xl px-6 py-3 mb-6 max-w-md text-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7, type: 'spring' }}
        >
          <p className="text-white/50 text-sm sm:text-base">{memoryMsg}</p>
        </motion.div>
      )}

      {/* Phone card */}
      <motion.div
        className="relative w-full max-w-[380px] sm:max-w-md"
        style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', damping: 14 }}
      >
        <motion.div
          className="glass-strong rounded-[2rem] sm:rounded-[2.5rem] px-4 py-6 sm:px-8 sm:py-9 relative overflow-hidden"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: 'transform 0.1s ease-out',
            boxShadow: `
              0 0 50px rgba(191,0,255,0.2),
              0 0 100px rgba(0,240,255,0.08),
              inset 0 0 40px rgba(191,0,255,0.04)
            `,
          }}
          animate={{
            boxShadow: [
              '0 0 50px rgba(191,0,255,0.2), 0 0 100px rgba(0,240,255,0.08), inset 0 0 40px rgba(191,0,255,0.04)',
              '0 0 70px rgba(191,0,255,0.35), 0 0 120px rgba(0,240,255,0.15), inset 0 0 60px rgba(191,0,255,0.07)',
              '0 0 50px rgba(191,0,255,0.2), 0 0 100px rgba(0,240,255,0.08), inset 0 0 40px rgba(191,0,255,0.04)',
            ],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-black/60 rounded-b-2xl z-20" />

          {/* Clock */}
          <div className="text-center mb-7 mt-4">
            <motion.p
              className="text-white text-4xl sm:text-5xl font-extralight tracking-widest"
              style={{ textShadow: '0 0 20px rgba(191,0,255,0.2)' }}
            >
              {time}
            </motion.p>
            <p className="text-white/30 text-xs sm:text-sm mt-1 tracking-wide">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* App Grid — 4 columns, generous spacing */}
          <div className="grid grid-cols-4 gap-x-2 gap-y-6 sm:gap-x-4 sm:gap-y-8 place-items-center">
            {APPS.map((app, i) => (
              <AppIcon key={app.id} app={app} index={i} onClick={onAppClick} />
            ))}
          </div>

          {/* Home indicator */}
          <div className="mt-7 flex justify-center">
            <div className="w-32 h-1 rounded-full bg-white/15" />
          </div>
        </motion.div>
      </motion.div>

      {/* Stats button */}
      <motion.div
        className="mt-7 sm:mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <motion.button
          className="glass rounded-full px-6 py-3 text-white/40 text-sm sm:text-base font-medium cursor-pointer hover:text-white/70 transition-colors"
          whileHover={{ scale: 1.06, boxShadow: '0 0 25px rgba(191,0,255,0.2)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playSound('click')
            onOpenStats()
          }}
        >
          📊 My Shame Stats
        </motion.button>
      </motion.div>

      {/* Footer text */}
      <motion.p
        className="mt-5 mb-4 text-white/15 text-xs text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        tap any app if you dare...
      </motion.p>
    </div>
  )
}
