// src/editor/BasicForm.tsx
import { useChallengeStore } from "@/store/challengeStore";
import { rolesList } from "@/utils/constants";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function BasicForm() {
  const { challenge, setChallenge } = useChallengeStore();

  const clampRating = (n: number) =>
    Math.max(1, Math.min(5, Math.floor(n || 1)));

  const toggleRole = (role: string) => {
    const has = challenge.roles.includes(role);
    setChallenge({
      roles: has
        ? challenge.roles.filter((r) => r !== role)
        : [...challenge.roles, role],
    });
  };

  return (
    <div className="space-y-6">
      {/* Name + Rating */}
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div className="grid gap-1">
          <Label htmlFor="challenge-name">Challenge name</Label>
          <Input
            id="challenge-name"
            placeholder="e.g., The Heap Thing"
            value={challenge.name}
            onChange={(e) => setChallenge({ name: e.target.value })}
          />
        </div>

        <div className="grid gap-1 w-[120px]">
          <Label htmlFor="challenge-rating">Rating (1–5)</Label>
          <Input
            id="challenge-rating"
            type="number"
            min={1}
            max={5}
            value={challenge.rating ?? 1}
            onChange={(e) =>
              setChallenge({ rating: clampRating(+e.target.value) })
            }
          />
        </div>
      </div>

      {/* Roles */}
      <div className="space-y-2">
        <Label>Roles</Label>
        <div className="flex flex-wrap gap-2">
          {rolesList.map((role) => {
            const active = challenge.roles.includes(role);
            return (
              <Button
                key={role}
                type="button"
                variant={active ? "default" : "outline"}
                className="h-8 rounded-full"
                onClick={() => toggleRole(role)}
              >
                {role}
              </Button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          Pick one or more roles that best describe this challenge.
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="challenge-desc">Description</Label>
        <Textarea
          id="challenge-desc"
          rows={4}
          placeholder="Short summary (Markdown + curly tokens supported in other sections)."
          value={challenge.description}
          onChange={(e) => setChallenge({ description: e.target.value })}
        />
      </div>
    </div>
  );
}
