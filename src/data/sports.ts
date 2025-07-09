import { Sport } from '../types'

export const SPORTS: Sport[] = [
  {
    id: 'basketball',
    name: 'Basketball',
    hasShotClock: true,
    periodName: 'Quarter',
    totalPeriods: 4,
    scoreIncrement: 1,
    statTypes: [
      { id: 'points', name: 'Points', sportId: 'basketball' },
      { id: 'assists', name: 'Assists', sportId: 'basketball' },
      { id: 'rebounds', name: 'Rebounds', sportId: 'basketball' },
      { id: 'steals', name: 'Steals', sportId: 'basketball' },
      { id: 'fouls', name: 'Fouls', sportId: 'basketball' }
    ]
  },
  {
    id: 'soccer',
    name: 'Soccer',
    hasShotClock: false,
    periodName: 'Half',
    totalPeriods: 2,
    scoreIncrement: 1,
    statTypes: [
      { id: 'goals', name: 'Goals', sportId: 'soccer' },
      { id: 'assists', name: 'Assists', sportId: 'soccer' },
      { id: 'fouls', name: 'Fouls', sportId: 'soccer' },
      { id: 'yellowCards', name: 'Yellow Cards', sportId: 'soccer' },
      { id: 'redCards', name: 'Red Cards', sportId: 'soccer' }
    ]
  },
  {
    id: 'afl',
    name: 'AFL',
    hasShotClock: false,
    periodName: 'Quarter',
    totalPeriods: 4,
    scoreIncrement: 1,
    statTypes: [
      { id: 'goals', name: 'Goals', sportId: 'afl' },
      { id: 'marks', name: 'Marks', sportId: 'afl' },
      { id: 'kicks', name: 'Kicks', sportId: 'afl' },
      { id: 'tackles', name: 'Tackles', sportId: 'afl' },
      { id: 'fouls', name: 'Fouls', sportId: 'afl' }
    ]
  },
  {
    id: 'tennis',
    name: 'Tennis',
    hasShotClock: false,
    periodName: 'Set',
    totalPeriods: 5,
    scoreIncrement: 1,
    statTypes: [
      { id: 'setsWon', name: 'Sets Won', sportId: 'tennis' },
      { id: 'aces', name: 'Aces', sportId: 'tennis' },
      { id: 'doubleFaults', name: 'Double Faults', sportId: 'tennis' },
      { id: 'fouls', name: 'Fouls', sportId: 'tennis' }
    ]
  },
  {
    id: 'netball',
    name: 'Netball',
    hasShotClock: true,
    periodName: 'Quarter',
    totalPeriods: 4,
    scoreIncrement: 1,
    statTypes: [
      { id: 'goals', name: 'Goals', sportId: 'netball' },
      { id: 'goalAssists', name: 'Goal Assists', sportId: 'netball' },
      { id: 'intercepts', name: 'Intercepts', sportId: 'netball' },
      { id: 'fouls', name: 'Fouls', sportId: 'netball' }
    ]
  },
  {
    id: 'rugby',
    name: 'Rugby',
    hasShotClock: false,
    periodName: 'Half',
    totalPeriods: 2,
    scoreIncrement: 1,
    statTypes: [
      { id: 'tries', name: 'Tries', sportId: 'rugby' },
      { id: 'conversions', name: 'Conversions', sportId: 'rugby' },
      { id: 'tackles', name: 'Tackles', sportId: 'rugby' },
      { id: 'penalties', name: 'Penalties', sportId: 'rugby' }
    ]
  },
  {
    id: 'nfl',
    name: 'NFL',
    hasShotClock: false,
    periodName: 'Quarter',
    totalPeriods: 4,
    scoreIncrement: 1,
    statTypes: [
      { id: 'touchdowns', name: 'Touchdowns', sportId: 'nfl' },
      { id: 'tackles', name: 'Tackles', sportId: 'nfl' },
      { id: 'interceptions', name: 'Interceptions', sportId: 'nfl' },
      { id: 'penalties', name: 'Penalties', sportId: 'nfl' }
    ]
  },
  // --- BASEBALL ---
  {
    id: 'baseball',
    name: 'Baseball',
    hasShotClock: false,
    periodName: 'Inning',
    totalPeriods: 9,
    scoreIncrement: 1,
    statTypes: [
      { id: 'hits', name: 'Hits', sportId: 'baseball' },
      { id: 'runs', name: 'Runs', sportId: 'baseball' },
      { id: 'homeRuns', name: 'Home Runs', sportId: 'baseball' },
      { id: 'strikeouts', name: 'Strikeouts', sportId: 'baseball' },
      { id: 'walks', name: 'Walks', sportId: 'baseball' },
      { id: 'catches', name: 'Catches', sportId: 'baseball' },
      { id: 'errors', name: 'Errors', sportId: 'baseball' }
    ]
  }
]
