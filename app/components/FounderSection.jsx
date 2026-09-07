"use client";

import { ArrowUpRight, Lightbulb } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function FounderSection() {
  const { t } = useTranslation();

  return (
    <section className="border-t border-[#DEE7DF] bg-[#F8FAF7] py-20 md:py-28">
      <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#CFE2D3] bg-[#E5EFE7] px-3.5 py-1.5 text-xs font-bold text-[#184530] shadow-2xs">
          <Lightbulb className="h-3.5 w-3.5 text-[#184530]" />
          <span>{t("founder.tag")}</span>
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 sm:px-8 lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div className="relative mx-auto w-full max-w-md lg:mx-0">
          <img
            src="/founder.webp"
            alt="Ahmad Fadil, Founder and Engineer of AsKing"
            className="relative aspect-square w-full rounded-[1.75rem] object-cover shadow-xl"
          />
        </div>

        <div className="relative space-y-6">
          <div className="space-y-4">
            <p className="text-base font-black tracking-tight text-[#11241C] sm:text-4xl">
              {t("founder.title")}
            </p>
            <p className="text-base leading-relaxed text-[#4B6055] sm:text-base">
              {t("founder.body")}
            </p>
            <p className="text-base leading-relaxed text-[#556A60] sm:text-base">
              {t("founder.detail")}
            </p>
            <p className="text-base leading-relaxed text-[#556A60] sm:text-base">
              {t("founder.mission")}
            </p>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#DEE7DF] pt-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm font-black text-[#11231B]">{t("founder.author")}</p>
                <a
                    href="https://ahmadfadil.godiscus.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6B8075] underline"
                    >
                    <span>{t("founder.link_label")}</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
