import type { JobStatus } from "@/lib/data";

const CONFIG: Record<JobStatus, { label: string; className: string }> = {
  open:      { label: "OPEN",      className: "text-[#6B7280] bg-[#6B7280]/10 border-[#6B7280]/25" },
  accepted:  { label: "ACCEPTED",  className: "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/25" },
  completed: { label: "COMPLETED", className: "text-[#60A5FA] bg-[#60A5FA]/10 border-[#60A5FA]/25" },
  validated: { label: "VALIDATED", className: "text-[#7C3AED] bg-[#7C3AED]/10 border-[#7C3AED]/25" },
  paid:      { label: "PAID",      className: "text-[#00E5CC] bg-[#00E5CC]/10 border-[#00E5CC]/25" },
  expired:   { label: "EXPIRED",   className: "text-[#FF5F57] bg-[#FF5F57]/10 border-[#FF5F57]/25" },
};

export default function StatusBadge({ status }: { status: JobStatus }) {
  const { label, className } = CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold tracking-widest border ${className}`}>
      {label}
    </span>
  );
}
