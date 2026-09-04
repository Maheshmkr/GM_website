interface DamageOverlayProps {
  damageLevel: number; // 0 to 5
}

export function DamageOverlay({ damageLevel }: DamageOverlayProps) {
  if (damageLevel <= 0) return null;

  return (
    <div className="aria-hidden pointer-events-none absolute inset-0 z-15 overflow-hidden rounded-2xl select-none">
      {/* LEVEL 1: Small Cheek Scratch & Redness */}
      {damageLevel >= 1 && (
        <>
          {/* Subtle blush/redness on right cheek */}
          <div className="absolute top-[48%] right-[18%] w-14 h-14 rounded-full bg-rose-600/40 blur-md" />
          {/* Small cartoon scratch on right cheek */}
          <div className="absolute top-[50%] right-[22%] w-10 h-6 flex items-center justify-center -rotate-12 drop-shadow">
            <svg viewBox="0 0 40 24" className="w-full h-full text-red-500 fill-none stroke-current stroke-[2.5]">
              <path d="M 5,12 Q 15,4 25,12 T 35,8" strokeLinecap="round" />
              <path d="M 12,18 L 24,6" strokeLinecap="round" />
            </svg>
          </div>
        </>
      )}

      {/* LEVEL 2: Cartoon Bruise & Additional Scratch */}
      {damageLevel >= 2 && (
        <>
          {/* Cartoon purple/blue bruise on left cheek */}
          <div className="absolute top-[42%] left-[18%] w-16 h-16 rounded-full bg-gradient-to-br from-purple-700/60 via-indigo-600/50 to-rose-600/40 blur-[2px] border border-purple-400/40 shadow-inner" />
          {/* Small scratch mark on left cheek */}
          <div className="absolute top-[46%] left-[22%] w-9 h-6 rotate-12">
            <svg viewBox="0 0 30 20" className="w-full h-full text-amber-300 stroke-current stroke-2 fill-none">
              <path d="M 4,6 L 24,14" strokeLinecap="round" />
              <path d="M 8,16 L 22,4" strokeLinecap="round" />
            </svg>
          </div>
        </>
      )}

      {/* LEVEL 3: Forehead Cartoon Bandage */}
      {damageLevel >= 3 && (
        <>
          {/* Forehead Bandage */}
          <div className="absolute top-[18%] left-[30%] w-[40%] h-[11%] -rotate-6 bg-gradient-to-r from-amber-100 via-stone-100 to-amber-100 border-2 border-amber-300/90 rounded-lg shadow-lg flex items-center justify-center">
            {/* Bandage padding cross hatch */}
            <div className="w-7 h-full bg-amber-200/70 border-x border-amber-300/70 flex items-center justify-center">
              <span className="text-[11px] font-bold text-amber-800/80 select-none">✚</span>
            </div>
          </div>
        </>
      )}

      {/* LEVEL 4: Cheek Cross-Bandage & Chin Scratches */}
      {damageLevel >= 4 && (
        <>
          {/* Cheek X Bandage */}
          <div className="absolute top-[54%] right-[16%] w-10 h-10 flex items-center justify-center">
            <div className="absolute w-9 h-3.5 bg-amber-100 border-2 border-amber-300/90 rounded rotate-45 shadow-md" />
            <div className="absolute w-9 h-3.5 bg-amber-100 border-2 border-amber-300/90 rounded -rotate-45 shadow-md" />
          </div>
          {/* Chin scratches */}
          <div className="absolute top-[72%] left-[40%] w-14 h-7 opacity-90">
            <svg viewBox="0 0 40 20" className="w-full h-full text-rose-500 fill-none stroke-current stroke-[2.5]">
              <path d="M 6,10 L 18,14" strokeLinecap="round" />
              <path d="M 22,6 L 34,12" strokeLinecap="round" />
            </svg>
          </div>
        </>
      )}

      {/* LEVEL 5: MAX DAMAGE (Cartoon Cross Patch, Dizzy Stars Ring, Sweat Drop) */}
      {damageLevel >= 5 && (
        <>
          {/* Dizzy spinning stars above head */}
          <div className="absolute top-[2%] inset-x-0 flex justify-center items-center gap-2 animate-bounce">
            <span className="text-xl animate-spin">💫</span>
            <span className="text-2xl animate-pulse">⭐</span>
            <span className="text-xl animate-spin">💫</span>
          </div>

          {/* Extra Cheek Bandage Patch */}
          <div className="absolute top-[40%] left-[14%] w-9 h-9 flex items-center justify-center">
            <div className="absolute w-8 h-3 bg-yellow-100 border border-yellow-400 rounded rotate-30 shadow-sm" />
            <div className="absolute w-8 h-3 bg-yellow-100 border border-yellow-400 rounded -rotate-60 shadow-sm" />
          </div>

          {/* Cartoon Sweat drop */}
          <div className="absolute top-[24%] right-[12%] text-2xl animate-pulse">
            💧
          </div>

          {/* Funny "MAX DAMAGE" Cartoon Badge */}
          <div className="absolute top-[4%] right-[4%] bg-red-600/90 text-white font-black text-[10px] tracking-wider px-2 py-0.5 rounded-full border border-red-300 shadow-lg animate-pulse">
            MAX DAMAGE! 😵
          </div>
        </>
      )}
    </div>
  );
}
