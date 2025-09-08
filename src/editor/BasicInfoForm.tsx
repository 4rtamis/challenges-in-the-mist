// src/editor/BasicInfoForm.tsx
import { useChallengeStore } from "../store/challengeStore";
import { rolesList } from "../utils/constants";

// shadcn/ui
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";

export default function BasicInfoForm() {
  const { challenge, setChallenge } = useChallengeStore();

  const toggleRole = (role: string) => {
    const has = challenge.roles.includes(role);
    setChallenge({
      roles: has
        ? challenge.roles.filter((r) => r !== role)
        : [...challenge.roles, role],
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Info</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Name */}
        <div className="grid gap-2">
          <Label htmlFor="ch-name">Challenge Name</Label>
          <Input
            id="ch-name"
            value={challenge.name}
            onChange={(e) => setChallenge({ name: e.target.value })}
            placeholder="The Heap-Thing"
          />
        </div>

        {/* Description */}
        <div className="grid gap-2">
          <Label htmlFor="ch-desc">Description</Label>
          <Textarea
            id="ch-desc"
            rows={4}
            value={challenge.description ?? ""}
            onChange={(e) => setChallenge({ description: e.target.value })}
            placeholder="A shambling pile of discarded items with a maw-like opening…"
          />
          <p className="text-xs text-muted-foreground">
            Supports **bold**, _italic_, and your curly tokens in preview.
          </p>
        </div>

        <Separator />

        {/* Rating */}
        <div className="flex items-center gap-3">
          <Label htmlFor="ch-rating" className="min-w-[72px]">
            Rating
          </Label>
          <Input
            id="ch-rating"
            type="number"
            inputMode="numeric"
            min={1}
            max={5}
            className="w-24"
            value={challenge.rating}
            onChange={(e) => {
              const n = Math.max(
                1,
                Math.min(5, Math.floor(Number(e.target.value) || 1))
              );
              setChallenge({ rating: n });
            }}
          />
          <span className="text-sm text-muted-foreground">(1–5)</span>
        </div>

        {/* Roles */}
        <div className="space-y-2">
          <Label>Roles</Label>
          <div className="flex flex-wrap gap-2">
            {rolesList.map((role) => {
              const selected = challenge.roles.includes(role);
              return (
                <Button
                  key={role}
                  type="button"
                  size="sm"
                  variant={selected ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => toggleRole(role)}
                >
                  {role}
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
