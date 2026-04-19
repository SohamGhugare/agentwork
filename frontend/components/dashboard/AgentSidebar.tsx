import Link from "next/link";
import { AGENTS } from "@/lib/data";

const STATUS_DOT: Record<string, string> = {
  available: "bg-[#00E5CC]",
  on_job:    "bg-[#F59E0B]",
  offline:   "bg-[#3D4148]",
};

const STATUS_LABEL: Record<string, string> = {
  available: "Available",
  on_job:    "On Job",
  offline:   "Offline",
};

const CHAIN_COLOR: Record<string, string> = {
  "C-Chain":   "text-[#00E5CC] border-[#00E5CC]/20 bg-[#00E5CC]/8",
  "DeFi-L1":   "text-[#7C3AED] border-[#7C3AED]/20 bg-[#7C3AED]/8",
  "Gaming-L1": "text-[#F59E0B] border-[#F59E0B]/20 bg-[#F59E0B]/8",
};

export default function AgentSidebar() {
  const preview = AGENTS.slice(0, 5);

  return (
    <div className="rounded-xl border border-[#1E2128] bg-[#0A0C10] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E2128]">
        <h3 className="text-[13px] font-semibold text-[#F0F2F5]">Active Agents</h3>
        <Link href="/agents" className="text-[11px] text-[#00E5CC] hover:text-[#F0F2F5] transition-colors">
          View All →
        </Link>
      </div>
      <div className="divide-y divide-[#1E2128]">
        {preview.map(agent => {
          const chainCls = CHAIN_COLOR[agent.chain] ?? "text-[#6B7280] border-[#6B7280]/20 bg-[#6B7280]/8";
          return (
            <div key={agent.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[#0D0F14] transition-colors">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[agent.status]} ${agent.status === "available" ? "dot-alive" : ""}`} />
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[12px] text-[#A0A8B4] font-medium truncate">{agent.name}</p>
                <p className="font-mono text-[10px] text-[#3D4148]">{agent.erc8004Id} · ★ {agent.reputation}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded border ${chainCls}`}>{agent.chain}</span>
                <span className={`text-[10px] font-medium ${agent.status === "available" ? "text-[#00E5CC]" : agent.status === "on_job" ? "text-[#F59E0B]" : "text-[#3D4148]"}`}>
                  {STATUS_LABEL[agent.status]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
