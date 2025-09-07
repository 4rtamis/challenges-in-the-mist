import { useChallengeStore } from "../store/challengeStore";
import { rolesList } from "../utils/constants";

export default function BasicInfoForm() {
  const { challenge, setChallenge } = useChallengeStore();

  const toggleRole = (role: string) => {
    const current = challenge.roles.includes(role);
    setChallenge({
      roles: current
        ? challenge.roles.filter((r) => r !== role)
        : [...challenge.roles, role],
    });
  };

  return (
    <div className="space-y-4">
      {/* Name */}
      <div>
        <label className="block font-semibold">Challenge Name</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={challenge.name}
          onChange={(e) => setChallenge({ name: e.target.value })}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-semibold">Description</label>
        <textarea
          className="w-full border p-2 rounded"
          rows={4}
          value={challenge.description}
          onChange={(e) => setChallenge({ description: e.target.value })}
        />
      </div>

      {/* Rating */}
      <div>
        <label className="block font-semibold">Rating (1–5)</label>
        <input
          type="number"
          min={1}
          max={5}
          className="w-20 border p-1 rounded"
          value={challenge.rating}
          onChange={(e) =>
            setChallenge({ rating: Math.max(1, Math.min(5, +e.target.value)) })
          }
        />
      </div>

      {/* Roles */}
      <div>
        <label className="block font-semibold">Roles</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {rolesList.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => toggleRole(role)}
              className={`px-3 py-1 rounded border ${
                challenge.roles.includes(role)
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
