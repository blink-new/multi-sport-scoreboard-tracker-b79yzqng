import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blink } from '../lib/blink';
import { Player, PlayerStat } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function PlayerDetailPage() {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [stats, setStats] = useState<PlayerStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!playerId) return;
    const fetchData = async () => {
      const p = await blink.db.players.get(playerId);
      const s = await blink.db.playerStats.list({ where: { playerId } });
      setPlayer(p);
      setStats(s);
      setLoading(false);
    };
    fetchData();
  }, [playerId]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!player) return <div className="p-8 text-center">Player not found.</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">← Back</Button>
      <Card>
        <CardHeader>
          <CardTitle>{player.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="font-semibold mb-2">Stats</h2>
          <ul className="space-y-1">
            {stats.length === 0 && <li className="text-gray-500">No stats yet.</li>}
            {stats.map((stat) => (
              <li key={stat.id} className="flex items-center gap-2">
                <span className="capitalize">{stat.statType}:</span>
                <span className="font-semibold">{stat.value}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}