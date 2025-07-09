import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { BarChart3, TrendingUp, Trophy, Target } from 'lucide-react'
import { blink } from '../lib/blink'
import { Game, Team, PlayerStat } from '../types'
import { SPORTS } from '../data/sports'

export function StatsPage() {
  const [games, setGames] = useState<Game[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [, setPlayerStats] = useState<PlayerStat[]>([])
  const [selectedSport, setSelectedSport] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const user = await blink.auth.me()
      
      const [gamesData, teamsData, statsData] = await Promise.all([
        blink.db.games.list({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' }
        }),
        blink.db.teams.list({}),
        blink.db.playerStats.list({
          where: { userId: user.id }
        })
      ])

      setGames(gamesData)
      setTeams(teamsData)
      setPlayerStats(statsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredGames = selectedSport === 'all' 
    ? games 
    : games.filter(game => game.sportId === selectedSport)

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId)
    return team?.name || 'Unknown Team'
  }

  const getSportName = (sportId: string) => {
    const sport = SPORTS.find(s => s.id === sportId)
    return sport?.name || 'Unknown Sport'
  }

  const getGameStats = () => {
    const totalGames = filteredGames.length
    const activeGames = filteredGames.filter(g => g.gameStatus === 'active').length
    const completedGames = filteredGames.filter(g => g.gameStatus === 'finished').length
    const totalScore = filteredGames.reduce((sum, game) => sum + game.team1Score + game.team2Score, 0)
    const avgScore = totalGames > 0 ? (totalScore / totalGames).toFixed(1) : 0

    return { totalGames, activeGames, completedGames, avgScore }
  }

  const stats = getGameStats()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Game Statistics</h1>
        <div className="flex items-center space-x-4">
          <Select value={selectedSport} onValueChange={setSelectedSport}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              {SPORTS.map((sport) => (
                <SelectItem key={sport.id} value={sport.id}>
                  {sport.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Games</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGames}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeGames} active, {stats.completedGames} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Games</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeGames}</div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Total Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgScore}</div>
            <p className="text-xs text-muted-foreground">Points per game</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sports Played</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(games.map(g => g.sportId)).size}
            </div>
            <p className="text-xs text-muted-foreground">Different sports</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Games */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Games</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredGames.slice(0, 10).map((game) => (
              <div key={game.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline">
                    {getSportName(game.sportId)}
                  </Badge>
                  <div>
                    <p className="font-medium">
                      {getTeamName(game.team1Id)} vs {getTeamName(game.team2Id)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(game.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      {game.team1Score} - {game.team2Score}
                    </p>
                    <Badge 
                      variant={game.gameStatus === 'active' ? 'default' : 'secondary'}
                      className={game.gameStatus === 'active' ? 'bg-green-600' : ''}
                    >
                      {game.gameStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredGames.length === 0 && (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No games found for the selected criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sport Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Games by Sport</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {SPORTS.map((sport) => {
              const sportGames = games.filter(g => g.sportId === sport.id)
              const percentage = games.length > 0 ? (sportGames.length / games.length * 100) : 0
              
              return (
                <div key={sport.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <span className="font-medium">{sport.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium min-w-[3rem]">
                      {sportGames.length} games
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}