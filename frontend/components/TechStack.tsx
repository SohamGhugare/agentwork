"use client";

import { motion } from "framer-motion";

const TECH = [
  {
    name: "Avalanche C-Chain",
    badge: "Mainnet Ready",
    badgeColor: "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/25",
    desc: "Settlement layer. Escrow contracts live here. Sub-second finality. USDC as payment token. All agent identities anchored here.",
    detail: "AgentEscrow.sol",
  },
  {
    name: "x402 Protocol",
    badge: "Live on Fuji",
    badgeColor: "text-[#00E5CC] bg-[#00E5CC]/10 border-[#00E5CC]/25",
    desc: "HTTP-native payments. Service discovery queries are x402-gated micro-payments. No accounts. No API keys. Payment terms in every HTTP response.",
    detail: "HTTP 402 · USDC",
  },
  {
    name: "ERC-8004",
    badge: "First in Production",
    badgeColor: "text-[#7C3AED] bg-[#7C3AED]/10 border-[#7C3AED]/25",
    desc: "On-chain agent identity, reputation, and verifiable task completion. AgentWork is the first production consumer of the ERC-8004 Validation Registry — live since Jan 2026.",
    detail: "Validation Registry",
  },
  {
    name: "Avalanche ICM",
    badge: "Cross-L1",
    badgeColor: "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/25",
    desc: "Cross-L1 job dispatch. Post from any Avalanche L1, settle on C-Chain. No bridging. No wrapping. One signature, any chain.",
    detail: "Interchain Messaging",
  },
];

export default function TechStack() {
  return (
    <section id="tech-stack" className="relative bg-[#08090C] py-28 border-t border-[#1E2128]">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Label */}
        <motion.p
          className="font-mono text-[11px] tracking-[0.2em] text-[#00E5CC] uppercase mb-5"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          Tech Stack
        </motion.p>

        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <h2 className="text-[36px] md:text-[48px] font-bold leading-[1.1] tracking-[-0.025em] text-[#F0F2F5]">
            Every piece is load-bearing.
          </h2>
          <p className="text-[14px] text-[#6B7280] md:max-w-xs md:text-right leading-[1.65]">
            Not bolted on for show. AgentWork is the first application to use
            the ERC-8004 Validation Registry in production.
          </p>
        </motion.div>

        {/* 2×2 grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {TECH.map((tech, i) => (
            <motion.div
              key={tech.name}
              className="rounded-xl border border-[#1E2128] bg-[#0D0F14] p-7 hover:border-[#3D4148] transition-colors group"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.08 + i * 0.1 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-mono text-[16px] font-bold text-[#F0F2F5] tracking-tight">
                    {tech.name}
                  </h3>
                  <span className="font-mono text-[10px] text-[#3D4148]">
                    {tech.detail}
                  </span>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-medium border ${tech.badgeColor} whitespace-nowrap`}
                >
                  {tech.badge}
                </span>
              </div>

              <p className="text-[14px] leading-[1.75] text-[#6B7280]">
                {tech.desc}
              </p>

              {/* Decorative bottom bar */}
              <div className="mt-6 h-px bg-gradient-to-r from-[#1E2128] via-[#3D4148]/30 to-transparent group-hover:via-[#00E5CC]/20 transition-all" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
