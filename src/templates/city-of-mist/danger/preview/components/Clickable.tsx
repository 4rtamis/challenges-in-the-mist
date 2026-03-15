import * as React from 'react'

export function ClickableSection({
    onClick,
    ariaLabel,
    children,
    overlayClassName = '',
}: {
    onClick: () => void
    ariaLabel: string
    children: React.ReactNode
    overlayClassName?: string
}) {
    return (
        <div className="relative group">
            <button
                type="button"
                onClick={onClick}
                aria-label={ariaLabel}
                className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />

            <div className="relative z-0">{children}</div>

            <div
                className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 ${overlayClassName}`}
                style={{ background: 'rgba(0,0,0,0.05)' }}
            />
        </div>
    )
}

export function handleClickableKeyDown(
    event: React.KeyboardEvent,
    onClick: () => void
) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onClick()
    }
}
