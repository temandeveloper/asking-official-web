import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Testimonial from "./components/Testimonial";
import StatsBanner from "./components/StatsBanner";
import DataPrivacySection from "./components/DataPrivacySection";
import FeaturesBento from "./components/FeaturesBento";
import InteractiveAppExplorer from "./components/InteractiveAppExplorer";
import NodeWorkflowSection from "./components/NodeWorkflowSection";
import PricingSection from "./components/PricingSection";
import CtaBanner from "./components/CtaBanner";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF7] text-[#11231B] selection:bg-[#B8F55C] selection:text-[#11281F]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Testimonial />
        <StatsBanner />
        <DataPrivacySection />
        <FeaturesBento />
        <InteractiveAppExplorer />
        <NodeWorkflowSection />
        <PricingSection />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
