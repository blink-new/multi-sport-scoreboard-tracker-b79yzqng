
import { useState } from "react";
import { blink } from "../lib/blink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface TeamFormProps {
  onTeamCreated: () => void;
}

const TeamForm = ({ onTeamCreated }: TeamFormProps) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast({ title: "Error", description: "Team name is required." });
      return;
    }
    try {
      await blink.db.teams.create({ name, color });
      toast({ title: "Success", description: "Team created successfully." });
      setName("");
      setColor("#000000");
      onTeamCreated();
    } catch (error) {
      console.error("Error creating team:", error);
      toast({ title: "Error", description: "Failed to create team." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Team Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter team name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="color">Team Color</Label>
        <Input
          id="color"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>
      <Button type="submit">Create Team</Button>
    </form>
  );
};

export default TeamForm;
