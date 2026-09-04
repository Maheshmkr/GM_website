import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Sparkles } from "lucide-react";
import { funZoneConfig } from "@/data/site";
import { FunActions, ActionType, ACTIONS } from "./FunActions";
import { FunCharacter } from "./FunCharacter";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { toast } from "sonner";

interface FunZoneStageItem {
  _id?: string;
  stage: number;
  title: string;
  filename: string;
  fileId: string;
  url: string;
}

const STAGE_INFO = [
  {
    stage: 1,
    title: "Stage 1 — Normal",
    badge: "Normal 🙂",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  },
  {
    stage: 2,
    title: "Stage 2 — Small Injury",
    badge: "Small Hit 🩹",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  },
  {
    stage: 3,
    title: "Stage 3 — Bruise",
    badge: "Bruised 😣",
    color: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  },
  {
    stage: 4,
    title: "Stage 4 — Bandage",
    badge: "Bandaged 🩹",
    color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
  },
  {
    stage: 5,
    title: "Stage 5 — Maximum Injury",
    badge: "MAX DAMAGE! 💫",
    color: "text-purple-400 bg-purple-500/20 border-purple-500/50 animate-pulse",
  },
];

export function FunZone() {
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
  const [activeAction, setActiveAction] = useState<ActionType | null>(null);
  const [isReacting, setIsReacting] = useState(false);
  const [damageLevel, setDamageLevel] = useState<number>(0); // 0 = Stage 1, 1 = Stage 2, 2 = Stage 3, 3 = Stage 4, 4 = Stage 5
  const [triggerId, setTriggerId] = useState(0);

  // Fetch admin configured 5 stage images from backend
  const { data: stages = [] } = useQuery<FunZoneStageItem[]>({
    queryKey: ["fun-stages"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/fun/stages");
        if (!res.ok) return [];
        return await res.json();
      } catch (err) {
        console.error("Error fetching fun zone stages:", err);
        return [];
      }
    },
  });

  // Resolve current active stage and its admin-uploaded image
  const currentStageInfo = STAGE_INFO[damageLevel] || STAGE_INFO[0];
  const uploadedStage = stages.find((s) => s.stage === currentStageInfo.stage);
  const currentImage = uploadedStage?.url || funZoneConfig.characterImage;

  const handleSelectAction = (action: ActionType) => {
    setSelectedAction(action);
    const actDef = ACTIONS.find((a) => a.id === action);
    if (actDef) {
      toast.info(`${actDef.icon} ${actDef.label} selected — now tap the picture!`, {
        duration: 1800,
      });
    }
  };

  const handleTapCharacter = () => {
    if (!selectedAction) {
      toast.warning("Please select an action from the toolbar below first!", {
        icon: "👇",
      });
      return;
    }

    // Trigger visual reaction
    setActiveAction(selectedAction);
    setIsReacting(true);
    setTriggerId((prev) => prev + 1);

    // Damaging actions advance through Stage 1 -> 2 -> 3 -> 4 -> 5 (max index 4)
    if (selectedAction !== "love") {
      setDamageLevel((prev) => {
        const next = Math.min(prev + 1, 4);
        if (next === 4 && prev < 4) {
          toast.error("Stage 5 — Maximum Injury reached! 💫", { duration: 2500 });
        }
        return next;
      });
    } else {
      // Love action heals and steps backward towards Stage 1 (Normal)
      setDamageLevel((prev) => {
        if (prev > 0) {
          const next = Math.max(0, prev - 1);
          const healedStage = STAGE_INFO[next];
          toast.success(`❤️ Love healed! Back to ${healedStage?.title || "Stage 1"} ✨`, {
            duration: 2000,
          });
          return next;
        }
        toast.success("❤️ LOVE! ✨ All healed & happy!", { duration: 1800 });
        return 0;
      });
    }

    // Auto finish reaction impact state after 850ms
    setTimeout(() => {
      setIsReacting(false);
    }, 850);
  };

  const handleReset = () => {
    setSelectedAction(null);
    setActiveAction(null);
    setIsReacting(false);
    setDamageLevel(0); // Reset back to Stage 1
    setTriggerId(0);
    toast.success("↻ Reset back to Stage 1 (Normal)!", { duration: 1500 });
  };

  return (
    <section className="section-shell relative py-6 lg:py-10 min-h-[85vh] flex flex-col justify-between">
      {/* Top Header & Navigation */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="glass rounded-full px-4 py-2 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-all flex items-center gap-2 hover:scale-105"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        <SectionHeading
          title={funZoneConfig.title}
          subtitle={funZoneConfig.subtitle}
        />
      </div>

      {/* Main Interactive Character Display */}
      <Reveal>
        <div className="flex flex-col items-center justify-center my-2">
          {/* Status Instruction Bar & Stage Indicator */}
          <div className="mb-2 flex flex-col sm:flex-row items-center gap-2 text-center">
            {selectedAction ? (
              <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold text-primary animate-pulse border-primary/40">
                <Sparkles className="size-4 text-primary animate-spin" />
                <span>
                  {ACTIONS.find((a) => a.id === selectedAction)?.icon}{" "}
                  {ACTIONS.find((a) => a.id === selectedAction)?.label} selected — tap the photo!
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs font-medium text-muted-foreground">
                <span>👇 Choose an action & tap the picture!</span>
              </div>
            )}

            {/* Stage Status Badge */}
            <div
              className={`inline-flex items-center gap-1.5 glass px-3 py-1 rounded-full text-xs font-bold border ${currentStageInfo.color}`}
            >
              <span>{currentStageInfo.title}</span>
            </div>
          </div>

          <FunCharacter
            imageSrc={currentImage}
            characterName={funZoneConfig.characterName}
            selectedAction={selectedAction}
            isReacting={isReacting}
            activeAction={activeAction}
            damageLevel={damageLevel}
            onTap={handleTapCharacter}
            triggerId={triggerId}
          />
        </div>
      </Reveal>

      {/* Action Toolbar & Controls */}
      <Reveal>
        <div className="w-full max-w-xl mx-auto mt-2">
          <FunActions
            selectedAction={selectedAction}
            onSelectAction={handleSelectAction}
            onReset={handleReset}
            isReacting={isReacting}
            damageLevel={damageLevel}
          />
        </div>
      </Reveal>
    </section>
  );
}
