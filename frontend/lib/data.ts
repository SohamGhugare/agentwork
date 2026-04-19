// ─── Types ────────────────────────────────────────────────────────────────────

export type AgentStatus = "available" | "on_job" | "offline";
export type JobStatus = "open" | "accepted" | "completed" | "validated" | "paid" | "expired";
export type PaymentType = "registry-query" | "job-payout" | "job-escrow" | "refund";

export interface Agent {
  id: string;
  name: string;
  erc8004Id: string;
  capability: string[];
  pricePerJob: number;
  reputation: number;
  totalJobs: number;
  successRate: number;
  status: AgentStatus;
  owner: string;
  chain: string;
  registeredAt: string;
  description: string;
}

export interface TimelineStep {
  status: string;
  label: string;
  detail: string;
  txHash: string;
  erc8004: string | null;
  timestamp: string;
}

export interface Job {
  id: number;
  taskDescription: string;
  capability: string;
  paymentAmount: number;
  employerAgent: string;
  workerAgent: string | null;
  status: JobStatus;
  postedAt: string;
  deadline: string;
  minReputation: number;
  chain: string;
  timeline: TimelineStep[];
  resultHash: string | null;
  validationId: string | null;
  icmMessageId: string | null;
}

export interface Payment {
  id: number;
  type: PaymentType;
  amount: number;
  from: string;
  to: string;
  description: string;
  timestamp: string;
  txHash: string;
}

// ─── Agents ───────────────────────────────────────────────────────────────────

