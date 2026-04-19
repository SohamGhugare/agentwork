"use client";

import type { Agent } from "@/lib/data";
import { usePostJob } from "@/lib/post-job-context";

const STATUS_DOT: Record<string, string> = {
  available: "bg-[#00E5CC] dot-alive",
  on_job:    "bg-[#F59E0B]",
  offline:   "bg-[#3D4148]",
};
const STATUS_LABEL: Record<string, string> = {
  available: "Available",
  on_job:    "On Job",
  offline:   "Offline",
};
const STATUS_TEXT: Record<string, string> = {
  available: "text-[#00E5CC]",
  on_job:    "text-[#F59E0B]",
  offline:   "text-[#3D4148]",
};
const CHAIN_COLOR: Record<string, string> = {
  "C-Chain":   "text-[#00E5CC] border-[#00E5CC]/25 bg-[#00E5CC]/8",
  "DeFi-L1":   "text-[#7C3AED] border-[#7C3AED]/25 bg-[#7C3AED]/8",
  "Gaming-L1": "text-[#F59E0B] border-[#F59E0B]/25 bg-[#F59E0B]/8",
};

interface AgentCardProps {
  agent: Agent;
  onViewProfile: (agent: Agent) => void;
}

export default function AgentCard({ agent, onViewProfile }: AgentCardProps) {
  const { open } = usePostJob();
  const chainCls = CHAIN_COLOR[agent.chain] ?? "text-[#6B7280] border-[#6B7280]/25 bg-[#6B7280]/8";
  const repPct = (agent.reputation / 5) * 100;

  return (
    <div className="rounded-xl border border-[#1E2128] bg-[#0A0C10] p-5 flex flex-col gap-4 hover:border-[#3D4148] transition-colors group">
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[agent.status]}`} />
          <span className={`text-[11px] font-medium ${STATUS_TEXT[agent.status]}`}>
            {STATUS_LABEL[agent.status]}
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#3D4148]">{agent.erc8004Id}</span>
      </div>

      {/* Name + chain */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-mono text-[15px] font-bold text-[#F0F2F5] group-hover:text-[#00E5CC] transition-colors leading-tight">
          {agent.name}
        </h3>
        <span className={`font-mono text-[10px] px-2 py-0.5 rounded border flex-shrink-0 ${chainCls}`}>
          {agent.chain}
        </span>
      </div>

      {/* Capability tags */}
      <div className="flex flex-wrap gap-1.5">
        {agent.capability.map(c => (
          <span key={c} className="px-2 py-0.5 rounded font-mono text-[10px] text-[#6B7280] border border-[#1E2128] bg-[#111318]">
            {c}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 rounded-full bg-[#1E2128] overflow-hidden">
            <div className="h-full rounded-full bg-[#00E5CC]" style={{ width: `${repPct}%` }} />
          </div>
          <span className="font-mono text-[12px] text-[#A0A8B4] flex-shrink-0">
            ★ {agent.reputation.toFixed(1)} / 5.0
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-[#6B7280] font-mono">
          <span>{agent.totalJobs} jobs</span>
          <span>{agent.successRate}% success</span>
          <span className="ml-auto text-[#00E5CC] font-medium">${agent.pricePerJob.toFixed(2)} / job</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-[12px] text-[#6B7280] leading-relaxed line-clamp-2">{agent.description}</p>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => open({ capability: agent.capability[0], agentName: agent.name, price: agent.pricePerJob })}
          disabled={agent.status !== "available"}
          className="flex-1 py-2 rounded-lg bg-[#00E5CC] text-[#08090C] text-[12px] font-semibold hover:bg-[#00ccb4] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Hire Agent →
        </button>
        <button
          onClick={() => onViewProfile(agent)}
          className="flex-1 py-2 rounded-lg border border-[#3D4148] text-[#A0A8B4] text-[12px] font-medium hover:border-[#6B7280] hover:text-[#F0F2F5] transition-colors"
        >
          View Profile
        </button>
      </div>
    </div>
  );
}
