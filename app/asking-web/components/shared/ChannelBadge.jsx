"use client";

import React from "react";
import { Mail } from "lucide-react";

export function WhatsAppLogo({ className = "w-3.5 h-3.5" }) {
  return (
    <svg
      className={`${className} fill-current text-[#25D366] shrink-0`}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      title="WhatsApp"
    >
      <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.475-.15-.675.15-.2.301-.776.979-.951 1.18-.176.201-.351.226-.652.076-.301-.15-1.272-.469-2.423-1.496-.897-.8-1.503-1.789-1.679-2.09-.176-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.176.201-.301.301-.502.1-.201.05-.376-.025-.526-.075-.15-.676-1.631-.926-2.233-.244-.587-.492-.507-.676-.517-.175-.008-.376-.01-.576-.01-.2 0-.526.075-.802.376-.275.301-1.052 1.028-1.052 2.508 0 1.48 1.077 2.909 1.228 3.109.15.201 2.12 3.238 5.136 4.542.717.31 1.277.495 1.713.634.721.229 1.377.197 1.896.119.578-.087 1.78-.727 2.031-1.429.251-.702.251-1.304.176-1.429-.075-.126-.276-.201-.577-.351zM12.04 21.785h-.002a9.78 9.78 0 01-4.992-1.365l-.358-.213-3.712.974.99-3.619-.233-.371a9.78 9.78 0 01-1.503-5.185c0-5.405 4.398-9.803 9.808-9.803 2.618 0 5.079 1.02 6.93 2.871a9.754 9.754 0 012.868 6.932c0 5.407-4.399 9.809-9.808 9.809zM20.52 3.48A11.915 11.915 0 0012.04 0C5.402 0 .007 5.394.007 12.031c0 2.12.554 4.19 1.608 6.014L0 24l6.147-1.613a11.96 11.96 0 005.891 1.542h.005c6.636 0 12.031-5.395 12.031-12.033a11.914 11.914 0 00-3.554-8.416z" />
    </svg>
  );
}

export function TelegramLogo({ className = "w-3.5 h-3.5" }) {
  return (
    <svg
      className={`${className} fill-current text-[#229ED9] shrink-0`}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      title="Telegram"
    >
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.832.942z" />
    </svg>
  );
}

export function EmailLogo({ className = "w-3.5 h-3.5" }) {
  return (
    <Mail
      className={`${className} text-sky-500 dark:text-sky-400 shrink-0`}
      title="Email"
    />
  );
}

export function ChannelBadge({ channel = "whatsapp", size = "sm", showLabel = false, labelText = null }) {
  const isTg = channel === "telegram";
  const isEmail = channel === "email";
  const iconSize = size === "xs" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
  const defaultLabel = isTg ? "Telegram" : isEmail ? "Email" : "WhatsApp";

  if (!showLabel) {
    return (
      <span
        className={`inline-flex items-center justify-center p-1 rounded-md shadow-2xs ${
          isTg
            ? "bg-[#229ED9]/15 text-[#229ED9] border border-[#229ED9]/30"
            : isEmail
              ? "bg-sky-500/15 text-sky-500 border border-sky-500/30"
              : "bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30"
        }`}
        title={defaultLabel}
      >
        {isTg ? <TelegramLogo className={iconSize} /> : isEmail ? <EmailLogo className={iconSize} /> : <WhatsAppLogo className={iconSize} />}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs ${
        isTg
          ? "bg-[#229ED9]/10 text-[#229ED9] border-[#229ED9]/30"
          : isEmail
            ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30"
            : "bg-[#25D366]/10 text-[#128C7E] dark:text-[#25D366] border-[#25D366]/30"
      }`}
    >
      {isTg ? <TelegramLogo className={iconSize} /> : isEmail ? <EmailLogo className={iconSize} /> : <WhatsAppLogo className={iconSize} />}
      <span>{labelText || defaultLabel}</span>
    </span>
  );
}
