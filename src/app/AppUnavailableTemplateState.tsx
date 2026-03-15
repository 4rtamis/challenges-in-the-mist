export default function AppUnavailableTemplateState() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
            <h2 className="text-xl font-semibold">
                Template not available yet
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
                This template is listed in the sidebar but is not implemented
                yet.
            </p>
        </div>
    )
}
