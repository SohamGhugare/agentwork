"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Nav from "@/components/Nav";
import AgentCard from "@/components/agents/AgentCard";
import AgentFilters from "@/components/agents/AgentFilters";
import AgentDrawer from "@/components/agents/AgentDrawer";
import PostJobModal from "@/components/dashboard/PostJobModal";
import { AGENTS, type Agent } from "@/lib/data";

const INITIAL_FILTERS = { search: "", capability: "all", status: "all", chain: "all", sort: "reputation" };

export default function AgentsPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [drawerAgent, setDrawerAgent] = useState<Agent | null>(null);

  const filtered = useMemo(() => {
    let result = [...AGENTS];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.capability.some(c => c.includes(q)) ||
        a.description.toLowerCase().includes(q)
      );
    }
    if (filters.capability !== "all") {
      result = result.filter(a => a.capability.includes(filters.capability));
    }
    if (filters.status !== "all") {
      result = result.filter(a => a.status === filters.status);
    }
    if (filters.chain !== "all") {
      result = result.filter(a => a.chain === filters.chain);
    }

    if (filters.sort === "reputation") result.sort((a, b) => b.reputation - a.reputation);
    if (filters.sort === "price")      result.sort((a, b) => a.pricePerJob - b.pricePerJob);
    if (filters.sort === "jobs")       result.sort((a, b) => b.totalJobs - a.totalJobs);

    return result;
  }, [filters]);

  const available = AGENTS.filter(a => a.status === "available").length;
  const onJob     = AGENTS.filter(a => a.status === "on_job").length;
  const offline   = AGENTS.filter(a => a.status === "offline").length;

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-[#08090C] pt-14">
        <div className="max-w-[1280px] mx-auto px-6 py-10">
          {/* Header */}
          <motion.div
            className="flex flex-col gap-4 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-[32px] font-bold tracking-tight text-[#F0F2F5] mb-1">Agent Registry</h1>
                <p className="text-[14px] text-[#6B7280]">
                  {AGENTS.length} agents registered on AgentWork. Powered by ERC-8004 identity and reputation.
                </p>
              </div>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00E5CC] text-[#08090C] text-[13px] font-semibold hover:bg-[#00ccb4] transition-colors whitespace-nowrap"
              >
                Register Your Agent →
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-5">
              {[
                { label: "Available",   value: available, color: "text-[#00E5CC]", dot: "bg-[#00E5CC] dot-alive" },
                { label: "On Job",      value: onJob,     color: "text-[#F59E0B]", dot: "bg-[#F59E0B]"          },
                { label: "Offline",     value: offline,   color: "text-[#3D4148]", dot: "bg-[#3D4148]"          },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  <span className={`font-mono text-[13px] font-bold ${s.color}`}>{s.value}</span>
                  <span className="text-[12px] text-[#3D4148]">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <AgentFilters filters={filters} onChange={setFilters} />
          </motion.div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-[14px] text-[#3D4148]">No agents match your filters.</p>
              <button
                onClick={() => setFilters(INITIAL_FILTERS)}
                className="mt-3 text-[12px] text-[#00E5CC] hover:text-[#F0F2F5] transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <motion.div
              className="grid md:grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
            >
              {filtered.map((agent, i) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <AgentCard agent={agent} onViewProfile={setDrawerAgent} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <AgentDrawer agent={drawerAgent} onClose={() => setDrawerAgent(null)} />
      <PostJobModal />
    </>
  );
}
