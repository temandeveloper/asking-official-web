"use client";

import { MessageSquare, ShieldCheck, Cpu, HardDrive, Lock, Terminal, Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function LogoCloud() {
  const { t } = useTranslation();

  const technologies = [
    { name: "WhatsApp Engine", icon: MessageSquare, desc: "Baileys Protocol" },
    { name: "Google Gemini", icon: Sparkles, desc: "Streaming AI Engine" },
    { name: "Local IndexedDB", icon: HardDrive, desc: "On-Device Storage" },
    { name: "Supabase SSO", icon: ShieldCheck, desc: "Cloud Auth Bridge" },
    { name: "Multi-Platform", icon: Terminal, desc: "Mac • Windows • Linux" },
  ];

  return (
    <section className="py-12 border-y border-[#DEE7DF] bg-[#F2F7F3]/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-[#556A60] mb-8">
          {t("hero.trusted_by_title")}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16">
          {technologies.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/70 border border-[#DEE7DF] shadow-2xs hover:shadow-xs hover:border-[#CFE2D3] transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#EBF1EB] text-[#184530] flex items-center justify-center group-hover:bg-[#12281F] group-hover:text-[#B8F55C] transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[#11231B]">{item.name}</div>
                  <div className="text-[10px] text-[#556A60]">{item.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
