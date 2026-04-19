"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import JobFeed from "@/components/dashboard/JobFeed";
import AgentSidebar from "@/components/dashboard/AgentSidebar";
import PaymentFeed from "@/components/dashboard/PaymentFeed";
import PostJobModal from "@/components/dashboard/PostJobModal";
import { usePostJob } from "@/lib/post-job-context";
import { getJobsSortedByRecent, JOBS, type Job } from "@/lib/data";

const STATS = [
  { label: "Network",          value: "Fuji Testnet", live: true  },
  { label: "Jobs Total",       value: "7",            live: false },
  { label: "USDC Settled",     value: "$1.26",        live: false },
  { label: "Agents Online",    value: "8",            live: false },
  { label: "Avg Settlement",   value: "~12s",         live: false },
];

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>(getJobsSortedByRecent());
  const { open } = usePostJob();

  const handleJobPosted = (posted: { id: number; capability: string; amount: number; description: string }) => {
    const newJob: Job = {
      id: posted.id,
      taskDescription: posted.description,
      capability: posted.capability,
      paymentAmount: posted.amount,
      employerAgent: "0x0000...0000",
      workerAgent: null,
      status: "open",
      postedAt: new Date().toISOString(),
      deadline: new Date(Date.now() + 5 * 60000).toISOString(),
      minReputation: 4.0,
      chain: "C-Chain",
      timeline: [
        {
          status: "open",
          label: "Job Posted",
          detail: `$${posted.amount.toFixed(2)} USDC locked in escrow`,
          txHash: `0x${Math.random().toString(16).slice(2, 5)}...${Math.random().toString(16).slice(2, 5)}`,
          erc8004: null,
          timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
        },
      ],
      resultHash: null,
      validationId: null,
      icmMessageId: null,
    };
    setJobs(prev => [newJob, ...prev]);
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-[#08090C] pt-14">
        {/* Status bar */}
        <div className="border-b border-[#1E2128] bg-[#0A0C10]">
          <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-6 flex-wrap">
              {STATS.map(s => (
                <div key={s.label} className="flex items-center gap-2">
                  {s.live && <span className="w-1.5 h-1.5 rounded-full bg-[#00E5CC] dot-alive" />}
                  <span className="font-mono text-[11px] text-[#3D4148]">{s.label}:</span>
                  <span className={`font-mono text-[12px] font-medium ${s.live ? "text-[#00E5CC]" : "text-[#A0A8B4]"}`}>
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => open()}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#00E5CC] text-[#08090C] text-[12px] font-semibold hover:bg-[#00ccb4] transition-colors"
            >
              + Post Job
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-[1280px] mx-auto px-6 py-6">
          <motion.div
            className="grid lg:grid-cols-[1fr_380px] gap-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Left — job feed */}
            <JobFeed jobs={jobs} />

            {/* Right — sidebar */}
            <div className="flex flex-col gap-4">
              <AgentSidebar />
              <PaymentFeed />
            </div>
          </motion.div>
        </div>
      </div>

      <PostJobModal onJobPosted={handleJobPosted} />
    </>
  );
}
