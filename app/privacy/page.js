"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ShieldCheck,
  ArrowLeft,
  HardDrive,
  Database,
  CheckCircle2,
  Globe,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function PrivacyPage() {
  const { language, toggleLanguage } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF7] text-[#11231B]">
      <Navbar />
      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#184530] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>
                {language === "id" ? "Kembali ke Beranda" : "Back to Home"}
              </span>
            </Link>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EBF1EB] hover:bg-[#DDE7DE] border border-[#CFE2D3] text-xs font-bold text-[#184530] transition-all cursor-pointer shadow-2xs"
            >
              <Globe className="w-3.5 h-3.5 text-[#184530]" />
              <span>{language === "id" ? "🇮🇩 ID" : "🇬🇧 EN"}</span>
            </button>
          </div>

          <div className="rounded-3xl bg-white border border-[#DEE7DF] p-8 sm:p-12 shadow-sm space-y-12">
            {/* Header */}
            <div className="space-y-3 pb-6 border-b border-[#DEE7DF]">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#18362B] text-[#B8F55C] text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>
                  {language === "id"
                    ? "Privasi & Kedaulatan Data"
                    : "Privacy & Data Sovereignty"}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#11231B] tracking-tight">
                {language === "id"
                  ? "Kebijakan Privasi AsKing"
                  : "AsKing Privacy Policy"}
              </h1>
              <p className="text-xs text-[#556A60]">
                {language === "id"
                  ? "Terakhir Diperbarui: 24 Agustus 2026"
                  : "Last Updated: August 24, 2026"}
              </p>
            </div>

            {/* Executive Summary Pill */}
            <div className="p-5 rounded-2xl bg-[#EBF1EB] border border-[#CFE2D3] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#184530]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {language === "id"
                    ? "Komitmen Utama: Privasi adalah Fondasi Kami, Bukan Sekadar Fitur"
                    : "Core Commitment: Privacy is Our Foundation, Not Just a Feature"}
                </span>
              </div>
              <p className="text-xs text-[#4A5F54] leading-relaxed">
                {language === "id"
                  ? "Berbeda dengan CRM berbasis cloud tradisional yang menyimpan seluruh percakapan rahasia Anda di server vendor mereka, AsKing dirancang secara mendasar dengan arsitektur Local-First. Riwayat pesan percakapan, kontak pelanggan, dan tiket bantuan Anda disimpan secara lokal di perangkat komputer Anda sendiri."
                  : "Unlike traditional cloud CRMs that aggregate your sensitive customer chats on their centralized vendor servers, AsKing is fundamentally architected Local-First. Your message logs, contacts, and support tickets reside directly on your own computer."}
              </p>
            </div>

            {language === "id" ? (
              /* INDONESIAN VERSION */
              <div className="space-y-10 text-sm text-[#4B6055] leading-relaxed">
                {/* Section 1: Introduction */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      1
                    </span>
                    Pendahuluan
                  </h2>
                  <p>
                    Di AsKing, privasi dan kedaulatan data pengguna adalah prinsip utama kami. Kebijakan Privasi ini menjelaskan bagaimana aplikasi desktop AsKing dan situs web resmi kami mengelola data. Kami berkomitmen untuk memberikan transparansi menyeluruh tanpa celah pengawasan tersembunyi.
                  </p>
                </section>

                {/* Section 2: Core Privacy Principles */}
                <section className="space-y-4">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      2
                    </span>
                    Prinsip Utama Privasi AsKing
                  </h2>

                  <div className="space-y-3">
                    <div className="border-l-4 border-[#184530] pl-4 py-1.5 bg-[#F8FAF7] rounded-r-xl">
                      <h3 className="font-bold text-xs text-[#11231B] mb-1">
                        100% Arsitektur Local-First
                      </h3>
                      <p className="text-xs text-[#556A60]">
                        Seluruh basis data kontak pelanggan, riwayat obrolan, dan tiket Kanban disimpan di perangkat lokal Anda. Data bisnis Anda tidak pernah dikirimkan ke server kami untuk penyimpanan data.
                      </p>
                    </div>

                    <div className="border-l-4 border-[#184530] pl-4 py-1.5 bg-[#F8FAF7] rounded-r-xl">
                      <h3 className="font-bold text-xs text-[#11231B] mb-1">
                        Nol Pengawasan & Tanpa Penjualan Data
                      </h3>
                      <p className="text-xs text-[#556A60]">
                        Kami tidak memantau, memeriksa, atau menjual pesan obrolan pelanggan Anda. Kami tidak memiliki basis data terpusat yang menyimpan percakapan bisnis Anda.
                      </p>
                    </div>

                    <div className="border-l-4 border-[#184530] pl-4 py-1.5 bg-[#F8FAF7] rounded-r-xl">
                      <h3 className="font-bold text-xs text-[#11231B] mb-1">
                        Kedaulatan Data Penuh
                      </h3>
                      <p className="text-xs text-[#556A60]">
                        Anda memegang kendali mutlak. Seluruh data dapat diekspor, dipindahkan, atau dihapus kapan saja langsung dari komputer Anda tanpa ketergantungan vendor lock-in.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 3: Data Stays Local vs Cloud */}
                <section className="space-y-4">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      3
                    </span>
                    Klasifikasi Penyimpanan Informasi
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-2">
                      <div className="font-bold text-xs text-[#11231B] flex items-center gap-1.5">
                        <HardDrive className="w-4 h-4 text-[#184530]" />
                        <span>Tersimpan di Komputer Lokal Anda</span>
                      </div>
                      <ul className="text-xs text-[#556A60] space-y-1 list-disc list-inside">
                        <li>Riwayat pesan chat WhatsApp dan Telegram</li>
                        <li>Daftar kontak dan nomor telepon pelanggan</li>
                        <li>Papan Kanban tiket, catatan internal, dan status SLA</li>
                        <li>Jadwal broadcast dan template pesan kustom</li>
                        <li>Pengaturan tema antarmuka dan preferensi aplikasi</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-2">
                      <div className="font-bold text-xs text-[#11231B] flex items-center gap-1.5">
                        <Database className="w-4 h-4 text-[#184530]" />
                        <span>Data Autentikasi Cloud (Online)</span>
                      </div>
                      <ul className="text-xs text-[#556A60] space-y-1 list-disc list-inside">
                        <li>Alamat email untuk masuk akun pengguna</li>
                        <li>Nama profil terdaftar Anda</li>
                        <li>Sesi login Single Sign-On (SSO) aplikasi desktop</li>
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#DEE7DF] bg-[#F8FAF7] p-4 text-xs text-[#556A60]">
                    <h3 className="mb-1.5 font-bold text-[#11231B]">Pengukuran Website dan Pemasaran</h3>
                    <p>
                      Situs web kami menggunakan Meta Pixel untuk mengukur kunjungan halaman, interaksi dengan paket, pendaftaran akun yang berhasil, dan klik menuju Microsoft Store. Meta dapat menerima pengenal browser/perangkat serta aktivitas pada situs web ini sesuai kebijakan privasinya. Kami tidak mengirim isi pesan pelanggan, kontak, tiket, atau data bisnis lokal aplikasi Anda melalui Meta Pixel.
                    </p>
                  </div>
                </section>

                {/* Section 4: AI Processing via Gemini */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      4
                    </span>
                    Pemrosesan Fitur Kecerdasan Buatan (AI)
                  </h2>
                  <p>
                    Saat Anda menggunakan fitur <strong>AsKing AI Assistant</strong> atau <strong>AI Customer Agent</strong>:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2">
                    <li>Konteks pesan atau pertanyaan dikirimkan secara aman melalui koneksi terenkripsi (HTTPS) ke layanan pemrosesan AI untuk menghasilkan balasan atau analisis seketika.</li>
                    <li>Kami tidak menyimpan percakapan tersebut secara permanen di server kami setelah jawaban selesai diproses.</li>
                    <li>
                      Kami menggunakan Google Gemini sebagai pemrosesan AI, silakan baca juga{" "}
                      <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#184530] font-bold underline"
                      >
                        <span>Kebijakan Privasi Google Gemini</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>.
                    </li>
                  </ul>
                </section>

                {/* Section 5: External Messaging Channels */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      5
                    </span>
                    Saluran Pesan Eksternal (WhatsApp & Telegram)
                  </h2>
                  <p>
                    Aplikasi AsKing menghubungkan alur kerja pesan Anda dengan saluran eksternal. Kami menggunakan 2 saluran pesan eksternal yaitu WhatsApp dan Telegram. Silakan baca dan pahami juga kebijakan privasi masing-masing platform:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2">
                    <li>
                      <a
                        href="https://www.whatsapp.com/legal/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#184530] font-bold underline"
                      >
                        <span>Kebijakan Privasi WhatsApp</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://telegram.org/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#184530] font-bold underline"
                      >
                        <span>Kebijakan Privasi Telegram</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                  </ul>
                </section>

                {/* Section 6: Security & Device Responsibility */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      6
                    </span>
                    Keamanan Data & Tanggung Jawab Perangkat
                  </h2>
                  <p>
                    Karena seluruh data pesan dan kontak pelanggan Anda tersimpan secara lokal di komputer Anda:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2">
                    <li>Keamanan data Anda bergantung pada perlindungan bawaan perangkat Anda, seperti kunci kata sandi komputer, enkripsi disk sistem operasi, dan hak akses file perangkat.</li>
                    <li>AsKing dibangun tanpa pintu belakang (backdoor) sehingga data Anda hanya dapat diakses oleh pihak yang memegang akses fisik/login ke perangkat Anda.</li>
                  </ul>
                </section>

                {/* Section 7: User Rights */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      7
                    </span>
                    Hak & Kontrol Pengguna
                  </h2>
                  <div className="space-y-2 text-xs">
                    <p>
                      <strong>Akses:</strong> Anda memiliki akses langsung ke seluruh file database lokal Anda.
                    </p>
                    <p>
                      <strong>Ekspor:</strong> Anda dapat mengekspor kontak dan data tiket kapan saja.
                    </p>
                    <p>
                      <strong>Penghapusan:</strong> Menghapus (uninstall) aplikasi atau membersihkan data lokal akan menghapus seluruh data dari perangkat secara permanen.
                    </p>
                  </div>
                </section>

                {/* Section 8: Policy Updates & Contact */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      8
                    </span>
                    Pembaruan Kebijakan & Kontak Kami
                  </h2>
                  <p>
                    Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Pembaruan akan selalu dicantumkan pada halaman ini dengan tanggal revisi terbaru.
                  </p>
                  <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] text-xs">
                    <p>
                      <strong>Email:</strong>{" "}
                      <a
                        href="mailto:asking@godiscus.com"
                        className="text-[#184530] font-bold underline"
                      >
                        asking@godiscus.com
                      </a>
                    </p>
                  </div>
                </section>
              </div>
            ) : (
              /* ENGLISH VERSION */
              <div className="space-y-10 text-sm text-[#4B6055] leading-relaxed">
                {/* Section 1: Introduction */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      1
                    </span>
                    Introduction
                  </h2>
                  <p>
                    At AsKing, privacy and user data sovereignty are our core foundations. This Privacy Policy explains how our desktop application and official website handle data. We are committed to absolute transparency without hidden monitoring or telemetry.
                  </p>
                </section>

                {/* Section 2: Core Privacy Principles */}
                <section className="space-y-4">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      2
                    </span>
                    Core Privacy Principles
                  </h2>

                  <div className="space-y-3">
                    <div className="border-l-4 border-[#184530] pl-4 py-1.5 bg-[#F8FAF7] rounded-r-xl">
                      <h3 className="font-bold text-xs text-[#11231B] mb-1">
                        100% Local-First Architecture
                      </h3>
                      <p className="text-xs text-[#556A60]">
                        All customer directories, chat histories, and Kanban tickets reside on your device. Your business data is never stored on our cloud servers.
                      </p>
                    </div>

                    <div className="border-l-4 border-[#184530] pl-4 py-1.5 bg-[#F8FAF7] rounded-r-xl">
                      <h3 className="font-bold text-xs text-[#11231B] mb-1">
                        Zero Inspection & No Data Selling
                      </h3>
                      <p className="text-xs text-[#556A60]">
                        We never inspect, monitor, or sell your customer conversations. We maintain no centralized database of your private business chats.
                      </p>
                    </div>

                    <div className="border-l-4 border-[#184530] pl-4 py-1.5 bg-[#F8FAF7] rounded-r-xl">
                      <h3 className="font-bold text-xs text-[#11231B] mb-1">
                        Complete Data Sovereignty
                      </h3>
                      <p className="text-xs text-[#556A60]">
                        You maintain absolute ownership. All data can be exported, backed up, or deleted at any time directly from your computer without vendor lock-in.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 3: Data Stays Local vs Cloud */}
                <section className="space-y-4">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      3
                    </span>
                    Information Storage Classification
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-2">
                      <div className="font-bold text-xs text-[#11231B] flex items-center gap-1.5">
                        <HardDrive className="w-4 h-4 text-[#184530]" />
                        <span>Stored On Your Computer (Local-First)</span>
                      </div>
                      <ul className="text-xs text-[#556A60] space-y-1 list-disc list-inside">
                        <li>WhatsApp and Telegram message conversation logs</li>
                        <li>Customer contact directory and phone numbers</li>
                        <li>Kanban tickets, internal notes, and SLA tags</li>
                        <li>Broadcast schedules and custom message templates</li>
                        <li>UI theme settings and desktop preferences</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-2">
                      <div className="font-bold text-xs text-[#11231B] flex items-center gap-1.5">
                        <Database className="w-4 h-4 text-[#184530]" />
                        <span>Online Cloud Data (Account Authentication)</span>
                      </div>
                      <ul className="text-xs text-[#556A60] space-y-1 list-disc list-inside">
                        <li>Email address used for account authentication</li>
                        <li>Your registered profile display name</li>
                        <li>Desktop app single sign-on (SSO) session status</li>
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#DEE7DF] bg-[#F8FAF7] p-4 text-xs text-[#556A60]">
                    <h3 className="mb-1.5 font-bold text-[#11231B]">Website Measurement and Marketing</h3>
                    <p>
                      Our website uses Meta Pixel to measure page visits, pricing interactions, successful account registrations, and clicks to Microsoft Store. Meta may receive browser/device identifiers and activity on this website under its privacy policy. We do not send customer message content, contacts, tickets, or your app&apos;s local business data through Meta Pixel.
                    </p>
                  </div>
                </section>

                {/* Section 4: AI Processing via Gemini */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      4
                    </span>
                    Artificial Intelligence (AI) Features Processing
                  </h2>
                  <p>
                    When you use <strong>AsKing AI Assistant</strong> or <strong>AI Customer Agent</strong>:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2">
                    <li>Relevant context is transmitted via secure encrypted connections (HTTPS) strictly to generate the requested auto-reply or summary in real time.</li>
                    <li>We do not retain or store these messages permanently on our servers after generating the response.</li>
                    <li>
                      We use Google Gemini for AI processing; please also review the{" "}
                      <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#184530] font-bold underline"
                      >
                        <span>Google Privacy Policy</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>.
                    </li>
                  </ul>
                </section>

                {/* Section 5: External Messaging Channels */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      5
                    </span>
                    External Messaging Channels (WhatsApp & Telegram)
                  </h2>
                  <p>
                    AsKing integrates with 2 external messaging channels, WhatsApp and Telegram. Please review their privacy policies:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2">
                    <li>
                      <a
                        href="https://www.whatsapp.com/legal/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#184530] font-bold underline"
                      >
                        <span>WhatsApp Privacy Policy</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://telegram.org/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#184530] font-bold underline"
                      >
                        <span>Telegram Privacy Policy</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                  </ul>
                </section>

                {/* Section 6: Security & Device Responsibility */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      6
                    </span>
                    Data Security & Device Responsibility
                  </h2>
                  <p>
                    Since customer data is stored locally on your device:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2">
                    <li>Security depends on your device's built-in protections, including OS passcodes, full disk encryption, and filesystem permissions.</li>
                    <li>AsKing is built with zero backdoors, ensuring your data is accessible only by authorized individuals with access to your device.</li>
                  </ul>
                </section>

                {/* Section 7: User Rights */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      7
                    </span>
                    User Rights & Portability
                  </h2>
                  <div className="space-y-2 text-xs">
                    <p>
                      <strong>Access:</strong> Direct access to your local files and databases.
                    </p>
                    <p>
                      <strong>Export:</strong> Export your contacts and tickets at any time.
                    </p>
                    <p>
                      <strong>Delete:</strong> Uninstalling the application or wiping app data permanently deletes local records.
                    </p>
                  </div>
                </section>

                {/* Section 8: Policy Updates & Contact */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      8
                    </span>
                    Policy Changes & Contact Information
                  </h2>
                  <p>
                    We may update this Privacy Policy from time to time. Revisions will be posted here with an updated "Last Updated" date.
                  </p>
                  <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] text-xs">
                    <p>
                      <strong>Email:</strong>{" "}
                      <a
                        href="mailto:asking@godiscus.com"
                        className="text-[#184530] font-bold underline"
                      >
                        asking@godiscus.com
                      </a>
                    </p>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
