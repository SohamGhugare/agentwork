"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import StatusBadge from "@/components/shared/StatusBadge";
import JobTimeline from "@/components/jobs/JobTimeline";
import JobParties from "@/components/jobs/JobParties";
import RawJobData from "@/components/jobs/RawJobData";
import { useToast } from "@/lib/toast-context";
import { JOBS, getJobById } from "@/lib/data";

const SORTED_IDS = [...JOBS].sort((a, b) => a.id - b.id).map(j => j.id);

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToast } = useToast();
  const jobId = parseInt(id, 10);
  const job = getJobById(jobId) ?? getJobById(4)!;

  const currentIdx = SORTED_IDS.indexOf(job.id);
  const prevId = currentIdx > 0 ? SORTED_IDS[currentIdx - 1] : null;
  const nextId = currentIdx < SORTED_IDS.length - 1 ? SORTED_IDS[currentIdx + 1] : null;

  const totalSeconds = (() => {
    if (job.timeline.length < 2) return null;
    const first = job.timeline[0].timestamp;
    const last  = job.timeline[job.timeline.length - 1].timestamp;
    const toSec = (t: string) => {
      const [h, m, s] = t.split(":").map(Number);
      return h * 3600 + m * 60 + s;
    };
    return toSec(last) - toSec(first);
  })();

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-[#08090C] pt-14">
        <div className="max-w-[900px] mx-auto px-6 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-[12px] font-mono">
            <Link href="/dashboard" className="text-[#3D4148] hover:text-[#6B7280] transition-colors">
              Dashboard
            </Link>
            <span className="text-[#1E2128]">/</span>
            <span className="text-[#A0A8B4]">Job #{job.id}</span>
          </div>

          <motion.div
            className="flex flex-col gap-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Header */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <h1 className="text-[28px] font-bold tracking-tight text-[#F0F2F5]">
                  Job #{job.id}
                </h1>
                <StatusBadge status={job.status} />
              </div>
              <p className="text-[15px] text-[#A0A8B4] leading-snug">
                &ldquo;{job.taskDescription}&rdquo;
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono text-[11px] text-[#3D4148]">Posted {job.postedAt.replace("T", " ").replace("Z", " UTC")}</span>
                <span className="text-[#1E2128]">·</span>
                <span className="font-mono text-[11px] text-[#3D4148]">{job.chain}</span>
                {totalSeconds !== null && (
                  <>
                    <span className="text-[#1E2128]">·</span>
                    <span className="font-mono text-[11px] text-[#3D4148]">{totalSeconds}s total time</span>
                  </>
                )}
              </div>

              {/* Key stats */}
              <div className="flex flex-wrap gap-3 pt-1">
                <div className="px-3 py-2 rounded-lg border border-[#1E2128] bg-[#0A0C10]">
                  <span className="font-mono text-[11px] text-[#3D4148] block mb-0.5">Payment</span>
                  <span className="font-mono text-[14px] font-bold text-[#00E5CC]">${job.paymentAmount.toFixed(2)} USDC</span>
                </div>
                <div className="px-3 py-2 rounded-lg border border-[#1E2128] bg-[#0A0C10]">
                  <span className="font-mono text-[11px] text-[#3D4148] block mb-0.5">Capability</span>
                  <span className="font-mono text-[13px] text-[#A0A8B4]">{job.capability}</span>
                </div>
                <div className="px-3 py-2 rounded-lg border border-[#1E2128] bg-[#0A0C10]">
                  <span className="font-mono text-[11px] text-[#3D4148] block mb-0.5">Min Reputation</span>
                  <span className="font-mono text-[13px] text-[#A0A8B4]">★ {job.minReputation.toFixed(1)}</span>
                </div>
                {job.validationId && (
                  <div className="px-3 py-2 rounded-lg border border-[#7C3AED]/25 bg-[#7C3AED]/5">
                    <span className="font-mono text-[11px] text-[#7C3AED]/60 block mb-0.5">ERC-8004 Validation</span>
                    <span className="font-mono text-[13px] text-[#7C3AED]">{job.validationId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h2 className="text-[13px] font-mono font-medium text-[#3D4148] uppercase tracking-widest mb-5">
                Job Lifecycle
              </h2>
              <JobTimeline steps={job.timeline} resultHash={job.resultHash} />
            </div>

            {/* ICM section */}
            {job.icmMessageId && (
              <div className="rounded-xl border border-[#7C3AED]/25 bg-[#7C3AED]/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-[11px] text-[#7C3AED] font-bold">Cross-L1 Dispatch via ICM</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div>
                    <span className="font-mono text-[10px] text-[#3D4148] block mb-0.5">Warp Message ID</span>
                    <span className="font-mono text-[11px] text-[#6B7280] break-all">{job.icmMessageId}</span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#3D4148] block mb-0.5">Route</span>
                    <span className="font-mono text-[12px] text-[#A0A8B4]">{job.chain} → C-Chain</span>
                  </div>
                  <button
                    onClick={() => addToast("Opening ICM message on Snowtrace...", "info")}
                    className="self-start text-[11px] font-mono text-[#7C3AED] hover:text-[#F0F2F5] transition-colors mt-1"
                  >
                    ↗ View ICM Message on Snowtrace
                  </button>
                </div>
              </div>
            )}

            {/* Parties */}
            <div>
              <h2 className="text-[13px] font-mono font-medium text-[#3D4148] uppercase tracking-widest mb-4">
                Parties
              </h2>
              <JobParties job={job} />
            </div>

            {/* Raw data */}
            <RawJobData job={job} />

            {/* Prev / next nav */}
            <div className="flex items-center justify-between pt-2 border-t border-[#1E2128]">
              {prevId ? (
                <Link
                  href={`/jobs/${prevId}`}
                  className="flex items-center gap-1.5 text-[12px] font-mono text-[#6B7280] hover:text-[#F0F2F5] transition-colors"
                >
                  ← Job #{prevId}
                </Link>
              ) : <span />}
              {nextId ? (
                <Link
                  href={`/jobs/${nextId}`}
                  className="flex items-center gap-1.5 text-[12px] font-mono text-[#6B7280] hover:text-[#F0F2F5] transition-colors"
                >
                  Job #{nextId} →
                </Link>
              ) : <span />}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
