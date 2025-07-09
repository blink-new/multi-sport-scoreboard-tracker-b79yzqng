import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { blink } from '../lib/blink';
import { Team } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      const t = await blink.db.teams.list();
      setTeams(t);
      setLoading(false);
    };
    fetchTeams();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Teams</h1>
      <div className="grid gap-4">
        {teams.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full inline-block" style={{ background: team.color || '#3B82F6' }}></span>
                {team.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate(`/teams/${team.id}`)} size="sm">View Team</Button>
            </CardContent>
          </Card>
        ))}
        {teams.length === 0 && <div className="text-gray-500">No teams yet.</div>}
      </div>
    </div>
  );
}
