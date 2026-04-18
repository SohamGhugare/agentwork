import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ProblemStatement from "@/components/ProblemStatement";
import HowItWorks from "@/components/HowItWorks";
import TechStack from "@/components/TechStack";
import ArchDiagram from "@/components/ArchDiagram";
import LiveStats from "@/components/LiveStats";
import AgentRegistry from "@/components/AgentRegistry";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <LiveStats />
        <ProblemStatement />
        <HowItWorks />
        <TechStack />
        <ArchDiagram />
        <AgentRegistry />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
