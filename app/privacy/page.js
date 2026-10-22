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
  Lock,
  AlertTriangle,
  UserCheck,
  KeyRound,
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
                    ? "Privasi, Kedaulatan Data & Kepatuhan UU PDP"
                    : "Privacy, Data Sovereignty & PDP Compliance"}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#11231B] tracking-tight">
                {language === "id"
                  ? "Kebijakan Privasi AsKing"
                  : "AsKing Privacy Policy"}
              </h1>
              <p className="text-xs text-[#556A60]">
                {language === "id"
                  ? "Terakhir Diperbarui: 22 Oktober 2026"
                  : "Last Updated: October 22, 2026"}
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
                  ? "Berbeda dengan CRM berbasis cloud konvensional yang mengumpulkan seluruh percakapan rahasia bisnis Anda ke server vendor terpusat, AsKing dirancang secara mendasar dengan arsitektur Local-First. Riwayat pesan percakapan pelanggan (WhatsApp, Telegram, dan Email), kontak, serta tiket bantuan disimpan secara eksklusif di perangkat komputer lokal Anda sendiri. Layanan cloud AsKing hanya digunakan secara minimal untuk keperluan autentikasi akun, validasi lisensi perangkat, dan pemrosesan AI secara temporer."
                  : "Unlike conventional cloud CRMs that aggregate sensitive customer chats on centralized vendor servers, AsKing is fundamentally architected Local-First. Customer messaging histories (WhatsApp, Telegram, and Email), contacts, and support tickets reside exclusively on your local computer. AsKing cloud services are strictly limited to account authentication, device license verification, and transient AI processing."}
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
                    Pendahuluan & Dasar Hukum
                  </h2>
                  <p>
                    Kebijakan Privasi ini mengatur bagaimana AsKing ("kami", "aplikasi", atau "layanan") memperoleh, mengumpulkan, memproses, menyimpan, mengamankan, dan menghapus Data Pribadi pengguna aplikasi desktop AsKing maupun pengunjung situs web resmi kami.
                  </p>
                  <p>
                    Kebijakan ini disusun berdasarkan standar tata kelola privasi industri dan mematuhi sepenuhnya ketentuan peraturan perundang-undangan di Republik Indonesia, khususnya <strong>Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)</strong> serta peraturan perundang-undangan terkait di bidang Informasi dan Transaksi Elektronik.
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
                    <div className="border-l-4 border-[#184530] pl-4 py-2 bg-[#F8FAF7] rounded-r-xl">
                      <h3 className="font-bold text-xs text-[#11231B] mb-1">
                        Penyimpanan Operasional Local-First
                      </h3>
                      <p className="text-xs text-[#556A60]">
                        Data operasional komunikasi pelanggan Anda (kontak, pesan masuk, pesan keluar, catatan internal tiket) disimpan secara lokal di komputer Anda. Kami tidak memiliki salinan pesan obrolan pelanggan Anda di cloud AsKing.
                      </p>
                    </div>

                    <div className="border-l-4 border-[#184530] pl-4 py-2 bg-[#F8FAF7] rounded-r-xl">
                      <h3 className="font-bold text-xs text-[#11231B] mb-1">
                        Prinsip Minimasi Data (Data Minimization)
                      </h3>
                      <p className="text-xs text-[#556A60]">
                        Kami hanya mengumpulkan data di cloud yang esensial untuk mengidentifikasi akun Anda, memvalidasi hak lisensi aktif pada perangkat Anda, serta mencatat transaksi langganan.
                      </p>
                    </div>

                    <div className="border-l-4 border-[#184530] pl-4 py-2 bg-[#F8FAF7] rounded-r-xl">
                      <h3 className="font-bold text-xs text-[#11231B] mb-1">
                        Kedaulatan & Kontrol Pengguna Penuh
                      </h3>
                      <p className="text-xs text-[#556A60]">
                        Anda memegang kendali penuh atas data lokal Anda, termasuk hak untuk mengekspor, membuat cadangan mandiri, atau menghapus seluruh berkas aplikasi tanpa jejak di server kami.
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
                    Klasifikasi Informasi & Data yang Disimpan di Cloud AsKing
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Local Data Box */}
                    <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-2.5">
                      <div className="font-bold text-xs text-[#11231B] flex items-center gap-1.5">
                        <HardDrive className="w-4 h-4 text-[#184530]" />
                        <span>Tersimpan di Komputer Lokal Anda (Local-First)</span>
                      </div>
                      <p className="text-xs text-[#556A60]">
                        Data berikut berada di penyimpanan lokal perangkat Anda dan <strong>tidak pernah</strong> diunggah ke server cloud AsKing:
                      </p>
                      <ul className="text-xs text-[#556A60] space-y-1 list-disc list-inside">
                        <li>Riwayat pesan percakapan WhatsApp, Telegram, dan Email</li>
                        <li>Daftar kontak buku telepon dan profil pelanggan</li>
                        <li>Papan Kanban tiket, catatan internal, dan status SLA</li>
                        <li>Jadwal broadcast dan template pesan kustom</li>
                        <li>Pengaturan tema antarmuka dan preferensi aplikasi desktop</li>
                      </ul>
                    </div>

                    {/* Cloud Data Box */}
                    <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-2.5">
                      <div className="font-bold text-xs text-[#11231B] flex items-center gap-1.5">
                        <Database className="w-4 h-4 text-[#184530]" />
                        <span>Data yang Disimpan di Cloud AsKing</span>
                      </div>
                      <p className="text-xs text-[#556A60]">
                        Data yang kami kelola di infrastruktur cloud terenkripsi secara terbatas mencakup:
                      </p>
                      <ul className="text-xs text-[#556A60] space-y-1 list-disc list-inside">
                        <li><strong>Identitas Akun:</strong> Alamat email, nama profil terdaftar, avatar (jika login via Google), serta ID Pengguna.</li>
                        <li><strong>Data Lisensi & Langganan:</strong> Tipe paket langganan (Starter, Pro, Enterprise), status masa aktif lisensi, dan riwayat invoice pembayaran.</li>
                        <li><strong>Pengenal Perangkat:</strong> Kode Aktivasi lisensi dan pengenal unik perangkat komputer Anda (Device ID).</li>
                      </ul>
                    </div>
                  </div>

                  {/* Purpose Table */}
                  <div className="overflow-x-auto rounded-2xl border border-[#DEE7DF] bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F8FAF7] text-[#11231B] border-b border-[#DEE7DF]">
                        <tr>
                          <th className="py-2.5 px-3.5 font-bold">Kategori Data Cloud</th>
                          <th className="py-2.5 px-3.5 font-bold">Elemen Data</th>
                          <th className="py-2.5 px-3.5 font-bold">Tujuan & Fungsi Pemrosesan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DEE7DF] text-[#4B6055]">
                        <tr>
                          <td className="py-2.5 px-3.5 font-semibold text-[#11231B]">Otentikasi Akun</td>
                          <td className="py-2.5 px-3.5">Alamat email, nama akun, ID Pengguna</td>
                          <td className="py-2.5 px-3.5">Mengautentikasi sesi masuk akun, manajemen profil, dan komunikasi administratif resmi.</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3.5 font-semibold text-[#11231B]">Lisensi & Transaksi</td>
                          <td className="py-2.5 px-3.5">Paket langganan, nomor invoice, tanggal masa aktif lisensi</td>
                          <td className="py-2.5 px-3.5">Memverifikasi keabsahan hak lisensi aktif aplikasi dan pencatatan riwayat langganan.</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3.5 font-semibold text-[#11231B]">Binding Perangkat</td>
                          <td className="py-2.5 px-3.5">Kode Aktivasi & Pengenal Perangkat (Device ID)</td>
                          <td className="py-2.5 px-3.5">Memastikan lisensi aktif digunakan pada perangkat komputer desktop yang Anda daftarkan.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Financial Guarantee Card */}
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-[#234A35] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#184530]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Jaminan Bebas Penyimpanan Data Finansial Sensitif</span>
                    </div>
                    <p>
                      AsKing <strong>tidak pernah menyimpan, memproses, atau memiliki akses</strong> terhadap data nomor kartu kredit, kode CVV/CVC, tanggal kedaluwarsa kartu, PIN ATM, atau kata sandi internet banking Anda. Seluruh transaksi pembayaran diproses secara langsung oleh mitra payment gateway resmi berizin.
                    </p>
                  </div>

                  {/* Website Analytics */}
                  <div className="rounded-2xl border border-[#DEE7DF] bg-[#F8FAF7] p-4 text-xs text-[#556A60]">
                    <h3 className="mb-1.5 font-bold text-[#11231B]">Pengukuran Situs Web dan Analitik</h3>
                    <p>
                      Situs web resmi kami dapat menggunakan alat analitik untuk mengukur kunjungan halaman dan pendaftaran akun baru. Kami tidak pernah mengirimkan isi percakapan pelanggan, kontak, tiket, atau data aplikasi desktop Anda melalui alat analitik web tersebut.
                    </p>
                  </div>
                </section>

                {/* Section 4: Data Security & Access Controls */}
                <section className="space-y-4">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      4
                    </span>
                    Keamanan Data & Pembatasan Akses
                  </h2>
                  <p>
                    AsKing menerapkan langkah pengamanan teknis dan organisasional standar industri untuk menjaga kerahasiaan dan keamanan data akun Anda:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                    <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-[#11231B]">
                        <Lock className="w-4 h-4 text-[#184530]" />
                        <span>Enkripsi Komunikasi & Penyimpanan</span>
                      </div>
                      <p className="text-[#556A60]">
                        Seluruh pertukaran data antara aplikasi desktop AsKing dan cloud dilindungi dengan sambungan terenkripsi (HTTPS). Data akun di cloud juga disimpan dengan sistem enkripsi berstandar industri.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-[#11231B]">
                        <KeyRound className="w-4 h-4 text-[#184530]" />
                        <span>Perlindungan Kredensial Akun</span>
                      </div>
                      <p className="text-[#556A60]">
                        Kata sandi dan token sesi akun diamankan dengan metode enkripsi satu arah, sehingga tidak dapat dibaca dalam bentuk teks terbuka oleh siapa pun, termasuk staf kami.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-[#11231B]">
                        <UserCheck className="w-4 h-4 text-[#184530]" />
                        <span>Pemisahan Data & Batasan Akses</span>
                      </div>
                      <p className="text-[#556A60]">
                        Sistem kami menerapkan pemisahan data yang ketat antar-pengguna. Setiap akun hanya memiliki akses ke datanya sendiri, dan akses operasional sistem dibatasi secara ketat hanya untuk fungsi yang berwenang.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 5: Indonesian PDP Law (UU No. 27 Tahun 2022) Compliance */}
                <section className="space-y-4">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      5
                    </span>
                    Kepatuhan Terhadap UU Pelindungan Data Pribadi (UU No. 27/2022)
                  </h2>
                  <p>
                    AsKing tunduk dan patuh pada ketentuan <strong>Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)</strong> dengan rincian pemenuhan sebagai berikut:
                  </p>

                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-1">
                      <h3 className="font-bold text-[#11231B]">
                        A. Dasar Pemrosesan Data Pribadi yang Sah (Pasal 20 UU PDP)
                      </h3>
                      <p className="text-[#556A60]">
                        Pemrosesan data pribadi oleh AsKing berlandaskan pada: (1) <strong>Persetujuan sah yang eksplisit</strong> yang diberikan pengguna saat mendaftar akun dan menyetujui Kebijakan Privasi ini, serta (2) <strong>Pelaksanaan kewajiban perjanjian lisensi</strong> perangkat lunak untuk mengoperasikan fitur aplikasi yang Anda gunakan.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-1">
                      <h3 className="font-bold text-[#11231B]">
                        B. Kedudukan Pengendali Data Pribadi vs Arsitektur Local-First
                      </h3>
                      <p className="text-[#556A60]">
                        Untuk data akun, transaksi, dan lisensi: AsKing bertindak sebagai <strong>Pengendali Data Pribadi</strong>. Namun untuk pesan percakapan, kontak pelanggan akhir, dan tiket bisnis Anda: <strong>Pengguna bertindak sebagai Pengendali Data Pribadi independen</strong> atas data konsumen Anda. AsKing menyediakan perangkat lunak lokal (Local-First) tanpa bertindak sebagai penampung data pesan pelanggan Anda di cloud.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 6: AI Features via Google Gemini */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      6
                    </span>
                    Pemrosesan Fitur Kecerdasan Buatan (AI)
                  </h2>
                  <p>
                    Saat Anda mengaktifkan fitur <strong>AsKing AI Assistant</strong> atau <strong>AI Customer Agent</strong>:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs">
                    <li>Konteks pesan atau pertanyaan yang Anda minta untuk diproses dikirimkan secara aman melalui koneksi terenkripsi ke layanan AI (Google Gemini) seketika untuk menghasilkan draf balasan atau ringkasan.</li>
                    <li>Kami tidak menyimpan percakapan tersebut secara permanen di server kami setelah jawaban selesai dikirimkan ke perangkat Anda.</li>
                    <li>
                      Pemrosesan pihak ketiga oleh penyedia model bahasa tunduk pada ketentuan keamanan penyedia. Anda dapat meninjau{" "}
                      <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#184530] font-bold underline"
                      >
                        <span>Kebijakan Privasi Google</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>.
                    </li>
                  </ul>
                </section>

                {/* Section 7: External Messaging Channels */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      7
                    </span>
                    Saluran Komunikasi Eksternal (WhatsApp, Telegram, dan Email)
                  </h2>
                  <p>
                    Aplikasi AsKing menghubungkan alur kerja percakapan Anda dengan saluran komunikasi resmi Anda (WhatsApp, Telegram, dan Email) secara langsung dari komputer lokal Anda tanpa perantara server pihak ketiga. Kredensial akun dan riwayat pesan Anda tetap berada di perangkat lokal Anda. Silakan pelajari kebijakan privasi masing-masing platform:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs">
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

                {/* Section 8: User Rights (UU PDP Pasal 5-13) */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      8
                    </span>
                    Hak-Hak Subjek Data Pribadi (Pasal 5 s.d. 13 UU PDP)
                  </h2>
                  <p>
                    Sebagai Subjek Data Pribadi, Anda memiliki hak-hak yang dijamin sepenuhnya oleh hukum:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF]">
                      <h4 className="font-bold text-[#11231B] mb-1">1. Hak Mendapatkan Informasi (Pasal 5)</h4>
                      <p className="text-[#556A60]">Mendapatkan kejelasan mengenai identitas pihak, tujuan pemrosesan data, dan dasar hukum pemrosesan data.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF]">
                      <h4 className="font-bold text-[#11231B] mb-1">2. Hak Akses & Salinan Data (Pasal 6 & 10)</h4>
                      <p className="text-[#556A60]">Mengakses dan memperoleh salinan data pribadi akun yang tersimpan di cloud kami dalam format terstruktur.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF]">
                      <h4 className="font-bold text-[#11231B] mb-1">3. Hak Perbaikan / Koreksi (Pasal 7)</h4>
                      <p className="text-[#556A60]">Memperbaiki kesalahan, ketidakakuratan, atau melengkapi data pribadi akun Anda yang belum tepat.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF]">
                      <h4 className="font-bold text-[#11231B] mb-1">4. Hak Penghapusan / Pemusnahan (Pasal 8)</h4>
                      <p className="text-[#556A60]">Hak untuk menghapus, mengakhiri pemrosesan, atau memusnahkan data akun Anda (Right to be Forgotten).</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF]">
                      <h4 className="font-bold text-[#11231B] mb-1">5. Hak Menarik Persetujuan (Pasal 9)</h4>
                      <p className="text-[#556A60]">Menarik kembali persetujuan pemrosesan data pribadi akun yang sebelumnya telah diberikan kepada kami.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF]">
                      <h4 className="font-bold text-[#11231B] mb-1">6. Hak Menunda atau Membatasi (Pasal 11)</h4>
                      <p className="text-[#556A60]">Meminta penundaan atau pembatasan pemrosesan data pribadi secara proporsional sesuai peruntukan.</p>
                    </div>
                  </div>
                </section>

                {/* Section 9: Retention, Breach Notification & Erasure */}
                <section className="space-y-4">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      9
                    </span>
                    Retensi Data, Prosedur Pemusnahan & Notifikasi Insiden (Pasal 46 UU PDP)
                  </h2>

                  <div className="space-y-3 text-xs">
                    <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-1.5">
                      <h3 className="font-bold text-[#11231B]">Masa Retensi Data (Pasal 27 UU PDP)</h3>
                      <p className="text-[#556A60]">
                        Data akun dan lisensi disimpan selama akun Anda aktif menggunakan AsKing. Jika Anda mengajukan penutupan akun permanen, data profil Anda akan dihapus dari server cloud aktif dalam waktu maksimal 30 hari kalender, kecuali riwayat faktur keuangan yang wajib diarsipkan sementara untuk mematuhi kewajiban pembukuan perpajakan yang diatur undang-undang.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Komitmen Notifikasi Kegagalan Pelindungan Data Pribadi (Maksimal 3 x 24 Jam)</span>
                      </div>
                      <p className="text-amber-800">
                        Sesuai amanat <strong>Pasal 46 UU PDP</strong>, dalam hal terjadi insiden kegagalan pelindungan data pribadi (data breach), AsKing berkomitmen untuk menyampaikan pemberitahuan tertulis kepada Pengguna terdampak dan Lembaga Pengawas Pelindungan Data Pribadi dalam kurun waktu maksimal <strong>3 x 24 jam (72 jam)</strong> sejak insiden teridentifikasi. Pemberitahuan akan memuat rincian data yang terkompromi, perkiraan waktu kejadian, serta langkah-langkah mitigasi dan pemulihan yang sedang dijalankan.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 10: Policy Updates & DPO Contact */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      10
                    </span>
                    Pembaruan Kebijakan & Kontak Petugas Pelindungan Data (DPO)
                  </h2>
                  <p>
                    Kami dapat memperbarui Kebijakan Privasi ini secara berkala guna menyesuaikan dengan perkembangan hukum, teknologi, atau pembaruan fitur AsKing. Setiap perubahan signifikan akan dipublikasikan pada halaman ini dengan tanggal pembaruan terbaru.
                  </p>
                  <p>
                    Jika Anda ingin menjalankan hak-hak subjek data (seperti permohonan akses data, koreksi, atau penutupan akun permanen) atau memiliki pertanyaan dan aduan terkait privasi, silakan hubungi tim Pelindungan Data Pribadi kami:
                  </p>
                  <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] text-xs space-y-1.5">
                    <p>
                      <strong>Kontak Resmi Pelindungan Data Pribadi (DPO AsKing):</strong>
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      <a
                        href="mailto:asking@godiscus.com"
                        className="text-[#184530] font-bold underline"
                      >
                        asking@godiscus.com
                      </a>
                    </p>
                    <p>
                      <strong>Layanan Bantuan Resmi:</strong> WhatsApp Support AsKing Customer Manager (+62 877-6900-5244)
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
                    Introduction & Legal Foundation
                  </h2>
                  <p>
                    This Privacy Policy governs how AsKing ("we", "us", or "the service") acquires, collects, processes, stores, secures, and erases Personal Data belonging to users of the AsKing desktop application and visitors to our official website.
                  </p>
                  <p>
                    This policy is formulated according to industry-standard data sovereignty practices and strictly complies with the statutory regulations of the Republic of Indonesia, specifically <strong>Law Number 27 of 2022 on Personal Data Protection (Indonesia PDP Law / UU PDP)</strong> and applicable electronic information regulations.
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
                    <div className="border-l-4 border-[#184530] pl-4 py-2 bg-[#F8FAF7] rounded-r-xl">
                      <h3 className="font-bold text-xs text-[#11231B] mb-1">
                        Local-First Operational Storage
                      </h3>
                      <p className="text-xs text-[#556A60]">
                        Your customer communication data (contacts, incoming and outgoing messages, internal ticket notes) is stored locally on your personal computer. We do not retain copies of your customer conversations on AsKing cloud servers.
                      </p>
                    </div>

                    <div className="border-l-4 border-[#184530] pl-4 py-2 bg-[#F8FAF7] rounded-r-xl">
                      <h3 className="font-bold text-xs text-[#11231B] mb-1">
                        Data Minimization Principle
                      </h3>
                      <p className="text-xs text-[#556A60]">
                        We only collect cloud data strictly necessary to authenticate your account, validate active software licenses on your authorized device, and verify subscription transactions.
                      </p>
                    </div>

                    <div className="border-l-4 border-[#184530] pl-4 py-2 bg-[#F8FAF7] rounded-r-xl">
                      <h3 className="font-bold text-xs text-[#11231B] mb-1">
                        Full User Sovereignty & Control
                      </h3>
                      <p className="text-xs text-[#556A60]">
                        You maintain full control over your local data, including the right to export records, create independent backups, or delete application files without residual traces on our servers.
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
                    Information Classification & Cloud Stored Data
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Local Data Box */}
                    <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-2.5">
                      <div className="font-bold text-xs text-[#11231B] flex items-center gap-1.5">
                        <HardDrive className="w-4 h-4 text-[#184530]" />
                        <span>Stored On Your Computer (Local-First)</span>
                      </div>
                      <p className="text-xs text-[#556A60]">
                        The following items reside exclusively on your local computer and are <strong>never</strong> transmitted to AsKing cloud servers:
                      </p>
                      <ul className="text-xs text-[#556A60] space-y-1 list-disc list-inside">
                        <li>WhatsApp, Telegram, and Email message conversation logs</li>
                        <li>Customer contact directory and phone numbers</li>
                        <li>Kanban tickets, internal notes, and SLA tags</li>
                        <li>Broadcast schedules and custom message templates</li>
                        <li>Desktop user interface theme and preferences</li>
                      </ul>
                    </div>

                    {/* Cloud Data Box */}
                    <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-2.5">
                      <div className="font-bold text-xs text-[#11231B] flex items-center gap-1.5">
                        <Database className="w-4 h-4 text-[#184530]" />
                        <span>Data Stored in AsKing Cloud</span>
                      </div>
                      <p className="text-xs text-[#556A60]">
                        Information stored in our encrypted cloud infrastructure is limited to:
                      </p>
                      <ul className="text-xs text-[#556A60] space-y-1 list-disc list-inside">
                        <li><strong>Account Identity:</strong> Email address, registered display name, avatar URL (if Google login is used), and User ID.</li>
                        <li><strong>License & Subscription:</strong> Plan tier (Starter, Pro, Enterprise), expiration timestamp (expired_at), and billing invoice records.</li>
                        <li><strong>Device Binding:</strong> Unique Activation Code and machine device identifier (Device ID).</li>
                      </ul>
                    </div>
                  </div>

                  {/* Purpose Table */}
                  <div className="overflow-x-auto rounded-2xl border border-[#DEE7DF] bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F8FAF7] text-[#11231B] border-b border-[#DEE7DF]">
                        <tr>
                          <th className="py-2.5 px-3.5 font-bold">Cloud Data Category</th>
                          <th className="py-2.5 px-3.5 font-bold">Data Elements</th>
                          <th className="py-2.5 px-3.5 font-bold">Purpose & Legal Basis</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DEE7DF] text-[#4B6055]">
                        <tr>
                          <td className="py-2.5 px-3.5 font-semibold text-[#11231B]">Account Authentication</td>
                          <td className="py-2.5 px-3.5">Email address, profile display name, User ID</td>
                          <td className="py-2.5 px-3.5">Authenticating login sessions, profile management, and official administrative updates.</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3.5 font-semibold text-[#11231B]">License & Transactions</td>
                          <td className="py-2.5 px-3.5">Tier plan, invoice reference ID, active/expiry timestamps</td>
                          <td className="py-2.5 px-3.5">Enabling software entitlements, verifying active subscription status, and billing records.</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3.5 font-semibold text-[#11231B]">Device Binding</td>
                          <td className="py-2.5 px-3.5">Activation Code & Device Identifier (Device ID)</td>
                          <td className="py-2.5 px-3.5">Ensuring active licenses are bound to your authorized registered computer.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Financial Guarantee Card */}
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-[#234A35] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#184530]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Zero Financial Data Storage Guarantee</span>
                    </div>
                    <p>
                      AsKing <strong>never collects, processes, or stores</strong> credit card numbers, CVV/CVC codes, card expiration dates, ATM PINs, or banking credentials. All subscription transactions are processed directly through licensed payment gateways.
                    </p>
                  </div>

                  {/* Website Analytics */}
                  <div className="rounded-2xl border border-[#DEE7DF] bg-[#F8FAF7] p-4 text-xs text-[#556A60]">
                    <h3 className="mb-1.5 font-bold text-[#11231B]">Website Analytics and Attribution</h3>
                    <p>
                      Our official website uses measurement tools including Meta Pixel to track page impressions, package selections, and account creations. Browser and device telemetry are processed under third-party terms. We never route customer chat logs, contacts, tickets, or desktop app data to these marketing scripts.
                    </p>
                  </div>
                </section>

                {/* Section 4: Data Security & Access Controls */}
                <section className="space-y-4">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      4
                    </span>
                    Data Security & Access Controls
                  </h2>
                  <p>
                    AsKing implements industry-standard technical and organizational safeguards to ensure user data remains protected against unauthorized access, leaks, or tampering:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                    <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-[#11231B]">
                        <Lock className="w-4 h-4 text-[#184530]" />
                        <span>Encrypted Communications & Storage</span>
                      </div>
                      <p className="text-[#556A60]">
                        All data exchanged between the desktop application and cloud services is protected using secure encrypted connections (HTTPS). Account data in the cloud is stored with industry-standard encryption.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-[#11231B]">
                        <KeyRound className="w-4 h-4 text-[#184530]" />
                        <span>Account Credential Protection</span>
                      </div>
                      <p className="text-[#556A60]">
                        Account passwords and login session tokens are secured using one-way cryptographic encryption, ensuring credentials cannot be read in plaintext by anyone, including our own staff.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-[#11231B]">
                        <UserCheck className="w-4 h-4 text-[#184530]" />
                        <span>Data Isolation & Access Controls</span>
                      </div>
                      <p className="text-[#556A60]">
                        Our systems enforce strict data isolation between accounts. Each user can only view and manage their own records, and internal system operations are restricted based on authorized necessity.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 5: Indonesian PDP Law (UU No. 27/2022) Compliance */}
                <section className="space-y-4">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      5
                    </span>
                    Compliance with Indonesia Personal Data Protection Law (UU PDP)
                  </h2>
                  <p>
                    AsKing operates in full adherence to <strong>Law Number 27 of 2022 on Personal Data Protection (UU PDP)</strong>:
                  </p>

                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-1">
                      <h3 className="font-bold text-[#11231B]">
                        A. Lawful Basis for Processing (Article 20 UU PDP)
                      </h3>
                      <p className="text-[#556A60]">
                        Processing is grounded on: (1) <strong>Explicit and valid consent</strong> provided upon user registration, and (2) <strong>Contractual necessity</strong> required to deliver software licenses, feature access, and technical support.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-1">
                      <h3 className="font-bold text-[#11231B]">
                        B. Data Controller Status vs Local-First Architecture
                      </h3>
                      <p className="text-[#556A60]">
                        For account, licensing, and billing data: AsKing acts as the <strong>Personal Data Controller</strong>. For customer messaging records and ticket notes: <strong>You act as an independent Personal Data Controller</strong> over your consumer data. AsKing delivers a Local-First application and does not ingest or aggregate your customer chats in the cloud.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 6: AI Features via Google Gemini */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      6
                    </span>
                    Artificial Intelligence (AI) Features Processing
                  </h2>
                  <p>
                    When using the <strong>AsKing AI Assistant</strong> or <strong>AI Customer Agent</strong>:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs">
                    <li>The message context or inquiry you choose to process is sent over secure encrypted connections to the AI service (Google Gemini) strictly to generate draft replies or summaries in real time.</li>
                    <li>We do not retain message payloads permanently on our servers after dispatching responses to your local device.</li>
                    <li>
                      Third-party processing is governed by the AI model provider. You can review the{" "}
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

                {/* Section 7: External Messaging Channels */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      7
                    </span>
                    External Communication Channels (WhatsApp, Telegram, and Email)
                  </h2>
                  <p>
                    AsKing connects your messaging workflows directly with your official communication channels (WhatsApp, Telegram, and Email) directly from your local computer without third-party server intermediaries. Your credentials and conversation histories remain securely on your local device. Please review their individual privacy policies:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs">
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

                {/* Section 8: User Rights (UU PDP Articles 5-13) */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      8
                    </span>
                    Data Subject Rights (Articles 5 through 13 UU PDP)
                  </h2>
                  <p>
                    As a Personal Data Subject, you are entitled to comprehensive statutory rights under Indonesian law:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF]">
                      <h4 className="font-bold text-[#11231B] mb-1">1. Right to Information (Article 5)</h4>
                      <p className="text-[#556A60]">Clarity regarding data processing identity, purposes, and legal basis.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF]">
                      <h4 className="font-bold text-[#11231B] mb-1">2. Right to Access & Portability (Articles 6 & 10)</h4>
                      <p className="text-[#556A60]">Access and obtain copies of your stored cloud data in structured machine-readable formats.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF]">
                      <h4 className="font-bold text-[#11231B] mb-1">3. Right to Rectification (Article 7)</h4>
                      <p className="text-[#556A60]">Correct inaccuracies, update outdated profile data, or complete account records.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF]">
                      <h4 className="font-bold text-[#11231B] mb-1">4. Right to Erasure (Article 8)</h4>
                      <p className="text-[#556A60]">Request the deletion or permanent destruction of your personal account data (Right to be Forgotten).</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF]">
                      <h4 className="font-bold text-[#11231B] mb-1">5. Right to Withdraw Consent (Article 9)</h4>
                      <p className="text-[#556A60]">Revoke previously granted consent for personal data processing at any time.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF]">
                      <h4 className="font-bold text-[#11231B] mb-1">6. Right to Restrict Processing (Article 11)</h4>
                      <p className="text-[#556A60]">Request suspension or limitation of processing under appropriate legal circumstances.</p>
                    </div>
                  </div>
                </section>

                {/* Section 9: Retention, Breach Notification & Erasure */}
                <section className="space-y-4">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      9
                    </span>
                    Data Retention, Erasure & Security Breach Notifications (Article 46 UU PDP)
                  </h2>

                  <div className="space-y-3 text-xs">
                    <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-1.5">
                      <h3 className="font-bold text-[#11231B]">Data Retention Schedule (Article 27 UU PDP)</h3>
                      <p className="text-[#556A60]">
                        Account and subscription records are retained as long as your account remains active. Upon verified account closure requests, personal profile data is purged from active databases within 30 calendar days, except where financial invoice records must be archived to fulfill mandatory fiscal accounting statutes.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Data Breach Notification Protocol (Maximum 72 Hours)</span>
                      </div>
                      <p className="text-amber-800">
                        In adherence to <strong>Article 46 of the Indonesia PDP Law</strong>, in the unlikely event of a personal data breach, AsKing commits to delivering official written notification to affected users and the statutory Data Protection Authority within a maximum of <strong>3 x 24 hours (72 hours)</strong> following incident confirmation. The notice will detail compromised elements, timeline estimates, and ongoing remedial actions.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 10: Policy Updates & DPO Contact */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      10
                    </span>
                    Policy Modifications & Data Protection Officer Contact
                  </h2>
                  <p>
                    We may update this Privacy Policy periodically to align with evolving statutory requirements, security architectures, or product features. Updates are published on this page with a revised date.
                  </p>
                  <p>
                    To exercise your data subject rights (such as data extraction, correction, or account closure) or to submit privacy inquiries, please contact our dedicated Data Protection Officer:
                  </p>
                  <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] text-xs space-y-1.5">
                    <p>
                      <strong>Official Data Protection Officer (DPO) Contact:</strong>
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      <a
                        href="mailto:asking@godiscus.com"
                        className="text-[#184530] font-bold underline"
                      >
                        asking@godiscus.com
                      </a>
                    </p>
                    <p>
                      <strong>Customer Support:</strong> AsKing Customer Manager WhatsApp Support (+62 813-8888-0644)
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
