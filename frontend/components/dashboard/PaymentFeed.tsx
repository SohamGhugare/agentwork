"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RECENT_PAYMENTS, type Payment } from "@/lib/data";
import { useToast } from "@/lib/toast-context";

const FAKE_CYCLE: Omit<Payment, "id">[] = [
  { type: "registry-query", amount: 0.001, from: "ReportWriter-AI",  to: "ServiceRegistry",   description: "x402 registry query · report-generation", timestamp: "", txHash: "0x2b3c...4d5e" },
  { type: "job-escrow",     amount: 0.35,  from: "ReportWriter-AI",  to: "AgentEscrow",        description: "Job #9 escrow lock",                       timestamp: "", txHash: "0x6f7a...8b9c" },
  { type: "registry-query", amount: 0.001, from: "SentimentBot",     to: "ServiceRegistry",   description: "x402 registry query · sentiment-analysis",  timestamp: "", txHash: "0x0d1e...2f3a" },
  { type: "job-payout",     amount: 0.15,  from: "AgentEscrow",      to: "AudioTranscribe",    description: "Job #8 payout",                            timestamp: "", txHash: "0x4b5c...6d7e" },
];

const TYPE_COLOR: Record<string, string> = {
  "registry-query": "bg-[#3D4148]",
  "job-payout":     "bg-[#00E5CC]",
  "job-escrow":     "bg-[#F59E0B]",
  "refund":         "bg-[#FF5F57]",
};

function now() {
  return new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function PaymentFeed() {
  const [payments, setPayments] = useState<Payment[]>(() =>
    [...RECENT_PAYMENTS].reverse()
  );
  const { addToast } = useToast();
  const cycleIdx = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const template = FAKE_CYCLE[cycleIdx.current % FAKE_CYCLE.length];
      cycleIdx.current++;
      const newPayment: Payment = {
        ...template,
        id: Date.now(),
        timestamp: now(),
      };
      setPayments(prev => [newPayment, ...prev.slice(0, 14)]);
      addToast(
        `${newPayment.description} · $${newPayment.amount.toFixed(3)}`,
        newPayment.type === "refund" ? "error" : "info"
      );
    }, 8000);
    return () => clearInterval(interval);
  }, [addToast]);

  return (
    <div className="rounded-xl border border-[#1E2128] bg-[#0A0C10] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E2128]">
        <h3 className="text-[13px] font-semibold text-[#F0F2F5]">Payment Feed</h3>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E5CC] dot-alive" />
          <span className="font-mono text-[10px] text-[#00E5CC]">x402</span>
        </span>
      </div>
      <div className="flex flex-col divide-y divide-[#1E2128] max-h-[340px] overflow-y-auto">
        <AnimatePresence mode="popLayout" initial={false}>
          {payments.map(p => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#0D0F14] transition-colors"
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${TYPE_COLOR[p.type] ?? "bg-[#3D4148]"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-[#6B7280] truncate">{p.description}</p>
                <p className="font-mono text-[10px] text-[#3D4148] truncate">{p.from} → {p.to}</p>
              </div>
              <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                <span className={`font-mono text-[12px] font-bold ${p.type === "refund" ? "text-[#FF5F57]" : p.type === "job-payout" ? "text-[#00E5CC]" : "text-[#A0A8B4]"}`}>
                  ${p.amount.toFixed(3)}
                </span>
                <span className="font-mono text-[9px] text-[#3D4148]">{p.timestamp}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
