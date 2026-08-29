"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FileText,
  ArrowLeft,
  AlertTriangle,
  Globe,
  ExternalLink,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function TermsPage() {
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
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E5EFE7] text-[#184530] text-xs font-bold">
                <FileText className="w-3.5 h-3.5" />
                <span>
                  {language === "id"
                    ? "Ketentuan Hukum & Lisensi Penggunaan"
                    : "Legal Terms & Licensing Agreement"}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#11231B] tracking-tight">
                {language === "id"
                  ? "Syarat & Ketentuan Penggunaan AsKing"
                  : "AsKing Terms of Use"}
              </h1>
              <p className="text-xs text-[#556A60]">
                {language === "id"
                  ? "Terakhir Diperbarui: 29 Agustus 2026"
                  : "Last Updated: August 29, 2026"}
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
                    Pendahuluan & Penerimaan Ketentuan
                  </h2>
                  <p>
                    Selamat datang di <strong>AsKing Customer Manager</strong> ("AsKing", "kami", "aplikasi"). Syarat dan Ketentuan Penggunaan ini ("Ketentuan") mengatur hak dan kewajiban Anda saat mengunduh, memasang, atau menggunakan aplikasi desktop AsKing, layanan web, dan dokumentasi terkait kami.
                  </p>
                  <p>
                    Dengan mengunduh, memasang, mendaftar akun, atau menggunakan AsKing, Anda menyatakan telah membaca, memahami, dan menyetujui untuk terikat oleh seluruh isi Ketentuan ini. Apabila Anda tidak menyetujui salah satu bagian dari Ketentuan ini, Anda dipersilakan untuk tidak menggunakan aplikasi AsKing.
                  </p>
                </section>

                {/* Section 2: License to Use */}
                <section className="space-y-4">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      2
                    </span>
                    Lisensi Penggunaan
                  </h2>
                  <p>
                    Tunduk pada kepatuhan Anda terhadap Ketentuan ini, kami memberi Anda lisensi terbatas, non-eksklusif, tidak dapat dipindahtangankan, dan dapat dibatalkan untuk mengunduh, memasang, dan menjalankan aplikasi AsKing pada perangkat yang Anda miliki atau kelola untuk keperluan pribadi maupun bisnis internal Anda.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {/* You May */}
                    <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-2">
                      <div className="flex items-center gap-2 font-bold text-xs text-[#184530]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Anda Diizinkan Untuk:</span>
                      </div>
                      <ul className="text-xs text-[#556A60] space-y-1.5 list-disc list-inside">
                        <li>Memasang AsKing pada perangkat kerja yang Anda kelola</li>
                        <li>Menggunakan AsKing untuk manajemen pelanggan komersial maupun pribadi</li>
                        <li>Membuat dan mengelola papan tiket Kanban, jadwal pesan, dan template</li>
                        <li>Mengekspor dan mencadangkan data lokal milik Anda kapan saja</li>
                      </ul>
                    </div>

                    {/* You May Not */}
                    <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-xs text-rose-800">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Anda Dilarang Untuk:</span>
                      </div>
                      <ul className="text-xs text-rose-700/90 space-y-1.5 list-disc list-inside">
                        <li>Melakukan reverse engineer, decompile, atau membongkar kode biner aplikasi</li>
                        <li>Mendistribusikan ulang, menjual, menyewakan, atau melisensikan ulang AsKing tanpa izin tertulis</li>
                        <li>Menghapus atau mengubah hak cipta, merek dagang, dan pemberitahuan hak milik kami</li>
                        <li>Menggunakan AsKing untuk aktivitas penipuan, spam massal, atau pelanggaran hukum</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Section 3: External Messaging Channels & WhatsApp Gateway Warning */}
                <section className="space-y-4">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      3
                    </span>
                    Integrasi Saluran Pesan Eksternal (WhatsApp & Telegram)
                  </h2>
                  <p>
                    Aplikasi AsKing menghubungkan alur kerja operasional Anda dengan <strong>2 saluran pesan pihak ketiga</strong>, yaitu WhatsApp dan Telegram. Penggunaan saluran tersebut tunduk pada syarat dan kebijakan masing-masing platform:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2">
                    <li>
                      Ketentuan Layanan WhatsApp:{" "}
                      <a
                        href="https://www.whatsapp.com/legal/terms-of-service"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#184530] font-bold underline"
                      >
                        <span>WhatsApp Terms of Service</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                    <li>
                      Ketentuan Layanan Telegram:{" "}
                      <a
                        href="https://telegram.org/tos"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#184530] font-bold underline"
                      >
                        <span>Telegram Terms of Service</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                  </ul>

                  {/* Mandatory WhatsApp Gateway Warning Callout */}
                  <div className="p-6 rounded-3xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-3 shadow-xs mt-2">
                    <div className="flex items-center gap-2 text-sm font-black text-amber-900">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                      <span>Pemberitahuan Penting: Integrasi Saluran WhatsApp</span>
                    </div>
                    <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed font-medium">
                      Channel ini menggunakan <b>Unofficial WhatsApp gateway</b>. Official WhatsApp Business API dapat mengenakan biaya yang cukup tinggi untuk setiap pesan, sehingga AsKing menggunakan gateway alternatif yang lebih terjangkau dan didukung oleh komunitas pengembang global yang besar. Gateway ini bukan produk resmi, tidak berafiliasi dengan atau didukung oleh Meta, dan tidak menjamin nomor bebas dari pemblokiran. Pengguna tetap bertanggung jawab atas aktivitas pengiriman pesan, persetujuan penerima, kepatuhan terhadap kebijakan anti-spam WhatsApp, dan regulasi perlindungan data yang berlaku. Gunakan nomor khusus bisnis secara bijak; kami tidak menyarankan menghubungkan nomor WhatsApp pribadi utama. Segala bentuk ban atau pembatasan nomor yang terjadi bukan merupakan tanggung jawab kami.
                    </p>
                    <div className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
                      <p className="font-bold mb-1">Tips penggunaan untuk mengurangi risiko pembatasan:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Lakukan warm-up nomor baru selama 3–7 hari dengan interaksi manual dua arah yang wajar, termasuk percakapan personal, grup aktif, dan panggilan suara/video.</li>
                        <li>Batasi nomor baru sekitar 20–50 pesan per hari. Untuk nomor yang sudah matang, naikkan secara bertahap hingga sekitar 80–200 pesan per hari.</li>
                        <li>Hindari lonjakan trafik atau burst traffic mendadak karena dapat memicu peninjauan otomatis dari sistem Meta.</li>
                      </ul>
                      <p className="mt-2">Panduan ini hanya mengurangi risiko dan bukan jaminan bahwa akun tidak akan dibatasi atau diblokir.</p>
                    </div>
                  </div>
                </section>

                {/* Section 4: Acceptable Use Policy */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      4
                    </span>
                    Kebijakan Penggunaan yang Bertanggung Jawab & Anti-Spam
                  </h2>
                  <p>
                    Anda setuju untuk menggunakan AsKing secara bertanggung jawab dan sesuai hukum yang berlaku. Pengguna bertanggung jawab penuh atas setiap konten, pesan, promosi, dan data yang dibuat, diproses, atau dikirimkan melalui aplikasi.
                  </p>
                  <p className="font-semibold text-[#11231B] pt-1">
                    Aktivitas yang Dilarang Secara Tegas:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2">
                    <li>Mengirim pesan spam massal tanpa persetujuan eksplisit (opt-in) dari penerima pesan</li>
                    <li>Menyebarkan konten berbahaya, malware, materi penipuan, pemerasan, atau fitnah</li>
                    <li>Melanggar hak kekayaan intelektual atau hak privasi pihak lain</li>
                    <li>Melakukan tindakan yang merugikan anak di bawah umur atau mengeksploitasi pihak rentan</li>
                    <li>Menyamar sebagai entitas, bisnis, atau individu lain tanpa kewenangan sah</li>
                  </ul>
                </section>

                {/* Section 5: AI Features & Generated Content */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      5
                    </span>
                    Fitur Kecerdasan Buatan (AI) & Konten yang Dihasilkan
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold text-xs text-[#11231B] mb-1">Pemrosesan AI via Google Gemini</h3>
                      <p>
                        Fitur AsKing AI Assistant dan AI Customer Agent menggunakan pemrosesan kecerdasan buatan berbasis Google Gemini. Penggunaan fitur ini tunduk pada kebijakan privasi dan pemrosesan pihak ketiga.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-[#11231B] mb-1">Sifat Konten AI</h3>
                      <p>
                        Respon yang dihasilkan oleh AI bersifat probabilistik dan dapat mengandung ketidakakuratan. Pengguna wajib untuk tetap memantau percakapan yang dihasilkan oleh AI. Kami tidak menjamin keakuratan mutlak atas jawaban yang dibuat oleh sistem AI.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-[#11231B] mb-1">Kepemilikan Konten</h3>
                      <p>
                        Anda memegang hak kepemilikan penuh atas basis pengetahuan perusahaan, data kontak, dan tiket yang Anda kelola di dalam AsKing.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-[#11231B] mb-1">Batas Penggunaan AI</h3>
                      <p>Kuota AI mengikuti periode paket atau akses yang berlaku. Sisa kuota akan hangus saat periode berakhir dan di-reset pada periode berikutnya. Kuota tidak bersifat akumulatif dan tidak dapat dibawa ke periode berikutnya, kecuali dinyatakan lain pada informasi paket yang berlaku.</p>
                    </div>
                  </div>
                </section>

                {/* Section 6: Local-First Data Sovereignty & Backup */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      6
                    </span>
                    Kedaulatan Data Lokal (Local-First) & Pencadangan
                  </h2>
                  <p>
                    AsKing dirancang dengan filosofi Local-First. Seluruh riwayat pesan, kontak pelanggan, dan tiket bantuan Anda disimpan secara lokal di perangkat keras komputer Anda (melalui basis data lokal perangkat).
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2">
                    <li>Kami tidak menyimpan cadangan basis data chat pelanggan Anda di cloud kami.</li>
                    <li>Pengguna memikul tanggung jawab mandiri untuk melakukan pencadangan (backup) berkala dari database lokal perangkat mereka.</li>
                    <li>Kehilangan data akibat kerusakan perangkat keras, infeksi sistem operasi, atau penghapusan manual oleh pengguna berada di luar kendali dan tanggung jawab kami.</li>
                  </ul>
                </section>

                {/* Section 7: Disclaimers & Limitations of Liability */}
                <section className="space-y-4">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      7
                    </span>
                    Pernyataan Penyangkalan (Disclaimer) & Batasan Tanggung Jawab
                  </h2>

                  <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2 text-xs text-amber-950">
                    <p className="font-bold uppercase tracking-wider text-[11px] text-amber-900">
                      Pemberitahuan Hukum Penting (As-Is Basis)
                    </p>
                    <p className="leading-relaxed">
                      APLIKASI ASKING DISEDIAKAN "SEBAGAIMANA ADANYA" (<em>AS IS</em>) DAN "SEBAGAIMANA TERSEDIA" (<em>AS AVAILABLE</em>) TANPA JAMINAN APA PUN, BAIK TERSURAT MAUPUN TERSIRAT. KAMI MENYANGKAL SELURUH JAMINAN MENGENAI KELAYAKAN UNTUK TUJUAN TERTENTU, KEBEBASAN DARI KESALAHAN SISTEM, MAUPUN KEBERLANJUTAN LAYANAN TANPA GANGGUAN.
                    </p>
                  </div>

                  <p>
                    SEJAUH DIIZINKAN OLEH HUKUM YANG BERLAKU, ASKING, PENGEMBANG, DAN AFILIASINYA TIDAK BERTANGGUNG JAWAB ATAS KERUGIAN TIDAK LANGSUNG, INSIDENTAL, KHUSUS, KONSEKUENSIAL, ATAU KERUGIAN FINANSIAL/BISNIS, KEHILANGAN DATA LOKAL, GANGGUAN KONEKSI, MAUPUN PEMBATASAN/PEMBLOKIRAN AKUN OLEH PIHAK KETIGA (SEPERTI WHATSAPP DAN TELEGRAM) YANG TIMBUL DARI PENGGUNAAN APLIKASI INI.
                  </p>
                </section>

                {/* Section 8: Intellectual Property */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      8
                    </span>
                    Hak Kekayaan Intelektual
                  </h2>
                  <p>
                    Aplikasi AsKing, termasuk desain antarmuka, logo, kode sumber aplikasi, nama merek, dan dokumentasi dilindungi oleh undang-undang hak kekayaan intelektual. Seluruh hak yang tidak diberikan secara tegas dalam Ketentuan ini tetap menjadi hak eksklusif dari AsKing Project by GoDiscus.
                  </p>
                </section>

                {/* Section 8: Refund & Subscription Cancellation */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2"><span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">8</span>Kebijakan Refund & Pembatalan Langganan</h2>
                  <p>Anda dapat membatalkan langganan kapan saja. Pembatalan menghentikan perpanjangan berikutnya, sedangkan akses berbayar tetap tersedia sampai akhir periode pembayaran yang telah dibayar.</p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2">
                    <li>Untuk pembatalan biasa (Ordinary cancellation), kami tidak memberikan refund prorata atas sisa waktu. Akses berbayar tetap tersedia sampai akhir periode yang telah dibayar.</li>
                    <li>Masa tenggang refund selama 14 hari berlaku sejak pembayaran pertama untuk langganan baru, baik paket bulanan maupun tahunan, dengan mempertimbangkan apakah layanan telah digunakan secara material, aturan payment provider, dan hukum yang berlaku.</li>
                    <li>Untuk perpanjangan otomatis tahunan, masa tenggang refund 14 hari dihitung sejak tanggal perpanjangan dan tetap tunduk pada peninjauan penggunaan, aturan payment provider, dan hukum yang berlaku.</li>
                    <li>Refund dapat ditinjau untuk tagihan ganda, kegagalan aktivasi atau provisioning, transaksi tidak sah, atau keadaan lain yang diwajibkan hukum.</li>
                    <li>Ajukan permintaan refund ke <a href="mailto:asking@godiscus.com" className="text-[#184530] font-bold underline">asking@godiscus.com</a> dengan informasi akun dan transaksi yang relevan.</li>
                  </ul>
                  <p>Permintaan di luar kondisi tersebut ditinjau berdasarkan kasus per kasus. Ketentuan ini tidak mengurangi hak konsumen yang tidak dapat dikesampingkan berdasarkan hukum yang berlaku.</p>
                </section>

                {/* Section 9: Termination */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      9
                    </span>
                    Pengakhiran (Termination)
                  </h2>
                  <p>
                    Ketentuan ini berlaku hingga diakhiri. Anda dapat mengakhiri perjanjian ini kapan saja dengan menghapus (uninstall) aplikasi AsKing dari perangkat Anda dan menghentikan seluruh penggunaan. Kami berhak menangguhkan atau mengakhiri akses akun cloud Anda jika ditemukan pelanggaran terhadap Ketentuan ini.
                  </p>
                </section>

                {/* Section 10: Governing Law & Updates */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      10
                    </span>
                    Hukum yang Berlaku & Pembaruan Ketentuan
                  </h2>
                  <p>
                    Ketentuan ini diatur dan ditafsirkan sesuai dengan hukum yang berlaku di yurisdiksi Republik Indonesia. Kami berhak memperbarui Ketentuan ini dari waktu ke waktu. Pembaruan akan berlaku segera setelah dipublikasikan pada halaman ini dengan tanggal pembaruan terbaru.
                  </p>
                </section>

                {/* Section 11: Contact */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      11
                    </span>
                    Kontak Kami
                  </h2>
                  <p>
                    Jika Anda memiliki pertanyaan mengenai Syarat & Ketentuan Penggunaan ini, silakan hubungi kami melalui:
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

                {/* Acknowledgment Box */}
                <div className="p-6 rounded-3xl bg-[#12281F] text-[#B8F55C] space-y-2 border border-[#234235] shadow-sm">
                  <h3 className="font-bold text-xs tracking-wider uppercase">
                    Pernyataan & Persetujuan Pengguna
                  </h3>
                  <p className="text-xs text-[#DEE7DF] leading-relaxed">
                    DENGAN MENGUNDUH, MEMASANG, MENDAFTAR, ATAU MENGGUNAKAN APLIKASI ASKING, ANDA MENYATAKAN BAHWA ANDA TELAH MEMBACA, MEMAHAMI, DAN MENYETUJUI SELURUH SYARAT DAN KETENTUAN PENGGUNAAN DI ATAS.
                  </p>
                </div>
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
                    Introduction & Acceptance of Terms
                  </h2>
                  <p>
                    Welcome to <strong>AsKing Customer Manager</strong> ("AsKing", "we", "our", "the application"). These Terms of Use ("Terms") govern your use of the AsKing desktop application, web services, and related documentation.
                  </p>
                  <p>
                    By downloading, installing, creating an account, or using AsKing, you acknowledge that you have read, understood, and agreed to be bound by these Terms. If you do not agree to these Terms, please do not use AsKing.
                  </p>
                </section>

                {/* Section 2: License to Use */}
                <section className="space-y-4">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      2
                    </span>
                    License to Use
                  </h2>
                  <p>
                    Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to download, install, and execute the AsKing application on devices you own or control for personal or internal business operations.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {/* You May */}
                    <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-2">
                      <div className="flex items-center gap-2 font-bold text-xs text-[#184530]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>You May:</span>
                      </div>
                      <ul className="text-xs text-[#556A60] space-y-1.5 list-disc list-inside">
                        <li>Install AsKing on multiple computing devices you control</li>
                        <li>Use AsKing for commercial customer management and personal workflows</li>
                        <li>Configure custom Kanban ticket boards, schedules, and message templates</li>
                        <li>Export, backup, and migrate your local database files at any time</li>
                      </ul>
                    </div>

                    {/* You May Not */}
                    <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-xs text-rose-800">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>You May Not:</span>
                      </div>
                      <ul className="text-xs text-rose-700/90 space-y-1.5 list-disc list-inside">
                        <li>Reverse engineer, decompile, or disassemble the application binaries</li>
                        <li>Redistribute, sell, lease, or sublicense AsKing without prior written consent</li>
                        <li>Remove, obscure, or alter any proprietary notices or copyright labels</li>
                        <li>Use AsKing for unlawful broadcasting, phishing, or abusive spam campaigns</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Section 3: External Messaging Channels & WhatsApp Gateway Warning */}
                <section className="space-y-4">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      3
                    </span>
                    External Messaging Channels (WhatsApp & Telegram)
                  </h2>
                  <p>
                    AsKing unifies your customer communication across <strong>2 external third-party messaging channels</strong>: WhatsApp and Telegram. Use of these channels is governed by each platform's respective terms:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2">
                    <li>
                      WhatsApp Terms of Service:{" "}
                      <a
                        href="https://www.whatsapp.com/legal/terms-of-service"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#184530] font-bold underline"
                      >
                        <span>WhatsApp Terms of Service</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                    <li>
                      Telegram Terms of Service:{" "}
                      <a
                        href="https://telegram.org/tos"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#184530] font-bold underline"
                      >
                        <span>Telegram Terms of Service</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                  </ul>

                  {/* Mandatory WhatsApp Gateway Warning Callout */}
                  <div className="p-6 rounded-3xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-3 shadow-xs mt-2">
                    <div className="flex items-center gap-2 text-sm font-black text-amber-900">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                      <span>Important Notice: WhatsApp Channel Integration</span>
                    </div>
                    <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed font-medium">
                      This channel uses an <b>Unofficial WhatsApp Gateway</b>. The official WhatsApp Business API may involve substantial per-message costs, so AsKing uses an alternative gateway that is more affordable and supported by a large global developer community. This gateway is not an official Meta product, is not affiliated with or endorsed by Meta, and cannot guarantee that a connected number will avoid restrictions. Users remain responsible for messaging activity, recipient consent, WhatsApp anti-spam compliance, and applicable data-protection laws. Use a dedicated business number responsibly; we strongly advise against connecting your primary personal WhatsApp number. Any bans or restrictions imposed on connected numbers are outside our liability.
                    </p>
                    <div className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
                      <p className="font-bold mb-1">Risk-reduction guidance:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Warm up a new number for 3–7 days through normal two-way manual activity, including legitimate conversations, active groups, and reasonable voice or video calls.</li>
                        <li>Limit a new number to approximately 20–50 messages per day. For a warmed number, increase gradually toward approximately 80–200 messages per day.</li>
                        <li>Avoid sudden traffic spikes or burst traffic, as abrupt high-volume activity may trigger automated review by Meta systems.</li>
                      </ul>
                      <p className="mt-2">This guidance only reduces risk and is not a guarantee against account restrictions or bans.</p>
                    </div>
                  </div>
                </section>

                {/* Section 4: Acceptable Use Policy */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      4
                    </span>
                    Acceptable Use Policy & Anti-Spam Compliance
                  </h2>
                  <p>
                    You agree to use AsKing lawfully and responsibly. You maintain sole responsibility for the content of messages, promotions, campaigns, and customer records processed through the application.
                  </p>
                  <p className="font-semibold text-[#11231B] pt-1">
                    Strictly Prohibited Activities:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2">
                    <li>Sending unsolicited bulk spam messages without explicit recipient consent (opt-in)</li>
                    <li>Distributing malware, fraudulent campaigns, extortion schemes, or defamatory content</li>
                    <li>Infringing upon third-party intellectual property or privacy rights</li>
                    <li>Harmful activities exploiting minors or vulnerable individuals</li>
                    <li>Impersonating another business, organization, or individual without authorization</li>
                  </ul>
                </section>

                {/* Section 5: AI Features & Generated Content */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      5
                    </span>
                    Artificial Intelligence (AI) Features & Output
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold text-xs text-[#11231B] mb-1">Google Gemini AI Engine</h3>
                      <p>
                        AsKing AI Assistant and AI Customer Agent features utilize Google Gemini generative intelligence for text inference and operational recommendations.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-[#11231B] mb-1">Nature of AI-Generated Content</h3>
                      <p>
                        AI-generated outputs are probabilistic and may contain inaccuracies. Users must continuously monitor and oversee conversations generated by AI. We provide no guarantee regarding the factual correctness or suitability of AI outputs.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-[#11231B] mb-1">Content Ownership</h3>
                      <p>
                        You retain total ownership over your company knowledge base, customer contacts, and tickets managed within AsKing.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-[#11231B] mb-1">AI Usage Limits</h3>
                      <p>AI quotas apply to the applicable plan or access period. Unused quota expires when that period ends and resets at the beginning of the next period. Quotas do not accumulate and cannot be rolled over, unless the applicable plan information expressly states otherwise.</p>
                    </div>
                  </div>
                </section>

                {/* Section 6: Local-First Data Sovereignty & Backup */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      6
                    </span>
                    Local-First Data Sovereignty & User Backups
                  </h2>
                  <p>
                    AsKing operates under a Local-First architecture. All customer chat logs, directory records, and support tickets reside locally within your computer's local database.
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2">
                    <li>We do not store or mirror your raw customer database in our cloud infrastructure.</li>
                    <li>Users are solely responsible for creating regular data backups and database exports.</li>
                    <li>We cannot recover data lost due to local hardware failures, OS corruptions, or manual user deletion.</li>
                  </ul>
                </section>

                {/* Section 7: Disclaimers & Limitations of Liability */}
                <section className="space-y-4">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      7
                    </span>
                    Disclaimers & Limitation of Liability
                  </h2>

                  <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2 text-xs text-amber-950">
                    <p className="font-bold uppercase tracking-wider text-[11px] text-amber-900">
                      Important Legal Notice (As-Is Warranty)
                    </p>
                    <p className="leading-relaxed">
                      ASKING IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESSED OR IMPLIED. WE DISCLAIM ALL WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND UNINTERRUPTED ERROR-FREE OPERATION.
                    </p>
                  </div>

                  <p>
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, ASKING, ITS DEVELOPERS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, LOSS OF PROFITS, LOCAL DATA LOSS, OR THIRD-PARTY MESSAGING PLATFORM BANS (INCLUDING WHATSAPP AND TELEGRAM) ARISING FROM THE USE OF THE APPLICATION.
                  </p>
                </section>

                {/* Section 8: Intellectual Property */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      8
                    </span>
                    Intellectual Property
                  </h2>
                  <p>
                    The AsKing application, interface designs, branding, logos, codebases, and documentation are protected by copyright and intellectual property laws. All rights not expressly granted herein remain the exclusive property of AsKing Project by GoDiscus.
                  </p>
                </section>

                {/* Section 8: Refund & Subscription Cancellation */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2"><span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">8</span>Refund & Subscription Cancellation Policy</h2>
                  <p>You may cancel your subscription at any time. Cancellation stops the next renewal, while paid access remains available until the end of the already-paid billing period.</p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2">
                    <li>Ordinary cancellations are not eligible for prorated refunds for unused time. Paid access remains available until the end of the period already paid for.</li>
                    <li>A 14-day refund grace period applies from the first payment for a new subscription, whether monthly or annual, subject to material usage, payment-provider rules, and applicable law.</li>
                    <li>For an annual auto-renewal, the 14-day refund grace period begins on the renewal date and remains subject to usage review, payment-provider rules, and applicable law.</li>
                    <li>Refunds may be reviewed for duplicate charges, failed activation or provisioning, unauthorized transactions, or other circumstances required by law.</li>
                    <li>Submit refund requests to <a href="mailto:asking@godiscus.com" className="text-[#184530] font-bold underline">asking@godiscus.com</a> with the relevant account and transaction details.</li>
                  </ul>
                  <p>Requests outside these conditions are assessed case by case. Nothing in this policy limits non-waivable consumer rights under applicable law.</p>
                </section>

                {/* Section 9: Termination */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      9
                    </span>
                    Termination
                  </h2>
                  <p>
                    These Terms remain in effect until terminated. You may terminate this agreement at any time by uninstalling AsKing and ceasing all use. We reserve the right to suspend cloud SSO access if these Terms are violated.
                  </p>
                </section>

                {/* Section 10: Governing Law */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      10
                    </span>
                    Governing Law & Changes to Terms
                  </h2>
                  <p>
                    These Terms are governed by and construed in accordance with the laws of Indonesia. We reserve the right to modify these Terms at any time. Changes become effective immediately upon posting to this page.
                  </p>
                </section>

                {/* Section 11: Contact */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-[#11231B] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#12281F] text-[#B8F55C] text-xs flex items-center justify-center font-black">
                      11
                    </span>
                    Contact Information
                  </h2>
                  <p>
                    For questions regarding these Terms of Use, please reach out to us at:
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

                {/* Acknowledgment Box */}
                <div className="p-6 rounded-3xl bg-[#12281F] text-[#B8F55C] space-y-2 border border-[#234235] shadow-sm">
                  <h3 className="font-bold text-xs tracking-wider uppercase">
                    Acknowledgment and Agreement
                  </h3>
                  <p className="text-xs text-[#DEE7DF] leading-relaxed">
                    BY DOWNLOADING, INSTALLING, OR USING ASKING, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF USE.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
