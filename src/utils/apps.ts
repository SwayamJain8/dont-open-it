export interface AppInfo {
  id: string
  name: string
  icon: string
  color: string
  url: string
  trollUrl: string
  roasts: string[]
  preferredChallenge: string
}

export const APPS: AppInfo[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    color: '#E1306C',
    url: 'https://www.instagram.com',
    trollUrl: 'https://www.google.com/search?q=how+to+stop+procrastination',
    roasts: [
      "Another selfie scroll session? 📸",
      "Your Explore page knows you better than your therapist.",
      "Reels are not real life. Literally.",
      "You're not 'catching up'. You're doom-scrolling.",
    ],
    preferredChallenge: 'captcha',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '▶️',
    color: '#FF0000',
    url: 'https://www.youtube.com',
    trollUrl: 'https://www.google.com/search?q=how+to+be+productive',
    roasts: [
      "'Just one video' — the biggest lie since 'I'll start Monday'.",
      "Your Watch Later playlist has more items than a grocery store.",
      "You don't need another tutorial. You need to START.",
      "Autoplay is not a lifestyle choice.",
    ],
    preferredChallenge: 'fakeLoader',
  },
  {
    id: 'netflix',
    name: 'Netflix',
    icon: '🎬',
    color: '#E50914',
    url: 'https://www.netflix.com',
    trollUrl: 'https://www.google.com/search?q=best+books+to+read+instead+of+netflix',
    roasts: [
      "'Are you still watching?' YES, AND I HATE MYSELF.",
      "Your bed and Netflix are in a toxic relationship.",
      "One more episode = 4 AM. Every. Single. Time.",
      "You've binged more series than books you've read. Ever.",
    ],
    preferredChallenge: 'typing',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    color: '#00f2ea',
    url: 'https://www.tiktok.com',
    trollUrl: 'https://www.google.com/search?q=how+to+increase+attention+span',
    roasts: [
      "Your attention span is now shorter than a TikTok. Congrats.",
      "Swipe up, swipe up, swipe up... into the void.",
      "You've been 'on TikTok for 2 min' for 3 hours.",
      "The algorithm owns you at this point.",
    ],
    preferredChallenge: 'movingButton',
  },
  {
    id: 'twitter',
    name: 'X / Twitter',
    icon: '🐦',
    color: '#1DA1F2',
    url: 'https://www.twitter.com',
    trollUrl: 'https://www.google.com/search?q=why+social+media+is+bad+for+you',
    roasts: [
      "Going to Twitter for peace of mind is like going to a fire for warmth.",
      "Hot takes won't pay your bills.",
      "You're about to argue with a stranger. Again.",
      "Timeline refreshing is not a personality trait.",
    ],
    preferredChallenge: 'typing',
  },
  {
    id: 'reddit',
    name: 'Reddit',
    icon: '👽',
    color: '#FF4500',
    url: 'https://www.reddit.com',
    trollUrl: 'https://www.google.com/search?q=how+to+stop+wasting+time+on+reddit',
    roasts: [
      "You've read 47 AITA posts today. You ARE the a-hole.",
      "r/productivity is not productivity.",
      "The rabbit hole has no bottom. Turn back.",
      "'Quick Reddit check' — 2 hours later...",
    ],
    preferredChallenge: 'captcha',
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    icon: '👻',
    color: '#FFFC00',
    url: 'https://www.snapchat.com',
    trollUrl: 'https://www.google.com/search?q=real+friends+vs+social+media+friends',
    roasts: [
      "Your streaks are more consistent than your study schedule.",
      "Sending a black screen to maintain a streak. Peak friendship.",
      "Snap Map stalking doesn't count as socializing.",
      "Your Bitmoji has a better life than you.",
    ],
    preferredChallenge: 'movingButton',
  },
  {
    id: 'twitch',
    name: 'Twitch',
    icon: '🎮',
    color: '#9146FF',
    url: 'https://www.twitch.tv',
    trollUrl: 'https://www.google.com/search?q=how+to+stop+watching+streams+and+start+creating',
    roasts: [
      "Watching someone else play games while you avoid your own life.",
      "You've donated more to streamers than your savings account.",
      "Parasocial relationships are not real friendships.",
      "Your sub badge won't get you a promotion.",
    ],
    preferredChallenge: 'fakeLoader',
  },
]
