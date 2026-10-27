"use client";

import { useRef, useState } from "react";
import {
  Download,
  FileDown,
  ImageDown,
  ArrowUpRight,
  ShieldCheck,
  Loader2,
  ArrowRight,
  Gift,
  MessageSquare,
  Globe,
  Kanban,
  Bot,
  BookOpen,
  Headset,
  Sun,
  Moon,
  ThumbsUp,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { PRICING_CONFIG } from "@/lib/config/pricing";

const STORE_URL = "https://apps.microsoft.com/detail/9NWF08NXV3GS";
const WEBSITE_URL = "https://asking.godiscus.com";

const INCLUDED_BENEFITS = [
  {
    icon: MessageSquare,
    title: "Follow-up & Blast Otomatis",
    desc: "Kirim info promo atau sapa banyak pelanggan sekaligus ke WhatsApp, Telegram, dan Email.",
  },
  {
    icon: Globe,
    title: "Landing Page Builder Bisnis",
    desc: "Buat web promosi produk dan bisnis tanpa koding, gratis 1 subdomain tanpa sewa hosting.",
  },
  {
    icon: Kanban,
    title: "CRM Manajemen Layanan & Penjualan",
    desc: "Papan Kanban rapi agar tidak ada chat prospek yang terlewat dan keluhan pelanggan tuntas tertangani.",
  },
  {
    icon: Bot,
    title: "AI Customer Agent (1.500 AI Credit)",
    desc: "AI Agent yang siap balas pesan pelanggan kapanpun dan mencatat kebutuhan pelanggan secara otomatis.",
  },
  {
    icon: BookOpen,
    title: "Pembaruan & Panduan Praktis",
    desc: "Gratis update fitur aplikasi dan panduan penggunaan yang mudah dipahami.",
  },
  {
    icon: Headset,
    title: "Layanan Bantuan AsKing",
    desc: "Dukungan tim support siap mendampingi saat Anda butuh bantuan teknis.",
  },
];

const BANNERS = [
  {
    id: "intro",
    label: "Pembuka (Dark Palette)",
    type: "intro",
    theme: "dark",
    eyebrow: "SOLUSI ALL-IN-ONE CUSTOMER & PESAN BISNIS",
    title: "Satu Aplikasi untuk Mengelola\nPelanggan & Pesan Tanpa Pusing\nBiaya Berlangganan yang Mahal",
    description: "Saat biaya software makin mahal, AsKing bantu Anda satukan WhatsApp, Telegram, Email, CRM, dan Web Landing Page bisnis Anda dalam sekali bayar yang terjangkau.",
    accent: "#B8F55C",
  },
  {
    id: "intro_light",
    label: "Pembuka (Landing Page Light)",
    type: "intro",
    theme: "light",
    eyebrow: "SOLUSI ALL-IN-ONE CUSTOMER & PESAN BISNIS PRIVATE",
    title: "Tingkatkan Layanan dan\n Penjualan, Tanpa Pusing\nBiaya Berlangganan yang Mahal",
    description: "Saat biaya software makin mahal, AsKing bantu Anda satukan WhatsApp, Telegram, Email, CRM, dan Web Landing Page bisnis Anda dalam sekali bayar yang terjangkau.",
    accent: "#184530",
  },
  {
    id: "intro_legacy",
    label: "Pembuka Legacy",
    type: "intro_legacy",
    theme: "dark",
    eyebrow: "CUSTOMER MANAGER LOCAL-FIRST",
    title: "Data Bisnis Anda Tidak\nAkan Pernah Lagi\nMeninggalkan Perangkat Anda",
    description: "Kelola pesan WhatsApp, Telegram, tiket pelayanan, dan pelanggan dalam satu aplikasi desktop yang cepat, rapi, dan lebih privat.",
    accent: "#B8F55C",
  },
  {
    id: "kanban",
    label: "Kanban Ticket",
    type: "feature",
    eyebrow: "TIKET LEBIH TERATUR",
    title: "Semua Tiket\nPelanggan, Satu\nAlur Kerja.",
    description: "Prioritaskan pekerjaan tim tanpa kehilangan konteks.",
    proof: "Kelola status, prioritas, dan SLA secara visual.",
    image: "/screenshots/tikets.webp",
    position: "center center",
    accent: "#B8F55C",
  },
  {
    id: "messages",
    label: "Chat Messages",
    eyebrow: "BALAS LEBIH CEPAT",
    title: "Percakapan\nPelanggan Tetap\nTertangani.",
    description: "Balas setiap chat dalam satu workspace bahkan di hari libur.",
    proof: "Riwayat percakapan tersimpan di perangkat Anda.",
    image: "/screenshots/messages.webp",
    position: "center center",
    accent: "#B8F55C",
  },
  {
    id: "channels",
    label: "Multi-Channel",
    eyebrow: "SEMUA CHANNEL, SATU TEMPAT",
    title: "WhatsApp &\nTelegram Dalam\nSatu Aplikasi.",
    description: "Hubungkan channel pesan bisnis tanpa berpindah aplikasi.",
    proof: "Pantau koneksi channel dari desktop Anda.",
    image: "/screenshots/message channels.webp",
    position: "center center",
    accent: "#B8F55C",
  },
  {
    id: "dashboard",
    label: "Dashboard",
    eyebrow: "LIHAT PRIORITASNYA",
    title: "Mulai Hari Dengan\n Lebih Terstruktur.",
    description: "Pantau tiket, pesan, dan analisis prioritas operasional menggunakan AsKing AI Assistant.",
    proof: "Keputusan lebih cepat, kerja tim lebih terarah.",
    image: "/screenshots/dashboard.webp",
    position: "center center",
    accent: "#B8F55C",
  },
  {
    id: "scheduler",
    label: "Penjadwal Pesan",
    type: "feature",
    eyebrow: "PESAN TERKIRIM TEPAT WAKTU",
    title: "Follow-Up dan\nPengingat Terkirim\nTepat Waktu.",
    description: "Jadwalkan broadcast, promo, dan pengingat janji dalam satu alur kerja.",
    proof: "Atur jadwal pengiriman pesan otomatis.",
    image: "/screenshots/scheduler.webp",
    position: "center center",
    accent: "#B8F55C",
  },
  {
    id: "templates",
    label: "Template Pesan",
    type: "feature",
    eyebrow: "BALAS CEPAT, TETAP PERSONAL",
    title: "Template Siap Pakai\nUntuk Balasan\nLebih Cepat.",
    description: "Gunakan pesan standar dengan tag pelanggan agar setiap respons tetap relevan.",
    proof: "Balas lebih cepat tanpa terasa generik.",
    image: "/screenshots/templates.webp",
    position: "center center",
    accent: "#B8F55C",
  },
  {
    id: "contacts",
    label: "Kontak Pelanggan",
    type: "feature",
    eyebrow: "KONTAK PELANGGAN LEBIH TERATUR",
    title: "Semua Kontak\nTersusun Rapi\nDalam Satu Tempat.",
    description: "Kelompokkan pelanggan berdasarkan channel dan tag agar tim mudah menemukan konteks.",
    proof: "Cari kontak dan mulai percakapan.",
    image: "/screenshots/contacts.webp",
    position: "center center",
    accent: "#B8F55C",
  },
  {
    id: "customer_agent",
    label: "AI Customer Agent",
    type: "feature",
    eyebrow: "LAYANAN TETAP RESPONSIF 24/7",
    title: "AI Memahami\nBisnis Anda dan\nSiap Membantu.",
    description: "Konfigurasikan AI Customer Agent sesuaikan dengan kebutuhan bisnis Anda.",
    proof: "Tingkatkan Layanan dengan Tetap Responsif 24/7.",
    image: "/screenshots/customer agent.webp",
    position: "center center",
    accent: "#B8F55C",
  },
  {
    id: "backup",
    label: "Backup & Restore",
    type: "feature",
    eyebrow: "DATA BISNIS TETAP DALAM KENDALI",
    title: "Backup Data\n Kapan\nSaja Dibutuhkan.",
    description: "Simpan dan pulihkan riwayat chat, tiket, serta kontak langsung ke file lokal.",
    proof: "Data penting bisnis tetap dalam genggaman.",
    image: "/screenshots/backup and restore.webp",
    position: "center center",
    accent: "#B8F55C",
  },
  {
    id: "closing",
    label: "Penutup",
    type: "closing",
    eyebrow: "MULAI KELOLA BISNIS DENGAN LEBIH TENANG",
    title: "AsKing Customer Manager",
    description: "Satu ruang kerja untuk pesan, tiket, dan operasional pelanggan.",
    accent: "#B8F55C",
  },
];

function BannerBrand({ theme = "dark" }) {
  const isLight = theme === "light";
  return (
    <div className="inline-flex items-center gap-2.5">
      <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl p-1">
        <img
          src="/logo.png"
          alt="AsKing Logo"
          className={`h-full w-full object-contain ${isLight
            ? "drop-shadow-[0_1px_3px_rgba(24,69,48,0.25)]"
            : "drop-shadow-[0_1px_3px_rgba(184,245,92,0.4)]"
            }`}
        />
      </div>
      <div className="flex flex-col text-left">
        <span
          className={`text-base sm:text-lg font-black leading-none tracking-tight ${isLight ? "text-[#12281F]" : "text-white"
            }`}
        >
          AsKing
        </span>
        <span
          className={`mt-0.5 text-[10px] font-semibold leading-none tracking-tight ${isLight ? "text-[#184530]" : "text-white/80"
            }`}
        >
          Customer Manager
        </span>
      </div>
    </div>
  );
}

function WindowsIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.802" />
    </svg>
  );
}

