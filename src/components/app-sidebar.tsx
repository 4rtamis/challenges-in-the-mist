// src/components/app-sidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useUiStore, type SectionKey } from "@/store/uiStore";
import {
  Settings2,
  Tags,
  Shield,
  Layers,
  ListChecks,
  AlertTriangle,
  Info,
} from "lucide-react";

// forms
import BasicInfoForm from "@/editor/BasicInfoForm";
import MetaForm from "@/editor/MetaForm";
import LimitsForm from "@/editor/LimitsForm";
import TagsStatusesForm from "@/editor/TagsStatusesForm";
import MightForm from "@/editor/MightForm";
import SpecialFeaturesForm from "@/editor/SpecialFeaturesForm";
import ThreatsForm from "@/editor/ThreatsForm";

const NAV: {
  key: SectionKey;
  label: string;
  icon: React.ComponentType<any>;
}[] = [
  { key: "basic", label: "Basic Info", icon: Info },
  { key: "meta", label: "Meta", icon: Settings2 },
  { key: "limits", label: "Limits", icon: Shield },
  { key: "tags", label: "Tags & Statuses", icon: Tags },
  { key: "mights", label: "Might", icon: Layers },
  { key: "special", label: "Special Features", icon: ListChecks },
  { key: "threats", label: "Threats", icon: AlertTriangle },
];

export default function AppSidebar() {
  const { active, setActive } = useUiStore();
  const { state } = useSidebar(); // collapsed/open info if you want to react to it
  const activeKey: SectionKey | null = active
    ? (active.kind as SectionKey)
    : null;

  return (
    <Sidebar
      variant="inset"
      collapsible="icon" // desktop: pushes content; mobile: offcanvas automatically
      className="border-r"
    >
      <SidebarHeader>
        <div className="text-sm font-semibold">Editor</div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Sections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map(({ key, label, icon: Icon }) => {
                const selected = activeKey === key;
                return (
                  <SidebarMenuItem key={key}>
                    <SidebarMenuButton
                      asChild
                      isActive={selected}
                      onClick={() => setActive({ kind: key })}
                    >
                      <button
                        className={cn(
                          "w-full flex items-center gap-2",
                          selected && "font-medium"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="truncate">{label}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-1" />

        {/* Section content: render only the active form */}
        <ScrollArea className="px-2 pb-3 h-[calc(100vh-16rem)]">
          <div className="space-y-4">
            {(!activeKey || activeKey === "basic") && <BasicInfoForm />}
            {activeKey === "meta" && <MetaForm />}
            {activeKey === "limits" && <LimitsForm />}
            {activeKey === "tags" && <TagsStatusesForm />}
            {activeKey === "mights" && <MightForm />}
            {activeKey === "special" && <SpecialFeaturesForm />}
            {activeKey === "threats" && <ThreatsForm />}
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="text-xs text-muted-foreground px-3">
        Click items in the preview to jump here.
      </SidebarFooter>

      {/* Remove this rail if you truly want *zero* collapsed width.
         Keeping it improves discoverability. */}
      <SidebarRail />
    </Sidebar>
  );
}
