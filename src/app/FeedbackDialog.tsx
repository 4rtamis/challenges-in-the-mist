import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Copy, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

type FeedbackContext = {
    viewport: string
    userAgent: string
    appVersion: string
    capturedAt: string
}

function captureFeedbackContext(): FeedbackContext {
    if (typeof window === 'undefined') {
        return {
            viewport: 'Unavailable',
            userAgent: 'Unavailable',
            appVersion: __APP_VERSION__,
            capturedAt: 'Unavailable',
        }
    }

    return {
        viewport: `${window.innerWidth} x ${window.innerHeight}`,
        userAgent: window.navigator.userAgent,
        appVersion: __APP_VERSION__,
        capturedAt: new Date().toISOString(),
    }
}

function formatFeedbackContext(context: FeedbackContext) {
    return [
        `Viewport: ${context.viewport}`,
        `User-Agent: ${context.userAgent}`,
        `App version: ${context.appVersion}`,
        `Date and time: ${context.capturedAt}`,
    ].join('\n')
}

export default function FeedbackDialog({ open, onOpenChange }: Props) {
    const [feedbackContext, setFeedbackContext] = useState<FeedbackContext>(
        captureFeedbackContext
    )

    useEffect(() => {
        if (!open) return

        const updateContext = () => {
            setFeedbackContext(captureFeedbackContext())
        }

        updateContext()
        window.addEventListener('resize', updateContext)

        return () => {
            window.removeEventListener('resize', updateContext)
        }
    }, [open])

    const contextText = formatFeedbackContext(feedbackContext)

    async function copyFeedbackContext() {
        try {
            await navigator.clipboard.writeText(contextText)
            toast.success('Feedback context copied.')
        } catch {
            toast.error('Could not copy feedback context.')
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[680px]">
                <DialogHeader>
                    <DialogTitle>Send feedback on Discord</DialogTitle>
                    <DialogDescription>
                        Reach out to <strong>@4rtamis</strong> on the City of
                        Mist Discord server to send feedback about the app.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 text-sm">
                    <p className="text-muted-foreground">
                        As there is no tutorial yet, the most useful feedback is
                        what felt intuitive, what did not, and where the app was
                        unclear.
                    </p>

                    <p className="text-muted-foreground">
                        Smartphone feedback is not useful for now because a
                        responsive small-device view has not been developed yet.
                    </p>

                    <div className="rounded-lg border bg-muted/30 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="font-medium">
                                    Include this context with your feedback
                                </h3>
                                <p className="text-muted-foreground text-xs">
                                    Copy and paste this block so the report has
                                    the browser and app details I need.
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={copyFeedbackContext}
                            >
                                <Copy />
                                Copy context
                            </Button>
                        </div>

                        <textarea
                            readOnly
                            value={contextText}
                            className="mt-3 min-h-28 w-full rounded-md border bg-background px-3 py-2 font-mono text-xs leading-5 text-foreground"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                    <Button asChild>
                        <a
                            href="https://discord.gg/jH686wH"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Join Discord
                            <ExternalLink />
                        </a>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