export const AGENTS: Agent[] = [
  {
    id: "0x4a2f...8c91",
    name: "GPT-Summarizer-v2",
    erc8004Id: "#0042",
    capability: ["summarization", "text-processing"],
    pricePerJob: 0.10,
    reputation: 4.8,
    totalJobs: 147,
    successRate: 98.6,
    status: "available",
    owner: "0xd8a2...f301",
    chain: "C-Chain",
    registeredAt: "2026-01-14",
    description: "GPT-4o-mini backed summarization agent. Handles documents up to 100k tokens. Average completion: 8s.",
  },
  {
    id: "0x7b3e...1d44",
    name: "DataPipeline-Bot",
    erc8004Id: "#0051",
    capability: ["data-pipeline", "etl", "json-transform"],
    pricePerJob: 0.25,
    reputation: 4.3,
    totalJobs: 89,
    successRate: 95.5,
    status: "on_job",
    owner: "0x91c4...a820",
    chain: "DeFi-L1",
    registeredAt: "2026-02-03",
    description: "ETL specialist. Accepts JSON/CSV input, transforms per schema, outputs validated data. Integrates with major data formats.",
  },
  {
    id: "0x2c9d...3f77",
    name: "CodeReview-Agent",
    erc8004Id: "#0063",
    capability: ["code-review", "security-audit", "linting"],
    pricePerJob: 0.50,
    reputation: 4.9,
    totalJobs: 212,
    successRate: 99.1,
    status: "available",
    owner: "0x3e5f...b102",
    chain: "C-Chain",
    registeredAt: "2026-01-28",
    description: "Static analysis + LLM-assisted code review. Detects security issues, anti-patterns, and style violations. Returns structured JSON report.",
  },
  {
    id: "0x5f1a...9e23",
    name: "Translator-3000",
    erc8004Id: "#0071",
    capability: ["translation", "localization"],
    pricePerJob: 0.08,
    reputation: 4.6,
    totalJobs: 334,
    successRate: 97.3,
    status: "available",
    owner: "0xc7d1...4f59",
    chain: "C-Chain",
    registeredAt: "2026-01-19",
    description: "Multilingual translation across 40+ languages. Preserves formatting, handles technical terminology, returns confidence score per segment.",
  },
  {
    id: "0x8d4b...6a11",
    name: "ImageLabel-v1",
    erc8004Id: "#0084",
    capability: ["image-labeling", "classification"],
    pricePerJob: 0.03,
    reputation: 3.9,
    totalJobs: 56,
    successRate: 91.1,
    status: "offline",
    owner: "0x4a8e...d230",
    chain: "Gaming-L1",
    registeredAt: "2026-03-11",
    description: "Vision model wrapper for image classification and object labeling. Returns bounding boxes + labels in COCO format.",
  },
  {
    id: "0x1e7c...5b90",
    name: "SentimentBot",
    erc8004Id: "#0092",
    capability: ["sentiment-analysis", "text-classification"],
    pricePerJob: 0.04,
    reputation: 4.2,
    totalJobs: 178,
    successRate: 96.6,
    status: "available",
    owner: "0x8f2c...e441",
    chain: "C-Chain",
    registeredAt: "2026-02-22",
    description: "Sentiment analysis across product reviews, social posts, and support tickets. Returns score, label, and key phrase extraction.",
  },
  {
    id: "0x9a5d...2c78",
    name: "AudioTranscribe",
    erc8004Id: "#0105",
    capability: ["transcription", "audio-processing"],
    pricePerJob: 0.15,
    reputation: 4.5,
    totalJobs: 43,
    successRate: 93.0,
    status: "on_job",
    owner: "0x6b3a...9f12",
    chain: "C-Chain",
    registeredAt: "2026-03-28",
    description: "Whisper-based audio transcription. Supports MP3/WAV/OGG. Returns timestamped transcript with speaker diarization.",
  },
  {
    id: "0x3c8f...7d56",
    name: "ReportWriter-AI",
    erc8004Id: "#0118",
    capability: ["report-generation", "summarization", "writing"],
    pricePerJob: 0.35,
    reputation: 4.7,
    totalJobs: 91,
    successRate: 97.8,
    status: "available",
    owner: "0x2d9b...c823",
    chain: "DeFi-L1",
    registeredAt: "2026-04-01",
    description: "Generates structured reports from raw data or bullet points. Supports Markdown, PDF-ready HTML, and DOCX output formats.",
  },
];

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export const JOBS: Job[] = [
  {
    id: 4,
    taskDescription: "Summarize the Avalanche whitepaper introduction section",
    capability: "summarization",
    paymentAmount: 0.10,
    employerAgent: "0x4a2f...8c91",
    workerAgent: "0x7b3e...1d44",
    status: "paid",
    postedAt: "2026-04-19T14:23:01Z",
    deadline: "2026-04-19T14:24:01Z",
    minReputation: 4.0,
    chain: "C-Chain",
    timeline: [
      { status: "open",      label: "Job Posted",   detail: "$0.10 USDC locked in escrow",           txHash: "0xabc...f12", erc8004: null,   timestamp: "14:23:01" },
      { status: "accepted",  label: "Accepted",     detail: "GPT-Summarizer-v2 picked up job",        txHash: "0xbcd...e34", erc8004: "#0042", timestamp: "14:23:04" },
      { status: "completed", label: "Completed",    detail: "Result hash submitted",                  txHash: "0xdef...a56", erc8004: null,   timestamp: "14:23:11" },
      { status: "validated", label: "Validated ✓",  detail: "ERC-8004 Validation Registry recorded",  txHash: "0x991...c78", erc8004: "#0089", timestamp: "14:23:14" },
      { status: "paid",      label: "Paid",         detail: "$0.10 USDC released to worker",          txHash: "0xff2...b90", erc8004: null,   timestamp: "14:23:16" },
    ],
    resultHash: "0xd8a2f301c7b9e45a1f832d6094c5e718b3a9f20d7c8e4b15293a76f0d1842ec",
    validationId: "#0089",
    icmMessageId: null,
  },
  {
    id: 5,
    taskDescription: "Review Solidity contract for reentrancy vulnerabilities",
    capability: "code-review",
    paymentAmount: 0.50,
    employerAgent: "0x2c9d...3f77",
    workerAgent: "0x2c9d...3f77",
    status: "validated",
    postedAt: "2026-04-19T14:31:00Z",
    deadline: "2026-04-19T14:36:00Z",
    minReputation: 4.5,
    chain: "C-Chain",
    timeline: [
      { status: "open",      label: "Job Posted",   detail: "$0.50 USDC locked in escrow",           txHash: "0x112...a33", erc8004: null,   timestamp: "14:31:00" },
      { status: "accepted",  label: "Accepted",     detail: "CodeReview-Agent picked up job",         txHash: "0x223...b44", erc8004: "#0063", timestamp: "14:31:05" },
      { status: "completed", label: "Completed",    detail: "Review report hash submitted",           txHash: "0x334...c55", erc8004: null,   timestamp: "14:31:38" },
      { status: "validated", label: "Validated ✓",  detail: "ERC-8004 Validation Registry recorded",  txHash: "0x445...d66", erc8004: "#0091", timestamp: "14:31:44" },
    ],
    resultHash: "0x9f3c1a8e2b5d7f04c6e9b1a3d5f8c2e4a7b9d1f3e5c7a9b1d3f5e7c9a1b3d5f",
    validationId: "#0091",
    icmMessageId: null,
  },
  {
    id: 6,
    taskDescription: "Translate product changelog from English to Japanese and Korean",
    capability: "translation",
    paymentAmount: 0.08,
    employerAgent: "0x5f1a...9e23",
    workerAgent: "0x5f1a...9e23",
    status: "accepted",
    postedAt: "2026-04-19T14:38:12Z",
    deadline: "2026-04-19T14:43:12Z",
    minReputation: 3.5,
    chain: "C-Chain",
    timeline: [
      { status: "open",     label: "Job Posted", detail: "$0.08 USDC locked in escrow",    txHash: "0x556...e77", erc8004: null,   timestamp: "14:38:12" },
      { status: "accepted", label: "Accepted",   detail: "Translator-3000 picked up job",  txHash: "0x667...f88", erc8004: "#0071", timestamp: "14:38:15" },
    ],
    resultHash: null,
    validationId: null,
    icmMessageId: null,
  },
  {
    id: 7,
    taskDescription: "Generate monthly analytics report from CSV sales data",
    capability: "report-generation",
    paymentAmount: 0.35,
    employerAgent: "0x3c8f...7d56",
    workerAgent: null,
    status: "open",
    postedAt: "2026-04-19T14:40:00Z",
    deadline: "2026-04-19T14:45:00Z",
    minReputation: 4.0,
    chain: "DeFi-L1",
    timeline: [
      { status: "open", label: "Job Posted", detail: "$0.35 USDC locked in escrow", txHash: "0x778...a99", erc8004: null, timestamp: "14:40:00" },
    ],
    resultHash: null,
    validationId: null,
    icmMessageId: "0x1c3e5a7b9d1f3e5c7a9b1d3f5e7c9a1b3d5f7e9c1a3b5d7f9e1c3a5b7d9f1e3",
  },
  {
    id: 3,
    taskDescription: "Label 500 product images with bounding boxes for ML training",
    capability: "image-labeling",
    paymentAmount: 0.03,
    employerAgent: "0x8d4b...6a11",
    workerAgent: "0x8d4b...6a11",
    status: "expired",
    postedAt: "2026-04-19T13:10:00Z",
    deadline: "2026-04-19T13:15:00Z",
    minReputation: 3.0,
    chain: "Gaming-L1",
    timeline: [
      { status: "open",    label: "Job Posted", detail: "$0.03 USDC locked in escrow",              txHash: "0x889...b10", erc8004: null, timestamp: "13:10:00" },
      { status: "expired", label: "Expired",    detail: "Deadline passed — USDC refunded to employer", txHash: "0x990...c21", erc8004: null, timestamp: "13:15:00" },
    ],
    resultHash: null,
    validationId: null,
    icmMessageId: null,
  },
  {
    id: 2,
    taskDescription: "Sentiment analysis on 1,000 customer support tickets",
    capability: "sentiment-analysis",
    paymentAmount: 0.04,
    employerAgent: "0x1e7c...5b90",
    workerAgent: "0x1e7c...5b90",
    status: "paid",
    postedAt: "2026-04-19T12:55:00Z",
    deadline: "2026-04-19T13:00:00Z",
    minReputation: 3.5,
    chain: "C-Chain",
    timeline: [
      { status: "open",      label: "Job Posted",  detail: "$0.04 USDC locked in escrow",           txHash: "0xaa1...d32", erc8004: null,   timestamp: "12:55:00" },
      { status: "accepted",  label: "Accepted",    detail: "SentimentBot picked up job",             txHash: "0xbb2...e43", erc8004: "#0092", timestamp: "12:55:03" },
      { status: "completed", label: "Completed",   detail: "Result hash submitted",                  txHash: "0xcc3...f54", erc8004: null,   timestamp: "12:55:19" },
      { status: "validated", label: "Validated ✓", detail: "ERC-8004 Validation Registry recorded",  txHash: "0xdd4...a65", erc8004: "#0088", timestamp: "12:55:22" },
      { status: "paid",      label: "Paid",        detail: "$0.04 USDC released to worker",          txHash: "0xee5...b76", erc8004: null,   timestamp: "12:55:24" },
    ],
    resultHash: "0x2a4c6e8b1d3f5a7c9e1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d1f3a5",
    validationId: "#0088",
    icmMessageId: null,
  },
  {
    id: 1,
    taskDescription: "ETL pipeline: transform raw blockchain event logs to relational schema",
    capability: "data-pipeline",
    paymentAmount: 0.25,
    employerAgent: "0x7b3e...1d44",
    workerAgent: null,
    status: "expired",
    postedAt: "2026-04-19T11:00:00Z",
    deadline: "2026-04-19T11:05:00Z",
    minReputation: 4.0,
    chain: "DeFi-L1",
    timeline: [
      { status: "open",    label: "Job Posted", detail: "$0.25 USDC locked in escrow",     txHash: "0xff6...c87", erc8004: null, timestamp: "11:00:00" },
      { status: "expired", label: "Expired",    detail: "Deadline passed — USDC refunded", txHash: "0x001...d98", erc8004: null, timestamp: "11:05:00" },
    ],
    resultHash: null,
    validationId: null,
    icmMessageId: null,
  },
  {
    id: 8,
    taskDescription: "Transcribe audio interview recording (45 min, English)",
    capability: "transcription",
    paymentAmount: 0.15,
    employerAgent: "0x9a5d...2c78",
    workerAgent: "0x9a5d...2c78",
    status: "completed",
    postedAt: "2026-04-19T14:35:00Z",
    deadline: "2026-04-19T14:42:00Z",
    minReputation: 4.0,
    chain: "C-Chain",
    timeline: [
      { status: "open",      label: "Job Posted", detail: "$0.15 USDC locked in escrow",    txHash: "0x112...e09", erc8004: null,   timestamp: "14:35:00" },
      { status: "accepted",  label: "Accepted",   detail: "AudioTranscribe picked up job",  txHash: "0x223...f10", erc8004: "#0105", timestamp: "14:35:04" },
      { status: "completed", label: "Completed",  detail: "Transcript hash submitted",      txHash: "0x334...a21", erc8004: null,   timestamp: "14:36:58" },
    ],
    resultHash: "0x7b9d1f3e5c7a9b1d3f5e7c9a1b3d5f7e9c1a3b5d7f9e1c3a5b7d9f1e3c5a7b9",
    validationId: null,
    icmMessageId: null,
  },
];

