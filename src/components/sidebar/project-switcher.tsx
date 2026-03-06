import { ChevronsUpDown, ExternalLink } from 'lucide-react'
import * as React from 'react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'

export function ProjectSwitcher({
    projects,
}: {
    projects: {
        name: string
        logo: string
        description: string
        href: string
        current: boolean
    }[]
}) {
    const { isMobile } = useSidebar()
    const [activeProject, setActiveProject] = React.useState(projects[0])

    if (!activeProject) {
        return null
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-secondary text-sidebar-primary-foreground">
                                <img
                                    src={activeProject.logo}
                                    alt={`${activeProject.name} logo`}
                                    className="size-6"
                                />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {activeProject.name}
                                </span>
                                <span className="truncate text-xs">
                                    {activeProject.description}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? 'bottom' : 'right'}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Explore other projects
                        </DropdownMenuLabel>
                        {projects.map((project) => (
                            <DropdownMenuItem key={project.name} className="">
                                <a
                                    href={project.href}
                                    className="flex gap-2 p-2 items-center w-full"
                                >
                                    <div className="flex size-6 items-center justify-center rounded-md ">
                                        <img
                                            src={project.logo}
                                            alt={`${project.name} logo`}
                                            className="size-6 shrink-0"
                                        />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span>{project.name}</span>
                                        <span className="truncate text-xs">
                                            {project.description}
                                        </span>
                                    </div>
                                    {!project.current && (
                                        <ExternalLink className="ml-auto h-4 w-4 opacity-50" />
                                    )}
                                </a>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
