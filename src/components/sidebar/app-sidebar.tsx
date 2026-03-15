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
import { templatesByGame } from '@/core/templates/registry'
import { useWorkspaceStore } from '@/core/workspace/store'

import FeedbackDialog from '@/app/FeedbackDialog'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Minus, Plus, Send } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavSecondary } from './nav-secondary'
import { ProjectSwitcher } from './project-switcher'

const data = {
    projects: [
        {
            name: 'Lantern',
            logo: '/lantern-logo.svg',
            description: 'Template editor',
            href: 'https://lantern.ravenloft.fr',
            current: true,
        },
        {
            name: 'Mistdraw',
            logo: '/assets/images/mistdraw-logo.svg',
            description: 'Whiteboard-based VTT',
            href: 'https://mistrdaw.ravenloft.fr',
            current: false,
        },
        {
            name: 'Brumes',
            logo: '/assets/images/brumes-logo.svg',
            description: 'Obsidian plugin',
            href: 'https://brumes.ravenloft.fr',
            current: false,
        },
        {
            name: 'Archives',
            logo: '/assets/images/archives-logo.svg',
            description: 'Blog template',
            href: 'https://archives.ravenloft.fr',
            current: false,
        },
    ],
    navSecondary: [
        /*{
            title: 'Support',
            href: 'https://discord.gg/jH686wH',
            icon: LifeBuoy,
        },*/
        {
            title: 'Feedback',
            icon: Send,
        },
    ],
}

export function AppSidebar() {
    const navigate = useNavigate()
    const createTab = useWorkspaceStore((s) => s.createTab)
    const activeTabId = useWorkspaceStore((s) => s.activeTabId)
    const tabs = useWorkspaceStore((s) => s.tabs)
    const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)

    const activeTemplateId =
        tabs.find((tab) => tab.id === activeTabId)?.templateId ?? null

    const navSecondaryItems = data.navSecondary.map((item) =>
        item.title === 'Feedback'
            ? {
                  ...item,
                  onClick: () => setFeedbackDialogOpen(true),
              }
            : item
    )

    return (
        <>
            <Sidebar variant="sidebar">
                <SidebarHeader>
                    <ProjectSwitcher projects={data.projects} />
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarMenu>
                            {templatesByGame.map((group) => (
                                <Collapsible
                                    key={group.gameId}
                                    defaultOpen={group.gameId === 'legend'}
                                    className="group/collapsible"
                                >
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton>
                                                {group.gameLabel}
                                                <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                                                <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {group.templates.map(
                                                    (template) => (
                                                        <SidebarMenuSubItem
                                                            key={template.id}
                                                        >
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                isActive={
                                                                    activeTemplateId ===
                                                                    template.id
                                                                }
                                                            >
                                                                <button
                                                                    type="button"
                                                                    className="flex w-full items-center justify-between"
                                                                    disabled={
                                                                        !template.implemented
                                                                    }
                                                                    onClick={() => {
                                                                        const tabId =
                                                                            createTab(
                                                                                template.id
                                                                            )
                                                                        if (
                                                                            !tabId
                                                                        )
                                                                            return
                                                                        navigate(
                                                                            `/tabs/${tabId}`
                                                                        )
                                                                    }}
                                                                >
                                                                    <span>
                                                                        {
                                                                            template.label
                                                                        }
                                                                    </span>
                                                                    {!template.implemented && (
                                                                        <span className="text-[8px] opacity-65 uppercase tracking-wide">
                                                                            {template.comingSoonLabel ||
                                                                                'Coming soon'}
                                                                        </span>
                                                                    )}
                                                                </button>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    )
                                                )}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                    <NavSecondary
                        items={navSecondaryItems}
                        className="mt-auto"
                    />
                </SidebarContent>
                <SidebarFooter>
                    <div className="flex items-center justify-center text-xs text-center">
                        Created by 4rtamis <br />
                    </div>
                </SidebarFooter>
            </Sidebar>

            <FeedbackDialog
                open={feedbackDialogOpen}
                onOpenChange={setFeedbackDialogOpen}
            />
        </>
    )
}
