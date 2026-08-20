import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import LogoCloud from "./components/LogoCloud";
import FeaturesBento from "./components/FeaturesBento";
import IntegrationSection from "./components/IntegrationSection";
import Testimonial from "./components/Testimonial";
import StatsBanner from "./components/StatsBanner";
import CtaBanner from "./components/CtaBanner";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF7] text-[#11231B] selection:bg-[#B8F55C] selection:text-[#11281F]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <LogoCloud />
        <FeaturesBento />
        <IntegrationSection />
        <Testimonial />
        <StatsBanner />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
