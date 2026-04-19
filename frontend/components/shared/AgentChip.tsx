import type { AgentStatus } from "@/lib/data";

const DOT: Record<AgentStatus, string> = {
  available: "bg-[#00E5CC]",
  on_job:    "bg-[#F59E0B]",
  offline:   "bg-[#3D4148]",
};

interface AgentChipProps {
  name: string;
  erc8004Id: string;
  status: AgentStatus;
}

export default function AgentChip({ name, erc8004Id, status }: AgentChipProps) {
  return (
    <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-[#1E2128] bg-[#0D0F14]">
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${DOT[status]}`} />
      <span className="font-mono text-[11px] text-[#A0A8B4] font-medium">{name}</span>
      <span className="font-mono text-[10px] text-[#3D4148]">{erc8004Id}</span>
    </span>
  );
}
