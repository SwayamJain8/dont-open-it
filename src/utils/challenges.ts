export const ROASTS = [
  "Again? Already? 💀",
  "Productivity left the chat.",
  "Bro… seriously? 😭",
  "Your screen time is crying rn.",
  "The Wi-Fi router is judging you.",
  "Even your phone needs a break from you.",
  "You opened this app 3 seconds ago. THREE.",
  "Your future self is so disappointed.",
  "Touch grass. Please. I'm begging.",
  "This is not the flex you think it is.",
  "Your attention span just filed for bankruptcy.",
  "Congratulations! You've achieved nothing!",
  "Your dopamine receptors are on strike.",
  "Plot twist: the app doesn't miss you.",
  "You're not bored. You're addicted. 🫠",
  "Average screen time enjoyer detected.",
  "POV: You choosing reels over real life.",
  "Your ancestors survived wars for THIS?",
  "Tell me you have no discipline without telling me.",
  "The app will be there tomorrow. Your deadlines won't.",
  "Caught in 4K procrastinating 📸",
  "Your willpower has left the group chat.",
]

export const TYPING_SENTENCES = [
  "I will not waste my life scrolling",
  "I am stronger than my phone",
  "Reels are not real life",
  "I choose productivity over procrastination",
  "My screen time does not define me",
  "I will close this and do something useful",
  "One more reel is never just one more",
  "I refuse to be a dopamine slave",
]

export const CAPTCHA_PROMPTS = [
  { text: "Select all images with motivation", subtext: "(There are none)" },
  { text: "Select the squares with self-control", subtext: "(Still looking...)" },
  { text: "Click on your life goals", subtext: "(Error: Not found)" },
  { text: "Identify the productive activities", subtext: "(Hint: Not scrolling)" },
]

export const PERSONALITY_MODES: Record<string, { name: string; responses: string[] }> = {
  toxic: {
    name: "Toxic Friend 🐍",
    responses: [
      "Omg you're SO disciplined... not. Lol.",
      "Sure, open it. It's not like you had anything better to do. Oh wait.",
      "I love how consistent you are. At being distracted.",
      "Go ahead bestie, ruin your day 💅",
      "You said 'last time' like 47 times now.",
      "No bc why are you like this 😭",
      "It's giving ✨ no self control ✨",
      "Slay queen! Slay your productivity!",
      "Just 5 minutes? Lmao we both know that's a lie.",
      "Really? You have 0 screen time control bro.",
    ],
  },
  indianMom: {
    name: "Indian Mom 🇮🇳",
    responses: [
      "Beta, Sharma ji ka ladka doesn't use Instagram.",
      "Phir se? Padhai kar le beta, IIT nahi jayega apne aap.",
      "Jab main tumhari umar ki thi, hum kitaabein padhte the!",
      "Phone tod dungi main! Ruk ja!",
      "Yeh sab karne se paise aate hain? Nahi na!",
      "Doctor banna hai ya YouTuber? DECIDE KAR!",
      "Mere paas phone nahi tha aur main first aati thi class mein.",
      "Khana kha le pehle, phone baad mein!",
      "Always on that phone! What are you even doing?",
      "If you studied as much as you looked at this screen...",
    ],
  },
  guru: {
    name: "Motivational Guru 🧘",
    responses: [
      "The scroll feeds the void, not the soul, my child.",
      "Every reel you watch is a page you didn't read.",
      "Be the algorithm, don't let it be you.",
      "The path to enlightenment doesn't have a 'For You' page.",
      "Your potential is infinite. Your screen time should not be.",
      "Breathe in ambition. Breathe out Instagram.",
      "The universe didn't create you to double-tap selfies.",
      "You are one decision away from a completely different life. Close the app.",
      "Is this serving you? Or are you serving the algorithm?",
      "Protect your peace. Close the tab.",
    ],
  },
}

export const FAKE_LOADING_MESSAGES = [
  "Loading your disappointment...",
  "Calculating your screen time shame...",
  "Contacting your future self for permission...",
  "Checking if you have any real hobbies...",
  "Searching for your willpower... Not found.",
  "Buffering your excuses...",
  "Downloading regret.exe...",
  "Initializing procrastination module...",
]

export const STATS_ROASTS = {
  low: ["Not bad. But we're watching you. 👀", "A casual user? How refreshing."],
  medium: [
    "Getting spicy! Your screen time has entered the chat.",
    "You're becoming a regular. That's... not a compliment.",
  ],
  high: [
    "INTERVENTION TIME. 🚨",
    "At this point, the app should be paying YOU rent.",
    "You've scrolled enough to circumnavigate the Earth. Twice.",
  ],
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const getRandomRoast = () => pick(ROASTS)
export const getRandomTypingSentence = () => pick(TYPING_SENTENCES)
export const getRandomCaptcha = () => pick(CAPTCHA_PROMPTS)
export const getRandomLoadingMessage = () => pick(FAKE_LOADING_MESSAGES)

export function getRandomPersonalityResponse(mode: string) {
  const p = PERSONALITY_MODES[mode] || PERSONALITY_MODES.toxic
  return pick(p.responses)
}

export function getRandomChallenge(preferred?: string): string {
  const all = ['movingButton', 'typing', 'fakeLoader', 'captcha']
  if (preferred && Math.random() > 0.35) return preferred
  return pick(all)
}

export function getAppRoast(appRoasts: string[]): string {
  if (appRoasts.length > 0 && Math.random() > 0.4) return pick(appRoasts)
  return pick(ROASTS)
}

export function getStatsRoast(totalAttempts: number) {
  if (totalAttempts < 5) return pick(STATS_ROASTS.low)
  if (totalAttempts < 15) return pick(STATS_ROASTS.medium)
  return pick(STATS_ROASTS.high)
}
