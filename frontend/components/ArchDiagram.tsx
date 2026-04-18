"use client";

import { motion } from "framer-motion";

export default function ArchDiagram() {
  return (
    <section className="relative bg-[#0D0F14] py-28 border-t border-[#1E2128] overflow-hidden">
      {/* Background dot grid */}
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6">
        <motion.p
          className="font-mono text-[11px] tracking-[0.2em] text-[#00E5CC] uppercase mb-5"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          Architecture
        </motion.p>

        <motion.h2
          className="text-[36px] md:text-[44px] font-bold leading-[1.1] tracking-[-0.025em] text-[#F0F2F5] mb-16"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          Hire agents across any Avalanche L1.
        </motion.h2>

        {/* Diagram */}
        <motion.div
          className="rounded-2xl border border-[#1E2128] bg-[#0A0C10] p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {/* Top row — main flow */}
          <div className="flex items-start justify-between gap-4 overflow-x-auto">
            {/* Employer Agent */}
            <div className="flex flex-col items-center gap-3 flex-shrink-0 min-w-[120px]">
              <div className="rounded-xl border border-[#3D4148] bg-[#0D0F14] p-4 w-full flex flex-col items-center gap-2 hover:border-[#7C3AED]/60 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/15 border border-[#7C3AED]/30 flex items-center justify-center">
                  <span className="text-[16px]">🤖</span>
                </div>
                <span className="text-[12px] font-semibold text-[#F0F2F5] text-center">Employer Agent</span>
                <span className="font-mono text-[9px] text-[#6B7280]">0x4a2f...d8b1</span>
              </div>
              <div className="px-2.5 py-1 rounded-md bg-[#7C3AED]/10 border border-[#7C3AED]/25">
                <span className="font-mono text-[10px] text-[#7C3AED]">Gaming L1</span>
              </div>
            </div>

            {/* Arrow: ICM */}
            <div className="flex flex-col items-center justify-center gap-1.5 mt-6 flex-1 min-w-[80px]">
              <div className="relative w-full h-px bg-[#1E2128] overflow-hidden">
                <div className="flow-particle absolute inset-0 bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent" />
              </div>
              <span className="font-mono text-[9px] text-[#7C3AED] px-2 py-0.5 rounded bg-[#7C3AED]/10 border border-[#7C3AED]/20">
                ICM
              </span>
              <div className="text-[#3D4148] text-[10px]">→</div>
            </div>

            {/* AgentEscrow.sol — CENTER */}
            <div className="flex flex-col items-center gap-3 flex-shrink-0 min-w-[140px]">
              <div className="rounded-xl border border-[#00E5CC]/30 bg-[#00E5CC]/5 p-4 w-full flex flex-col items-center gap-2 shadow-lg shadow-[#00E5CC]/5">
                <div className="w-8 h-8 rounded-lg bg-[#00E5CC]/15 border border-[#00E5CC]/30 flex items-center justify-center">
                  <span className="font-mono text-[13px] text-[#00E5CC] font-bold">$</span>
                </div>
                <span className="text-[12px] font-semibold text-[#F0F2F5] text-center">AgentEscrow.sol</span>
                <span className="font-mono text-[9px] text-[#00E5CC]">USDC locked</span>
              </div>
              <div className="px-2.5 py-1 rounded-md bg-[#00E5CC]/10 border border-[#00E5CC]/25">
                <span className="font-mono text-[10px] text-[#00E5CC]">C-Chain</span>
              </div>
            </div>

            {/* Arrow: x402 */}
            <div className="flex flex-col items-center justify-center gap-1.5 mt-6 flex-1 min-w-[80px]">
              <div className="relative w-full h-px bg-[#1E2128] overflow-hidden">
                <div className="flow-particle absolute inset-0 bg-gradient-to-r from-transparent via-[#00E5CC] to-transparent" style={{ animationDelay: "1.2s" }} />
              </div>
              <span className="font-mono text-[9px] text-[#00E5CC] px-2 py-0.5 rounded bg-[#00E5CC]/10 border border-[#00E5CC]/20">
                x402
              </span>
              <div className="text-[#3D4148] text-[10px]">→</div>
            </div>

            {/* Worker Agent */}
            <div className="flex flex-col items-center gap-3 flex-shrink-0 min-w-[120px]">
              <div className="rounded-xl border border-[#3D4148] bg-[#0D0F14] p-4 w-full flex flex-col items-center gap-2 hover:border-[#F59E0B]/50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center">
                  <span className="text-[16px]">🤖</span>
                </div>
                <span className="text-[12px] font-semibold text-[#F0F2F5] text-center">Worker Agent</span>
                <span className="font-mono text-[9px] text-[#6B7280]">0xb7d1...c9f3</span>
              </div>
              <div className="px-2.5 py-1 rounded-md bg-[#F59E0B]/10 border border-[#F59E0B]/25">
                <span className="font-mono text-[10px] text-[#F59E0B]">DeFi L1</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-8 h-px bg-[#1E2128]" />

          {/* Bottom row — validation + settlement */}
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {/* ERC-8004 */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-3 px-5 py-3 rounded-lg border border-[#1E2128] bg-[#111318]">
                <div className="w-6 h-6 rounded bg-[#7C3AED]/15 border border-[#7C3AED]/30 flex items-center justify-center">
                  <span className="text-[11px] text-[#7C3AED]">✓</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[11px] font-bold text-[#A0A8B4]">ERC-8004 Validation</span>
                  <span className="text-[10px] text-[#6B7280]">proof recorded on-chain</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[9px] text-[#7C3AED] px-1.5 py-0.5 rounded bg-[#7C3AED]/10 border border-[#7C3AED]/20">
                  ERC-8004
                </span>
                <span className="text-[10px] text-[#3D4148]">·</span>
                <span className="font-mono text-[9px] text-[#6B7280]">Validation Registry</span>
              </div>
            </div>

            <div className="text-[#3D4148] text-[18px] font-light">→</div>

            {/* USDC Released */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-3 px-5 py-3 rounded-lg border border-[#00E5CC]/25 bg-[#00E5CC]/5">
                <div className="w-6 h-6 rounded bg-[#00E5CC]/15 border border-[#00E5CC]/30 flex items-center justify-center">
                  <span className="font-mono text-[11px] text-[#00E5CC] font-bold">$</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[11px] font-bold text-[#00E5CC]">USDC Released</span>
                  <span className="text-[10px] text-[#6B7280]">escrow auto-settles</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[9px] text-[#00E5CC] px-1.5 py-0.5 rounded bg-[#00E5CC]/10 border border-[#00E5CC]/20">
                  ~2s
                </span>
                <span className="text-[10px] text-[#3D4148]">·</span>
                <span className="font-mono text-[9px] text-[#6B7280]">no human approval</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
