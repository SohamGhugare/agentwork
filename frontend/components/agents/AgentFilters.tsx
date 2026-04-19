"use client";

interface Filters {
  search: string;
  capability: string;
  status: string;
  chain: string;
  sort: string;
}

interface AgentFiltersProps {
  filters: Filters;
  onChange: (f: Filters) => void;
}

const CAPS = ["summarization","code-review","translation","data-pipeline","transcription","sentiment-analysis","image-labeling","report-generation"];
const CHAINS = ["C-Chain","DeFi-L1","Gaming-L1"];
const SORTS = [
  { label: "Reputation ↓", value: "reputation" },
  { label: "Price ↑",      value: "price"       },
  { label: "Jobs ↓",       value: "jobs"        },
];

export default function AgentFilters({ filters, onChange }: AgentFiltersProps) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  return (
    <div className="flex flex-col gap-3">
      {/* Search + sort row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3D4148]" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search agents..."
            value={filters.search}
            onChange={e => set({ search: e.target.value })}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#1E2128] bg-[#0A0C10] text-[13px] text-[#F0F2F5] placeholder-[#3D4148] focus:outline-none focus:border-[#00E5CC]/50 transition-colors"
          />
        </div>
        <select
          value={filters.sort}
          onChange={e => set({ sort: e.target.value })}
          className="rounded-lg border border-[#1E2128] bg-[#0A0C10] px-3 py-2 text-[12px] text-[#A0A8B4] focus:outline-none focus:border-[#00E5CC]/50 transition-colors appearance-none pr-8"
        >
          {SORTS.map(s => <option key={s.value} value={s.value} className="bg-[#0D0F14]">{s.label}</option>)}
        </select>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {/* Status */}
        {(["all","available","on_job","offline"] as const).map(s => (
          <button
            key={s}
            onClick={() => set({ status: s })}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
              filters.status === s
                ? "bg-[#00E5CC] text-[#08090C]"
                : "border border-[#1E2128] text-[#6B7280] hover:border-[#3D4148]"
            }`}
          >
            {s === "all" ? "All Status" : s === "on_job" ? "On Job" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <span className="w-px h-5 bg-[#1E2128] mx-1 self-center" />
        {/* Chains */}
        {CHAINS.map(c => (
          <button
            key={c}
            onClick={() => set({ chain: filters.chain === c ? "all" : c })}
            className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium transition-colors ${
              filters.chain === c
                ? "bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED]/40"
                : "border border-[#1E2128] text-[#6B7280] hover:border-[#3D4148]"
            }`}
          >
            {c}
          </button>
        ))}
        <span className="w-px h-5 bg-[#1E2128] mx-1 self-center" />
        {/* Capabilities */}
        {CAPS.map(c => (
          <button
            key={c}
            onClick={() => set({ capability: filters.capability === c ? "all" : c })}
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-colors ${
              filters.capability === c
                ? "bg-[#00E5CC]/15 text-[#00E5CC] border border-[#00E5CC]/40"
                : "border border-[#1E2128] text-[#3D4148] hover:border-[#3D4148] hover:text-[#6B7280]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
