import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SPORTS } from '@/data/sports';
import { blink } from '../lib/blink';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

const CreateTeamPage = () => {
  const [teamName, setTeamName] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [players, setPlayers] = useState(['']);
  const [submitting, setSubmitting] = useState(false);

  const handleAddPlayer = () => {
    setPlayers([...players, '']);
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);
  };

  const handleRemovePlayer = (index: number) => {
    const newPlayers = [...players];
    newPlayers.splice(index, 1);
    setPlayers(newPlayers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !selectedSport || players.some((p) => !p.trim())) {
      toast({ title: 'Error', description: 'Please fill all fields and player names.' });
      return;
    }
    setSubmitting(true);
    try {
      const user = await blink.auth.me();
      const teamId = uuidv4();
      await blink.db.teams.create({
        id: teamId,
        name: teamName,
        color: '#1976d2', // Default color, can be extended
        sport: selectedSport,
        userId: user.id,
      });
      // Save players
      await blink.db.players.createMany(
        players.map((name) => ({
          id: uuidv4(),
          name,
          teamId,
          userId: user.id,
        }))
      );
      toast({ title: 'Success', description: 'Team and players created!' });
      setTeamName('');
      setSelectedSport('');
      setPlayers(['']);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create team.' });
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Team</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="teamName">Team Name</Label>
          <Input
            id="teamName"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="sport">Sport</Label>
          <Select value={selectedSport} onValueChange={setSelectedSport} required>
            <SelectTrigger id="sport">
              <SelectValue placeholder="Select a sport" />
            </SelectTrigger>
            <SelectContent>
              {SPORTS.map((sport) => (
                <SelectItem key={sport.name} value={sport.name}>
                  {sport.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Players</Label>
          {players.map((player, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <Input
                value={player}
                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                placeholder={`Player ${index + 1}`}
                required
              />
              <Button type="button" variant="destructive" onClick={() => handleRemovePlayer(index)} disabled={players.length === 1}>
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" onClick={handleAddPlayer}>
            Add Player
          </Button>
        </div>
        <Button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create Team'}</Button>
      </form>
    </div>
  );
};

export default CreateTeamPage;
