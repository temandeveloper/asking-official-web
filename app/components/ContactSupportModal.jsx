"use client";

import { QRCodeSVG } from "qrcode.react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { PRICING_CONFIG } from "@/lib/config/pricing";
import {
  X,
  Send,
  ExternalLink,
  Headphones,
  Phone,
  HelpCircle,
  CreditCard,
  UserCheck,
} from "lucide-react";

export default function ContactSupportModal({
  isOpen,
  onClose,
  context = "general", // 'general' | 'payment' | 'signup' | 'login'
  user = null,
  planName = "Pro Business",
  amount = null,
}) {
  const { t, language } = useTranslation();

  if (!isOpen) return null;

  const supportNumber = PRICING_CONFIG.supportPhone || "6287769005244";
  const userName = user?.user_metadata?.full_name || user?.email || "Pengguna AsKing";
  const userEmail = user?.email || "-";
  const userId = user?.id || "-";

  // Build context-specific message
  let supportMessage = "";
  if (language === "en") {
    if (context === "payment") {
      supportMessage = `Hello AsKing Support Team, I need assistance regarding Payment / Plan Upgrade:

• Name: ${userName}
• Email: ${userEmail}
• User ID: ${userId}
• Target Plan: ${planName}
• Total Amount: ${amount ? `Rp ${amount}` : `Rp ${PRICING_CONFIG.proPrice}`}

Issue / Question with Payment: `;
    } else if (context === "signup") {
      supportMessage = `Hello AsKing Support Team, I need assistance regarding Account Registration / Email Verification:

• Name: ${userName}
• Email: ${userEmail}

Issue / Question: `;
    } else if (context === "login") {
      supportMessage = `Hello AsKing Support Team, I need assistance logging into my AsKing account:

• Email: ${userEmail}

Issue / Question: `;
    } else {
      supportMessage = `Hello AsKing Support Team, I need assistance regarding AsKing:

• Name: ${userName}
• Email: ${userEmail}
• User ID: ${userId}

Inquiry: `;
    }
  } else {
    if (context === "payment") {
      supportMessage = `Halo Tim Support AsKing, saya butuh bantuan terkait Pembayaran / Upgrade Paket:

• Nama: ${userName}
• Email: ${userEmail}
• User ID: ${userId}
• Paket yang Dipilih: ${planName}
• Total Nominal: ${amount ? `Rp ${amount}` : `Rp ${PRICING_CONFIG.proPrice}`}

Kendala / Pertanyaan Pembayaran: `;
    } else if (context === "signup") {
      supportMessage = `Halo Tim Support AsKing, saya butuh bantuan terkait Pendaftaran Akun / Verifikasi Email:

• Nama: ${userName}
• Email: ${userEmail}

Kendala / Pertanyaan: `;
    } else if (context === "login") {
      supportMessage = `Halo Tim Support AsKing, saya butuh bantuan untuk Masuk / Login ke akun AsKing:

• Email: ${userEmail}

Kendala / Pertanyaan: `;
    } else {
      supportMessage = `Halo Tim Support AsKing, saya butuh bantuan terkait aplikasi AsKing:

• Nama: ${userName}
• Email: ${userEmail}
• User ID: ${userId}

Pertanyaan / Kendala: `;
    }
  }

  const whatsappUrl = `https://api.whatsapp.com/send/?phone=${supportNumber}&text=${encodeURIComponent(
    supportMessage
  )}&type=phone_number&app_absent=0`;

  const handleOpenWhatsApp = () => {
    window.open(whatsappUrl, "_blank");
  };

  const formattedPhone = `+${supportNumber.slice(0, 2)} ${supportNumber.slice(2, 5)}-${supportNumber.slice(5, 9)}-${supportNumber.slice(9)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150 select-none">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#12241C] rounded-3xl border border-[#DEE7DF] dark:border-[#1F382B] shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200">

        {/* Modal Header */}
        <div className="bg-[#12281F] text-white p-6 flex items-center justify-between border-b border-[#234235]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#18362B] text-[#B8F55C] border border-[#2A5241] flex items-center justify-center shadow-xs">
              {context === "payment" ? (
                <CreditCard className="w-5 h-5" />
              ) : (
                <Headphones className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight">
                {context === "payment"
                  ? language === "en"
                    ? "Payment Assistance"
                    : "Bantuan Kendala Pembayaran"
                  : language === "en"
                    ? "Contact AsKing Support"
                    : "Hubungi Tim Support AsKing"}
              </h3>
              <p className="text-xs text-[#A5B8AD] leading-tight">
                {language === "en"
                  ? "Official Customer Care & Technical Team"
                  : "Layanan Bantuan Resmi & Tim Support Cepat"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6 text-center">
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold text-[#11231B] dark:text-[#F2F7F4]">
              {language === "en"
                ? "Scan QR Code with WhatsApp Camera"
                : "Pindai QR Code via Kamera WhatsApp"}
            </h4>
            <p className="text-xs text-[#556A60] dark:text-[#A5B8AD] max-w-sm mx-auto leading-relaxed">
              {context === "payment"
                ? language === "en"
                  ? "Having trouble with transfer or need immediate plan approval? Chat directly with our finance & support team."
                  : "Mengalami kendala saat transfer atau butuh persetujuan plan cepat? Hubungi langsung tim support kami."
                : language === "en"
                  ? "Our dedicated support team is ready to assist your onboarding, questions, or setup."
                  : "Tim support kami siap membantu pertanyaan, onboarding, dan kendala teknis Anda."}
            </p>
          </div>

          {/* QR Code Container */}
          <div className="flex justify-center my-2">
            <div className="p-4 rounded-3xl bg-white border-2 border-[#184530] shadow-md inline-block">
              <QRCodeSVG
                value={whatsappUrl}
                size={200}
                level="M"
                includeMargin={true}
                className="w-44 h-44 sm:w-48 sm:h-48"
              />
            </div>
          </div>

          {/* Contact Details Pill */}
          <div className="p-3.5 rounded-2xl bg-[#F8FAF7] dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B] space-y-1 text-xs text-[#556A60] dark:text-[#A5B8AD]">
            <div className="font-bold text-[#11231B] dark:text-[#F2F7F4] flex items-center justify-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Support: {formattedPhone}</span>
            </div>
            <p className="text-[11px] text-[#7A9386]">
              {language === "en"
                ? "Active Daily • Response time < 5 mins"
                : "Aktif Setiap Hari • Respon Cepat < 5 Menit"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>
                {language === "en"
                  ? "Open WhatsApp Web / App Directly"
                  : "Buka WhatsApp Langsung"}
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-[#556A60] dark:text-[#A5B8AD] hover:bg-[#EBF1EB] dark:hover:bg-[#1F382B] transition-colors cursor-pointer"
            >
              {language === "en" ? "Close" : "Tutup"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
