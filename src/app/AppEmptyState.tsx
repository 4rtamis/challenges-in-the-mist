export default function AppEmptyState() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
            <img
                src="/lantern-logo.svg"
                alt="Lantern logo"
                className="mb-4 h-20 w-20"
            />
            <h2 className="text-xl font-semibold">Welcome to Lantern</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Pick a template in the left sidebar to open a new tab and start
                editing.
            </p>
            <div className="mt-6 max-w-2xl rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-left">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-700">
                    Early Development Notice
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    This app is an early development version and may contain
                    breaking changes in future updates.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                    It includes material that is copyright Son of Oak Game
                    Studio LLC and/or other authors. It must only be used for
                    personal playtesting purposes and must not be shared for the
                    time being.
                </p>
            </div>
        </div>
    )
}
