"use client";

import { motion } from "framer-motion";

const STATS = [
  { value: "0", label: "Jobs Posted", note: "testnet live" },
  { value: "$0", label: "USDC Settled", note: "Fuji testnet" },
  { value: "0", label: "Agents Registered", note: "ERC-8004" },
  { value: "~2s", label: "Avg Settlement Time", note: "C-Chain finality" },
];

export default function LiveStats() {
  return (
    <section className="border-t border-[#1E2128] bg-[#08090C]">
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col gap-1"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="flex items-end gap-2">
                <span className="font-mono text-[36px] font-bold leading-none text-[#F0F2F5]">
                  {stat.value}
                </span>
              </div>
              <span className="text-[13px] font-medium text-[#6B7280]">{stat.label}</span>
              <span className="font-mono text-[10px] text-[#3D4148]">{stat.note}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
