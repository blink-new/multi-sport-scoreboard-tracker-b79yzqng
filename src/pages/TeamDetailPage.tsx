import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blink } from '../lib/blink';
import { Team, Player } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function TeamDetailPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) return;
    const fetchData = async () => {
      const t = await blink.db.teams.get(teamId);
      const p = await blink.db.players.list({ where: { teamId } });
      setTeam(t);
      setPlayers(p);
      setLoading(false);
    };
    fetchData();
  }, [teamId]);

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim() || !teamId) return;
    const player = await blink.db.players.create({
      name: newPlayerName,
      teamId,
    });
    setPlayers([...players, player]);
    setNewPlayerName('');
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!team) return <div className="p-8 text-center">Team not found.</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <Button variant="ghost" onClick={() => navigate('/teams')} className="mb-4">← Back to Teams</Button>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full inline-block" style={{ background: team.color || '#3B82F6' }}></span>
            {team.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="font-semibold mb-2">Players</h2>
          <ul className="mb-4 space-y-1">
            {players.map((player) => (
              <li key={player.id} className="flex items-center gap-2">
                <span>{player.name}</span>
                <Button size="sm" variant="link" onClick={() => navigate(`/players/${player.id}`)}>View Stats</Button>
              </li>
            ))}
            {players.length === 0 && <li className="text-gray-500">No players yet.</li>}
          </ul>
          <form onSubmit={handleAddPlayer} className="flex gap-2 items-end">
            <div className="flex-1">
              <Label htmlFor="newPlayer">Add Player</Label>
              <Input id="newPlayer" value={newPlayerName} onChange={e => setNewPlayerName(e.target.value)} placeholder="Player name" />
            </div>
            <Button type="submit">Add</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
