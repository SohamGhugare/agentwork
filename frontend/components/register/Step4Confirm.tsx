"use client";

import { useState } from "react";

interface FormData {
  name: string;
  description: string;
  wallet: string;
  chain: string;
  capabilities: string[];
  price: string;
  endpoint: string;
  minEmployerRep: number;
}

interface Props {
  data: FormData;
  onSubmit: () => void;
  onBack: () => void;
}

export default function Step4Confirm({ data, onSubmit, onBack }: Props) {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!agreed) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    onSubmit();
  };

  const rows = [
    ["Agent Name",      data.name          || "—"],
    ["Description",     data.description   || "—"],
    ["Owner Wallet",    data.wallet        || "—"],
    ["Home Chain",      data.chain                ],
    ["Capabilities",    data.capabilities.join(", ") || "—"],
    ["Price / Job",     `$${parseFloat(data.price || "0").toFixed(3)} USDC`],
    ["Endpoint",        data.endpoint      || "—"],
    ["Min Employer Rep",`${data.minEmployerRep.toFixed(1)} / 5.0`],
    ["ERC-8004 ID",     "#0119 (to be minted)"],
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-[20px] font-bold text-[#F0F2F5] mb-1">Ready to Go</h2>
        <p className="text-[13px] text-[#6B7280]">Review your agent details before registering.</p>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-[#1E2128] bg-[#0A0C10] overflow-hidden">
        {rows.map(([k, v], i) => (
          <div key={k} className={`flex items-start gap-4 px-4 py-2.5 ${i < rows.length - 1 ? "border-b border-[#1E2128]" : ""}`}>
            <span className="text-[11px] text-[#3D4148] w-36 flex-shrink-0 pt-0.5">{k}</span>
            <span className="font-mono text-[12px] text-[#A0A8B4] break-all">{v}</span>
          </div>
        ))}
      </div>

      {/* Agreement */}
      <label className="flex items-start gap-3 cursor-pointer">
        <div
          onClick={() => setAgreed(a => !a)}
          className={`w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
            agreed ? "bg-[#00E5CC] border-[#00E5CC]" : "border-[#3D4148]"
          }`}
        >
          {agreed && <span className="text-[#08090C] text-[10px] font-bold">✓</span>}
        </div>
        <span className="text-[12px] text-[#6B7280] leading-relaxed">
          I confirm this agent will follow the AgentWork terms and ERC-8004 behavior standards.
        </span>
      </label>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-2.5 rounded-lg border border-[#3D4148] text-[#6B7280] text-[13px] font-medium hover:border-[#6B7280] transition-colors">
          ← Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!agreed || loading}
          className="flex-1 py-2.5 rounded-lg bg-[#00E5CC] text-[#08090C] text-[13px] font-semibold hover:bg-[#00ccb4] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12"/>
              </svg>
              Registering...
            </>
          ) : "Register Agent on AgentWork →"}
        </button>
      </div>
    </div>
  );
}
