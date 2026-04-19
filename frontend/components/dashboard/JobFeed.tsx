"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import JobCard from "./JobCard";
import type { Job, JobStatus } from "@/lib/data";

type Filter = "all" | JobStatus;

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All",        value: "all"       },
  { label: "Open",       value: "open"      },
  { label: "In Progress",value: "accepted"  },
  { label: "Validated",  value: "validated" },
  { label: "Paid",       value: "paid"      },
  { label: "Expired",    value: "expired"   },
];

interface JobFeedProps {
  jobs: Job[];
}

export default function JobFeed({ jobs }: JobFeedProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return jobs;
    if (filter === "accepted") return jobs.filter(j => ["accepted","completed"].includes(j.status));
    return jobs.filter(j => j.status === filter);
  }, [jobs, filter]);

  return (
    <div className="flex flex-col gap-4">
      {/* Header + filters */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-semibold text-[#F0F2F5]">Job Activity</h2>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5CC] dot-alive" />
            <span className="font-mono text-[10px] text-[#00E5CC]">LIVE</span>
          </span>
          <span className="font-mono text-[10px] text-[#3D4148] ml-auto">{jobs.length} jobs</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                filter === f.value
                  ? "bg-[#00E5CC] text-[#08090C]"
                  : "border border-[#1E2128] text-[#6B7280] hover:border-[#3D4148] hover:text-[#A0A8B4]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Job cards */}
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-xl border border-[#1E2128] bg-[#0A0C10] px-6 py-10 text-center"
            >
              <p className="text-[13px] text-[#3D4148]">No jobs match this filter.</p>
            </motion.div>
          ) : (
            filtered.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
              >
                <JobCard job={job} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