function PriceBlock({ compact = false, theme = "dark", plan = "lifetime" }) {
  const isLight = theme === "light";
  const isLifetime = plan === "lifetime";

  const originalPrice = isLifetime
    ? PRICING_CONFIG.proPlusOriginalPrice
    : PRICING_CONFIG.proOriginalPrice;
  const price = isLifetime
    ? PRICING_CONFIG.proPlusPrice
    : PRICING_CONFIG.proPrice;
  const discount = isLifetime
    ? PRICING_CONFIG.proPlusDiscountPercent
    : PRICING_CONFIG.proDiscountPercent;
  const period = isLifetime ? "sekali bayar" : "bulan";
  const planLabel = isLifetime ? "Lisensi Sekali Bayar" : "Pro Business";

  return (
    <div className={`flex items-end gap-2.5 sm:gap-3 ${compact ? "" : "mt-2 sm:mt-3"}`}>
      <div>
        <p
          className={`text-[9.5px] sm:text-[10px] font-extrabold uppercase text-left tracking-[0.14em] ${isLight ? "text-[#556A60]" : "text-[#A5B8AD]"
            }`}
        >
          {planLabel}
        </p>
        <p
          className={`mt-0.5 text-xs sm:text-sm font-bold text-left line-through ${isLight ? "text-[#8EA096]" : "text-[#7B8F83]"
            }`}
        >
          Rp {originalPrice}
        </p>
        <p
          className={`text-2xl sm:text-3xl lg:text-[34px] font-black leading-none tracking-tighter ${isLight ? "text-[#12281F]" : "text-[#B8F55C]"
            }`}
        >
          Rp {price}
          <span
            className={`ml-1 text-xs sm:text-sm font-medium tracking-normal ${isLight ? "text-[#556A60]" : "text-[#C4D2C9]"
              }`}
          >
            / {period}
          </span>
        </p>
      </div>
      <div className="flex flex-col items-start gap-1 pb-0.5">
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] sm:text-xs font-black ${isLight ? "bg-[#184530] text-[#B8F55C]" : "bg-[#B8F55C] text-[#11281F]"
            }`}
        >
          Hemat {discount}%
        </span>
        <div
          className={`inline-flex max-w-full items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-bold border-rose-500/40 bg-rose-500/20 text-rose-600`}
        >
          <span>🔥 Promo Terbatas</span>
        </div>
      </div>
    </div>
  );
}

function waitForImages(node) {
  return Promise.all(
    Array.from(node.querySelectorAll("img")).map(
      (image) =>
        image.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", resolve, { once: true });
          })
    )
  );
}

export default function AdBannerStudio() {
  const [activeId, setActiveId] = useState(BANNERS[0].id);
  const [colorTheme, setColorTheme] = useState("dark"); // "dark" | "light"
  const [aspectRatio, setAspectRatio] = useState("portrait");
  const [exporting, setExporting] = useState(null);
  const [exportError, setExportError] = useState("");
  const bannerRef = useRef(null);

  const activeBanner = BANNERS.find((banner) => banner.id === activeId) || BANNERS[0];
  const isLight = colorTheme === "light";

  function handleSelectBanner(banner) {
    setActiveId(banner.id);
    if (banner.theme) {
      setColorTheme(banner.theme);
    }
  }

  async function getBannerDataUrl() {
    if (!bannerRef.current) return null;

    await document.fonts.ready;
    await waitForImages(bannerRef.current);

    const { toPng } = await import("html-to-image");
    const width = bannerRef.current.getBoundingClientRect().width;
    const exportHeight = aspectRatio === "portrait" ? 1920 : 1080;
    const backgroundColor = isLight ? "#F8FAF7" : "#0B1713";

    return toPng(bannerRef.current, {
      cacheBust: true,
      pixelRatio: 1080 / width,
      canvasWidth: 1080,
      canvasHeight: exportHeight,
      backgroundColor,
    });
  }

  async function handleExport(format) {
    setExporting(format);
    setExportError("");

    try {
      const dataUrl = await getBannerDataUrl();
      if (!dataUrl) throw new Error("Banner belum siap diekspor.");

      const filename = `asking-banner-${activeBanner.id}-${colorTheme}`;
      if (format === "png") {
        const link = document.createElement("a");
        link.download = `${filename}.png`;
        link.href = dataUrl;
        link.click();
      } else {
        const { jsPDF } = await import("jspdf");
        const exportHeight = aspectRatio === "portrait" ? 1920 : 1080;
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: [1080, exportHeight],
          hotfixes: ["px_scaling"],
        });
        pdf.addImage(dataUrl, "PNG", 0, 0, 1080, exportHeight, undefined, "FAST");
        pdf.save(`${filename}.pdf`);
      }
    } catch (error) {
      setExportError("Export gagal. Pastikan gambar sudah selesai dimuat lalu coba lagi.");
      console.error("Banner export failed", error);
    } finally {
      setExporting(null);
    }
  }

  return (
    <section className="min-h-screen bg-[#F8FAF7] px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#184530]">
              AsKing Creative Studio
            </p>
            <h1 className="text-3xl font-black tracking-tight text-[#11231B] sm:text-4xl">
              Banner ads yang menjual satu ide dengan jelas.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#556A60]">
              Pilih konsep, sesuaikan tema palet warna (Dark Forest atau Landing Page Light), lalu ekspor dalam resolusi tinggi.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-[#CFE2D3] bg-white px-4 py-3 text-xs text-[#556A60] shadow-sm">
              <span className="font-bold text-[#184530]">
                {aspectRatio === "portrait" ? "1080 x 1920 px" : "1080 x 1080 px"}
              </span>
              <span className="mx-2 text-[#A5B8AD]">/</span>
              Konten tetap 1:1
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
          <div className="mx-auto w-full max-w-180">
            <div
              ref={bannerRef}
              className={`relative w-full overflow-hidden shadow-2xl transition-colors duration-300 ${isLight
                ? "bg-[#F8FAF7] text-[#11231B] ring-1 ring-[#CFE2D3]"
                : "bg-[#0B1713] text-white ring-1 ring-[#234235]"
                }`}
              style={{
                "--banner-accent": isLight ? "#184530" : activeBanner.accent,
                aspectRatio: aspectRatio === "portrait" ? "9 / 16" : "1 / 1",
                background: isLight
                  ? "linear-gradient(180deg, #FFFFFF 0%, #F5F9F6 50%, #EBF3ED 100%)"
                  : "linear-gradient(180deg, #0B1713 0%, #07110D 100%)",
              }}
            >
              <div
                contentEditable="true"
                suppressContentEditableWarning
                className={`relative left-0 w-full aspect-square p-[5.5%] ${aspectRatio === "portrait" ? "absolute top-1/2 -translate-y-1/2" : ""
                  }`}
              >
                {/* corner glow effect */}
                <div
                  className={`absolute right-[-10%] top-[-15%] h-[55%] w-[60%] rounded-full blur-3xl pointer-events-none ${isLight ? "bg-[#B8F55C] opacity-25" : "bg-(--banner-accent) opacity-10"
                    }`}
                />

                <div className="relative z-10 flex h-full flex-col justify-between">
                  {/* Top Bar / Branding */}
                  <div className="flex items-center justify-between">
                    <BannerBrand theme={colorTheme} />
                    <div
                      className={`hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold sm:flex border ${isLight
                        ? "border-[#CFE2D3] bg-white text-[#184530] shadow-xs"
                        : "border-[#2E5544] bg-[#173427]/80 text-[#DCE8DF]"
                        }`}
                    >
                      {activeBanner.type === "intro_legacy" ? (
                        <>
                          <WindowsIcon className="h-4 w-4 text-[#B8F55C]" /> Available on Microsoft Store
                        </>
                      ) : activeBanner.type === "intro" ? (
                        <>
                          <ShieldCheck
                            className={`h-4 w-4 ${isLight ? "text-[#184530]" : "text-[#B8F55C]"}`}
                          />{" "}
                          Solusi All-In-One & Data 100% di Komputer Anda
                        </>
                      ) : (
                        <>
                          <ShieldCheck
                            className={`h-4 w-4 ${isLight ? "text-[#184530]" : "text-[#B8F55C]"}`}
                          />{" "}
                          Data bisnis tetap milik Anda
                        </>
                      )}
                    </div>
                  </div>

                  {/* Body Content based on Banner Type */}
                  {activeBanner.type === "intro" ? (
                    <div className="flex flex-col flex-1 justify-between py-1.5">
                      {/* 1. Header Typography */}
                      <div>
                        <div className="inline-flex items-center gap-2 mb-1.5">
                        </div>

                        <div
                          className={`relative mx-[-2%] overflow-hidden rounded-2xl px-[3%] py-2.5 sm:py-3 border transition-colors ${isLight
                            ? "border-[#CFE2D3] bg-white/70 shadow-[0_2px_12px_rgba(18,40,31,0.04)]"
                            : "border-[#2A5240]/60 bg-[#12281F]/40 shadow-[0_2px_12px_rgba(0,0,0,0.2)]"
                            }`}
                        >
                          <img
                            src="/screenshots/tikets.webp"
                            alt=""
                            className={`absolute inset-0 h-full w-full scale-105 object-cover object-[75%_20%] blur-[1px] pointer-events-none ${isLight ? "opacity-65" : "opacity-30"
                              }`}
                          />
                          <div
                            className={`absolute inset-0 pointer-events-none ${isLight
                              ? "bg-gradient-to-r from-white via-white/80 to-white/20"
                              : "bg-gradient-to-r from-[#0B1713] via-[#0B1713]/85 to-[#0B1713]/25"
                              }`}
                          />
                          <div className="relative z-10">
                            <h2
                              className={`whitespace-pre-line text-[clamp(1.35rem,3.1vw,2.15rem)] font-black leading-[1.06] tracking-tight ${isLight ? "text-[#11231B]" : "text-white"
                                }`}
                            >
                              {activeBanner.title}
                            </h2>

                            <p
                              className={`mt-1.5 max-w-160 text-[clamp(0.72rem,1.25vw,0.85rem)] font-medium leading-relaxed ${isLight ? "text-[#243D30]" : "text-[#C4D2C9]"
                                }`}
                            >
                              {activeBanner.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 2. Value Proposition Grid: "Apa yang Anda Dapatkan?" */}
                      <div className="my-auto py-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className={`text-[10px] sm:text-[10.5px] font-extrabold uppercase tracking-[0.14em] flex items-center gap-1.5 ${isLight ? "text-[#184530]" : "text-[#B8F55C]"
                              }`}
                          >
                            Apa yang Anda Dapatkan?
                          </span>
                          <span
                            className={`text-[9.5px] font-bold ${isLight ? "text-[#556A60]" : "text-[#A5B8AD]"
                              }`}
                          >
                            Masih banyak fitur menarik lainnya
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                          {INCLUDED_BENEFITS.map((item, idx) => (
                            <div
                              key={idx}
                              className={`flex items-start gap-2 sm:gap-2.5 rounded-xl p-2 sm:p-2.5 border transition-all ${isLight
                                ? "bg-white/95 border-[#DEE7DF] shadow-[0_2px_6px_rgba(18,40,31,0.03)]"
                                : "bg-[#142A20]/80 border-[#2A5240]/80 shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
                                }`}
                            >
                              <div
                                className={`flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-lg mt-0.5 ${isLight
                                  ? "bg-[#EBF1EB] text-[#184530]"
                                  : "bg-[#1F4233] text-[#B8F55C]"
                                  }`}
                              >
                                <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3
                                  className={`text-[11px] sm:text-xs font-bold leading-tight ${isLight ? "text-[#11231B]" : "text-white"
                                    }`}
                                >
                                  {item.title}
                                </h3>
                                <p
                                  className={`mt-0.5 text-[9.5px] sm:text-[10px] leading-snug line-clamp-2 ${isLight ? "text-[#556A60]" : "text-[#A5B8AD]"
                                    }`}
                                >
                                  {item.desc}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 3. Bottom Bar: Pricing + CTA */}
                      <div
                        className={`pt-2 ${isLight ? "border-[#DEE7DF]" : "border-[#1F4233]"
                          }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                          <PriceBlock compact theme={colorTheme} plan="lifetime" />

                          <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                            <a
                              href={STORE_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block transition-transform hover:scale-[1.03] active:scale-[0.98] drop-shadow-md rounded-[5px]"
                            >
                              <img
                                src="/badges/microsoft-store-id-light.svg"
                                alt="Tersedia di Microsoft Store"
                                className="h-11 sm:h-12 w-auto object-contain"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : activeBanner.type === "intro_legacy" ? (
                    <div className="flex flex-col flex-1 justify-between">
                      <div>
                        <p className="mb-4 mt-[6%] text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#B8F55C] sm:text-[11px]">
                          {activeBanner.eyebrow}
                        </p>
                        <div className="relative mx-[-3%] overflow-hidden rounded-2xl px-[3%] py-4">
                          <img
                            src="/screenshots/tikets.webp"
                            alt=""
                            className="absolute inset-0 h-full w-full scale-110 object-cover object-center opacity-25 blur-[1px]"
                          />
                          <div className="relative z-10 max-w-[88%]">
                            <h2 className="max-w-full whitespace-pre-line text-[clamp(1.7rem,4.35vw,3.5rem)] font-black leading-[0.96] tracking-tighter text-white">
                              {activeBanner.title}
                            </h2>
                          </div>
                        </div>
                        <div className="max-w-[88%]">
                          <p className="mt-4 max-w-155 text-[clamp(0.78rem,1.6vw,1.05rem)] font-medium leading-relaxed text-[#C4D2C9]">
                            {activeBanner.description}
                          </p>
                        </div>
                        <div className="max-w-[100%]">
                          <PriceBlock compact={false} theme="dark" plan="pro" />
                        </div>
                      </div>

                      <div className="mt-6 flex items-end justify-between gap-4">
                        <a
                          href={STORE_URL}
                          className="inline-flex items-center gap-2 rounded-full bg-[#B8F55C] px-5 py-2.5 text-xs font-black text-[#11281F] shadow-lg"
                        >
                          Coba AsKing Gratis <Gift className="h-4 w-4" />
                        </a>
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#B8F55C] px-3.5 py-2 text-[10px] font-black text-[#11281F] shadow-lg sm:px-5 sm:py-2.5 sm:text-xs">
                          Fitur AsKing
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  ) : activeBanner.type === "closing" ? (
                    <div className="mt-[8%] flex flex-1 flex-col items-center justify-center text-center">
                      <p
                        className={`mb-3 text-[9px] font-extrabold uppercase tracking-[0.2em] sm:text-[11px] ${isLight ? "text-[#184530]" : "text-(--banner-accent)"
                          }`}
                      >
                        {activeBanner.eyebrow}
                      </p>
                      <h2
                        className={`max-w-full whitespace-nowrap text-[clamp(1.1rem,3.8vw,2.75rem)] font-black leading-none tracking-tighter ${isLight ? "text-[#11231B]" : "text-white"
                          }`}
                      >
                        {activeBanner.title}
                      </h2>
                      <p
                        className={`my-4 max-w-135 text-[clamp(0.78rem,1.6vw,1.05rem)] font-semibold leading-relaxed ${isLight ? "text-[#556A60]" : "text-[#C4D2C9]"
                          }`}
                      >
                        {activeBanner.description}
                      </p>
                      <PriceBlock compact theme={colorTheme} plan="lifetime" />
                      <div
                        className={`mt-6 flex items-center gap-4 rounded-xl p-2 text-left border ${isLight
                          ? "bg-white border-[#DEE7DF] shadow-xs"
                          : "bg-white/10 border-[#2E5544]"
                          }`}
                      >
                        <QRCodeSVG
                          value={WEBSITE_URL}
                          size={84}
                          bgColor={isLight ? "#ffffff" : "#ffffff"}
                          fgColor="#0B1713"
                          includeMargin
                        />
                        <div className="pr-2">
                          <p
                            className={`text-[10px] font-extrabold uppercase tracking-wider ${isLight ? "text-[#184530]" : "text-[#B8F55C]"
                              }`}
                          >
                            Kunjungi website kami
                          </p>
                          <p
                            className={`mt-1 text-xs font-black ${isLight ? "text-[#11231B]" : "text-white"
                              }`}
                          >
                            {WEBSITE_URL.replace("https://", "")}
                          </p>
                          <p
                            className={`mt-1 text-[10px] ${isLight ? "text-[#556A60]" : "text-[#8EA096]"
                              }`}
                          >
                            Scan untuk mulai.
                          </p>
                        </div>
                      </div>
                      <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                        <a
                          href={STORE_URL}
                          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-black shadow-lg ${isLight
                            ? "bg-[#12281F] text-[#B8F55C] hover:bg-[#184530]"
                            : "bg-[#B8F55C] text-[#11281F]"
                            }`}
                        >
                          Download via Microsoft Store <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                        <a
                          href={WEBSITE_URL}
                          className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-black ${isLight
                            ? "border-[#CFE2D3] bg-white text-[#184530]"
                            : "border-[#527566] text-[#DCE8DF]"
                            }`}
                        >
                          Kunjungi Website <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mt-[4%] max-w-[68%] sm:max-w-[59%]">
                        <p
                          className={`mb-3 text-[9px] font-extrabold uppercase tracking-[0.2em] sm:text-[11px] ${isLight ? "text-[#184530]" : "text-(--banner-accent)"
                            }`}
                        >
                          {activeBanner.eyebrow}
                        </p>
                        <h2
                          className={`whitespace-pre-line text-[44px] sm:text-[52px] font-black leading-[0.98] tracking-[-0.04em] ${isLight ? "text-[#11231B]" : "text-white"
                            }`}
                        >
                          {activeBanner.title}
                        </h2>
                        <p
                          className={`my-3 max-w-124 text-[clamp(0.72rem,1.5vw,0.95rem)] font-medium leading-relaxed ${isLight ? "text-[#556A60]" : "text-[#C4D2C9]"
                            }`}
                        >
                          {activeBanner.description}
                        </p>
                      </div>

                      <div className="mt-auto">
                        <div
                          className={`relative ml-[8%] h-[39%] min-h-38.75 w-[106%] overflow-hidden rounded-t-lg border shadow-2xl sm:ml-[12%] sm:min-h-55 ${isLight
                            ? "border-[#CFE2D3] bg-[#E8F0EA]"
                            : "border-[#6C8476]/50 bg-[#E8F0EA]"
                            }`}
                        >
                          <div className="absolute inset-0 bg-[#E8F0EA]" />
                          <img
                            src={activeBanner.image}
                            alt=""
                            className="relative h-full w-full object-cover object-(--image-position)"
                            style={{ "--image-position": activeBanner.position }}
                          />
                          <div
                            className={`absolute inset-0 bg-linear-to-t from-black/30 to-transparent`}
                          />
                        </div>

                        <div className="relative z-10 mt-3 flex items-end justify-between gap-3">
                          <div className="max-w-[55%]">
                            <p
                              className={`text-sm font-medium ${isLight ? "text-[#556A60]" : "text-[#B8C9BD]"
                                }`}
                            >
                              {activeBanner.proof}
                            </p>
                            <span
                              className={`border-t text-[9px] font-semibold ${isLight
                                ? "border-[#CFE2D3] text-[#6B8075]"
                                : "border-[#8EA096] text-[#8EA096]"
                                }`}
                            >
                              © 2026 GoDiscus. All rights reserved. {WEBSITE_URL}
                            </span>
                          </div>
                          <span
                            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[10px] font-black shadow-lg sm:px-5 sm:py-2.5 sm:text-xs ${isLight
                              ? "bg-[#12281F] text-[#B8F55C]"
                              : "bg-[#B8F55C] text-[#11281F]"
                              }`}
                          >
                            Selanjutnya
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-[#DEE7DF] bg-white p-5 shadow-sm lg:sticky lg:top-6">
            {/* Color Theme Selector */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-black text-[#11231B]">Pilihan Tema Warna</h2>
                <span className="text-[10px] font-bold text-[#184530] bg-[#EBF1EB] px-2 py-0.5 rounded-full">
                  {isLight ? "Landing Page" : "Dark Forest"}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-[#6B8075]">
                Pilih palet warna banner ads yang ingin Anda preview dan ekspor.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setColorTheme("dark")}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all ${colorTheme === "dark"
                    ? "border-[#184530] bg-[#12281F] text-[#B8F55C] shadow-sm"
                    : "border-[#DEE7DF] bg-white text-[#556A60] hover:border-[#AFC8B6]"
                    }`}
                >
                  <Moon className="h-3.5 w-3.5" />
                  Dark Forest
                </button>
                <button
                  type="button"
                  onClick={() => setColorTheme("light")}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all ${colorTheme === "light"
                    ? "border-[#184530] bg-[#F2F7F3] text-[#184530] shadow-sm ring-1 ring-[#184530]"
                    : "border-[#DEE7DF] bg-white text-[#556A60] hover:border-[#AFC8B6]"
                    }`}
                >
                  <Sun className="h-3.5 w-3.5" />
                  Landing Page
                </button>
              </div>
            </div>

            <div className="my-4 h-px bg-[#EEF3EF]" />

            <div className="mb-4">
              <h2 className="text-sm font-black text-[#11231B]">Pilih fokus banner</h2>
              <p className="mt-1 text-xs leading-relaxed text-[#6B8075]">
                Pilih varian konsep banner yang ingin ditampilkan.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              {BANNERS.map((banner) => {
                const isActive = banner.id === activeId;
                return (
                  <button
                    key={banner.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleSelectBanner(banner)}
                    className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all focus:outline-none focus:ring-2 focus:ring-[#B8F55C] focus:ring-offset-2 ${isActive
                      ? "border-[#184530] bg-[#F2F7F3] shadow-sm"
                      : "border-[#DEE7DF] bg-white hover:border-[#AFC8B6]"
                      }`}
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: banner.accent }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-bold text-[#11231B] truncate">
                        {banner.label}
                      </span>
                      <span className="mt-0.5 block text-[10px] text-[#6B8075]">
                        {isActive ? "Sedang dipreview" : "Gunakan konsep ini"}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="my-5 h-px bg-[#EEF3EF]" />
            <div className="mb-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B8075]">
                Rasio export
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-[#6B8075]">
                Konten banner selalu dipertahankan dalam proporsi 1:1.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: "square", label: "Square", size: "1080 x 1080" },
                { id: "portrait", label: "Portrait", size: "1080 x 1920" },
              ].map((option) => {
                const isSelected = aspectRatio === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setAspectRatio(option.id)}
                    className={`rounded-xl border px-3 py-2.5 text-left transition-all focus:outline-none focus:ring-2 focus:ring-[#B8F55C] focus:ring-offset-2 ${isSelected
                      ? "border-[#184530] bg-[#F2F7F3]"
                      : "border-[#DEE7DF] bg-white hover:border-[#AFC8B6]"
                      }`}
                  >
                    <span className="block text-xs font-bold text-[#11231B]">{option.label}</span>
                    <span className="mt-0.5 block text-[10px] text-[#6B8075]">{option.size} px</span>
                  </button>
                );
              })}
            </div>

            <div className="my-5 h-px bg-[#EEF3EF]" />
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-[#6B8075]">
              Export banner aktif
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleExport("png")}
                disabled={Boolean(exporting)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#184530] px-3 py-2.5 text-xs font-bold text-[#B8F55C] transition-colors hover:bg-[#12281F] disabled:cursor-wait disabled:opacity-60 shadow-sm"
              >
                {exporting === "png" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ImageDown className="h-3.5 w-3.5" />
                )}
                PNG
              </button>
              <button
                type="button"
                onClick={() => handleExport("pdf")}
                disabled={Boolean(exporting)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#184530] px-3 py-2.5 text-xs font-bold text-[#184530] transition-colors hover:bg-[#F2F7F3] disabled:cursor-wait disabled:opacity-60"
              >
                {exporting === "pdf" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <FileDown className="h-3.5 w-3.5" />
                )}
                PDF
              </button>
            </div>
            {exportError && (
              <p className="mt-3 text-[11px] leading-relaxed text-rose-700">{exportError}</p>
            )}
            <div className="mt-5 rounded-2xl bg-[#F8FAF7] p-3.5 text-[11px] leading-relaxed text-[#6B8075]">
              <Download className="mb-1.5 h-4 w-4 text-[#184530]" />
              File otomatis diekspor dengan palet warna {isLight ? "Landing Page Light" : "Dark Forest"} dalam kualitas tajam.
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

