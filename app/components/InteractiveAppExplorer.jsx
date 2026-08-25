"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Kanban,
  Sparkles,
  Bot,
  CheckCircle2,
  Clock,
  Send,
  User,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function InteractiveAppExplorer() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("messages"); // "messages" | "kanban" | "assistant" | "agent"

  const tabs = [
    { id: "messages", label: t("demo.tab_messages"), icon: MessageSquare },
    { id: "kanban", label: t("demo.tab_kanban"), icon: Kanban },
    { id: "assistant", label: t("demo.tab_assistant"), icon: Sparkles },
    { id: "agent", label: t("demo.tab_agent"), icon: Bot },
  ];

  return (
    <section id="omnichannel" className="py-20 md:py-28 bg-white border-b border-[#DEE7DF] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E5EFE7] border border-[#CFE2D3] text-xs font-bold text-[#184530]">
            <Zap className="w-3.5 h-3.5" />
            <span>{t("demo.tag")}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#11241C] tracking-tight">
            {t("demo.title")}
          </h2>

          <p className="text-base sm:text-lg text-[#4B6055] leading-relaxed">
            {t("demo.subtitle")}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 max-w-3xl mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${isActive
                    ? "bg-[#12281F] text-[#B8F55C] shadow-md scale-102 border border-[#234235]"
                    : "bg-[#F2F7F3] text-[#3D5247] hover:bg-[#E5EFE7] border border-[#DEE7DF]"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Window */}
        <div className="max-w-5xl mx-auto rounded-3xl bg-[#0C1712] border border-[#234235] shadow-2xl p-4 sm:p-8 text-left overflow-hidden min-h-[460px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {/* Tab 1: Messages */}
            {activeTab === "messages" && (
              <motion.div
                key="messages"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#1F382B]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-900 text-emerald-300 flex items-center justify-center font-bold text-xs">
                      WA
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#F2F7F4]">Budi Santoso (Retail Store Jakarta)</div>
                      <div className="text-[10px] text-emerald-400 font-medium">WhatsApp Connected • Online</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#18362B] text-[#B8F55C] font-bold border border-[#234235]">
                    Local Storage OK
                  </span>
                </div>

                <div className="space-y-3 py-4 max-w-2xl">
                  <div className="p-3.5 rounded-2xl bg-[#18362B] text-xs text-[#D1DDD6] leading-relaxed max-w-md">
                    Halo CS AsKing, kami tertarik pesan paket Custom Enterprise untuk integrasi 15 CS & bot auto-reply WhatsApp. Apakah ada live demo besok?
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#12241C] border border-[#234235] text-xs text-[#B8F55C] leading-relaxed max-w-md ml-auto space-y-1">
                    <div className="flex items-center gap-1 text-[10px] text-[#A5B8AD] font-semibold">
                      <Bot className="w-3 h-3 text-[#B8F55C]" />
                      <span>AsKing AI Agent (Auto-Response)</span>
                    </div>
                    <p className="text-[#F2F7F4]">
                      Halo Pak Budi! Tentu ada. Tim kami siap mendemokan fitur Kanban tiket, isolasi database on-device, dan custom persona AI jam 10.00 WIB besok. Link calendar sudah dikirimkan ya! 🚀
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1F382B] flex items-center gap-3">
                  <input
                    type="text"
                    disabled
                    value="Ketik pesan balasan manual atau gunakan saran AI..."
                    className="flex-1 bg-[#12241C] border border-[#1F382B] rounded-xl px-4 py-2.5 text-xs text-[#8EA096] focus:outline-none"
                  />
                  <button className="px-4 py-2.5 rounded-xl bg-[#B8F55C] text-[#12281F] font-bold text-xs flex items-center gap-1.5 cursor-default">
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Tab 2: Kanban */}
            {activeTab === "kanban" && (
              <motion.div
                key="kanban"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#1F382B]">
                  <div className="text-xs font-bold text-[#F2F7F4]">
                    Kanban Customer Ticket Board (Real-time View)
                  </div>
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-950/60 border border-amber-800/40 px-2.5 py-0.5 rounded-full">
                    SLA Guarantee: 99.8%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {/* Column 1: Open */}
                  <div className="rounded-2xl bg-[#12241C] border border-[#1F382B] p-3 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-[#A5B8AD] pb-1 border-b border-[#1F382B]">
                      <span>Open Tickets</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#18362B] text-xs font-bold text-[#B8F55C]">2</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#18362B] border border-[#234235] space-y-1.5">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-rose-400 font-bold">URGENT</span>
                        <span className="text-[#8EA096]">#TCK-1002</span>
                      </div>
                      <div className="text-xs font-bold text-[#F2F7F4]">Setup Multi-Device</div>
                      <div className="text-[10px] text-[#A5B8AD]">Customer: PT Berkah Jaya</div>
                    </div>
                  </div>

                  {/* Column 2: In Progress */}
                  <div className="rounded-2xl bg-[#12241C] border border-[#1F382B] p-3 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-[#A5B8AD] pb-1 border-b border-[#1F382B]">
                      <span>In Progress</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#18362B] text-xs font-bold text-[#B8F55C]">3</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#18362B] border border-[#234235] space-y-1.5">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-amber-400 font-bold">HIGH</span>
                        <span className="text-[#8EA096]">#TCK-1003</span>
                      </div>
                      <div className="text-xs font-bold text-[#F2F7F4]">Knowledge Base Verification</div>
                      <div className="text-[10px] text-[#A5B8AD]">Customer: Sarah Cosmetics</div>
                    </div>
                  </div>

                  {/* Column 3: Resolved */}
                  <div className="rounded-2xl bg-[#12241C] border border-[#1F382B] p-3 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-[#A5B8AD] pb-1 border-b border-[#1F382B]">
                      <span>Resolved</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#18362B] text-xs font-bold text-[#B8F55C]">18</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#18362B]/50 border border-[#234235] space-y-1.5 opacity-80">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-emerald-400 font-bold">DONE</span>
                        <span className="text-[#8EA096]">#TCK-0998</span>
                      </div>
                      <div className="text-xs font-bold text-[#D1DDD6]">Broadcast Campaign Schedule</div>
                      <div className="text-[10px] text-[#8EA096]">Completed via WhatsApp</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 3: AI Assistant */}
            {activeTab === "assistant" && (
              <motion.div
                key="assistant"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#1F382B]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#B8F55C]" />
                    <span className="text-xs font-bold text-[#F2F7F4]">AsKing AI Executive Manager</span>
                  </div>
                  <span className="text-[10px] text-[#B8F55C] bg-[#18362B] px-2.5 py-0.5 rounded-full font-bold border border-[#234235]">
                    Real-time Data Intelligence
                  </span>
                </div>

                <div className="space-y-3 py-3">
                  <div className="p-4 rounded-2xl bg-[#18362B] border border-[#234235] space-y-2">
                    <div className="text-xs font-bold text-[#B8F55C] flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Ringkasan & Arahan Operasional Hari Ini:</span>
                    </div>
                    <ul className="text-xs text-[#D1DDD6] space-y-1.5 list-disc list-inside leading-relaxed">
                      <li><strong>2 Tiket Urgent:</strong> Perlu eskalasi ke lead tech sebelum pukul 15.00 WIB.</li>
                      <li><strong>Pola Pesan Pelanggan:</strong> 64% pertanyaan mengenai promo onboarding kuartal ini.</li>
                      <li><strong>Rekomendasi Tindakan:</strong> Aktifkan template jawaban cepat WhatsApp untuk mempercepat respon rata-rata di bawah 30 detik.</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 4: Agent */}
            {activeTab === "agent" && (
              <motion.div
                key="agent"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#1F382B]">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-[#B8F55C]" />
                    <span className="text-xs font-bold text-[#F2F7F4]">Autonomous AI Customer Agent Simulator</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-0.5 rounded-full font-bold">
                    Guardrails Active
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#12241C] border border-[#1F382B] space-y-3">
                  <div className="text-[11px] text-[#A5B8AD] font-semibold">
                    Simulasi Pertanyaan Pelanggan:
                  </div>
                  <div className="p-3 rounded-xl bg-[#18362B] text-xs text-[#D1DDD6]">
                    "Bagaimana cara memastikan data chat saya tidak disimpan di server AsKing?"
                  </div>

                  <div className="text-[11px] text-[#B8F55C] font-semibold pt-1">
                    Jawaban AI Agent (Grounded in Verified Policy):
                  </div>
                  <div className="p-3 rounded-xl bg-[#09130E] border border-[#234235] text-xs text-[#F2F7F4] leading-relaxed">
                    "AsKing dirancang secara fundamental dengan arsitektur <strong>Local-First</strong>. Seluruh riwayat percakapan WhatsApp Anda disimpan langsung di IndexedDB komputer lokal Anda. Server kami tidak pernah menerima atau menyimpan konten chat pelanggan Anda."
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
