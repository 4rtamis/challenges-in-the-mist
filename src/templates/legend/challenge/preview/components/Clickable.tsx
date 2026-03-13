// src/preview/components/Clickable.tsx
import * as React from 'react'

export function ClickableSection({
    onClick,
    ariaLabel,
    children,
    //hint = "Edit",
    overlayClassName = '',
}: {
    onClick: () => void
    ariaLabel: string
    children: React.ReactNode
    hint?: string
    overlayClassName?: string
}) {
    return (
        <div className="relative group">
            {/* click target (above overlay) */}
            <button
                type="button"
                onClick={onClick}
                aria-label={ariaLabel}
                className="absolute cursor-pointer inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />

            {/* content */}
            <div className="relative z-0">{children}</div>

            {/* hover overlay */}
            <div
                className={`pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity ${overlayClassName}`}
                style={{ background: 'rgba(0,0,0,0.05)' }}
            />

            {/* hint pill */}
            {/*<div className="pointer-events-none absolute right-2 top-2 z-20 text-[11px] rounded border bg-white/90 px-2 py-0.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
        {hint}
      </div>*/}
        </div>
    )
}
