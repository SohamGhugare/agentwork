"use client";

import { useState, useEffect } from "react";

interface Step1Data {
  name: string;
  description: string;
  wallet: string;
  chain: string;
}

interface Props {
  data: Step1Data;
  onChange: (d: Step1Data) => void;
  onNext: () => void;
}

export default function Step1Identity({ data, onChange, onNext }: Props) {
  const [errors, setErrors] = useState<Partial<Record<keyof Step1Data, string>>>({});

  const set = (patch: Partial<Step1Data>) => onChange({ ...data, ...patch });

  const validate = () => {
    const e: typeof errors = {};
    if (!data.name.trim())    e.name   = "Agent name is required.";
    if (!data.wallet.trim())  e.wallet = "Wallet address is required.";
    else if (!data.wallet.startsWith("0x") || data.wallet.length < 10)
      e.wallet = "Must start with 0x and be at least 10 characters.";
    return e;
  };

  const handleNext = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) onNext();
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-[20px] font-bold text-[#F0F2F5] mb-1">Connect Your Agent</h2>
        <p className="text-[13px] text-[#6B7280]">Set up the identity for your on-chain agent.</p>
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-medium text-[#A0A8B4]">Agent Name <span className="text-[#FF5F57]">*</span></label>
        <input
          type="text"
          value={data.name}
          onChange={e => set({ name: e.target.value })}
          placeholder="GPT-Summarizer-v3"
          className={`w-full rounded-lg border px-3 py-2.5 text-[13px] text-[#F0F2F5] placeholder-[#3D4148] bg-[#0A0C10] focus:outline-none transition-colors ${errors.name ? "border-[#FF5F57]/60" : "border-[#1E2128] focus:border-[#00E5CC]/50"}`}
        />
        {errors.name && <p className="text-[11px] text-[#FF5F57]">{errors.name}</p>}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-medium text-[#A0A8B4]">Description</label>
        <textarea
          value={data.description}
          onChange={e => set({ description: e.target.value })}
          placeholder="What does your agent do? What inputs/outputs does it accept?"
          rows={3}
          className="w-full rounded-lg border border-[#1E2128] px-3 py-2.5 text-[13px] text-[#F0F2F5] placeholder-[#3D4148] bg-[#0A0C10] focus:outline-none focus:border-[#00E5CC]/50 resize-none transition-colors"
        />
      </div>

      {/* Wallet */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-medium text-[#A0A8B4]">Owner Wallet Address <span className="text-[#FF5F57]">*</span></label>
        <input
          type="text"
          value={data.wallet}
          onChange={e => set({ wallet: e.target.value })}
          placeholder="0x..."
          className={`w-full rounded-lg border px-3 py-2.5 text-[13px] font-mono text-[#F0F2F5] placeholder-[#3D4148] bg-[#0A0C10] focus:outline-none transition-colors ${errors.wallet ? "border-[#FF5F57]/60" : "border-[#1E2128] focus:border-[#00E5CC]/50"}`}
        />
        {errors.wallet && <p className="text-[11px] text-[#FF5F57]">{errors.wallet}</p>}
      </div>

      {/* Chain */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-medium text-[#A0A8B4]">Home Chain</label>
        <select
          value={data.chain}
          onChange={e => set({ chain: e.target.value })}
          className="w-full rounded-lg border border-[#1E2128] px-3 py-2.5 text-[13px] text-[#F0F2F5] bg-[#0A0C10] focus:outline-none focus:border-[#00E5CC]/50 transition-colors appearance-none"
        >
          {["C-Chain", "DeFi-L1", "Gaming-L1", "Custom L1"].map(c => (
            <option key={c} value={c} className="bg-[#0D0F14]">{c}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleNext}
        className="w-full py-2.5 rounded-lg bg-[#00E5CC] text-[#08090C] text-[13px] font-semibold hover:bg-[#00ccb4] transition-colors"
      >
        Continue →
      </button>
    </div>
  );
}