// ─── Payments ─────────────────────────────────────────────────────────────────

export const RECENT_PAYMENTS: Payment[] = [
  { id: 1, type: "registry-query", amount: 0.001, from: "GPT-Summarizer-v2",  to: "ServiceRegistry",    description: "x402 registry query · summarization", timestamp: "14:23:00", txHash: "0x1a2b...3c4d" },
  { id: 2, type: "job-payout",    amount: 0.10,  from: "AgentEscrow",         to: "GPT-Summarizer-v2",  description: "Job #4 payout",                       timestamp: "14:23:16", txHash: "0xff2...b90"  },
  { id: 3, type: "registry-query", amount: 0.001, from: "CodeReview-Agent",   to: "ServiceRegistry",    description: "x402 registry query · code-review",   timestamp: "14:31:00", txHash: "0x5e6f...7a8b" },
  { id: 4, type: "job-payout",    amount: 0.50,  from: "AgentEscrow",         to: "CodeReview-Agent",   description: "Job #5 payout",                       timestamp: "14:31:44", txHash: "0x445...d66"  },
  { id: 5, type: "registry-query", amount: 0.001, from: "Translator-3000",    to: "ServiceRegistry",    description: "x402 registry query · translation",   timestamp: "14:38:12", txHash: "0x9c1d...2e3f" },
  { id: 6, type: "job-escrow",    amount: 0.08,  from: "Translator-3000",     to: "AgentEscrow",        description: "Job #6 escrow lock",                  timestamp: "14:38:12", txHash: "0x556...e77"  },
  { id: 7, type: "refund",        amount: 0.25,  from: "AgentEscrow",         to: "DataPipeline-Bot",   description: "Job #1 expired — refund",             timestamp: "11:05:00", txHash: "0x001...d98"  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const ALL_CAPABILITIES = [
  "summarization", "text-processing", "data-pipeline", "etl", "json-transform",
  "code-review", "security-audit", "linting", "translation", "localization",
  "image-labeling", "classification", "sentiment-analysis", "text-classification",
  "transcription", "audio-processing", "report-generation", "writing",
];

export const CAPABILITY_OPTIONS = [
  "summarization", "code-review", "translation", "data-pipeline",
  "transcription", "sentiment-analysis", "image-labeling", "report-generation",
];

export function getAgentByName(name: string): Agent | undefined {
  return AGENTS.find(a => a.name === name);
}

export function getJobById(id: number): Job | undefined {
  return JOBS.find(j => j.id === id);
}

export function getJobsSortedByRecent(): Job[] {
  return [...JOBS].sort((a, b) =>
    new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  );
}
