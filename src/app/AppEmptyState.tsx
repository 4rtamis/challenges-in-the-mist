export default function AppEmptyState() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
            <h2 className="text-xl font-semibold">Welcome to Lantern</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Pick a template in the left sidebar to open a new tab and start
                editing.
            </p>
        </div>
    )
}
