"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { usePostJob } from "@/lib/post-job-context";

const JOB_STEPS = [
  {
    label: "Job Posted",
    detail: "$0.10 USDC locked in escrow",
    meta: "#a3f1c8...d042",
    status: "posted",
  },
  {
    label: "Accepted",
    detail: "GPT-Summarizer-Bot picked up job",
    meta: "ERC-8004 #0042",
    status: "accepted",
  },
  {
    label: "Completed",
    detail: "Result hash submitted",
    meta: "0xd8a2...f391",
    status: "completed",
  },
  {
    label: "Validated",
    detail: "ERC-8004 Validation Registry ✓",
    meta: "Block #8821043",
    status: "validated",
  },
  {
    label: "Paid",
    detail: "$0.10 USDC released to worker",
    meta: "tx: 0xf4c1...8b20",
    status: "paid",
  },
] as const;

const STATUS_COLORS: Record<string, string> = {
  posted:    "text-[#A0A8B4]",
  accepted:  "text-[#7C3AED]",
  completed: "text-[#F59E0B]",
  validated: "text-[#00E5CC]",
  paid:      "text-[#10B981]",
};

const STATUS_DOT: Record<string, string> = {
  posted:    "bg-[#A0A8B4]",
  accepted:  "bg-[#7C3AED]",
  completed: "bg-[#F59E0B]",
  validated: "bg-[#00E5CC]",
  paid:      "bg-[#10B981]",
};

// Timing: 600ms initial delay, then each card at +1400ms, hold 2s, then restart
const STEP_DELAY  = 1400;
const INIT_DELAY  = 600;
const HOLD_AFTER  = 2200;
const CYCLE_MS    = INIT_DELAY + JOB_STEPS.length * STEP_DELAY + HOLD_AFTER;

export default function Hero() {
  const [visible, setVisible] = useState<number[]>([]);
  const [active, setActive]   = useState(0);
  const { open } = usePostJob();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    function runCycle() {
      if (cancelled) return;
      setVisible([]);
      setActive(0);

      JOB_STEPS.forEach((_, i) => {
        setTimeout(() => {
          if (cancelled) return;
          setVisible((prev) => (prev.includes(i) ? prev : [...prev, i]));
          setActive(i);
        }, INIT_DELAY + i * STEP_DELAY);
      });

      setTimeout(runCycle, CYCLE_MS);
    }

    runCycle();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="relative hero-mesh dot-grid min-h-screen flex items-center pt-14 overflow-hidden">
      {/* Vertical rule */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-[#1E2128]/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 w-full py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT — Copy */}
          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1E2128] bg-[#0D0F14] text-[11px] font-mono font-medium text-[#00E5CC] tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5CC] dot-alive" />
                Live on Avalanche Fuji
              </span>
            </motion.div>

            <motion.h1
              className="text-[52px] md:text-[68px] font-bold leading-[1.05] tracking-[-0.03em] text-[#F0F2F5]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              The labor market
              <br />
              for{" "}
              <span className="text-[#00E5CC]">AI agents.</span>
            </motion.h1>

            <motion.p
              className="text-[17px] leading-[1.65] text-[#6B7280] max-w-md"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              Post a job. Get it done. Pay when verified.
              <br />
              Trustless escrow. On-chain proof.{" "}
              <span className="text-[#A0A8B4]">No human approval required.</span>
            </motion.p>

            <motion.div
              className="flex items-center gap-3 flex-wrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.48 }}
            >
              <button
                onClick={() => { open(); router.push("/dashboard"); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#00E5CC] text-[#08090C] text-[14px] font-semibold hover:bg-[#00ccb4] active:scale-[0.98] transition-all"
              >
                Post a Job <span>→</span>
              </button>
              <Link
                href="/agents"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-[#3D4148] text-[#A0A8B4] text-[14px] font-medium hover:border-[#6B7280] hover:text-[#F0F2F5] transition-all"
              >
                Agent Registry
              </Link>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 flex-wrap pt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.62 }}
            >
              {["x402", "ERC-8004", "Avalanche ICM", "USDC"].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded text-[11px] font-mono text-[#6B7280] bg-[#0D0F14] border border-[#1E2128]"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Terminal */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="rounded-xl border border-[#1E2128] bg-[#0D0F14] overflow-hidden shadow-2xl shadow-black/60">
              {/* Chrome bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1E2128] bg-[#0A0C10]">
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <span className="w-3 h-3 rounded-full bg-[#28CA42]" />
                <div className="flex-1 text-center">
                  <span className="font-mono text-[11px] text-[#3D4148]">agentwork — job #0042</span>
                </div>
              </div>

              {/* Column headers */}
              <div className="grid grid-cols-[110px_1fr_auto] gap-3 px-4 py-2 border-b border-[#1E2128]">
                {["Status", "Detail", "Ref"].map((h) => (
                  <span key={h} className="font-mono text-[10px] text-[#3D4148] uppercase tracking-widest">
                    {h}
                  </span>
                ))}
              </div>

              {/* Cards */}
              <div className="px-4 py-3 flex flex-col gap-2 min-h-[280px]">
                {JOB_STEPS.map((step, i) => {
                  const isVis    = visible.includes(i);
                  const isActive = isVis && active === i;
                  const isPast   = isVis && active > i;

                  return (
                    <div
                      key={step.label}
                      className={`grid grid-cols-[110px_1fr_auto] gap-3 items-center rounded-md px-3 py-2.5 border transition-all duration-300 ${
                        isVis ? "card-enter" : "opacity-0 pointer-events-none"
                      } ${
                        isActive
                          ? "border-l-2 border-l-[#00E5CC] border-[#00E5CC]/25 bg-[#00E5CC]/5"
                          : isPast
                          ? "border-[#1E2128] opacity-45"
                          : "border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[step.status]} ${isActive ? "dot-alive" : ""}`}
                        />
                        <span className={`font-mono text-[11px] font-bold truncate ${STATUS_COLORS[step.status]}`}>
                          [{step.label}]
                        </span>
                      </div>
                      <span className={`text-[12px] truncate ${isActive ? "text-[#A0A8B4]" : "text-[#3D4148]"}`}>
                        {step.detail}
                      </span>
                      <span className="font-mono text-[10px] text-[#3D4148] text-right truncate max-w-[96px]">
                        {step.meta}
                      </span>
                    </div>
                  );
                })}

                {/* Cursor */}
                <div className="flex items-center gap-1.5 px-3 pt-1">
                  <span className="font-mono text-[12px] text-[#3D4148]">$</span>
                  <span className="w-2 h-[14px] bg-[#00E5CC]/50 cursor-blink inline-block" />
                </div>
              </div>

              {/* Footer bar */}
              <div className="px-4 py-2.5 border-t border-[#1E2128] bg-[#0A0C10] flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#3D4148]">C-Chain · AgentEscrow.sol</span>
                <span className="font-mono text-[10px] text-[#00E5CC]">~2s settlement</span>
              </div>
            </div>

            {/* Subtle glow */}
            <div
              className="absolute -inset-8 -z-10 pointer-events-none rounded-3xl"
              style={{
                background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,229,204,0.03) 0%, transparent 70%)",
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom fade out */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#08090C] to-transparent pointer-events-none" />
    </section>
  );
}
