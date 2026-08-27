"use client";

import Link from "next/link";
import { Mail, ShieldCheck, Heart } from "lucide-react";
import { AsKingLogo } from "./Navbar";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#0A130E] text-[#8DA095] pt-16 pb-12 border-t border-[#16251D]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-[#18281F]">
          {/* Col 1: Brand & Contacts */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 shrink-0">
                <img
                  src="/logo.png"
                  alt="AsKing Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-black tracking-tight text-white leading-none">
                  AsKing
                </span>
                <span className="text-[10px] font-semibold text-[#8DA095] tracking-tight mt-0.5">
                  Customer Manager
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#7A9084] max-w-sm leading-relaxed pt-2">
              {t("footer.description")}
            </p>

            <div className="space-y-2 pt-2 text-xs sm:text-sm">
              <a
                href="mailto:asking@godiscus.com"
                className="flex items-center gap-2.5 text-[#9CB0A4] hover:text-[#B8F55C] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#B8F55C]" />
                <span>asking@godiscus.com</span>
              </a>
            </div>
          </div>

          {/* Col 2: Fitur & Solusi */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {t("footer.section_features")}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#omnichannel" className="hover:text-white transition-colors">
                  Omnichannel Messaging
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Kanban & Ticket SLA
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  AsKing AI Assistant
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Autonomous AI Agent
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Produk & Unduhan */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Social Media
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="https://x.com/" className="hover:text-white transition-colors">
                  X
                </a>
              </li>
              <li>
                <a href="https://instagram.com/" className="hover:text-white transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://youtube.com/" className="hover:text-white transition-colors">
                  YouTube
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Privasi */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {t("footer.section_legal")}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  {t("footer.link_privacy")}
                </Link>
              </li>
              <li>
                <Link href="/term" className="hover:text-white transition-colors">
                  {t("footer.link_terms")}
                </Link>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white transition-colors text-[#B8F55C] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Local Data Guarantee</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5D7266]">
          <p>© {new Date().getFullYear()} {t("footer.copyright")}</p>
          <div className="flex items-center gap-1.5">
            <span>Built with focus on data privacy & performance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
