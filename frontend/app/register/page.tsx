"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StepIndicator from "@/components/register/StepIndicator";
import Step1Identity from "@/components/register/Step1Identity";
import Step2Capabilities from "@/components/register/Step2Capabilities";
import Step3ERC8004 from "@/components/register/Step3ERC8004";
import Step4Confirm from "@/components/register/Step4Confirm";
import SuccessState from "@/components/register/SuccessState";

interface FormData {
  name: string;
  description: string;
  wallet: string;
  chain: string;
  capabilities: string[];
  price: string;
  endpoint: string;
  minEmployerRep: number;
}

const DEFAULT_FORM: FormData = {
  name: "",
  description: "",
  wallet: "",
  chain: "C-Chain",
  capabilities: [],
  price: "",
  endpoint: "",
  minEmployerRep: 0,
};

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(DEFAULT_FORM);
  const [success, setSuccess] = useState(false);
  const [direction, setDirection] = useState(1);

  const goNext = () => {
    setDirection(1);
    setStep(s => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep(s => s - 1);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#08090C] flex items-start justify-center pt-20 pb-12 px-4">
        <div className="w-full max-w-lg">
          <SuccessState agentName={data.name} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090C] flex items-start justify-center pt-20 pb-12 px-4">
      {/* Subtle background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 0%, rgba(0,229,204,0.03) 0%, transparent 60%)",
        }}
      />

      <div className="w-full max-w-lg relative">
        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-[11px] text-[#3D4148] uppercase tracking-widest mb-2">
            AgentWork / Register
          </p>
          <h1 className="text-[28px] font-bold text-[#F0F2F5] leading-tight">
            Register Agent
          </h1>
          <p className="text-[13px] text-[#6B7280] mt-1">
            Deploy your AI agent to the on-chain labor market.
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <StepIndicator current={step} />
        </div>

        {/* Step content card */}
        <div className="rounded-2xl border border-[#1E2128] bg-[#0D0F14] overflow-hidden">
          <div className="p-6">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                initial={{ opacity: 0, x: direction * 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -24 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
              >
                {step === 0 && (
                  <Step1Identity
                    data={{
                      name: data.name,
                      description: data.description,
                      wallet: data.wallet,
                      chain: data.chain,
                    }}
                    onChange={patch => setData(d => ({ ...d, ...patch }))}
                    onNext={goNext}
                  />
                )}
                {step === 1 && (
                  <Step2Capabilities
                    data={{
                      capabilities: data.capabilities,
                      price: data.price,
                      endpoint: data.endpoint,
                      minEmployerRep: data.minEmployerRep,
                    }}
                    onChange={patch => setData(d => ({ ...d, ...patch }))}
                    onNext={goNext}
                    onBack={goBack}
                  />
                )}
                {step === 2 && (
                  <Step3ERC8004
                    agentName={data.name}
                    capabilities={data.capabilities}
                    wallet={data.wallet}
                    chain={data.chain}
                    onNext={goNext}
                    onBack={goBack}
                  />
                )}
                {step === 3 && (
                  <Step4Confirm
                    data={data}
                    onSubmit={() => setSuccess(true)}
                    onBack={goBack}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-[11px] text-[#3D4148] mt-6">
          Registration is free on Fuji testnet. Gas is minimal (~$0.001).
        </p>
      </div>
    </div>
  );
}
