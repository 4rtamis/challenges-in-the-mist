import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { useUIStore, type SectionId } from "@/store/uiStore";

export default function ViewMenu({ children }: { children: React.ReactNode }) {
  const {
    hidden,
    toggleHidden,
    autoHideEmpty,
    setAutoHideEmpty,
    zoom,
    setZoom,
    background,
    setBackground,
    resetViewPrefs,
  } = useUIStore();

  const sectionItems: { id: SectionId; label: string }[] = [
    { id: "rolesDesc", label: "Roles & Description" },
    { id: "tagsStatuses", label: "Tags & Statuses" },
    { id: "might", label: "Might" },
    { id: "specialFeatures", label: "Special Features" },
    { id: "meta", label: "Meta footer" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>View</DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          checked={autoHideEmpty}
          onCheckedChange={(v) => setAutoHideEmpty(!!v)}
        >
          Auto-hide empty sections
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Show sections</DropdownMenuLabel>
        {sectionItems.map((s) => (
          <DropdownMenuCheckboxItem
            key={s.id}
            checked={!hidden[s.id]}
            onCheckedChange={() => toggleHidden(s.id)}
          >
            {s.label}
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Zoom</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => setZoom(0.75)}>
              75%
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setZoom(1)}>100%</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setZoom(1.25)}>
              125%
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setZoom(1.5)}>
              150%
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Background</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={background}
              onValueChange={(v) => setBackground(v as any)}
            >
              <DropdownMenuRadioItem value="parchment">
                Parchment
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="plain">Plain</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="transparent">
                Transparent
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={resetViewPrefs}>Reset view</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
