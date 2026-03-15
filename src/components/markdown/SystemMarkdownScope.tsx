import { EDITOR_TOKEN_SCOPE_CLASS } from '@/core/gameThemes'
import { cn } from '@/lib/utils'
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

type SystemMarkdownScopeProps<T extends ElementType> = {
    as?: T
    children: ReactNode
    className?: string
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>

export function SystemMarkdownScope<T extends ElementType = 'div'>({
    as,
    className,
    children,
    ...props
}: SystemMarkdownScopeProps<T>) {
    const Component = (as ?? 'div') as ElementType

    return (
        <Component
            className={cn(EDITOR_TOKEN_SCOPE_CLASS, className)}
            {...props}
        >
            {children}
        </Component>
    )
}
