"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePostJob } from "@/lib/post-job-context";

const APP_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Agents",    href: "/agents"    },
  { label: "Jobs",      href: "/jobs/4"    },
];

const LANDING_LINKS = [
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Tech Stack",   href: "/#tech-stack"   },
  { label: "Docs",         href: "#"              },
  { label: "GitHub",       href: "#"              },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isApp = pathname !== "/";
  const { open } = usePostJob();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = isApp ? APP_LINKS : LANDING_LINKS;

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || isApp
          ? "backdrop-blur-md border-b border-[#1E2128] bg-[#08090C]/90"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <span className="text-[#00E5CC] text-lg leading-none select-none">⬡</span>
          <span className="font-mono font-bold text-[15px] tracking-tight text-[#F0F2F5] group-hover:text-[#00E5CC] transition-colors">
            AgentWork
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(({ label, href }) => {
            const active = isApp && pathname.startsWith(href.split("/").slice(0, 2).join("/"));
            return (
              <Link
                key={label}
                href={href}
                className={`text-[13px] font-medium transition-colors ${
                  active
                    ? "text-[#00E5CC]"
                    : "text-[#6B7280] hover:text-[#F0F2F5]"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isApp && (
            <button
              onClick={() => open()}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#3D4148] text-[#A0A8B4] text-[12px] font-medium hover:border-[#6B7280] hover:text-[#F0F2F5] transition-all"
            >
              + Post Job
            </button>
          )}
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#00E5CC] text-[#08090C] text-[13px] font-semibold hover:bg-[#00B09E] transition-colors whitespace-nowrap"
          >
            Register Agent
            <span className="text-xs">→</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
