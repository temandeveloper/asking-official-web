"use client";

import { useRef, useState } from "react";
import { Download, FileDown, ImageDown, ArrowUpRight, ShieldCheck, Loader2,ArrowRight,Gift } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { PRICING_CONFIG } from "@/lib/config/pricing";

const STORE_URL = "https://apps.microsoft.com/detail/9NWF08NXV3GS";
const WEBSITE_URL = "https://asking.godiscus.com";

const BANNERS = [
  {
    id: "intro",
    label: "Pembuka",
    type: "intro",
    eyebrow: "CUSTOMER MANAGER LOCAL-FIRST",
    title: "Data Bisnis Anda Tidak\nAkan Pernah Lagi\nMeninggalkan Perangkat Anda",
    description: "Kelola pesan WhatsApp, Telegram, tiket, dan pelanggan dalam satu aplikasi desktop yang cepat, rapi, dan lebih privat.",
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

function BannerBrand() {
  return (
    <div className="inline-flex items-center gap-2.5">
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl p-1">
        <img src="/logo.png" alt="AsKing Logo" className="h-full w-full object-contain drop-shadow-[0_1px_3px_rgba(184,245,92,0.4)]" />
      </div>
      <div className="flex flex-col text-left">
        <span className="text-lg font-black leading-none tracking-tight text-white">AsKing</span>
        <span className="mt-0.5 text-[10px] font-semibold leading-none tracking-tight text-white/80">Customer Manager</span>
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

function PriceBlock({ compact = false }) {
  return (
    <div className={`flex items-end gap-3 ${compact ? "" : "mt-6"}`}>
      <div>
        <p className="text-[10px] font-bold uppercase text-left tracking-[0.18em] text-[#A5B8AD]">Pro Business</p>
        <p className="mt-1 text-sm font-bold text-[#8EA096] text-left line-through">Rp {PRICING_CONFIG.proOriginalPrice}</p>
        <p className="text-4xl font-black leading-none tracking-tighter text-[#B8F55C] sm:text-5xl">Rp {PRICING_CONFIG.proPrice}<span className="text-base font-medium tracking-normal">/ bulan</span></p>
      </div>
      <div className="flex flex-col items-start gap-1">
        <span className="mb-1 rounded-full bg-[#B8F55C] px-3 py-1.5 text-xs font-black text-[#11281F]">Hemat {PRICING_CONFIG.proDiscountPercent}%</span>
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-[11px] font-bold text-rose-300">
          <span>🔥 Harga Flat, Promo Terbatas</span>
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
  const [exporting, setExporting] = useState(null);
  const [exportError, setExportError] = useState("");
  const bannerRef = useRef(null);
  const activeBanner = BANNERS.find((banner) => banner.id === activeId) || BANNERS[0];

  async function getBannerDataUrl() {
    if (!bannerRef.current) return null;

    await document.fonts.ready;
    await waitForImages(bannerRef.current);

    const { toPng } = await import("html-to-image");
    const width = bannerRef.current.getBoundingClientRect().width;

    return toPng(bannerRef.current, {
      cacheBust: true,
      pixelRatio: 1080 / width,
      canvasWidth: 1080,
      canvasHeight: 1080,
      backgroundColor: "#0B1713",
    });
  }

  async function handleExport(format) {
    setExporting(format);
    setExportError("");

    try {
      const dataUrl = await getBannerDataUrl();
      if (!dataUrl) throw new Error("Banner belum siap diekspor.");

      const filename = `asking-banner-${activeBanner.id}`;
      if (format === "png") {
        const link = document.createElement("a");
        link.download = `${filename}.png`;
        link.href = dataUrl;
        link.click();
      } else {
        const { jsPDF } = await import("jspdf");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: [1080, 1080],
          hotfixes: ["px_scaling"],
        });
        pdf.addImage(dataUrl, "PNG", 0, 0, 1080, 1080, undefined, "FAST");
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
              Pilih konsep, review di kanvas 1:1, lalu unduh materi siap pakai untuk Meta Ads.
            </p>
          </div>
          <div className="rounded-2xl border border-[#CFE2D3] bg-white px-4 py-3 text-xs text-[#556A60] shadow-sm">
            <span className="font-bold text-[#184530]">1080 x 1080 px</span>
            <span className="mx-2 text-[#A5B8AD]">/</span>
            Satu pesan, satu bukti, satu CTA
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_310px] lg:items-start">
          <div className="mx-auto w-full max-w-180">
            <div
              ref={bannerRef}
              className="relative aspect-square w-full overflow-hidden bg-[#0B1713] p-[6.5%] text-white shadow-2xl ring-1 ring-[#234235]"
              style={{ "--banner-accent": activeBanner.accent }}
            >
              {/* corner glow effect */}
              <div className="absolute right-[-12%] top-[-15%] h-[48%] w-[55%] rounded-full bg-(--banner-accent) opacity-10 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-[42%] w-full bg-linear-to-t from-[#07110D] to-transparent" />

              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <BannerBrand />
                  <div className="hidden items-center gap-1.5 rounded-full border border-[#2E5544] bg-[#173427]/80 px-3 py-1.5 text-xs font-bold text-[#DCE8DF] sm:flex">
                    {activeBanner.type === "intro" ? (
                      <>
                        <WindowsIcon className="h-4 w-4 text-[#B8F55C]" /> Available on Microsoft Store
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4 text-[#B8F55C]" /> Data bisnis tetap milik Anda
                      </>
                    )}
                  </div>
                </div>

                {activeBanner.type === "intro" ? (
                  <div>
                    <p className="mb-4 mt-[10%] text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#B8F55C] sm:text-[11px]">{activeBanner.eyebrow}</p>
                    <div className="relative mx-[-3%] overflow-hidden rounded-2xl px-[3%] py-4">
                      <img
                        src="/screenshots/tikets.webp"
                        alt=""
                        className="absolute inset-0 h-full w-full scale-110 object-cover object-center opacity-25 blur-[1px]"
                      />
                      <div className="relative z-10 max-w-[88%]">
                        <h2 className="max-w-full whitespace-pre-line text-[clamp(1.7rem,4.35vw,3.5rem)] font-black leading-[0.96] tracking-tighter text-white">{activeBanner.title}</h2>
                      </div>
                    </div>
                    <div className="max-w-[88%]">
                      <p className="mt-5 max-w-155 text-[clamp(0.78rem,1.6vw,1.05rem)] font-medium leading-relaxed text-[#C4D2C9]">{activeBanner.description}</p>
                      <PriceBlock />
                    </div>
                  </div>
                ) : activeBanner.type === "closing" ? (
                  <div className="mt-[8%] flex flex-1 flex-col items-center justify-center text-center">
                    <p className="mb-3 text-[9px] font-extrabold uppercase tracking-[0.2em] text-(--banner-accent) sm:text-[11px]">{activeBanner.eyebrow}</p>
                    <h2 className="max-w-full whitespace-nowrap text-[clamp(1.1rem,3.8vw,2.75rem)] font-black leading-none tracking-tighter text-white">{activeBanner.title}</h2>
                    <p className="my-4 max-w-135 text-[clamp(0.78rem,1.6vw,1.05rem)] font-semibold leading-relaxed text-[#C4D2C9]">{activeBanner.description}</p>
                    <PriceBlock compact />
                    <div className="mt-8 flex items-center gap-4 rounded-lg bg-white p-1 text-left">
                      <QRCodeSVG value={WEBSITE_URL} size={92} bgColor="#ffffff" fgColor="#0B1713" includeMargin />
                      <div className="pr-2">
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#184530]">Kunjungi website kami</p>
                        <p className="mt-1 text-xs font-black text-[#11231B]">{WEBSITE_URL.replace("https://", "")}</p>
                        <p className="mt-1 text-[10px] text-[#556A60]">Scan untuk mulai.</p>
                      </div>
                    </div>
                    <div className="mt-8 flex flex-wrap justify-center gap-2.5">
                      <a href={STORE_URL} className="inline-flex items-center gap-2 rounded-full bg-[#B8F55C] px-5 py-2.5 text-xs font-black text-[#11281F] shadow-lg">
                        Download via Microsoft Store <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                      <a href={WEBSITE_URL} className="inline-flex items-center gap-2 rounded-full border border-[#527566] px-5 py-2.5 text-xs font-black text-[#DCE8DF]">
                        Kunjungi Website <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                ) : (
                <>
                <div className="mt-[4%] max-w-[68%] sm:max-w-[59%]">
                  <p className="mb-3 text-[9px] font-extrabold uppercase tracking-[0.2em] text-(--banner-accent) sm:text-[11px]">
                    {activeBanner.eyebrow}
                  </p>
                  <h2 className="whitespace-pre-line text-[52px] font-black leading-[0.98] tracking-[-0.04em] text-white">
                    {activeBanner.title}
                  </h2>
                  <p className="my-4 max-w-124 text-[clamp(0.72rem,1.5vw,1rem)] font-medium leading-relaxed text-[#C4D2C9]">
                    {activeBanner.description}
                  </p>
                </div>

                <div className="mt-auto">
                  <div className="relative ml-[8%] h-[39%] min-h-38.75 w-[106%] overflow-hidden rounded-t-lg border border-[#6C8476]/50 bg-[#E8F0EA] shadow-2xl sm:ml-[12%] sm:min-h-55">
                    <div className="absolute inset-0 bg-[#E8F0EA]" />
                    <img
                      src={activeBanner.image}
                      alt=""
                      className="relative h-full w-full object-cover object-(--image-position)"
                      style={{ "--image-position": activeBanner.position }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#0B1713]/35 to-transparent" />
                  </div>

                  <div className="relative z-10 mt-3 flex items-end justify-between gap-3">
                    <div className="max-w-[55%]">
                      <p className="text-sm font-medium text-[#B8C9BD]">{activeBanner.proof}</p>
                      <span className="border-t border-[#8EA096] text-[9px] font-semibold text-[#8EA096]">© 2026 GoDiscus. All rights reserved. {WEBSITE_URL}</span>
                    </div>
                    <span
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#B8F55C] px-3.5 py-2 text-[10px] font-black text-[#11281F] shadow-lg sm:px-5 sm:py-2.5 sm:text-xs"
                    >
                      Selanjutnya
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
                </>
                )}

                {activeBanner.type === "intro" && (
                  <div className="mt-6 flex items-end justify-between gap-4">
                    <a href={STORE_URL} className="inline-flex items-center gap-2 rounded-full bg-[#B8F55C] px-5 py-2.5 text-xs font-black text-[#11281F] shadow-lg">
                      Coba AsKing Gratis <Gift className="h-4 w-4" />
                    </a>
                    <span
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#B8F55C] px-3.5 py-2 text-[10px] font-black text-[#11281F] shadow-lg sm:px-5 sm:py-2.5 sm:text-xs"
                    >
                      Fitur AsKing
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-[#DEE7DF] bg-white p-5 shadow-sm lg:sticky lg:top-6">
            <div className="mb-4">
              <h2 className="text-sm font-black text-[#11231B]">Pilih fokus banner</h2>
              <p className="mt-1 text-xs leading-relaxed text-[#6B8075]">Setiap varian memakai screenshot dan pesan yang berbeda.</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-1">
              {BANNERS.map((banner) => {
                const isActive = banner.id === activeId;
                return (
                  <button
                    key={banner.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveId(banner.id)}
                    className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-all focus:outline-none focus:ring-2 focus:ring-[#B8F55C] focus:ring-offset-2 ${isActive ? "border-[#184530] bg-[#F2F7F3] shadow-sm" : "border-[#DEE7DF] bg-white hover:border-[#AFC8B6]"}`}
                  >
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: banner.accent }} />
                    <span>
                      <span className="block text-xs font-bold text-[#11231B]">{banner.label}</span>
                      <span className="mt-0.5 block text-[10px] text-[#6B8075]">{isActive ? "Sedang dipreview" : "Gunakan konsep ini"}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="my-5 h-px bg-[#EEF3EF]" />
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-[#6B8075]">Export banner aktif</p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleExport("png")}
                disabled={Boolean(exporting)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#184530] px-3 py-2.5 text-xs font-bold text-[#B8F55C] transition-colors hover:bg-[#12281F] disabled:cursor-wait disabled:opacity-60"
              >
                {exporting === "png" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageDown className="h-3.5 w-3.5" />}
                PNG
              </button>
              <button
                type="button"
                onClick={() => handleExport("pdf")}
                disabled={Boolean(exporting)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#184530] px-3 py-2.5 text-xs font-bold text-[#184530] transition-colors hover:bg-[#F2F7F3] disabled:cursor-wait disabled:opacity-60"
              >
                {exporting === "pdf" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileDown className="h-3.5 w-3.5" />}
                PDF
              </button>
            </div>
            {exportError && <p className="mt-3 text-[11px] leading-relaxed text-rose-700">{exportError}</p>}
            <div className="mt-5 rounded-2xl bg-[#F8FAF7] p-3.5 text-[11px] leading-relaxed text-[#6B8075]">
              <Download className="mb-1.5 h-4 w-4 text-[#184530]" />
              File akan diberi nama berdasarkan fokus banner dan siap dipakai sebagai materi iklan square.
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
