import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { blink } from "../lib/blink";
import { Team } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { Plus } from "lucide-react";

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await blink.db.teams.list<Team>({
          orderBy: { createdAt: "desc" },
        });
        setTeams(data);
      } catch (err: unknown) {
        console.error("Failed to load teams", err);
        setError("Failed to load teams. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Teams</h1>
        <Button onClick={() => navigate("/create-team")}>
          <Plus className="w-4 h-4 mr-2" /> Create Team
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-24 rounded-lg" />
          ))}
        </div>
      ) : teams.length === 0 ? (
        <p className="text-gray-500">No teams created yet. Click “Create Team” to add one.</p>
      ) : (
        <div className="grid gap-4">
          {teams.map((team) => (
            <Card
              key={team.id}
              className="hover:shadow-md transition cursor-pointer"
              onClick={() => navigate(`/teams/${team.id}`)}
            >
              <CardHeader className="flex flex-row items-center gap-3 py-4">
                <span
                  className="inline-block w-4 h-4 rounded-full"
                  style={{ background: team.color || "#3B82F6" }}
                ></span>
                <CardTitle className="text-lg font-medium">
                  {team.name}
                </CardTitle>
              </CardHeader>
              {team.sport && (
                <CardContent className="pt-0 pb-4 pl-[52px] text-sm text-gray-600">
                  Sport: {team.sport}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}