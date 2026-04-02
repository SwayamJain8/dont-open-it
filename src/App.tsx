import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Background3D } from './components/Background3D'
import { HomeScreen } from './components/HomeScreen'
import { RoastOverlay } from './components/RoastOverlay'
import { FrictionChallenge } from './components/FrictionChallenge'
import { PersonalityResponse } from './components/PersonalityResponse'
import { FinalTrap } from './components/FinalTrap'
import { StatsScreen } from './components/StatsScreen'
import { CursorGlow } from './components/CursorGlow'
import { GrainOverlay } from './components/GrainOverlay'
import { incrementAttempts, recordChallenge } from './utils/storage'
import { getRandomChallenge, getAppRoast } from './utils/challenges'
import type { AppInfo } from './utils/apps'

type GameState = 'HOME' | 'ROAST' | 'CHALLENGE' | 'PERSONALITY' | 'FINAL' | 'STATS'

export default function App() {
  const [gameState, setGameState] = useState<GameState>('HOME')
  const [targetApp, setTargetApp] = useState<AppInfo | null>(null)
  const [roast, setRoast] = useState('')
  const [challenge, setChallenge] = useState('movingButton')
  const [microPop, setMicroPop] = useState<{ x: number; y: number; id: number } | null>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      setMicroPop({ x: e.clientX, y: e.clientY, id: Date.now() })
      setTimeout(() => setMicroPop(null), 500)
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  const handleAppClick = useCallback((app: AppInfo) => {
    setTargetApp(app)
    setRoast(getAppRoast(app.roasts))
    setChallenge(getRandomChallenge(app.preferredChallenge))
    incrementAttempts(app.id)
    setGameState('ROAST')
  }, [])

  const resetHome = useCallback(() => {
    setGameState('HOME')
    setTargetApp(null)
  }, [])

  const handleChallengeWin = useCallback(() => {
    recordChallenge()
    setGameState('PERSONALITY')
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#050008]">
      <Background3D />
      <CursorGlow />
      <GrainOverlay />

      <AnimatePresence>
        {microPop && (
          <motion.div
            key={microPop.id}
            className="fixed pointer-events-none z-[9999]"
            style={{ left: microPop.x, top: microPop.y }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="w-6 h-6 rounded-full -translate-x-1/2 -translate-y-1/2"
              style={{ background: 'radial-gradient(circle, rgba(191,0,255,0.4) 0%, transparent 70%)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {gameState === 'HOME' && (
        <HomeScreen
          onAppClick={handleAppClick}
          onOpenStats={() => setGameState('STATS')}
        />
      )}

      <AnimatePresence>
        {gameState === 'ROAST' && targetApp && (
          <RoastOverlay
            key="roast"
            roast={roast}
            appName={targetApp.name}
            onComplete={() => setGameState('CHALLENGE')}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameState === 'CHALLENGE' && (
          <FrictionChallenge
            key="challenge"
            challenge={challenge as any}
            onWin={handleChallengeWin}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameState === 'PERSONALITY' && targetApp && (
          <PersonalityResponse
            key="personality"
            app={targetApp}
            onComplete={() => setGameState('FINAL')}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameState === 'FINAL' && targetApp && (
          <FinalTrap
            key="final"
            app={targetApp}
            onReset={resetHome}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameState === 'STATS' && (
          <StatsScreen onClose={resetHome} />
        )}
      </AnimatePresence>
    </div>
  )
}
