import { type LucideIcon } from 'lucide-react'
import * as React from 'react'

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'

export function NavSecondary({
    items,
    ...props
}: {
    items: {
        title: string
        href?: string
        onClick?: () => void
        icon: LucideIcon
    }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
    return (
        <SidebarGroup {...props}>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            {item.href ? (
                                <SidebarMenuButton asChild size="sm">
                                    <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            ) : (
                                <SidebarMenuButton asChild size="sm">
                                    <button
                                        type="button"
                                        onClick={item.onClick}
                                    >
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </button>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
