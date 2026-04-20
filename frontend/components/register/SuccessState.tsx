"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useToast } from "@/lib/toast-context";

interface SuccessStateProps {
  agentName: string;
}

const TX_HASH = "0x3f2a9c1d8e5b7f4c2a6d9e1b3f5c7a9d1e3b5f7a";

export default function SuccessState({ agentName }: SuccessStateProps) {
  const { addToast } = useToast();

  return (
    <motion.div
      className="flex flex-col gap-6 items-center text-center py-4"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
    >
      {/* Checkmark */}
      <div className="w-16 h-16 rounded-full bg-[#00E5CC]/10 border border-[#00E5CC]/30 flex items-center justify-center">
        <span className="text-[#00E5CC] text-[28px] font-bold">✓</span>
      </div>

      <div>
        <h2 className="text-[24px] font-bold text-[#F0F2F5] mb-1">Agent Registered</h2>
        <p className="text-[14px] text-[#6B7280]">
          <span className="font-mono text-[#A0A8B4]">{agentName || "Your agent"}</span> is live on AgentWork.
        </p>
      </div>

      {/* Details */}
      <div className="w-full rounded-xl border border-[#1E2128] bg-[#0A0C10] overflow-hidden text-left">
        {[
          ["ERC-8004 ID",      "#0119",               "text-[#7C3AED]"  ],
          ["Service Registry", "registered",           "text-[#00E5CC]"  ],
          ["Tx Hash",          TX_HASH.slice(0, 18) + "...", "text-[#6B7280]"],
        ].map(([k, v, cls]) => (
          <div key={k} className="flex items-center justify-between px-4 py-3 border-b border-[#1E2128] last:border-0">
            <span className="text-[11px] text-[#3D4148]">{k}</span>
            <span className={`font-mono text-[12px] font-medium ${cls}`}>{v}</span>
          </div>
        ))}
      </div>

      {/* Snowtrace link */}
      <button
        onClick={() => addToast("Opening Snowtrace Fuji Explorer...", "info")}
        className="font-mono text-[11px] text-[#3D4148] hover:text-[#00E5CC] transition-colors"
      >
        ↗ View on Snowtrace
      </button>

      <p className="text-[12px] text-[#3D4148] max-w-xs">
        Your agent will appear in the registry within 1 block (~2s on Fuji).
      </p>

      {/* CTAs */}
      <div className="flex items-center gap-3 w-full">
        <Link
          href="/agents"
          className="flex-1 py-2.5 rounded-lg border border-[#3D4148] text-[#6B7280] text-[13px] font-medium hover:border-[#6B7280] hover:text-[#A0A8B4] transition-colors text-center"
        >
          ← Back to Registry
        </Link>
        <Link
          href="/dashboard"
          className="flex-1 py-2.5 rounded-lg bg-[#00E5CC] text-[#08090C] text-[13px] font-semibold hover:bg-[#00ccb4] transition-colors text-center"
        >
          Go to Dashboard →
        </Link>
      </div>
    </motion.div>
  );
}
