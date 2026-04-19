"use client";

import { useToast } from "@/lib/toast-context";
import type { TimelineStep } from "@/lib/data";

const STEP_COLOR: Record<string, { dot: string; label: string }> = {
  open:      { dot: "bg-[#6B7280]",  label: "text-[#6B7280]"  },
  accepted:  { dot: "bg-[#F59E0B]",  label: "text-[#F59E0B]"  },
  completed: { dot: "bg-[#60A5FA]",  label: "text-[#60A5FA]"  },
  validated: { dot: "bg-[#7C3AED]",  label: "text-[#7C3AED]"  },
  paid:      { dot: "bg-[#00E5CC]",  label: "text-[#00E5CC]"  },
  expired:   { dot: "bg-[#FF5F57]",  label: "text-[#FF5F57]"  },
};

export default function JobTimeline({ steps, resultHash }: { steps: TimelineStep[]; resultHash: string | null }) {
  const { addToast } = useToast();

  const openSnowTrace = (type?: string) => {
    if (type === "erc8004") {
      addToast("Opening ERC-8004 Registry on Snowtrace...", "info");
    } else {
      addToast("Opening Snowtrace Fuji Explorer...", "info");
    }
  };

  return (
    <div className="flex flex-col">
      {steps.map((step, i) => {
        const isValidated = step.status === "validated";
        const colors = STEP_COLOR[step.status] ?? STEP_COLOR.open;
        const isLast = i === steps.length - 1;

        return (
          <div key={i} className="flex gap-4">
            {/* Timeline spine */}
            <div className="flex flex-col items-center flex-shrink-0 w-6">
              <span className={`w-2.5 h-2.5 rounded-full mt-0.5 flex-shrink-0 ${colors.dot} ${isValidated ? "ring-2 ring-[#7C3AED]/30" : ""}`} />
              {!isLast && <div className="w-px flex-1 bg-[#1E2128] mt-1 mb-0" style={{ minHeight: "32px" }} />}
            </div>

            {/* Content */}
            <div className={`pb-6 flex-1 ${isLast ? "pb-0" : ""}`}>
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span className={`text-[13px] font-semibold ${colors.label}`}>{step.label}</span>
                <span className="font-mono text-[11px] text-[#3D4148] flex-shrink-0">{step.timestamp}</span>
              </div>
              <p className="text-[13px] text-[#6B7280] mb-2">{step.detail}</p>

              {/* Result hash on completed step */}
              {step.status === "completed" && resultHash && (
                <div className="mb-2 px-3 py-2 rounded-md border border-[#1E2128] bg-[#0A0C10]">
                  <span className="text-[10px] text-[#3D4148] block mb-0.5 font-mono">RESULT HASH</span>
                  <span className="font-mono text-[11px] text-[#6B7280] break-all">{resultHash}</span>
                </div>
              )}

              {/* ERC-8004 agent chip on accepted */}
              {step.erc8004 && (
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#7C3AED] bg-[#7C3AED]/8 border border-[#7C3AED]/25 px-2 py-0.5 rounded mr-2">
                  ERC-8004 {step.erc8004}
                </span>
              )}

              {/* Tx hash + links */}
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <span className="font-mono text-[11px] text-[#3D4148]">Tx: {step.txHash}</span>
                <button
                  onClick={() => openSnowTrace()}
                  className="inline-flex items-center gap-1 text-[10px] text-[#3D4148] hover:text-[#00E5CC] transition-colors font-mono"
                >
                  ↗ Snowtrace
                </button>
                {isValidated && step.erc8004 && (
                  <button
                    onClick={() => openSnowTrace("erc8004")}
                    className="inline-flex items-center gap-1 text-[10px] text-[#3D4148] hover:text-[#7C3AED] transition-colors font-mono"
                  >
                    ↗ ERC-8004 Registry
                  </button>
                )}
              </div>

              {/* ERC-8004 validation callout */}
              {isValidated && (
                <div className="mt-3 px-4 py-3 rounded-lg border border-[#7C3AED]/25 bg-[#7C3AED]/5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] text-[#7C3AED] font-bold">✦ ERC-8004 Validation Registry</span>
                    <span className="font-mono text-[9px] text-[#7C3AED]/60 border border-[#7C3AED]/25 px-1.5 py-0.5 rounded">FIRST PRODUCTION USE</span>
                  </div>
                  <p className="text-[12px] text-[#6B7280] leading-relaxed">
                    This validation proof is permanently recorded on Avalanche C-Chain using ERC-8004 — the first on-chain standard for verifiable AI agent task completion.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
