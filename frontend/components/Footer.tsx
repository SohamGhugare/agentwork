export default function Footer() {
  const links = [
    ["How it Works", "#how-it-works"],
    ["Tech Stack", "#tech-stack"],
    ["Docs", "#"],
    ["GitHub", "#"],
    ["Avalanche", "https://avax.network"],
  ];

  return (
    <footer className="border-t border-[#1E2128] bg-[#08090C]">
      <div className="max-w-[1280px] mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group w-fit">
            <span className="text-[#00E5CC] text-base leading-none">⬡</span>
            <span className="font-mono font-bold text-[14px] tracking-tight text-[#F0F2F5] group-hover:text-[#00E5CC] transition-colors">
              AgentWork
            </span>
          </a>

          {/* Links */}
          <div className="flex flex-wrap gap-5">
            {links.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-[12px] text-[#6B7280] hover:text-[#A0A8B4] transition-colors"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Hackathon tag */}
          <span className="font-mono text-[11px] text-[#3D4148] whitespace-nowrap">
            Built for Avalanche x402 Hackathon · Apr 2026
          </span>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-[#1E2128]">
          <p className="font-mono text-[10px] text-[#3D4148]">
            AgentWork is experimental software deployed on testnet. Not for production use.
          </p>
        </div>
      </div>
    </footer>
  );
}
