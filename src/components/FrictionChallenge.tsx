import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getRandomTypingSentence, getRandomCaptcha, getRandomLoadingMessage } from '../utils/challenges'
import { playSound } from '../utils/sounds'

type ChallengeType = 'movingButton' | 'typing' | 'fakeLoader' | 'captcha'

interface Props {
  challenge: ChallengeType
  onWin: () => void
}

export function FrictionChallenge({ challenge, onWin }: Props) {
  return (
    <div className="fixed inset-0 z-50">
      {challenge === 'movingButton' && <MovingButtonChallenge onWin={onWin} />}
      {challenge === 'typing' && <TypingChallenge onWin={onWin} />}
      {challenge === 'fakeLoader' && <FakeLoader onWin={onWin} />}
      {challenge === 'captcha' && <FakeCaptcha onWin={onWin} />}
    </div>
  )
}

function MovingButtonChallenge({ onWin }: { onWin: () => void }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [size, setSize] = useState(1)
  const [attempts, setAttempts] = useState(0)
  const [msg, setMsg] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const msgs = [
    "Too slow! 🐌", "Almost! ...not really.", "LMAO nice try",
    "You thought? 💀", "Skill issue fr", "My grandma clicks faster",
    "Are you even trying?", "So close! Jk. 😂",
  ]

  const evade = useCallback(() => {
    if (!containerRef.current) return
    playSound('whoosh')
    const rect = containerRef.current.getBoundingClientRect()
    const pad = 60
    const nx = pad + Math.random() * (rect.width - pad * 2)
    const ny = pad + Math.random() * (rect.height - pad * 2)
    setPos({ x: nx - rect.width / 2, y: ny - rect.height / 2 })
    setSize((p) => Math.max(0.45, p - 0.05))
    setAttempts((a) => a + 1)
    setMsg(msgs[Math.floor(Math.random() * msgs.length)])
  }, [])

  useEffect(() => {
    if (attempts > 0 && attempts % 6 === 0 && Math.random() > 0.45) {
      setPos({ x: 0, y: 0 })
      setSize(1)
      setMsg("Fine, here you go... 🎁")
      setTimeout(() => {
        evade()
        setMsg("SIKE! 😂😂😂")
        playSound('troll')
      }, 500)
    }
  }, [attempts, evade])

  const handleClick = () => {
    if (attempts >= 10 || (attempts >= 5 && Math.random() > 0.65)) {
      playSound('success')
      onWin()
      return
    }
    evade()
  }

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 bg-[#0a0014]/97"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.h3
        className="text-white/60 text-xl sm:text-2xl font-bold mb-2 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        🎯 Catch the button to proceed
      </motion.h3>
      <p className="text-white/30 text-sm sm:text-base mb-8 text-center">
        Attempts: <span className="text-neon-purple font-bold">{attempts}</span> &nbsp;|&nbsp; Size: <span className="text-neon-blue font-bold">{Math.round(size * 100)}%</span>
      </p>

      <div className="relative w-full flex-1 flex items-center justify-center" style={{ minHeight: 280 }}>
        <motion.button
          className="absolute px-8 py-4 sm:px-10 sm:py-5 rounded-2xl font-bold text-white cursor-pointer text-base sm:text-lg"
          style={{
            background: 'linear-gradient(135deg, #bf00ff, #00f0ff)',
            boxShadow: '0 0 30px rgba(191,0,255,0.5), 0 0 60px rgba(0,240,255,0.2)',
            transform: `scale(${size})`,
          }}
          animate={{ x: pos.x, y: pos.y, rotate: [0, Math.random() * 8 - 4] }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          onMouseEnter={evade}
          onClick={handleClick}
          whileTap={{ scale: size * 0.85 }}
        >
          ✅ I Promise I'll Be Productive
        </motion.button>
      </div>

      {msg && (
        <motion.p
          key={msg + attempts}
          className="text-xl sm:text-2xl font-black mb-6 text-center"
          style={{ color: '#ff00ff', textShadow: '0 0 20px rgba(255,0,255,0.4)' }}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {msg}
        </motion.p>
      )}

      {attempts >= 7 && (
        <motion.p className="text-white/20 text-sm mb-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          (keep trying... or don't. we don't care.)
        </motion.p>
      )}
    </motion.div>
  )
}

function TypingChallenge({ onWin }: { onWin: () => void }) {
  const [sentence] = useState(getRandomTypingSentence)
  const [typed, setTyped] = useState('')
  const [mistakes, setMistakes] = useState(0)
  const [shaking, setShaking] = useState(false)
  const [trollMsg, setTrollMsg] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const trollMsgs = [
    "Butterfingers! Start over. 🧈",
    "Wrong key! Your keyboard is disappointed.",
    "Typo = restart. We don't do mediocrity here.",
    "Even autocorrect gave up on you.",
    "WRONG letter. RESET. 💀",
  ]

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (sentence.startsWith(val)) {
      setTyped(val)
      if (val === sentence) {
        playSound('success')
        onWin()
      }
    } else {
      playSound('error')
      setMistakes((m) => m + 1)
      setShaking(true)
      setTrollMsg(trollMsgs[Math.floor(Math.random() * trollMsgs.length)])
      setTimeout(() => setShaking(false), 500)
      setTyped(Math.random() > 0.4 ? '' : val.slice(0, -1))
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 bg-[#0a0014]/97"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3 className="text-white/60 text-xl sm:text-2xl font-bold mb-2 text-center">
        ⌨️ Type this perfectly to proceed
      </h3>
      <p className="text-white/30 text-sm sm:text-base mb-8 text-center">
        Mistakes: <span className="text-neon-orange font-bold">{mistakes}</span> &nbsp;|&nbsp; Wrong key = reset (usually)
      </p>

      <motion.div
        className="glass rounded-3xl p-6 sm:p-10 max-w-xl w-full"
        animate={shaking ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.35 }}
      >
        <div className="text-xl sm:text-2xl font-mono text-white/80 mb-7 leading-relaxed text-center">
          {sentence.split('').map((char, i) => (
            <span
              key={i}
              className={
                i < typed.length
                  ? 'text-neon-green'
                  : i === typed.length
                    ? 'text-neon-purple border-b-2 border-neon-purple'
                    : 'text-white/20'
              }
            >
              {char}
            </span>
          ))}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={typed}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-mono text-lg sm:text-xl focus:outline-none focus:border-neon-purple/50 transition-colors text-center"
          placeholder="Start typing..."
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <div className="mt-5 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #39ff14, #00f0ff)' }}
            animate={{ width: `${(typed.length / sentence.length) * 100}%` }}
            transition={{ type: 'spring', damping: 20 }}
          />
        </div>
      </motion.div>

      {trollMsg && (
        <motion.p
          key={trollMsg + mistakes}
          className="text-lg sm:text-xl font-black mt-7 text-center"
          style={{ color: '#ff6b00', textShadow: '0 0 15px rgba(255,107,0,0.4)' }}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {trollMsg}
        </motion.p>
      )}
    </motion.div>
  )
}

function FakeLoader({ onWin }: { onWin: () => void }) {
  const [progress, setProgress] = useState(0)
  const [resets, setResets] = useState(0)
  const [msg, setMsg] = useState(getRandomLoadingMessage)
  const [phase, setPhase] = useState<'loading' | 'reset'>('loading')
  const doneRef = useRef(false)

  const resetMsgs = [
    "Connection lost. Reconnecting... 💀",
    "Server said: 'Nah fam' 🚫",
    "Error 418: I'm a teapot ☕",
    "Progress.exe has stopped working",
    "Just kidding! Starting over... 😈",
  ]

  useEffect(() => {
    if (doneRef.current) return
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 99 && resets < 2) {
          playSound('deny')
          setResets((r) => r + 1)
          setMsg(getRandomLoadingMessage())
          setPhase('reset')
          setTimeout(() => setPhase('loading'), 700)
          return Math.random() * 25
        }
        if (p >= 99 && resets >= 2) {
          if (Math.random() > 0.45) {
            doneRef.current = true
            clearInterval(id)
            playSound('success')
            setTimeout(onWin, 500)
            return 100
          }
          playSound('troll')
          setResets((r) => r + 1)
          setMsg("LOL just kidding. Again!")
          return 10 + Math.random() * 20
        }
        const inc =
          p < 60 ? 1.5 + Math.random() * 3 :
          p < 85 ? 0.5 + Math.random() * 1.2 :
          p < 95 ? 0.1 + Math.random() * 0.4 :
          0.05 + Math.random() * 0.12
        return Math.min(99.9, p + inc)
      })
    }, 100)
    return () => clearInterval(id)
  }, [resets, onWin])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 bg-[#0a0014]/97"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3 className="text-white/60 text-xl sm:text-2xl font-bold mb-2 text-center">
        ⏳ Loading your app... please wait
      </h3>
      <p className="text-white/30 text-sm sm:text-base mb-8 text-center">
        Resets: <span className="text-red-400 font-bold">{resets}</span> &nbsp;|&nbsp; You can't skip this.
      </p>

      <div className="glass rounded-3xl p-6 sm:p-10 max-w-lg w-full">
        <div className="flex justify-between text-sm sm:text-base text-white/40 mb-3">
          <span className="flex-1 truncate mr-4">{msg}</span>
          <span className="text-2xl sm:text-3xl font-black text-white/70">{Math.floor(progress)}%</span>
        </div>
        <div className="h-4 sm:h-5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: phase === 'reset'
                ? 'linear-gradient(90deg, #ff0000, #ff6b00)'
                : 'linear-gradient(90deg, #bf00ff, #00f0ff, #39ff14)',
              boxShadow: '0 0 20px rgba(191,0,255,0.4)',
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.08 }}
          />
        </div>
        {phase === 'reset' && (
          <motion.p
            className="text-red-400 text-center mt-4 text-base sm:text-lg font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, -3, 3, 0] }}
          >
            {resetMsgs[resets % resetMsgs.length]}
          </motion.p>
        )}
        <div className="mt-6 flex justify-center gap-2.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-neon-purple"
              animate={{ scale: [1, 1.8, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>

      {resets >= 2 && (
        <motion.p className="text-white/20 text-sm mt-7 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          (it'll work eventually... probably... maybe...)
        </motion.p>
      )}
    </motion.div>
  )
}

function FakeCaptcha({ onWin }: { onWin: () => void }) {
  const [captcha] = useState(getRandomCaptcha)
  const [selected, setSelected] = useState<number[]>([])
  const [attempts, setAttempts] = useState(0)
  const [msg, setMsg] = useState('')
  const [gridKey, setGridKey] = useState(0)

  const failMsgs = [
    "Wrong! But honestly, there was no right answer. 😈",
    "Incorrect! Try again (it won't work though).",
    "Nope! The AI is judging you.",
    "Error: Motivation not detected in any square.",
    "Did you really think that would work? 💀",
  ]

  const emojis = ['🛋️', '📱', '🍕', '😴', '🎮', '📺', '🛏️', '🌙', '💤']

  const toggle = (i: number) => {
    playSound('click')
    setSelected((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]))
  }

  const handleVerify = () => {
    setAttempts((a) => a + 1)
    setMsg(failMsgs[Math.floor(Math.random() * failMsgs.length)])
    setSelected([])
    if (attempts >= 3 && Math.random() > 0.35) {
      playSound('success')
      setTimeout(onWin, 800)
      setMsg("Fine. You pass. (We just got bored.)")
      return
    }
    playSound('error')
    setGridKey((k) => k + 1)
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 bg-[#0a0014]/97"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3 className="text-white/60 text-xl sm:text-2xl font-bold mb-2 text-center">
        🤖 Verify you're not a procrastinator
      </h3>
      <p className="text-white/30 text-sm sm:text-base mb-8 text-center">
        Failed attempts: <span className="text-red-400 font-bold">{attempts}</span>
      </p>

      <div className="glass rounded-3xl p-6 sm:p-8 max-w-sm w-full">
        <div className="text-center mb-5">
          <p className="text-white font-bold text-lg sm:text-xl">{captcha.text}</p>
          <p className="text-white/35 text-sm mt-1">{captcha.subtext}</p>
        </div>

        <motion.div
          key={gridKey}
          className="grid grid-cols-3 gap-2 sm:gap-2.5 mb-5"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <motion.button
              key={i}
              className="aspect-square rounded-xl flex items-center justify-center text-2xl sm:text-3xl cursor-pointer relative overflow-hidden"
              style={{
                background: selected.includes(i) ? 'rgba(191,0,255,0.25)' : 'rgba(255,255,255,0.04)',
                border: selected.includes(i)
                  ? '2px solid rgba(191,0,255,0.7)'
                  : '1px solid rgba(255,255,255,0.06)',
              }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => toggle(i)}
            >
              {emojis[i]}
              {selected.includes(i) && (
                <motion.div
                  className="absolute top-1 right-1 w-5 h-5 bg-neon-purple rounded-full flex items-center justify-center text-[10px]"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
          ))}
        </motion.div>

        <motion.button
          className="w-full py-3.5 rounded-2xl font-bold text-white text-base cursor-pointer"
          style={{
            background: selected.length > 0 ? 'linear-gradient(135deg, #bf00ff, #00f0ff)' : 'rgba(255,255,255,0.08)',
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleVerify}
          disabled={selected.length === 0}
        >
          VERIFY
        </motion.button>
      </div>

      {msg && (
        <motion.p
          key={msg + attempts}
          className="text-base sm:text-lg font-bold mt-7 text-center max-w-sm"
          style={{ color: '#ff00ff', textShadow: '0 0 15px rgba(255,0,255,0.4)' }}
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {msg}
        </motion.p>
      )}
    </motion.div>
  )
}
