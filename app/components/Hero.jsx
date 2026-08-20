"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 hero-grid">
      {/* Decorative radial lighting glow behind center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#E8F6EB]/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative">
        {/* Floating Avatar 1: Top-Left (Woman smiling) */}
        <div className="hidden lg:flex items-center gap-2 absolute top-4 left-8 animate-float">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
              alt="Team Member"
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
            />
          </div>
          {/* Directional green pointer */}
          <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-[#12281F]" />
        </div>

        {/* Floating Avatar 2: Top-Right (Man with glasses) */}
        <div className="hidden lg:flex items-center gap-2 absolute top-6 right-10 animate-float-delayed">
          {/* Directional green pointer */}
          <div className="w-0 h-0 border-y-[6px] border-y-transparent border-r-[10px] border-r-[#12281F]" />
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
              alt="Team Member"
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
            />
          </div>
        </div>

        {/* Floating Avatar 3: Bottom-Left (Woman) */}
        <div className="hidden lg:flex items-center gap-2 absolute bottom-8 left-16 animate-float-delayed">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
              alt="Team Member"
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
            />
          </div>
          {/* Directional green pointer */}
          <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-[#12281F]" />
        </div>

        {/* Floating Avatar 4: Bottom-Right (Man in yellow beanie/helmet) */}
        <div className="hidden lg:flex items-center gap-2 absolute bottom-6 right-20 animate-float">
          {/* Directional green pointer */}
          <div className="w-0 h-0 border-y-[6px] border-y-transparent border-r-[10px] border-r-[#12281F]" />
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"
              alt="Team Member"
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
            />
          </div>
        </div>

        {/* Center Content */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Streamline contracts badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5EFE7] border border-[#CFE2D3] text-xs font-semibold text-[#184530] shadow-2xs mb-8 transition-transform hover:scale-105">
            <span className="w-2 h-2 rounded-full bg-[#184530] animate-pulse" />
            <span>Streamline contracts</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-extrabold tracking-[-0.03em] leading-[1.12] text-[#11241C] mb-6">
            One tool to{" "}
            <span className="relative inline-block px-1">
              <span className="relative z-10">manage</span>
              <span className="absolute left-0 bottom-1.5 w-full h-3.5 bg-[#B8F55C] -z-0 rounded-sm opacity-90" />
            </span>{" "}
            contracts and your team
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#4B6055] leading-relaxed max-w-2xl mb-10">
            Clause helps agile teams work faster, smarter, and more efficiently, delivering flexibility and data-driven insights to mitigate risk and ensure compliance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#12281F] text-white font-semibold text-[15px] shadow-sm hover:bg-[#1B3C2F] hover:shadow-lg hover:-translate-y-0.5 transition-all active:translate-y-0"
            >
              Get started free
            </Link>
            <a
              href="#contact"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-[#12281F] border border-[#D3DFD6] font-semibold text-[15px] shadow-xs hover:bg-[#F3F7F4] hover:border-[#BFD0C3] transition-all"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
