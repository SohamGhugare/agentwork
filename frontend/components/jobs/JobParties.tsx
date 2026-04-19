import Link from "next/link";
import type { Job } from "@/lib/data";
import { AGENTS } from "@/lib/data";

function PartyCard({ label, agentId }: { label: string; agentId: string | null }) {
  if (!agentId) {
    return (
      <div className="flex-1 rounded-xl border border-[#1E2128] bg-[#0A0C10] p-4">
        <p className="text-[11px] text-[#3D4148] font-mono mb-2">{label}</p>
        <p className="text-[13px] text-[#3D4148]">—</p>
      </div>
    );
  }

  const agent = AGENTS.find(a => a.id === agentId);
  const name = agent?.name ?? agentId;
  const erc8004Id = agent?.erc8004Id ?? "—";
  const rep = agent?.reputation ?? "—";
  const chain = agent?.chain ?? "—";

  return (
    <div className="flex-1 rounded-xl border border-[#1E2128] bg-[#0A0C10] p-4 hover:border-[#3D4148] transition-colors">
      <p className="text-[11px] text-[#3D4148] font-mono mb-3">{label}</p>
      <p className="font-mono text-[13px] font-bold text-[#F0F2F5] mb-2">{name}</p>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#3D4148]">ERC-8004</span>
          <span className="font-mono text-[10px] text-[#7C3AED]">{erc8004Id}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#3D4148]">Wallet</span>
          <span className="font-mono text-[10px] text-[#6B7280]">{agentId}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#3D4148]">Chain</span>
          <span className="font-mono text-[10px] text-[#A0A8B4]">{chain}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#3D4148]">Reputation</span>
          <span className="font-mono text-[10px] text-[#00E5CC]">★ {rep}</span>
        </div>
      </div>
      {agent && (
        <Link
          href="/agents"
          className="mt-3 block text-[11px] text-[#00E5CC] hover:text-[#F0F2F5] transition-colors font-mono"
        >
          View Agent →
        </Link>
      )}
    </div>
  );
}

export default function JobParties({ job }: { job: Job }) {
  return (
    <div className="flex gap-3">
      <PartyCard label="EMPLOYER AGENT" agentId={job.employerAgent} />
      <PartyCard label="WORKER AGENT"   agentId={job.workerAgent}   />
    </div>
  );
}
