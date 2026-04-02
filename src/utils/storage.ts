const STORAGE_KEY = 'dont-open-it-data'

export interface AppStats {
  attempts: Record<string, number>
  totalAttempts: number
  lastReason: string | null
  lastApp: string | null
  lastVisit: string | null
  personalityMode: string
  completedChallenges: number
  trollCount: number
  actualOpens: number
}

function getDefault(): AppStats {
  return {
    attempts: {},
    totalAttempts: 0,
    lastReason: null,
    lastApp: null,
    lastVisit: null,
    personalityMode: 'toxic',
    completedChallenges: 0,
    trollCount: 0,
    actualOpens: 0,
  }
}

function getData(): AppStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefault()
    const parsed = JSON.parse(raw)
    return { ...getDefault(), ...parsed }
  } catch {
    return getDefault()
  }
}

function saveData(data: AppStats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function incrementAttempts(appId: string) {
  const data = getData()
  data.attempts[appId] = (data.attempts[appId] || 0) + 1
  data.totalAttempts += 1
  data.lastApp = appId
  data.lastVisit = new Date().toISOString()
  saveData(data)
  return data
}

export function recordReason(reason: string) {
  const data = getData()
  data.lastReason = reason
  saveData(data)
}

export function recordTroll() {
  const data = getData()
  data.trollCount += 1
  saveData(data)
}

export function recordActualOpen() {
  const data = getData()
  data.actualOpens += 1
  saveData(data)
}

export function recordChallenge() {
  const data = getData()
  data.completedChallenges += 1
  saveData(data)
}

export function setPersonalityMode(mode: string) {
  const data = getData()
  data.personalityMode = mode
  saveData(data)
}

export function getStats(): AppStats {
  return getData()
}

export function getAppAttempts(appId: string): number {
  return getData().attempts[appId] || 0
}

export function resetStats() {
  localStorage.removeItem(STORAGE_KEY)
}
