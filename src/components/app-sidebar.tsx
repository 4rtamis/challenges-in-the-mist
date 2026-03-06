import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from '@/components/ui/sidebar'

import { ProjectSwitcher } from './project-switcher'

const data = {
    projects: [
        {
            name: 'Lantern',
            logo: 'lantern-logo.svg',
            description: 'Challenge maker',
            href: 'https://lantern.ravenloft.fr',
            current: true,
        },
        {
            name: 'Mistdraw',
            logo: 'assets/images/mistdraw-logo.svg',
            description: 'Whiteboard-based VTT',
            href: 'https://mistrdaw.ravenloft.fr',
            current: false,
        },
        {
            name: 'Brumes',
            logo: 'assets/images/brumes-logo.svg',
            description: 'Obsidian plugin',
            href: 'https://brumes.ravenloft.fr',
            current: false,
        },
        {
            name: 'Archives',
            logo: 'assets/images/archives-logo.svg',
            description: 'Blog template',
            href: 'https://archives.ravenloft.fr',
            current: false,
        },
    ],
}

export function AppSidebar() {
    return (
        <Sidebar variant="sidebar">
            <SidebarHeader>
                <ProjectSwitcher projects={data.projects} />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup />
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}
