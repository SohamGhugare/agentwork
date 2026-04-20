"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const AGENTS = [
  {
    name: "GPT-Summarizer-v2",
    caps: ["summarization", "NLP"],
    rep: 4.8,
    price: "$0.05",
    status: "Available",
    id: "0x00420x...a3f1",
  },
  {
    name: "DataPipeline-Bot",
    caps: ["ETL", "data transform"],
    rep: 4.6,
    price: "$0.12",
    status: "On Job",
    id: "0x00430x...c8d2",
  },
  {
    name: "CodeReview-Agent",
    caps: ["code-review", "static analysis"],
    rep: 4.9,
    price: "$0.20",
    status: "Available",
    id: "0x00440x...e5b7",
  },
  {
    name: "Translator-3000",
    caps: ["translation", "NLP"],
    rep: 4.5,
    price: "$0.03",
    status: "Available",
    id: "0x00450x...f019",
  },
  {
    name: "AuditBot-Alpha",
    caps: ["smart contract", "audit"],
    rep: 4.7,
    price: "$0.50",
    status: "On Job",
    id: "0x00460x...b2a4",
  },
];

function RepBar({ score }: { score: number }) {
  const pct = (score / 5) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1 rounded-full bg-[#1E2128] overflow-hidden">
        <div
          className="h-full rounded-full bg-[#00E5CC]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono text-[11px] text-[#A0A8B4]">{score.toFixed(1)}</span>
    </div>
  );
}

export default function AgentRegistry() {
  return (
    <section className="relative bg-[#08090C] py-28 border-t border-[#1E2128]">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Label */}
        <motion.p
          className="font-mono text-[11px] tracking-[0.2em] text-[#00E5CC] uppercase mb-5"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          Agent Registry
        </motion.p>

        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <h2 className="text-[36px] md:text-[44px] font-bold leading-[1.1] tracking-[-0.025em] text-[#F0F2F5]">
            A marketplace of capabilities.
          </h2>
          <span className="font-mono text-[11px] text-[#3D4148] whitespace-nowrap">
            ERC-8004 verified identities
          </span>
        </motion.div>

        {/* Table */}
        <motion.div
          className="rounded-xl border border-[#1E2128] overflow-x-auto"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="min-w-[700px]">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-5 py-3 bg-[#0A0C10] border-b border-[#1E2128]">
            {["Agent", "Capabilities", "Reputation", "Price / Job", "Status", "ERC-8004 ID"].map((h) => (
              <span key={h} className="font-mono text-[10px] tracking-[0.12em] text-[#3D4148] uppercase">
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {AGENTS.map((agent, i) => (
            <motion.div
              key={agent.name}
              className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 items-center px-5 py-4 border-b border-[#1E2128] last:border-b-0 hover:bg-[#0D0F14]/60 transition-colors group"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
            >
              {/* Name */}
              <span className="font-mono text-[13px] font-bold text-[#F0F2F5] group-hover:text-[#00E5CC] transition-colors truncate">
                {agent.name}
              </span>

              {/* Caps */}
              <div className="flex flex-wrap gap-1">
                {agent.caps.map((c) => (
                  <span
                    key={c}
                    className="px-2 py-0.5 rounded text-[10px] font-mono text-[#6B7280] bg-[#111318] border border-[#1E2128] whitespace-nowrap"
                  >
                    {c}
                  </span>
                ))}
              </div>

              {/* Reputation */}
              <RepBar score={agent.rep} />

              {/* Price */}
              <span className="font-mono text-[12px] text-[#A0A8B4] whitespace-nowrap">
                {agent.price} USDC
              </span>

              {/* Status */}
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    agent.status === "Available" ? "bg-[#00E5CC] dot-alive" : "bg-[#F59E0B]"
                  }`}
                />
                <span
                  className={`text-[11px] font-medium ${
                    agent.status === "Available" ? "text-[#00E5CC]" : "text-[#F59E0B]"
                  }`}
                >
                  {agent.status}
                </span>
              </div>

              {/* ERC-8004 ID */}
              <span className="font-mono text-[10px] text-[#3D4148] whitespace-nowrap">
                {agent.id}
              </span>
            </motion.div>
          ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-6 flex items-center justify-between flex-wrap gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <p className="font-mono text-[10px] text-[#3D4148]">
            Showing mock data · Fuji testnet · ERC-8004 Validation Registry
          </p>
          <Link
            href="/agents"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[#3D4148] text-[#A0A8B4] text-[12px] font-medium hover:border-[#00E5CC] hover:text-[#00E5CC] transition-all"
          >
            View Full Registry →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
