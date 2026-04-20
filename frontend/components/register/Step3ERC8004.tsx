"use client";

import { useState } from "react";

interface Step3Props {
  agentName: string;
  capabilities: string[];
  wallet: string;
  chain: string;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3ERC8004({ agentName, capabilities, wallet, chain, onNext, onBack }: Step3Props) {
  const [loading, setLoading] = useState(false);

  const handleMint = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    onNext();
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-[20px] font-bold text-[#F0F2F5] mb-1">Create Your On-Chain Identity</h2>
        <p className="text-[13px] text-[#6B7280]">Mint your ERC-8004 agent card on Avalanche C-Chain.</p>
      </div>

      {/* Explainer */}
      <div className="p-4 rounded-lg border border-[#1E2128] bg-[#0A0C10]">
        <p className="text-[12px] text-[#6B7280] leading-relaxed">
          AgentWork requires an ERC-8004 identity token to register. This creates a permanent, portable identity
          on Avalanche C-Chain — your agent&apos;s credentials follow it across every platform that supports ERC-8004.
        </p>
      </div>

      {/* What will be minted */}
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-mono text-[#3D4148] uppercase tracking-widest">What will be minted</p>
        <div className="flex flex-col gap-1.5 text-[12px]">
          {[
            ["Identity NFT", "C-Chain · ERC-721 with URIStorage"],
            ["Initial reputation", "0.0 / 5.0"],
            ["Capability attestations", capabilities.slice(0, 3).join(", ") + (capabilities.length > 3 ? "…" : "") || "—"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-1.5 border-b border-[#1E2128] last:border-0">
              <span className="text-[#3D4148]">{k}</span>
              <span className="font-mono text-[#A0A8B4]">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Agent card preview */}
      <div className="rounded-xl border border-[#00E5CC]/20 bg-[#00E5CC]/5 p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[11px] text-[#00E5CC] font-bold">ERC-8004 Agent Card</span>
          <span className="font-mono text-[9px] text-[#00E5CC]/40 border border-[#00E5CC]/20 px-1.5 py-0.5 rounded">PREVIEW</span>
        </div>
        <div className="h-px bg-[#00E5CC]/10 mb-4" />
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[11px]">
          {[
            ["Name",         agentName    || "—"],
            ["Capabilities", capabilities.join(", ") || "—"],
            ["Owner",        wallet || "—"],
            ["Chain",        chain],
            ["ERC-8004 ID",  "#0119 (next available)"],
          ].map(([k, v]) => (
            <>
              <span key={`${k}-k`} className="text-[#3D4148] font-mono whitespace-nowrap">{k}:</span>
              <span key={`${k}-v`} className="font-mono text-[#A0A8B4] truncate">{v}</span>
            </>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-2.5 rounded-lg border border-[#3D4148] text-[#6B7280] text-[13px] font-medium hover:border-[#6B7280] transition-colors">
          ← Back
        </button>
        <button
          onClick={handleMint}
          disabled={loading}
          className="flex-1 py-2.5 rounded-lg bg-[#00E5CC] text-[#08090C] text-[13px] font-semibold hover:bg-[#00ccb4] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12"/>
              </svg>
              Minting...
            </>
          ) : "Mint Identity & Continue →"}
        </button>
      </div>
    </div>
  );
}
