import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Play, Pause, Plus, Minus, Clock, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { blink } from '../lib/blink'
import { Game, Team, Sport } from '../types'
import { SPORTS } from '../data/sports'
import toast from 'react-hot-toast'

export function GamePage() {
  const { gameId } = useParams<{ gameId: string }>()
  const navigate = useNavigate()
  const [game, setGame] = useState<Game | null>(null)
  const [teams, setTeams] = useState<{ team1: Team | null, team2: Team | null }>({ team1: null, team2: null })
  const [sport, setSport] = useState<Sport | null>(null)
  const [loading, setLoading] = useState(true)
  
  const gameClockRef = useRef<NodeJS.Timeout | null>(null)
  const shotClockRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (gameId) {
      loadGame()
    }
  }, [gameId])

  useEffect(() => {
    if (!game) return

    if (game.isGameClockRunning) {
      gameClockRef.current = setInterval(() => {
        setGame(prev => prev ? { ...prev, gameTime: prev.gameTime + 1 } : null)
      }, 1000)
    } else {
      if (gameClockRef.current) {
        clearInterval(gameClockRef.current)
        gameClockRef.current = null
      }
    }

    if (game.isShotClockRunning && sport?.hasShotClock) {
      shotClockRef.current = setInterval(() => {
        setGame(prev => {
          if (!prev) return null
          const newTime = Math.max(0, prev.shotClockTime - 1)
          if (newTime === 0) {
            // Shot clock expired
            toast.error('Shot clock expired!')
            return { ...prev, shotClockTime: 24, isShotClockRunning: false }
          }
          return { ...prev, shotClockTime: newTime }
        })
      }, 1000)
    } else {
      if (shotClockRef.current) {
        clearInterval(shotClockRef.current)
        shotClockRef.current = null
      }
    }

    return () => {
      if (gameClockRef.current) clearInterval(gameClockRef.current)
      if (shotClockRef.current) clearInterval(shotClockRef.current)
    }
  }, [game?.isGameClockRunning, game?.isShotClockRunning, sport?.hasShotClock])

  const loadGame = async () => {
    try {
      const gamesData = await blink.db.games.list({
        where: { id: gameId },
        limit: 1
      })
      
      if (gamesData.length === 0) {
        toast.error('Game not found')
        navigate('/')
        return
      }

      const gameData = gamesData[0]
      setGame(gameData)

      // Load teams
      const [team1Data, team2Data] = await Promise.all([
        blink.db.teams.list({ where: { id: gameData.team1Id }, limit: 1 }),
        blink.db.teams.list({ where: { id: gameData.team2Id }, limit: 1 })
      ])

      setTeams({
        team1: team1Data[0] || null,
        team2: team2Data[0] || null
      })

      // Load sport
      const sportData = SPORTS.find(s => s.id === gameData.sportId)
      setSport(sportData || null)

    } catch (error) {
      console.error('Error loading game:', error)
      toast.error('Failed to load game')
    } finally {
      setLoading(false)
    }
  }

  const updateGame = async (updates: Partial<Game>) => {
    if (!game) return

    try {
      const updatedGame = { ...game, ...updates }
      await blink.db.games.update(game.id, updates)
      setGame(updatedGame)
    } catch (error) {
      console.error('Error updating game:', error)
      toast.error('Failed to update game')
    }
  }

  const toggleGameClock = () => {
    if (!game) return
    updateGame({ isGameClockRunning: !game.isGameClockRunning })
  }

  const toggleShotClock = () => {
    if (!game) return
    updateGame({ isShotClockRunning: !game.isShotClockRunning })
  }

  const adjustGameTime = (minutes: number) => {
    if (!game) return
    const newTime = Math.max(0, game.gameTime + (minutes * 60))
    updateGame({ gameTime: newTime })
  }

  const adjustShotClock = (seconds: number) => {
    if (!game) return
    const newTime = Math.max(0, Math.min(99, game.shotClockTime + seconds))
    updateGame({ shotClockTime: newTime })
  }

  const updateScore = (team: 'team1' | 'team2', change: number) => {
    if (!game) return
    
    const scoreKey = team === 'team1' ? 'team1Score' : 'team2Score'
    const newScore = Math.max(0, game[scoreKey] + change)
    
    updateGame({ [scoreKey]: newScore })
  }

  const updateFouls = (team: 'team1' | 'team2', change: number) => {
    if (!game) return
    
    const foulsKey = team === 'team1' ? 'team1Fouls' : 'team2Fouls'
    const newFouls = Math.max(0, game[foulsKey] + change)
    
    updateGame({ [foulsKey]: newFouls })
  }

  const nextPeriod = () => {
    if (!game || !sport) return
    
    if (game.currentPeriod < sport.totalPeriods) {
      updateGame({ 
        currentPeriod: game.currentPeriod + 1,
        isGameClockRunning: false,
        isShotClockRunning: false
      })
    }
  }

  const previousPeriod = () => {
    if (!game) return
    
    if (game.currentPeriod > 1) {
      updateGame({ 
        currentPeriod: game.currentPeriod - 1,
        isGameClockRunning: false,
        isShotClockRunning: false
      })
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!game || !sport) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Game not found</p>
        <Button onClick={() => navigate('/')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Badge variant="outline" className="bg-green-50 text-green-700">
          {sport.name} - {sport.periodName} {game.currentPeriod}
        </Badge>
      </div>

      {/* Main Scoreboard */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Live Scoreboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Team 1 */}
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold text-blue-600">{teams.team1?.name}</h3>
              <div className="text-6xl font-bold text-blue-600">{game.team1Score}</div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="lg"
                  onClick={() => updateScore('team1', sport.scoreIncrement)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => updateScore('team1', -sport.scoreIncrement)}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Minus className="h-5 w-5" />
                </Button>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Fouls: {game.team1Fouls}</p>
                <div className="grid grid-cols-2 gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateFouls('team1', 1)}
                  >
                    +1
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateFouls('team1', -1)}
                  >
                    -1
                  </Button>
                </div>
              </div>
            </div>

            {/* Game Controls */}
            <div className="text-center space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Game Time</p>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatTime(game.gameTime)}
                </div>
                <div className="flex justify-center space-x-2 mb-2">
                  <Button
                    onClick={toggleGameClock}
                    variant={game.isGameClockRunning ? "default" : "outline"}
                    className={game.isGameClockRunning ? "bg-red-600 hover:bg-red-700" : ""}
                  >
                    {game.isGameClockRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex justify-center space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => adjustGameTime(-1)}
                  >
                    -1m
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => adjustGameTime(1)}
                  >
                    +1m
                  </Button>
                </div>
              </div>

              {sport.hasShotClock && (
                <div className="bg-orange-100 p-4 rounded-lg">
                  <p className="text-sm text-orange-700 mb-2">Shot Clock</p>
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {game.shotClockTime}s
                  </div>
                  <div className="flex justify-center space-x-2 mb-2">
                    <Button
                      onClick={toggleShotClock}
                      variant={game.isShotClockRunning ? "default" : "outline"}
                      className={game.isShotClockRunning ? "bg-red-600 hover:bg-red-700" : ""}
                    >
                      {game.isShotClockRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="flex justify-center space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => adjustShotClock(-1)}
                    >
                      -1s
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => adjustShotClock(1)}
                    >
                      +1s
                    </Button>
                  </div>
                </div>
              )}

              <div className="bg-blue-100 p-4 rounded-lg">
                <p className="text-sm text-blue-700 mb-2">{sport.periodName}</p>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {game.currentPeriod} / {sport.totalPeriods}
                </div>
                <div className="flex justify-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={previousPeriod}
                    disabled={game.currentPeriod <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={nextPeriod}
                    disabled={game.currentPeriod >= sport.totalPeriods}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Team 2 */}
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold text-red-600">{teams.team2?.name}</h3>
              <div className="text-6xl font-bold text-red-600">{game.team2Score}</div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="lg"
                  onClick={() => updateScore('team2', sport.scoreIncrement)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => updateScore('team2', -sport.scoreIncrement)}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Minus className="h-5 w-5" />
                </Button>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Fouls: {game.team2Fouls}</p>
                <div className="grid grid-cols-2 gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateFouls('team2', 1)}
                  >
                    +1
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateFouls('team2', -1)}
                  >
                    -1
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Game Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Sport</p>
              <p className="font-semibold">{sport.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge variant={game.gameStatus === 'active' ? 'default' : 'secondary'}>
                {game.gameStatus}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Fouls</p>
              <p className="font-semibold">{game.team1Fouls + game.team2Fouls}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Created</p>
              <p className="font-semibold">{new Date(game.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}