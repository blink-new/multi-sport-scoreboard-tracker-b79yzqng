import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Play, Pause, Clock, Users } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { blink } from '../lib/blink'
import { Game, Team } from '../types'
import { SPORTS } from '../data/sports'

export function HomePage() {
  const [games, setGames] = useState<Game[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGames()
    loadTeams()
  }, [])

  const loadGames = async () => {
    try {
      const user = await blink.auth.me()
      const gamesData = await blink.db.games.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        limit: 10
      })
      setGames(gamesData)
    } catch (error) {
      console.error('Error loading games:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTeams = async () => {
    try {
      const teamsData = await blink.db.teams.list({
        limit: 100
      })
      setTeams(teamsData)
    } catch (error) {
      console.error('Error loading teams:', error)
    }
  }

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId)
    return team?.name || 'Unknown Team'
  }

  const getSportName = (sportId: string) => {
    const sport = SPORTS.find(s => s.id === sportId)
    return sport?.name || 'Unknown Sport'
  }

  const formatGameTime = (seconds: number) => {
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

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Multi-Sport Scoreboard
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Track live scores, game timers, and player statistics across multiple sports
        </p>
        <Link to="/new-game">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-5 w-5" />
            Start New Game
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <Card key={game.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {getSportName(game.sportId)}
                </CardTitle>
                <Badge 
                  variant={game.gameStatus === 'active' ? 'default' : 'secondary'}
                  className={game.gameStatus === 'active' ? 'bg-green-600' : ''}
                >
                  {game.gameStatus === 'active' ? 'Live' : game.gameStatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="font-medium">{getTeamName(game.team1Id)}</p>
                    <p className="text-2xl font-bold text-blue-600">{game.team1Score}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">VS</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{getTeamName(game.team2Id)}</p>
                    <p className="text-2xl font-bold text-blue-600">{game.team2Score}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatGameTime(game.gameTime)}
                  </div>
                  <div className="flex items-center">
                    {game.isGameClockRunning ? (
                      <Play className="h-4 w-4 mr-1 text-green-600" />
                    ) : (
                      <Pause className="h-4 w-4 mr-1 text-gray-400" />
                    )}
                    Period {game.currentPeriod}
                  </div>
                </div>
                
                <Link to={`/game/${game.id}`}>
                  <Button className="w-full">
                    View Game
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {games.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No games yet</h3>
          <p className="text-gray-600 mb-4">
            Create your first game to start tracking scores and stats
          </p>
          <Link to="/new-game">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Game
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}