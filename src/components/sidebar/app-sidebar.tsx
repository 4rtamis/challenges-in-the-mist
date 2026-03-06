import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar'

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'

import { LifeBuoy, Minus, Plus, Send } from 'lucide-react'
import { NavSecondary } from './nav-secondary'
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

    navMain: [
        {
            title: 'City of Mist',
            url: '#',
            items: [
                {
                    title: 'Danger',
                    url: '#',
                },
                {
                    title: 'Custom Move',
                    url: '#',
                },
                {
                    title: 'Iceberg',
                    url: '#',
                },
                {
                    title: 'Theme Kit',
                    url: '#',
                },
            ],
        },
        {
            title: 'Legend in the Mist',
            url: '#',
            items: [
                {
                    title: 'Challenge',
                    url: '#',
                },
                {
                    title: 'Journey',
                    url: '#',
                },
                {
                    title: 'Story Theme',
                    url: '#',
                },
                {
                    title: 'Theme Kit',
                    url: '#',
                    isActive: false,
                },
            ],
        },
        {
            title: ':Otherscape',
            url: '#',
            items: [
                {
                    title: 'Challenge',
                    url: '#',
                },
                {
                    title: 'Theme Kit',
                    url: '#',
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: 'Support',
            url: '#',
            icon: LifeBuoy,
        },
        {
            title: 'Feedback',
            url: '#',
            icon: Send,
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
                <SidebarGroup>
                    <SidebarMenu>
                        {data.navMain.map((item, index) => (
                            <Collapsible
                                key={item.title}
                                defaultOpen={index === 1}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton>
                                            {item.title}{' '}
                                            <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                                            <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    {item.items?.length ? (
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items.map((item) => (
                                                    <SidebarMenuSubItem
                                                        key={item.title}
                                                    >
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={
                                                                item.isActive
                                                            }
                                                        >
                                                            <a href={item.url}>
                                                                {item.title}
                                                            </a>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    ) : null}
                                </SidebarMenuItem>
                            </Collapsible>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <div className="flex justify-center items-center text-xs">
                    Created by 4rtamis
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
