const audioCache: Record<string, HTMLAudioElement> = {}

function getAudio(name: string): HTMLAudioElement | null {
  if (audioCache[name]) return audioCache[name]
  try {
    const audio = new Audio(`/sounds/${name}`)
    audio.volume = 0.5
    audioCache[name] = audio
    return audio
  } catch {
    return null
  }
}

export function playSound(name: SoundName) {
  const file = SOUND_FILES[name]
  if (!file) return
  const audio = getAudio(file)
  if (!audio) return
  audio.currentTime = 0
  audio.play().catch(() => {})
}

export type SoundName =
  | 'click'
  | 'error'
  | 'success'
  | 'whoosh'
  | 'bruh'
  | 'slowclap'
  | 'deny'
  | 'troll'
  | 'typing'
  | 'popup'

const SOUND_FILES: Record<SoundName, string> = {
  click: 'click.mp3',
  error: 'error.mp3',
  success: 'success.mp3',
  whoosh: 'whoosh.mp3',
  bruh: 'bruh.mp3',
  slowclap: 'slowclap.mp3',
  deny: 'deny.mp3',
  troll: 'troll.mp3',
  typing: 'typing.mp3',
  popup: 'popup.mp3',
}

/**
 * Sound files to add in /public/sounds/:
 *
 * 1. click.mp3     — short UI click/tap sound
 * 2. error.mp3     — buzzer / wrong answer beep
 * 3. success.mp3   — small win chime / ding
 * 4. whoosh.mp3    — swoosh when button evades cursor
 * 5. bruh.mp3      — "bruh" sound effect
 * 6. slowclap.mp3  — slow sarcastic clapping
 * 7. deny.mp3      — access denied / rejection buzz
 * 8. troll.mp3     — troll laugh / comedic fail
 * 9. typing.mp3    — keyboard typing clicks
 * 10. popup.mp3    — modal/overlay pop-in sound
 */
