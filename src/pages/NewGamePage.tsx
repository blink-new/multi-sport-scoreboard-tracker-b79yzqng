import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { blink } from '../lib/blink'
import { SPORTS } from '../data/sports'
import toast from 'react-hot-toast'

export function NewGamePage() {
  const navigate = useNavigate()
  const [selectedSport, setSelectedSport] = useState('')
  const [team1Name, setTeam1Name] = useState('')
  const [team2Name, setTeam2Name] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreateGame = async () => {
    if (!selectedSport || !team1Name || !team2Name) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const user = await blink.auth.me()
      
      // Create teams
      const team1 = await blink.db.teams.create({
        id: `team_${Date.now()}_1`,
        name: team1Name,
        color: '#3B82F6'
      })
      
      const team2 = await blink.db.teams.create({
        id: `team_${Date.now()}_2`,
        name: team2Name,
        color: '#EF4444'
      })

      // Get sport details
      const sport = SPORTS.find(s => s.id === selectedSport)
      const initialShotClockTime = sport?.hasShotClock ? 24 : 0

      // Create game
      const game = await blink.db.games.create({
        id: `game_${Date.now()}`,
        sportId: selectedSport,
        team1Id: team1.id,
        team2Id: team2.id,
        team1Score: 0,
        team2Score: 0,
        currentPeriod: 1,
        gameTime: 0,
        shotClockTime: initialShotClockTime,
        isGameClockRunning: false,
        isShotClockRunning: false,
        team1Fouls: 0,
        team2Fouls: 0,
        gameStatus: 'active',
        userId: user.id
      })

      toast.success('Game created successfully!')
      navigate(`/game/${game.id}`)
    } catch (error) {
      console.error('Error creating game:', error)
      toast.error('Failed to create game')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create New Game</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="sport">Select Sport</Label>
            <Select value={selectedSport} onValueChange={setSelectedSport}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a sport" />
              </SelectTrigger>
              <SelectContent>
                {SPORTS.map((sport) => (
                  <SelectItem key={sport.id} value={sport.id}>
                    {sport.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="team1">Team 1 Name</Label>
              <Input
                id="team1"
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
                placeholder="Enter team 1 name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team2">Team 2 Name</Label>
              <Input
                id="team2"
                value={team2Name}
                onChange={(e) => setTeam2Name(e.target.value)}
                placeholder="Enter team 2 name"
              />
            </div>
          </div>

          {selectedSport && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">
                {SPORTS.find(s => s.id === selectedSport)?.name} Settings
              </h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• {SPORTS.find(s => s.id === selectedSport)?.totalPeriods} {SPORTS.find(s => s.id === selectedSport)?.periodName}s</p>
                {SPORTS.find(s => s.id === selectedSport)?.hasShotClock && (
                  <p>• Shot clock: 24 seconds</p>
                )}
                <p>• Statistics tracked: {SPORTS.find(s => s.id === selectedSport)?.statTypes.map(s => s.name).join(', ')}</p>
              </div>
            </div>
          )}

          <Button 
            onClick={handleCreateGame}
            disabled={loading || !selectedSport || !team1Name || !team2Name}
            className="w-full"
            size="lg"
          >
            {loading ? 'Creating...' : 'Create Game'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}