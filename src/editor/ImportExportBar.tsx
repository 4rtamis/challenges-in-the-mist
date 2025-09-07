import { useRef, useState } from "react";
import { useChallengeStore } from "../store/challengeStore";
import { exportToTOML, importFromTOMLWithWarnings } from "../utils/tomlIO";
import { slugify } from "../utils/strings";
import { Download, Upload, Copy, AlertTriangle } from "lucide-react";

export default function ImportExportBar() {
  const { challenge, replaceChallenge } = useChallengeStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  function downloadText(filename: string, text: string) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function handleExport() {
    try {
      const toml = exportToTOML(challenge);
      const name = slugify(challenge.name);
      downloadText(`${name}.toml`, toml);
      setMsg("Exported TOML.");
      setErr(null);
      setWarnings([]);
    } catch (e: any) {
      setErr(e?.message || "Failed to export TOML.");
      setMsg(null);
    }
  }

  async function handleCopy() {
    try {
      const toml = exportToTOML(challenge);
      await navigator.clipboard.writeText(toml);
      setMsg("Copied TOML to clipboard.");
      setErr(null);
      setWarnings([]);
    } catch (e: any) {
      setErr(e?.message || "Clipboard copy failed.");
      setMsg(null);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || "");
        const { challenge: imported, warnings } =
          importFromTOMLWithWarnings(text);

        const ok = window.confirm(
          `Replace the current challenge with "${imported.name || "Imported Challenge"}"?`
        );
        if (!ok) return;

        replaceChallenge(imported);
        setMsg("Imported TOML.");
        setErr(null);
        setWarnings(warnings);
      } catch (errAny: any) {
        setErr(`Failed to parse/validate TOML:\n${errAny?.message || errAny}`);
        setMsg(null);
        setWarnings([]);
      } finally {
        if (fileRef.current) fileRef.current.value = "";
      }
    };
    reader.onerror = () => {
      setErr("Failed to read file.");
      setMsg(null);
      setWarnings([]);
    };
    reader.readAsText(f);
  }

  return (
    <div className="flex flex-col gap-2 items-stretch">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <input
          ref={fileRef}
          type="file"
          accept=".toml,text/plain"
          className="hidden"
          onChange={onFileChange}
        />

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded border bg-white hover:bg-slate-50"
          title="Import .toml"
        >
          <Upload size={16} /> Import TOML
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded border bg-white hover:bg-slate-50"
          title="Copy .toml to clipboard"
        >
          <Copy size={16} /> Copy TOML
        </button>

        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          title="Download .toml"
        >
          <Download size={16} /> Export TOML
        </button>
      </div>

      {(msg || err) && (
        <div
          className={`${err ? "text-red-700" : "text-green-700"} text-sm whitespace-pre-wrap`}
        >
          {err || msg}
        </div>
      )}

      {warnings.length > 0 && (
        <div className="text-amber-700 text-sm flex items-start gap-2">
          <AlertTriangle size={16} className="mt-0.5" />
          <div>
            <div className="font-medium">Imported with warnings:</div>
            <ul className="list-disc ml-5">
              {warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
