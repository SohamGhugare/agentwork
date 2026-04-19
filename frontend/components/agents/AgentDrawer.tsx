"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Agent } from "@/lib/data";
import { JOBS } from "@/lib/data";
import StatusBadge from "@/components/shared/StatusBadge";
import { usePostJob } from "@/lib/post-job-context";

interface AgentDrawerProps {
  agent: Agent | null;
  onClose: () => void;
}

// Fake last-5 rep scores for the mini chart
const FAKE_SCORES = [4.6, 4.7, 4.5, 4.8, 4.9];

export default function AgentDrawer({ agent, onClose }: AgentDrawerProps) {
  const { open } = usePostJob();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = agent ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [agent]);

  const agentJobs = agent
    ? JOBS.filter(j => j.employerAgent === agent.id || j.workerAgent === agent.id).slice(0, 3)
    : [];

  const scores = agent ? FAKE_SCORES.map(s => Math.min(5, Math.max(1, s + (Math.random() * 0.4 - 0.2)))) : [];
  const maxScore = 5;

  return (
    <AnimatePresence>
      {agent && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-[#08090C]/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[420px] bg-[#0D0F14] border-l border-[#1E2128] flex flex-col overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-[#1E2128] sticky top-0 bg-[#0D0F14] z-10">
              <div className="flex flex-col gap-1">
                <h2 className="font-mono text-[16px] font-bold text-[#F0F2F5]">{agent.name}</h2>
                <span className="font-mono text-[11px] text-[#3D4148]">ERC-8004 {agent.erc8004Id}</span>
              </div>
              <button onClick={onClose} className="text-[#3D4148] hover:text-[#A0A8B4] transition-colors mt-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-6 p-6">
              {/* Identity */}
              <div className="flex flex-col gap-3 p-4 rounded-lg border border-[#1E2128] bg-[#0A0C10]">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[12px]">
                  {[
                    ["Owner", agent.owner],
                    ["Chain", agent.chain],
                    ["Registered", agent.registeredAt],
                    ["Success Rate", `${agent.successRate}%`],
                    ["Total Jobs", agent.totalJobs.toString()],
                    ["Price / Job", `$${agent.pricePerJob.toFixed(2)} USDC`],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <p className="text-[10px] text-[#3D4148] mb-0.5">{k}</p>
                      <p className="font-mono text-[11px] text-[#A0A8B4]">{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-[11px] text-[#3D4148] uppercase tracking-widest mb-2 font-mono">Description</p>
                <p className="text-[13px] text-[#6B7280] leading-relaxed">{agent.description}</p>
              </div>

              {/* Reputation mini chart */}
              <div>
                <p className="text-[11px] text-[#3D4148] uppercase tracking-widest mb-3 font-mono">Reputation History</p>
                <div className="flex items-end gap-1.5 h-16">
                  {scores.map((s, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-sm bg-[#00E5CC]/60 hover:bg-[#00E5CC] transition-colors"
                        style={{ height: `${(s / maxScore) * 100}%` }}
                      />
                      <span className="font-mono text-[9px] text-[#3D4148]">{s.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  <span className="font-mono text-[9px] text-[#3D4148]">job -4</span>
                  <span className="font-mono text-[9px] text-[#3D4148]">latest</span>
                </div>
              </div>

              {/* Capabilities */}
              <div>
                <p className="text-[11px] text-[#3D4148] uppercase tracking-widest mb-2 font-mono">Capabilities</p>
                <div className="flex flex-wrap gap-1.5">
                  {agent.capability.map(c => (
                    <span key={c} className="font-mono text-[10px] text-[#00E5CC] px-2 py-0.5 rounded border border-[#00E5CC]/20 bg-[#00E5CC]/5">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent jobs */}
              {agentJobs.length > 0 && (
                <div>
                  <p className="text-[11px] text-[#3D4148] uppercase tracking-widest mb-2 font-mono">Recent Jobs</p>
                  <div className="flex flex-col gap-2">
                    {agentJobs.map(job => (
                      <Link
                        key={job.id}
                        href={`/jobs/${job.id}`}
                        onClick={onClose}
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-[#1E2128] hover:border-[#3D4148] transition-colors"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[12px] text-[#A0A8B4] line-clamp-1">{job.taskDescription}</span>
                          <span className="font-mono text-[10px] text-[#3D4148]">#{job.id} · {job.capability}</span>
                        </div>
                        <StatusBadge status={job.status} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer CTA */}
            <div className="sticky bottom-0 p-6 border-t border-[#1E2128] bg-[#0D0F14]">
              <button
                onClick={() => { open({ capability: agent.capability[0], agentName: agent.name, price: agent.pricePerJob }); onClose(); }}
                disabled={agent.status !== "available"}
                className="w-full py-2.5 rounded-lg bg-[#00E5CC] text-[#08090C] text-[13px] font-semibold hover:bg-[#00ccb4] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Hire This Agent →
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
