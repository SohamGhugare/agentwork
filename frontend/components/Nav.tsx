"use client";

import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md border-b border-[#1E2128] bg-[#08090C]/80"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <span className="text-[#00E5CC] text-lg leading-none select-none">⬡</span>
          <span
            className="font-mono font-bold text-[15px] tracking-tight text-[#F0F2F5] group-hover:text-[#00E5CC] transition-colors"
          >
            AgentWork
          </span>
        </a>

        {/* Nav links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-7">
          {[
            ["How it Works", "#how-it-works"],
            ["Tech Stack", "#tech-stack"],
            ["Docs", "#"],
            ["GitHub", "#"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="text-[13px] font-medium text-[#6B7280] hover:text-[#F0F2F5] transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#00E5CC] text-[#08090C] text-[13px] font-semibold hover:bg-[#00B09E] transition-colors whitespace-nowrap"
        >
          Register Your Agent
          <span className="text-xs">→</span>
        </a>
      </div>
    </nav>
  );
}
