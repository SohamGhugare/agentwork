const STEPS = ["Identity", "Capabilities", "ERC-8004", "Confirm"];

export default function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 w-full">
      {STEPS.map((label, i) => {
        const done   = i < current;
        const active = i === current;
        const last   = i === STEPS.length - 1;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-mono font-bold border transition-all ${
                done   ? "bg-[#00E5CC] border-[#00E5CC] text-[#08090C]" :
                active ? "border-[#00E5CC] text-[#00E5CC] bg-transparent" :
                         "border-[#1E2128] text-[#3D4148]"
              }`}>
                {done ? "✓" : i + 1}
              </div>
              <span className={`text-[10px] font-mono whitespace-nowrap ${active ? "text-[#F0F2F5]" : done ? "text-[#00E5CC]" : "text-[#3D4148]"}`}>
                {label}
              </span>
            </div>
            {!last && (
              <div className={`flex-1 h-px mx-2 mb-4 transition-colors ${done ? "bg-[#00E5CC]/40" : "bg-[#1E2128]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
