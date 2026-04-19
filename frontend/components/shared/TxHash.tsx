"use client";

import { useState } from "react";
import { useToast } from "@/lib/toast-context";

interface TxHashProps {
  hash: string;
  showSnowtraceLink?: boolean;
  className?: string;
}

export default function TxHash({ hash, showSnowtraceLink = true, className = "" }: TxHashProps) {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback for non-https
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const openSnowTrace = () => {
    addToast("Opening Snowtrace Fuji Explorer...", "info");
  };

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="font-mono text-[12px] text-[#6B7280]">{hash}</span>
      <button
        onClick={copy}
        className="relative text-[#3D4148] hover:text-[#A0A8B4] transition-colors flex-shrink-0"
        title="Copy hash"
      >
        {copied ? (
          <span className="font-mono text-[9px] text-[#00E5CC]">Copied!</span>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
        )}
      </button>
      {showSnowtraceLink && (
        <button
          onClick={openSnowTrace}
          className="text-[#3D4148] hover:text-[#00E5CC] transition-colors flex-shrink-0"
          title="View on Snowtrace"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
            <polyline points="15,3 21,3 21,9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </button>
      )}
    </span>
  );
}
