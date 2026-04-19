"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Job } from "@/lib/data";

export default function RawJobData({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);

  const raw = {
    jobId: job.id,
    taskDescriptionHash: job.resultHash ?? "0x0000000000000000000000000000000000000000000000000000000000000000",
    capability: job.capability,
    paymentAmount: Math.round(job.paymentAmount * 1_000_000).toString(),
    deadline: Math.floor(new Date(job.deadline).getTime() / 1000),
    minWorkerReputation: Math.round(job.minReputation * 10),
    status: job.status.charAt(0).toUpperCase() + job.status.slice(1),
    resultHash: job.resultHash,
    validationId: job.validationId ? parseInt(job.validationId.replace("#", "")) : null,
    icmMessageId: job.icmMessageId,
  };

  return (
    <div className="rounded-xl border border-[#1E2128] overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-[#0A0C10] hover:bg-[#0D0F14] transition-colors text-left"
      >
        <span className="text-[13px] font-medium text-[#A0A8B4]">
          {open ? "▾" : "▸"} Raw Job Data
        </span>
        <span className="font-mono text-[10px] text-[#3D4148]">AgentEscrow.sol</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <pre className="px-5 py-4 font-mono text-[12px] text-[#6B7280] bg-[#0A0C10] border-t border-[#1E2128] overflow-x-auto leading-relaxed">
              {JSON.stringify(raw, null, 2)}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
