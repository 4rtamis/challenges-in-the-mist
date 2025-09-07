import { useChallengeStore } from "../store/challengeStore";

export default function MetaForm() {
  const { challenge, updateMeta } = useChallengeStore();
  const m = challenge.meta ?? {};

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Meta</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-600">Sourcebook</label>
          <input
            type="text"
            className="w-full border rounded px-2 py-1"
            value={m.sourcebook ?? ""}
            onChange={(e) => updateMeta({ sourcebook: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Chapter</label>
          <input
            type="text"
            className="w-full border rounded px-2 py-1"
            value={m.chapter ?? ""}
            onChange={(e) => updateMeta({ chapter: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Page</label>
          <input
            type="number"
            min={1}
            className="w-full border rounded px-2 py-1"
            value={m.page ?? ""}
            onChange={(e) =>
              updateMeta({
                page: e.target.value
                  ? Math.max(1, Math.floor(+e.target.value))
                  : undefined,
              })
            }
          />
        </div>

        <div className="flex items-center gap-2 pt-6">
          <input
            id="meta-official"
            type="checkbox"
            checked={!!m.is_official}
            onChange={(e) => updateMeta({ is_official: e.target.checked })}
          />
          <label htmlFor="meta-official" className="text-sm">
            Official
          </label>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Tip: Meta is optional and used for attribution/search. It's preserved on
        import/export.
      </p>
    </div>
  );
}
