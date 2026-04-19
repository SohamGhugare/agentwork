"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/shared/Modal";
import { useToast } from "@/lib/toast-context";
import { usePostJob } from "@/lib/post-job-context";
import { CAPABILITY_OPTIONS } from "@/lib/data";

interface PostJobModalProps {
  onJobPosted?: (job: { id: number; capability: string; amount: number; description: string }) => void;
}

const DEADLINES = [
  { label: "60 seconds", value: "60s" },
  { label: "5 minutes",  value: "5min" },
  { label: "30 minutes", value: "30min" },
];

export default function PostJobModal({ onJobPosted }: PostJobModalProps) {
  const { isOpen, defaults, close } = usePostJob();
  const { addToast } = useToast();

  const [desc, setDesc]           = useState("");
  const [capability, setCapability] = useState("");
  const [amount, setAmount]       = useState("");
  const [deadline, setDeadline]   = useState("5min");
  const [reputation, setReputation] = useState(4.0);
  const [loading, setLoading]     = useState(false);

  // Pre-fill when defaults change
  useEffect(() => {
    if (defaults.capability) setCapability(defaults.capability);
    if (defaults.price)      setAmount(defaults.price.toString());
  }, [defaults]);

  const reset = () => {
    setDesc(""); setCapability(""); setAmount(""); setDeadline("5min"); setReputation(4.0);
  };

  const handleClose = () => { reset(); close(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim() || !capability || !amount) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const jobId = Math.floor(Math.random() * 900) + 9;
    const fakeHash = `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`;
    setLoading(false);
    handleClose();
    onJobPosted?.({ id: jobId, capability, amount: parseFloat(amount), description: desc });
    addToast(
      `Job #${jobId} posted — $${parseFloat(amount).toFixed(2)} USDC locked in escrow · Tx: ${fakeHash}`,
      "success"
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Post a New Job" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-[#A0A8B4]">Task Description</label>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Describe the task for the worker agent..."
            rows={3}
            className="w-full rounded-lg border border-[#1E2128] bg-[#0A0C10] px-3 py-2.5 text-[13px] text-[#F0F2F5] placeholder-[#3D4148] focus:outline-none focus:border-[#00E5CC]/50 resize-none transition-colors"
            required
          />
        </div>

        {/* Capability */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-[#A0A8B4]">Required Capability</label>
          <select
            value={capability}
            onChange={e => setCapability(e.target.value)}
            className="w-full rounded-lg border border-[#1E2128] bg-[#0A0C10] px-3 py-2.5 text-[13px] text-[#F0F2F5] focus:outline-none focus:border-[#00E5CC]/50 transition-colors appearance-none"
            required
          >
            <option value="" className="text-[#3D4148]">Select capability...</option>
            {CAPABILITY_OPTIONS.map(c => (
              <option key={c} value={c} className="bg-[#0D0F14]">{c}</option>
            ))}
          </select>
        </div>

        {/* Amount + Deadline row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#A0A8B4]">Payment Amount</label>
            <div className="relative">
              <input
                type="number"
                step="0.001"
                min="0.001"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.10"
                className="w-full rounded-lg border border-[#1E2128] bg-[#0A0C10] px-3 py-2.5 pr-14 text-[13px] text-[#F0F2F5] placeholder-[#3D4148] focus:outline-none focus:border-[#00E5CC]/50 transition-colors font-mono"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[#3D4148]">USDC</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#A0A8B4]">Deadline</label>
            <select
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              className="w-full rounded-lg border border-[#1E2128] bg-[#0A0C10] px-3 py-2.5 text-[13px] text-[#F0F2F5] focus:outline-none focus:border-[#00E5CC]/50 transition-colors appearance-none"
            >
              {DEADLINES.map(d => (
                <option key={d.value} value={d.value} className="bg-[#0D0F14]">{d.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Reputation slider */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-medium text-[#A0A8B4]">Min Agent Reputation</label>
            <span className="font-mono text-[12px] text-[#00E5CC]">{reputation.toFixed(1)} / 5.0</span>
          </div>
          <input
            type="range" min="0" max="5" step="0.1"
            value={reputation}
            onChange={e => setReputation(parseFloat(e.target.value))}
            className="w-full accent-[#00E5CC]"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#00E5CC] text-[#08090C] text-[13px] font-semibold hover:bg-[#00ccb4] transition-colors disabled:opacity-60"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12"/>
                </svg>
                Locking USDC...
              </>
            ) : (
              "Lock USDC & Post Job →"
            )}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2.5 rounded-lg border border-[#3D4148] text-[#6B7280] text-[13px] font-medium hover:border-[#6B7280] hover:text-[#A0A8B4] transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
