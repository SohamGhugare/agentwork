"use client";

import Link from "next/link";
import type { Job } from "@/lib/data";
import StatusBadge from "@/components/shared/StatusBadge";
import TxHash from "@/components/shared/TxHash";

const STEP_DOT: Record<string, string> = {
  open:      "bg-[#6B7280]",
  accepted:  "bg-[#F59E0B]",
  completed: "bg-[#60A5FA]",
  validated: "bg-[#7C3AED]",
  paid:      "bg-[#00E5CC]",
  expired:   "bg-[#FF5F57]",
};

const CHAIN_COLOR: Record<string, string> = {
  "C-Chain":    "text-[#00E5CC] bg-[#00E5CC]/8 border-[#00E5CC]/20",
  "DeFi-L1":    "text-[#7C3AED] bg-[#7C3AED]/8 border-[#7C3AED]/20",
  "Gaming-L1":  "text-[#F59E0B] bg-[#F59E0B]/8 border-[#F59E0B]/20",
};

const isActive = (job: Job, stepStatus: string) => {
  const order = ["open","accepted","completed","validated","paid","expired"];
  return order.indexOf(stepStatus) === order.indexOf(job.status);
};

export default function JobCard({ job }: { job: Job }) {
  const chainCls = CHAIN_COLOR[job.chain] ?? "text-[#6B7280] bg-[#6B7280]/8 border-[#6B7280]/20";
  const inProgress = ["accepted","completed"].includes(job.status);

  return (
    <div className={`rounded-xl border bg-[#0A0C10] transition-colors hover:border-[#3D4148] ${
      inProgress ? "border-[#F59E0B]/30" : "border-[#1E2128]"
    }`}>
      {/* Card header */}
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="font-mono text-[12px] text-[#3D4148]">#{job.id}</span>
          <StatusBadge status={job.status} />
          <span className="font-mono text-[10px] text-[#6B7280] px-2 py-0.5 rounded border border-[#1E2128]">
            {job.capability}
          </span>
          <span className={`font-mono text-[10px] px-2 py-0.5 rounded border ${chainCls}`}>
            {job.chain}
          </span>
        </div>
        <span className="font-mono text-[12px] text-[#00E5CC] whitespace-nowrap flex-shrink-0">
          ${job.paymentAmount.toFixed(2)}
        </span>
      </div>

      {/* Description */}
      <p className="px-4 pb-3 text-[13px] text-[#A0A8B4] leading-snug line-clamp-1">
        &ldquo;{job.taskDescription}&rdquo;
      </p>

      {/* Timeline */}
      <div className="px-4 pb-3 flex flex-col gap-1">
        {job.timeline.map((step, i) => {
          const active = isActive(job, step.status);
          return (
            <div
              key={i}
              className={`flex items-center gap-2.5 py-1 transition-opacity ${
                active ? "opacity-100" : i < job.timeline.length - 1 ? "opacity-40" : "opacity-100"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STEP_DOT[step.status] ?? "bg-[#3D4148]"} ${active && inProgress ? "dot-alive" : ""}`} />
              <span className={`font-mono text-[10px] font-bold w-[90px] flex-shrink-0 ${active ? "text-[#F0F2F5]" : "text-[#6B7280]"}`}>
                [{step.label}]
              </span>
              <span className="text-[11px] text-[#3D4148] truncate flex-1">{step.detail}</span>
              <TxHash hash={step.txHash} showSnowtraceLink={false} className="flex-shrink-0" />
              <span className="font-mono text-[10px] text-[#3D4148] flex-shrink-0">{step.timestamp}</span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-[#1E2128]">
        <div className="flex items-center gap-3 text-[11px] text-[#3D4148] font-mono">
          {job.status === "paid" && <span>~15s total</span>}
          <span>Zero human approvals</span>
          {job.icmMessageId && <span className="text-[#7C3AED]">ICM ↗</span>}
        </div>
        <Link
          href={`/jobs/${job.id}`}
          className="text-[12px] font-medium text-[#00E5CC] hover:text-[#F0F2F5] transition-colors"
        >
          View →
        </Link>
      </div>
    </div>
  );
}
