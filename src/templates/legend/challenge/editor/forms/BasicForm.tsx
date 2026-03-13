// src/editor/BasicForm.tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { rolesList } from '@/utils/constants'
import { useChallengeStore } from '../../hooks'

export default function BasicForm() {
    const { challenge, setChallenge } = useChallengeStore()

    const clampRating = (n: number) =>
        Math.max(1, Math.min(5, Math.floor(n || 1)))

    const toggleRole = (role: string) => {
        const has = challenge.roles.includes(role)
        setChallenge({
            roles: has
                ? challenge.roles.filter((r) => r !== role)
                : [...challenge.roles, role],
        })
    }

    return (
        <div className="space-y-4">
            {/* Name + Rating */}
            <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                <div className="grid gap-1">
                    <Label htmlFor="challenge-name">Challenge name</Label>
                    <Input
                        id="challenge-name"
                        className="h-8 px-2 text-sm"
                        placeholder="e.g., The Heap Thing"
                        value={challenge.name}
                        onChange={(e) =>
                            setChallenge({
                                name: e.target.value || 'Untitled Challenge',
                            })
                        }
                    />
                </div>

                <div className="grid w-[88px] gap-1">
                    <Label htmlFor="challenge-rating">Rating (1-5)</Label>
                    <Input
                        id="challenge-rating"
                        className="h-8 px-2 text-sm"
                        type="number"
                        min={1}
                        max={5}
                        value={challenge.rating ?? 1}
                        onChange={(e) =>
                            setChallenge({
                                rating: clampRating(+e.target.value),
                            })
                        }
                    />
                </div>
            </div>

            {/* Roles */}
            <div className="space-y-2">
                <Label>Roles</Label>
                <div className="flex flex-wrap gap-1.5">
                    {rolesList.map((role) => {
                        const active = challenge.roles.includes(role)
                        return (
                            <Button
                                key={role}
                                type="button"
                                variant={active ? 'default' : 'outline'}
                                size="sm"
                                className="h-7 rounded-full px-2.5 text-xs"
                                onClick={() => toggleRole(role)}
                            >
                                {role}
                            </Button>
                        )
                    })}
                </div>
                <p className="text-xs text-muted-foreground">
                    Pick one or more roles that best describe this challenge
                    (see <i>Legend in the Mist - Vol. II - The Narrator</i>, p.
                    110)
                </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="challenge-desc">Description</Label>
                <Textarea
                    id="challenge-desc"
                    rows={4}
                    className="px-2 py-1 text-sm"
                    placeholder="Write a short summary of the challenge here..."
                    value={challenge.description}
                    onChange={(e) =>
                        setChallenge({ description: e.target.value })
                    }
                />
            </div>
        </div>
    )
}
