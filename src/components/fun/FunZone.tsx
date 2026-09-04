import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Image as ImageIcon } from "lucide-react";
import { funZoneConfig, photos } from "@/data/site";
import { FunActions, ActionType, ACTIONS } from "./FunActions";
import { FunCharacter } from "./FunCharacter";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { toast } from "sonner";

const DAMAGE_DESCRIPTIONS = [
  { level: 0, text: "Normal 🙂", detail: "No damage", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  { level: 1, text: "Small Hit 🩹", detail: "Tiny cheek scratch", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  { level: 2, text: "Bruised 😣", detail: "Cartoon cheek bruise", color: "text-orange-400 bg-orange-500/10 border-orange-500/30" },
  { level: 3, text: "Bandaged 🩹", detail: "Forehead cartoon bandage", color: "text-rose-400 bg-rose-500/10 border-rose-500/30" },
  { level: 4, text: "Heavy Damage 😵", detail: "Scratches & cross-bandages", color: "text-red-400 bg-red-500/10 border-red-500/30" },
  { level: 5, text: "MAX DAMAGE! 💫", detail: "Exaggerated cartoon state!", color: "text-purple-400 bg-purple-500/20 border-purple-500/50 animate-pulse" },
];

export function FunZone() {
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
  const [activeAction, setActiveAction] = useState<ActionType | null>(null);
  const [isReacting, setIsReacting] = useState(false);
  const [damageLevel, setDamageLevel] = useState<number>(0);
  const [triggerId, setTriggerId] = useState(0);

  // Allow switching photos from site gallery easily!
  const availableImages = [
    { src: funZoneConfig.characterImage, label: "Default Hero" },
    ...photos.slice(0, 5).map((p, idx) => ({
      src: p.image,
      label: p.caption || `Photo ${idx + 1}`,
    })),
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const currentImage = availableImages[currentImageIndex]?.src || funZoneConfig.characterImage;

  const handleSelectAction = (action: ActionType) => {
    setSelectedAction(action);
    const actDef = ACTIONS.find((a) => a.id === action);
    if (actDef) {
      toast.info(`${actDef.icon} ${actDef.label} selected — now tap the picture!`, {
        duration: 1800,
      });
    }
  };

  const handleTapCharacter = (clickPos: { x: number; y: number }) => {
    if (!selectedAction) {
      toast.warning("Please select an action from the toolbar below first!", {
        icon: "👇",
      });
      return;
    }

    // Trigger reaction
    setActiveAction(selectedAction);
    setIsReacting(true);
    setTriggerId((prev) => prev + 1);

    // Damaging actions increase damage level up to max 5
    if (selectedAction !== "love") {
      setDamageLevel((prev) => {
        const next = Math.min(prev + 1, 5);
        if (next === 5 && prev < 5) {
          toast.error("MAX DAMAGE REACHED! 💫 Bandages & bruises everywhere!", { duration: 2500 });
        }
        return next;
      });
    } else {
      // Love action does NOT increase damage. Soothes 1 level if damaged!
      setDamageLevel((prev) => {
        if (prev > 0) {
          toast.success("❤️ Love healed a bit of damage!", { duration: 1800 });
          return Math.max(0, prev - 1);
        }
        return 0;
      });
    }

    // Auto finish hit animation after 850ms, while damage overlays remain visible!
    setTimeout(() => {
      setIsReacting(false);
    }, 850);
  };

  const handleReset = () => {
    setSelectedAction(null);
    setActiveAction(null);
    setIsReacting(false);
    setDamageLevel(0);
    setTriggerId(0);
    toast.success("✨ Everything reset back to normal!", { duration: 1500 });
  };

  const handleNextPhoto = () => {
    setCurrentImageIndex((prev) => (prev + 1) % availableImages.length);
    // Reset damage level when switching character photo
    setDamageLevel(0);
  };

  const currentDamageInfo = DAMAGE_DESCRIPTIONS[damageLevel] || DAMAGE_DESCRIPTIONS[0];

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

          {/* Photo Switcher Button */}
          {availableImages.length > 1 && (
            <button
              onClick={handleNextPhoto}
              aria-label="Switch character photo"
              className="glass rounded-full px-3.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ImageIcon className="size-3.5" />
              <span>Switch Photo</span>
            </button>
          )}
        </div>

        <SectionHeading
          title={funZoneConfig.title}
          subtitle={funZoneConfig.subtitle}
        />
      </div>

      {/* Main Interactive Character Display */}
      <Reveal>
        <div className="flex flex-col items-center justify-center my-2">
          {/* Status Instruction Bar & Damage Level Meter */}
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

            {/* Damage Status Badge */}
            <div className={`inline-flex items-center gap-1.5 glass px-3 py-1 rounded-full text-xs font-bold border ${currentDamageInfo.color}`}>
              <span>Damage Lvl {damageLevel}/5:</span>
              <span>{currentDamageInfo.text}</span>
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
          />
        </div>
      </Reveal>
    </section>
  );
}
