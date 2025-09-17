import { useChallengeStore } from "@/store/challengeStore";
import {
  useUIStore,
  shouldShow,
  groupShouldShow,
  type SectionId,
} from "@/store/uiStore";

export function SectionGate({
  id,
  children,
}: {
  id: SectionId;
  children: React.ReactNode;
}) {
  const { challenge } = useChallengeStore();
  // subscribe to UI store so changes re-render
  const ui = useUIStore();
  if (!shouldShow(challenge, id, ui)) return null;
  return <>{children}</>;
}

export function SectionGroupGate({
  ids,
  children,
}: {
  ids: SectionId[];
  children: React.ReactNode;
}) {
  const { challenge } = useChallengeStore();
  // subscribe to UI store so changes re-render
  const ui = useUIStore();
  if (!groupShouldShow(challenge, ids, ui)) return null;
  return <>{children}</>;
}
