"use client";

import { MessageCircleWarning } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function StatementConcern() {
  const { t } = useTranslation();

  return (
    <section id="concern" className="border-b border-[#DEE7DF] bg-[#F8FAF7] py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center sm:px-8">
        <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#E5EFE7] text-[#184530] shadow-2xs">
          <MessageCircleWarning className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="text-xl font-bold leading-[1.5] tracking-tight text-[#11241C] sm:text-2xl lg:text-2xl">
          {t("concern.body")}
        </p>
      </div>
    </section>
  );
}
