import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Users, Plus, UserPlus } from 'lucide-react'
import { blink } from '../lib/blink'
import { Player, Team } from '../types'
import toast from 'react-hot-toast'

export function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    teamId: '',
    position: '',
    jerseyNumber: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [playersData, teamsData] = await Promise.all([
        blink.db.players.list({
          orderBy: { createdAt: 'desc' }
        }),
        blink.db.teams.list({
          orderBy: { createdAt: 'desc' }
        })
      ])

      setPlayers(playersData)
      setTeams(teamsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePlayer = async () => {
    if (!newPlayer.name || !newPlayer.teamId) {
      toast.error('Please fill in required fields')
      return
    }

    try {
      const player = await blink.db.players.create({
        id: `player_${Date.now()}`,
        name: newPlayer.name,
        teamId: newPlayer.teamId,
        position: newPlayer.position || undefined,
        jerseyNumber: newPlayer.jerseyNumber ? parseInt(newPlayer.jerseyNumber) : undefined
      })

      setPlayers([player, ...players])
      setNewPlayer({ name: '', teamId: '', position: '', jerseyNumber: '' })
      setIsDialogOpen(false)
      toast.success('Player created successfully!')
    } catch (error) {
      console.error('Error creating player:', error)
      toast.error('Failed to create player')
    }
  }

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId)
    return team?.name || 'Unknown Team'
  }

  const getTeamColor = (teamId: string) => {
    const team = teams.find(t => t.id === teamId)
    return team?.color || '#3B82F6'
  }

  const groupedPlayers = players.reduce((acc, player) => {
    const teamId = player.teamId
    if (!acc[teamId]) {
      acc[teamId] = []
    }
    acc[teamId].push(player)
    return acc
  }, {} as Record<string, Player[]>)

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
        <h1 className="text-3xl font-bold text-gray-900">Players</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Player
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Player</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="playerName">Player Name *</Label>
                <Input
                  id="playerName"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                  placeholder="Enter player name"
                />
              </div>
              <div>
                <Label htmlFor="team">Team *</Label>
                <Select value={newPlayer.teamId} onValueChange={(value) => setNewPlayer({ ...newPlayer, teamId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={newPlayer.position}
                  onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
                  placeholder="Enter position (optional)"
                />
              </div>
              <div>
                <Label htmlFor="jerseyNumber">Jersey Number</Label>
                <Input
                  id="jerseyNumber"
                  type="number"
                  value={newPlayer.jerseyNumber}
                  onChange={(e) => setNewPlayer({ ...newPlayer, jerseyNumber: e.target.value })}
                  placeholder="Enter jersey number (optional)"
                />
              </div>
              <Button onClick={handleCreatePlayer} className="w-full">
                Create Player
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Player Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{players.length}</div>
            <p className="text-xs text-muted-foreground">Across all teams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.length}</div>
            <p className="text-xs text-muted-foreground">With registered players</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Team Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teams.length > 0 ? Math.round(players.length / teams.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Players per team</p>
          </CardContent>
        </Card>
      </div>

      {/* Players by Team */}
      <div className="space-y-6">
        {Object.entries(groupedPlayers).map(([teamId, teamPlayers]) => (
          <Card key={teamId}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getTeamColor(teamId) }}
                ></div>
                <span>{getTeamName(teamId)}</span>
                <Badge variant="outline">
                  {teamPlayers.length} players
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamPlayers.map((player) => (
                  <div key={player.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{player.name}</h3>
                      {player.jerseyNumber && (
                        <Badge variant="outline">
                          #{player.jerseyNumber}
                        </Badge>
                      )}
                    </div>
                    {player.position && (
                      <p className="text-sm text-gray-600 mb-2">
                        Position: {player.position}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Added: {new Date(player.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {players.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No players yet</h3>
          <p className="text-gray-600 mb-4">
            Add players to start tracking their statistics
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add First Player
          </Button>
        </div>
      )}
    </div>
  )
}