import * as React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useChallengeStore } from "@/store/challengeStore";
import { getSampleChallenge } from "@/data/sampleChallenges";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilePlus2, Stars } from "lucide-react";

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

export default function NewDialog({ open, onOpenChange }: Props) {
  const { replaceChallenge } = useChallengeStore();
  const [choice, setChoice] = useState<"blank" | "sample">("blank");

  function close() {
    onOpenChange(false);
    // reset after animation
    setTimeout(() => setChoice("blank"), 150);
  }

  function createBlank() {
    replaceChallenge({
      name: "",
      description: "",
      rating: 1,
      roles: [],
      limits: [],
      special_features: [],
      tags_and_statuses: [],
      mights: [],
      threats: [],
      general_consequences: [],
      meta: {
        publication_type: "homebrew",
        source: "",
        authors: [],
        page: undefined,
      },
    } as any);
    toast.success("Blank challenge created.");
    close();
  }

  function createSample() {
    const sample = getSampleChallenge();
    replaceChallenge(sample as any);
    toast.success(`Loaded: "${sample.name}".`);
    close();
  }

  function onCreate() {
    if (choice === "blank") createBlank();
    else createSample();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => (v ? onOpenChange(true) : close())}
    >
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>New Challenge</DialogTitle>
          <DialogDescription>
            Start fresh or load a sample to see what the editor can do.
          </DialogDescription>
        </DialogHeader>

        <RadioGroup
          value={choice}
          onValueChange={(v) => setChoice(v as "blank" | "sample")}
          className="space-y-3"
        >
          <label className="flex items-start gap-3 rounded-md border p-3 hover:bg-muted/40 cursor-pointer">
            <RadioGroupItem value="blank" id="new-blank" />
            <div className="grid gap-1">
              <Label htmlFor="new-blank" className="flex items-center gap-2">
                <FilePlus2 className="h-4 w-4" />
                Blank challenge
              </Label>
              <p className="text-sm text-muted-foreground">
                An empty sheet with no roles, limits, tags, mights, or threats.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 rounded-md border p-3 hover:bg-muted/40 cursor-pointer">
            <RadioGroupItem value="sample" id="new-sample" />
            <div className="grid gap-1 w-full">
              <Label htmlFor="new-sample" className="flex items-center gap-2">
                <Stars className="h-4 w-4" />
                Sample:{" "}
                <span className="font-medium">Lantern-Warden of the Wilds</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                A wolf-spirit who guides beasts away from hunters with a
                spectral lantern. Demonstrates limits (incl. progress), tags &
                statuses (inline tokens), three levels of Might, threats &
                consequences (plus general ones), special features, and meta.
              </p>
            </div>
          </label>
        </RadioGroup>

        <DialogFooter>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button onClick={onCreate}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
