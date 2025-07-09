export interface Sport {
  id: string
  name: string
  hasShotClock: boolean
  periodName: string
  totalPeriods: number
  scoreIncrement: number
  statTypes: StatType[]
}

export interface StatType {
  id: string
  name: string
  sportId: string
}

export interface Team {
  id: string
  name: string
  color: string
  sport: string
  userId: string
}

export interface Player {
  id: string
  name: string
  teamId: string
  position?: string
  jerseyNumber?: number
}

export interface PlayerStat {
  id: string
  gameId: string
  playerId: string
  statType: string
  value: number
  createdAt: string
  userId: string
}

export interface Game {
  id: string
  sportId: string
  team1Id: string
  team2Id: string
  team1Score: number
  team2Score: number
  currentPeriod: number
  gameTime: number
  shotClockTime: number
  isGameClockRunning: boolean
  isShotClockRunning: boolean
  team1Fouls: number
  team2Fouls: number
  gameStatus: 'active' | 'paused' | 'finished'
  createdAt: string
  userId: string
}

export interface GameWithDetails extends Game {
  sport: Sport
  team1: Team
  team2: Team
}

export interface PlayerStat {
  id: string
  gameId: string
  playerId: string
  statType: string
  value: number
  createdAt: string
  userId: string
}