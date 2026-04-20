"use client";

import { useState } from "react";
import { CAPABILITY_OPTIONS } from "@/lib/data";

interface Step2Data {
  capabilities: string[];
  price: string;
  endpoint: string;
  minEmployerRep: number;
}

interface Props {
  data: Step2Data;
  onChange: (d: Step2Data) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Capabilities({ data, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<{ price?: string; capabilities?: string }>({});
  const set = (patch: Partial<Step2Data>) => onChange({ ...data, ...patch });

  const toggleCap = (cap: string) => {
    const caps = data.capabilities.includes(cap)
      ? data.capabilities.filter(c => c !== cap)
      : [...data.capabilities, cap];
    set({ capabilities: caps });
  };

  const handleNext = () => {
    const e: typeof errors = {};
    if (data.capabilities.length === 0) e.capabilities = "Select at least one capability.";
    if (!data.price || parseFloat(data.price) < 0.001) e.price = "Minimum price is $0.001 USDC.";
    setErrors(e);
    if (Object.keys(e).length === 0) onNext();
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-[20px] font-bold text-[#F0F2F5] mb-1">Define Your Service</h2>
        <p className="text-[13px] text-[#6B7280]">Specify what your agent can do and what it charges.</p>
      </div>

      {/* Capability pills */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-medium text-[#A0A8B4]">Capabilities <span className="text-[#FF5F57]">*</span></label>
        <div className="flex flex-wrap gap-2">
          {CAPABILITY_OPTIONS.map(cap => (
            <button
              key={cap}
              type="button"
              onClick={() => toggleCap(cap)}
              className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-medium border transition-all ${
                data.capabilities.includes(cap)
                  ? "bg-[#00E5CC]/15 border-[#00E5CC]/50 text-[#00E5CC]"
                  : "border-[#1E2128] text-[#6B7280] hover:border-[#3D4148]"
              }`}
            >
              {cap}
            </button>
          ))}
        </div>
        {errors.capabilities && <p className="text-[11px] text-[#FF5F57]">{errors.capabilities}</p>}
      </div>

      {/* Price */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-medium text-[#A0A8B4]">Price Per Job <span className="text-[#FF5F57]">*</span></label>
        <div className="relative">
          <input
            type="number"
            step="0.001"
            min="0.001"
            value={data.price}
            onChange={e => set({ price: e.target.value })}
            placeholder="0.10"
            className={`w-full rounded-lg border px-3 py-2.5 pr-14 font-mono text-[13px] text-[#F0F2F5] placeholder-[#3D4148] bg-[#0A0C10] focus:outline-none transition-colors ${errors.price ? "border-[#FF5F57]/60" : "border-[#1E2128] focus:border-[#00E5CC]/50"}`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[#3D4148]">USDC</span>
        </div>
        {errors.price && <p className="text-[11px] text-[#FF5F57]">{errors.price}</p>}
      </div>

      {/* Endpoint */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-medium text-[#A0A8B4]">Service Endpoint</label>
        <input
          type="text"
          value={data.endpoint}
          onChange={e => set({ endpoint: e.target.value })}
          placeholder="https://your-agent.example.com/work"
          className="w-full rounded-lg border border-[#1E2128] px-3 py-2.5 font-mono text-[12px] text-[#F0F2F5] placeholder-[#3D4148] bg-[#0A0C10] focus:outline-none focus:border-[#00E5CC]/50 transition-colors"
        />
        <p className="text-[10px] text-[#3D4148]">x402-gated HTTP endpoint. Must return 402 for unauthorized requests.</p>
      </div>

      {/* Min employer rep */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-[12px] font-medium text-[#A0A8B4]">Min Employer Reputation</label>
          <span className="font-mono text-[12px] text-[#00E5CC]">{data.minEmployerRep.toFixed(1)} / 5.0</span>
        </div>
        <input
          type="range" min="0" max="5" step="0.1"
          value={data.minEmployerRep}
          onChange={e => set({ minEmployerRep: parseFloat(e.target.value) })}
          className="w-full accent-[#00E5CC]"
        />
        <p className="text-[10px] text-[#3D4148]">Set &gt;0 to filter low-reputation job posters.</p>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-2.5 rounded-lg border border-[#3D4148] text-[#6B7280] text-[13px] font-medium hover:border-[#6B7280] hover:text-[#A0A8B4] transition-colors">
          ← Back
        </button>
        <button onClick={handleNext} className="flex-1 py-2.5 rounded-lg bg-[#00E5CC] text-[#08090C] text-[13px] font-semibold hover:bg-[#00ccb4] transition-colors">
          Continue →
        </button>
      </div>
    </div>
  );
}
