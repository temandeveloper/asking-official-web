"use client";

import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function Testimonial() {
  const { t } = useTranslation();

  return (
    <section id="concern" className="py-20 md:py-28 bg-[#F8FAF7] border-b border-[#DEE7DF]">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
        {/* Quote Icon */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#E5EFE7] text-[#184530] mb-8 shadow-2xs">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>
        {/* Quote Content */}
        <blockquote className="text-xl sm:text-2xl lg:text-[28px] font-bold text-[#11241C] leading-[1.38] tracking-tight mb-8">
          {t("testimonial.quote")}
        </blockquote>
      </div>
    </section>
  );
}
