import { PRICING_CONFIG } from "../config/pricing";

export const translations = {
  id: {
    // 1. Navigation & Brand
    nav: {
      brand_name: "AsKing",
      tagline: "Customer Manager",
      solutions: "Fitur & Solusi",
      data_privacy: "Perhatian Kami",
      app_showcase: "Galeri App",
      omnichannel: "Omnichannel",
      ai_assistant: "AI Assistant",
      pricing: "Harga",
      download: "Download App",
      login: "Masuk",
      signup: "Coba Gratis",
      profile: "Profil Saya",
      logout: "Keluar",
      auth_bridge: "Desktop SSO",
    },

    // 2. Hero Section
    hero: {
      badge: "Local-First Customer Manager & AI Automation",
      headline_prefix: "Satu Aplikasi untuk Mengelola",
      headline_highlight: "Pelanggan & Pesan",
      headline_suffix: "dengan Kepemilikan Data Penuh",
      subtitle:
        "AsKing adalah Customer Manager modern untuk manajemen tiket Kanban, otomasi customer support, dan marketer. Seluruh data pelanggan tersimpan aman 100% di perangkat Anda (Local-First)—bebas dari risiko kebocoran data di cloud vendor CRM tradisional.",
      cta_primary: "Download AsKing Desktop",
      cta_secondary: "Jelajahi Fitur",
      badge_local_data: "100% Data On-Device",
      badge_omnichannel: "WhatsApp • Telegram • Live Chat",
      badge_ai_agent: "AI Agent & Assistant 24/7",
      trusted_by_title: "Dipercaya oleh tim customer support & marketer modern",
    },

    // 3. Data Ownership & Privacy Comparison
    privacy: {
      tag: "Arsitektur Local-First",
      title: "Mengapa Kepemilikan Data di Perangkat Sangat Penting?",
      subtitle:
        "Hampir semua CRM di luar sana menyimpan data sensitif pelanggan Anda di server vendor cloud mereka. AsKing mengubah paradigma tersebut dengan arsitektur Local-First di mana data selalu berada di tangan Anda.",
      cloud_crm_title: "Vendor Cloud CRM Tradisional",
      cloud_crm_desc:
        "Data chat, kontak rahasia, dan tiket pelanggan Anda tersimpan di database server pihak ketiga.",
      cloud_crm_points: [
        "Rentan terhadap kebocoran data & insiden keamanan server cloud",
        "Vendor memiliki akses teknis ke seluruh basis data pelanggan Anda",
        "Ketergantungan biaya langganan bulanan mahal untuk penyimpanan",
      ],
      asking_title: "AsKing Local-First Architecture",
      asking_desc:
        "Seluruh riwayat pesan, kontak, dan tiket tersimpan di database lokal perangkat Anda.",
      asking_points: [
        "100% Kepemilikan Data: Data rahasia tidak pernah keluar dari komputer Anda",
        "Privasi Mutlak: AsKing tidak menyimpan atau melihat chat pelanggan",
        "Full Backup & Restore: Ekspor database mandiri kapan pun Anda inginkan",
      ],
    },

    // 4. Features Bento Grid
    features: {
      tag: "Fitur Unggulan",
      title: "Solusi Lengkap Manajemen Pelanggan & Otomasi Cerdas",
      subtitle:
        "Tingkatkan produktivitas tim CS dan marketer Anda dengan integrasi pesan, papan kanban visual, dan AI cerdas dalam satu antarmuka yang elegan.",

      // Card 1: Omnichannel
      omnichannel_title: "Omnichannel Message Channels",
      omnichannel_desc:
        "Hubungkan WhatsApp, Telegram, dan Live Chat Widget langsung dalam satu window terpadu.",
      omnichannel_name_wa: "WhatsApp",
      omnichannel_name_tg: "Telegram",
      omnichannel_name_chat: "Live Chat Widget",
      omnichannel_desc_wa: "Integrasi WhatsApp",
      omnichannel_desc_tg: "Integrasi Telegram",
      omnichannel_desc_chat: "Coming Soon",
      omnichannel_status_wa: "Aktif",
      omnichannel_status_tg: "Segera Hadir",
      omnichannel_status_chat: "Segera Hadir",
      omnichannel_disclaimer:
        "AsKing adalah aplikasi independen dan tidak berafiliasi, disponsori, atau didukung secara resmi oleh WhatsApp (Meta Platforms Inc.) maupun Telegram (Telegram FZ-LLC).",

      // Card 2: Kanban & Tickets
      kanban_title: "Visual Kanban & Ticket Workflow",
      kanban_desc:
        "Pantau alur keluhan, permintaan layanan, prioritas, dan tenggat waktu SLA pelanggan secara visual dan terorganisir.",
      kanban_open: "Open",
      kanban_in_progress: "In Progress",
      kanban_resolved: "Resolved",
      kanban_priority_urgent: "Urgent",
      kanban_priority_high: "High",

      // Card 3: AsKing AI Assistant
      assistant_title: "AsKing AI Assistant Manager",
      assistant_desc:
        "Asisten eksekutif cerdas yang menganalisis data percakapan real-time, tiket prioritas, dan jadwal pesan untuk memberikan arahan operasional strategis.",
      assistant_prompt_sample: "Rangkum tiket prioritas hari ini & buat draf tindak lanjut",
      assistant_reply_sample: "Terdapat 3 tiket urgent terkait onboarding. Draf pesan konfirmasi telah disiapkan untuk WhatsApp.",

      // Card 4: AI Customer Agent 24/7
      agent_title: "Autonomous AI Customer Agent",
      agent_desc:
        "Otomasi alur kerja customer service dan marketing dengan grounding knowledge base perusahaan terverifikasi dan guardrail human handoff otomatis.",
      agent_badge: "Auto-Reply 24/7",
      agent_guardrail: "Guardrail & Knowledge",

      // Card 5: Smart Scheduler & Templates
      scheduler_title: "Smart Scheduler & Broadcast Templates",
      scheduler_desc:
        "Atur jadwal follow-up, reminder janji temu, dan pesan siaran massal dengan template interaktif yang dapat disesuaikan.",
      scheduler_active_badge: "Jadwal Aktif",
    },

    // 5. Interactive Demo / App Explorer
    demo: {
      tag: "Galeri & Eksplorasi Antarmuka",
      title: "Jelajahi Setiap Sudut Aplikasi AsKing Desktop",
      subtitle: "Lihat langsung screenshot tampilan asli antarmuka AsKing yang dirancang elegan, intuitif, dan Local-First.",
      zoom_preview: "Perbesar Tampilan",
      close_preview: "Tutup Pratinjau",
      view_fullscreen: "Mode Layar Penuh",
      route_label: "Aplikasi Desktop",
      module_counter: "Modul {current} dari {total}",
      feature_points_title: "Fitur Utama Modul:",
      tabs: {
        dashboard: "Dashboard",
        messages: "Pesan & Chat",
        tikets: "Tiket Kanban",
        customer_agent: "AI Customer Agent",
        channels: "Saluran Pesan",
        scheduler: "Penjadwal Pesan",
        templates: "Template Pesan",
        contacts: "Kontak Pelanggan",
        backup: "Backup & Restore",
      },
      modules: {
        dashboard: {
          title: "Dashboard Ringkasan & Operasional",
          tagline: "Pusat pantauan harian untuk memonitor prioritas tiket dan bantuan analisis menagement prioritas tiket dan pesan oleh AI Asking assitant.",
          badge: "Ringkasan Operasional",
          points: [
            "Pantau tiket yang mendekati batas waktu penyelesaian hari ini dan besok",
            "Indikator status aktif untuk saluran pesan WhatsApp dan Telegram",
            "Akses cepat ke seluruh modul utama dan informasi paket langganan",
          ],
        },
        messages: {
          title: "Workspace Percakapan Terpadu",
          tagline: "Kelola pesan pelanggan dari WhatsApp dan Telegram dalam satu antarmuka desktop.",
          badge: "Obrolan Terpadu",
          points: [
            "Satu ruang kerja untuk membaca dan membalas pesan WhatsApp dan Telegram",
            "Kontrol fleksibel untuk beralih antara respon otomatis dan Human Mode",
            "Riwayat percakapan tersimpan aman di database lokal komputer Anda",
          ],
        },
        tikets: {
          title: "Manajemen Tiket CRM & Kanban",
          tagline: "Catat dan kelola kendala teknis, prospek penjualan, dan tindak lanjut pelanggan secara terstruktur.",
          badge: "Papan Tiket CRM",
          points: [
            "Papan visual Kanban dengan opsi beralih ke tampilan tabel yang rapi",
            "Pengaturan kategori, tingkat prioritas, dan batas waktu penyelesaian",
            "Tombol direct chat untuk langsung membuka percakapan pelanggan terkait",
          ],
        },
        customer_agent: {
          title: "Pengaturan AI Customer Agent",
          tagline: "Konfigurasi asisten otomatis untuk menjawab pertanyaan pelanggan sesuai panduan bisnis Anda.",
          badge: "Otomasi Pesan AI",
          points: [
            "Kustomisasi persona gaya bahasa dan basis pengetahuan resmi bisnis Anda",
            "Dukungan pemanggilan tools otomatis untuk pencatatan tiket dan jadwal",
            "Area live simulator playground untuk menguji respon sebelum diaktifkan",
          ],
        },
        channels: {
          title: "Pengaturan Saluran Pesan",
          tagline: "Hubungkan dan pantau akun WhatsApp serta Telegram bisnis Anda di satu tempat.",
          badge: "Koneksi Multi-Saluran",
          points: [
            "Koneksi WhatsApp yang praktis melalui pemindaian QR code",
            "Integrasi akun Telegram menggunakan sesi yang aman di perangkat",
            "Pemantauan status koneksi aktif perangkat secara langsung",
          ],
        },
        scheduler: {
          title: "Penjadwal Pesan & Broadcast",
          tagline: "Atur pengiriman pesan promosi, pengingat janji temu, atau info berkala secara terencana.",
          badge: "Jadwal Pesan",
          points: [
            "Penjadwalan pesan siaran untuk kontak WhatsApp dan Telegram",
            "Pilihan waktu pengiriman sekali kirim atau pengulangan terjadwal",
            "Mekanisme jeda acak alami untuk menjaga kenyamanan pengiriman",
          ],
        },
        templates: {
          title: "Template Pesan & Balasan Cepat",
          tagline: "Siapkan format pesan standar agar tim dapat membalas pertanyaan umum dengan lebih cepat.",
          badge: "Balasan Cepat",
          points: [
            "Dukungan tag dinamis seperti nama pelanggan dan nomor kontak",
            "Format variasi kata Spintax untuk variasi kalimat yang lebih beragam",
            "Kemudahan menyalin dan menggunakan template saat membalas chat",
          ],
        },
        contacts: {
          title: "Direktori Kontak Pelanggan",
          tagline: "Daftar kontak pelanggan terpusat dengan label kategori dan saluran komunikasi.",
          badge: "Buku Kontak",
          points: [
            "Pencarian cepat kontak berdasarkan nama, nomor telepon, atau tag",
            "Pengelompokan kontak berdasarkan saluran WhatsApp atau Telegram",
            "Tombol pintas untuk langsung memulai percakapan baru dengan kontak",
          ],
        },
        backup: {
          title: "Cadangan & Pemulihan Data (Backup & Restore)",
          tagline: "Kelola cadangan seluruh data aplikasi secara mandiri langsung ke berkas lokal.",
          badge: "Penyimpanan Lokal",
          points: [
            "Ekspor seluruh riwayat chat, tiket, dan kontak ke file backup JSON",
            "Fitur restore untuk memulihkan data saat berpindah perangkat komputer",
            "Kontrol penuh pengguna atas data lokal dengan opsi reset database",
          ],
        },
      },
    },

    // 6. Node Workflow Section
    integration: {
      tag: "Otomasi Alur Kerja",
      title: "Dari Pesan Chat Menjadi Tiket Kanban Otomatis",
      subtitle:
        "Pelanggan meminta jadwal demo → AI Customer Agent langsung membuat tiket Kanban → Jadwal terdaftar dan konfirmasi terkirim seketika.",
      node1_title: "Chat",
      node1_badge: "Pesan Masuk",
      node2_title: "AI Customer Agent",
      node2_action: "AI membuat tiket",
      node2_desc: "Mendeteksi permintaan demo & mencatat ke Kanban",
      node3_title: "Tiket Kanban Terbit",
      node3_badge: "Papan Kanban Desktop",
      customer_label: "Customer",
      customer_msg:
        "Halo min, kami tertarik beli paket AsKing Pro untuk tim, apakah bisa dijadwal demo besok jam 10 pagi?",
      ai_reply:
        "Boleh kak Abdullah. Tiket demo sudah kami buatkan (#TCK-1003) untuk besok pukul 10:00 pagi ya. Tim kami siap mendampingi via zoom meeting ya kak! 😊",
      ai_disclaimer:
        "Respons AI bersifat dinamis dan dapat berbeda pada setiap percakapan.",
      ticket_id: "#TCK-1003",
      ticket_title: "Sales Team Live Onboarding Demo",
      ticket_category: "Support",
      ticket_priority: "Medium",
      ticket_date: "2026-08-25",
    },

    // 7. Testimonial
    testimonial: {
      quote:
        "\"Saat ini, data telah menjadi aset strategis bernilai tinggi yang rentan terhadap berbagai ancaman siber dan penyalahgunaan. Oleh sebab itu, perlindungan data privasi merupakan tanggung jawab kolektif yang menuntut mitigasi komprehensif guna mencegah potensi insiden kebocoran data.\"",
      author: "Komitmen Kedaulatan & Keamanan Data",
      role: "Standar Privasi Local-First AsKing",
    },

    // 8. Stats Banner
    stats: {
      stat1_value: "30%",
      stat1_title: "Kebocoran via Vendor Pihak Ketiga",
      stat1_desc: "Insiden kebocoran global melibatkan akses vendor cloud pihak ketiga.",
      stat1_source: "Verizon DBIR 2025",

      stat2_value: "63%",
      stat2_title: "Eksposur Data di Cloud SaaS",
      stat2_desc: "Perusahaan mengalami insiden oversharing data sensitif di aplikasi SaaS.",
      stat2_source: "CSA State of SaaS Security 2025",

      stat3_value: "4x",
      stat3_title: "Lonjakan Serangan Rantai Pasok",
      stat3_desc: "Peningkatan drastis serangan siber menyasar ekosistem cloud pihak ketiga.",
      stat3_source: "IBM X-Force / IBM Think 2026",

      stat4_value: "$4.44M",
      stat4_title: "Rata-Rata Kerugian Finansial",
      stat4_desc: "Biaya kerugian rata-rata yang ditanggung akibat satu insiden kebocoran data.",
      stat4_source: "IBM Cost of a Data Breach 2025",
    },

    // 9. Pricing Section
    pricing: {
      tag: "Pilihan Paket & Harga",
      title: "Investasi Cerdas untuk Produktivitas Maksimal",
      subtitle:
        "Seluruh paket berlaku untuk 1 akun dan 1 perangkat desktop. Nikmati kedaulatan data penuh tanpa biaya pesan per kirim.",
      billed_monthly: "/ bulan",
      custom_price: "Coming Soon",
      trial_badge: "15 Hari Uji Coba Penuh",
      trial_title: "Free Trial",
      trial_price: "Rp 0",
      trial_period: "selama 15 hari",
      trial_desc:
        "Coba seluruh fitur utama AsKing untuk memvalidasi alur kerja manajemen pelanggan dan otomasi tim Anda.",
      trial_ai_quota_label: "50 Request AI Assistant (Uji Coba)",
      trial_cta: "Mulai Uji Coba Gratis",
      trial_features: [
        "1 Akun WhatsApp Aktif",
        "Papan Kanban & Manajemen Status Tiket",
        "Jadwal Broadcast & Template Pesan",
        "100% Arsitektur Local-First (Data On-Device)",
        "50 Request AI Assistant / 15 Hari (Sangat Terbatas)",
        "Dukungan Komunitas & Dokumentasi",
      ],

      pro_badge: "🌟 Paling Populer",
      pro_discount_badge: "Flat Payment Promo Terbatas",
      pro_title: "Pro Business",
      pro_original_price: `Rp ${PRICING_CONFIG.proOriginalPrice}`,
      pro_price: `Rp ${PRICING_CONFIG.proPrice}`,
      pro_period: "/ bulan",
      pro_desc:
        "Solusi lengkap dan tanpa kompromi untuk online shop, customer support, dan marketer aktif.",
      pro_ai_quota_label: "1.000 Request AI Assistant & Agent / Bulan",
      pro_cta: "Pilih Pro Business",
      pro_features: [
        "1 Akun WhatsApp Aktif + Telegram",
        "100% Local-First Database (0ms Latency)",
        "Visual Kanban Board & Aturan SLA Tiket",
        "1.000 Request AI Assistant & Agent / Bulan",
        "Autonomous 24/7 AI Customer Agent (Grounded Knowledge Base)",
        "Broadcast Pesan Terjadwal Tanpa Batas",
        "Template Interaktif & Tagging Pelanggan",
        "Pembaruan Fitur Berkala & Prioritas Ringan",
      ],

      advance_badge: "🚀 Segera Hadir",
      advance_title: "Advance Business",
      advance_price: PRICING_CONFIG.advancePrice,
      advance_period: "Hubungi untuk Kustomisasi",
      advance_desc:
        "Dirancang untuk tim bisnis menengah & enterprise dengan kebutuhan kolaborasi dan integrasi kustom.",
      advance_ai_quota_label: "Custom Quota AI Gemini & API Key",
      advance_cta: "Daftar Antrean Segera",
      advance_features: [
        "Seluruh Fitur Paket Pro Business",
        "Collaboration Multi-user (Segera Hadir)",
        "Customise Kanban Workflow & Fields (Segera Hadir)",
        "API Integration untuk Aplikasi Internal (Segera Hadir)",
        "MCP Server untuk Integrasi AI Agent Internal (Segera Hadir)",
        "Support Custom Model AI Gemini & Custom API Key",
        "Company Setup Support (Bantuan Setup Langsung ke Perusahaan)",
        "Priority Dedicated Support 24/7",
      ],
    },

    // 10. CTA & Download
    cta: {
      badge_verified: "Aplikasi Desktop Terverifikasi",
      title: "Rasakan Kekuatan AsKing Customer Manager",
      subtitle:
        "Mulai tingkatkan kecepatan layanan pelanggan dan lindungi kepemilikan data bisnis Anda hari ini.",
      btn_download: "Download AsKing Desktop",
      btn_login: "Buka Akun Web",
      ms_store_desc: "Tersedia Resmi di Microsoft Store",
      status_ready: "Tersedia",
      status_coming_soon: "Segera Hadir",
      platforms_label: "Dukungan Platform",
      platform_notice: "Saat ini AsKing tersedia untuk Windows di Microsoft Store. Versi macOS & Linux segera hadir.",
      mac_btn: "macOS (Apple & Intel)",
      win_btn: "Windows (x64)",
      linux_btn: "Linux (AppImage/Deb)",
    },

    // 10. Footer
    footer: {
      description:
        "AsKing adalah aplikasi Customer Manager Local-First untuk manajemen kanban tiket, integrasi omnichannel messaging, dan otomasi AI Customer Agent dengan privasi data 100% di tangan Anda.",
      section_product: "Produk",
      section_features: "Fitur",
      section_legal: "Legal & Privasi",
      section_connect: "Hubungi Kami",
      link_features: "Fitur Utama",
      link_privacy: "Kebijakan Privasi",
      link_terms: "Syarat & Ketentuan",
      link_contact: "Kontak Support",
      link_pricing: "Paket Harga",
      copyright: "Hak Cipta Dilindungi Undang-Undang. AsKing Customer Manager.",
    },

    // 11. Auth Pages (Login & Signup)
    auth: {
      secure_badge: "🔐 Akses Anggota Aman",
      login_title: "Selamat Datang di AsKing",
      login_subtitle: "Masuk untuk sinkronisasi aplikasi desktop dan kelola akun AsKing Anda.",
      signup_title: "Daftar Akun Baru AsKing",
      signup_subtitle: "Mulai kelola pelanggan Anda secara cerdas dan aman dengan arsitektur Local-First.",
      email_label: "Alamat Email",
      email_placeholder: "nama@perusahaan.com",
      password_label: "Kata Sandi",
      password_placeholder: "••••••••",
      full_name_label: "Nama Lengkap",
      full_name_placeholder: "misal: Ahmad Fadil",
      repeat_password_label: "Konfirmasi Kata Sandi",
      repeat_password_placeholder: "••••••••",
      btn_login: "Masuk",
      btn_signup: "Daftar Akun",
      logging_in: "Memproses masuk...",
      creating_account: "Membuat akun...",
      no_account_text: "Belum punya akun?",
      start_free_trial: "Coba gratis sekarang",
      have_account_text: "Sudah punya akun?",
      sign_in_link: "Masuk ke akun Anda",
      terms_agree_prefix: "Dengan membuat akun, Anda menyetujui",
      terms_checkbox_prefix: "Saya telah membaca dan menyetujui",
      terms_checkbox_suffix: "AsKing - Customer Manager.",
      terms_required_error: "Anda harus menyetujui Syarat & Ketentuan serta Kebijakan Privasi sebelum membuat akun.",
      terms_link: "Syarat & Ketentuan",
      and_word: "dan",
      privacy_link: "Kebijakan Privasi",
      email_verified_title: "Email Berhasil Diverifikasi!",
      email_verified_desc: "Email Anda telah dikonfirmasi. Silakan masukkan kredensial Anda di bawah untuk masuk.",
      verification_sent_title: "Verifikasi Email Anda",
      verification_sent_desc: "Kami telah mengirimkan tautan aktivasi ke {email}. Silakan klik tautan di email Anda untuk mengaktifkan akun.",
      next_steps_title: "Langkah selanjutnya:",
      next_step_1: "Periksa kotak masuk (atau folder spam) email Anda",
      next_step_2: "Klik tombol konfirmasi aktivasi",
      next_step_3: "Anda akan langsung diarahkan ke halaman Profil Anda",
      resend_email_btn: "Kirim Ulang Email Konfirmasi",
      resend_cooldown: "Tunggu {seconds}d untuk kirim ulang",
      resend_success: "Email verifikasi telah dikirim ulang! Silakan periksa inbox Anda.",
      desktop_bridge_badge: "Otentikasi Desktop AsKing",
      desktop_bridge_title: "Menghubungkan ke Aplikasi Desktop AsKing...",
      desktop_bridge_desc: "Tunggu sebentar selagi kami memverifikasi kredensial Anda untuk login SSO desktop.",
      desktop_bridge_success: "Autentikasi Terkirim ke Desktop",
      desktop_ready_title: "Siap di AsKing Desktop!",
      desktop_ready_desc: "Masuk sebagai {user}. Jika browser meminta izin, klik \"Open AsKing\".",
      open_desktop_btn: "Buka Aplikasi Desktop AsKing",
      go_to_profile: "Ke Profil Web",
      login_required_badge: "Diperlukan Autentikasi",
      login_required_title: "Masuk untuk Melanjutkan",
      login_required_desc: "Untuk menghubungkan aplikasi desktop AsKing dengan akun cloud Anda, silakan masuk terlebih dahulu.",
      login_with_email_btn: "Masuk dengan Email",
      create_account_btn: "Buat Akun Baru",
      connection_failed_title: "Gagal Menghubungkan",
      back_to_login: "Kembali ke Halaman Masuk",
    },

    // 12. Profile Page
    profile: {
      workspace_badge: "AsKing Workspace",
      view_landing: "Lihat Landing Page",
      sign_out: "Keluar",
      verified_badge: "Email Terverifikasi",
      member_since: "Anggota sejak {date}",
      user_id: "ID",
      copied: "Tersalin!",
      explore_features: "Jelajahi Fitur",
      personal_info_title: "Profil Pribadi",
      personal_info_desc: "Perbarui nama tampilan dan identitas kontak Anda",
      full_name_label: "Nama Lengkap",
      email_label: "Alamat Email",
      email_note: "Alamat email terverifikasi.",
      save_changes: "Simpan Perubahan",
      saving: "Menyimpan...",
      security_title: "Keamanan & Kata Sandi",
      security_desc: "Perbarui kata sandi akun login Anda",
      new_password: "Kata Sandi Baru",
      new_password_placeholder: "Minimal 6 karakter",
      confirm_new_password: "Konfirmasi Kata Sandi Baru",
      confirm_password_placeholder: "Ulangi kata sandi baru",
      update_password: "Perbarui Kata Sandi",
      updating_password: "Memperbarui...",
      loading_profile: "Memuat profil Anda...",
      name_updated_success: "Nama berhasil diperbarui!",
      password_updated_success: "Kata sandi berhasil diperbarui!",

      // Billing & Subscription
      billing_title: "Status Langganan & Paket",
      billing_desc: "Informasi paket aktif, masa berlaku, dan kuota request AI akun Anda",
      plan_free_trial: "Free Trial (15 Hari)",
      plan_pro_business: "Pro Business",
      plan_advance_business: "Advance Business",
      plan_status_active: "Aktif",
      plan_status_expired: "Kadaluarsa",
      plan_started: "Mulai Aktif",
      plan_expires: "Masa Berlaku",
      plan_remaining_days: "Sisa {days} hari",
      plan_expired_badge: "Telah Berakhir",
      plan_ai_budget: "Batas Kuota AI Request",
      plan_ai_budget_desc: "Maksimal kuota request AI assistant per siklus",
      upgrade_plan_btn: "Perpanjangan",
      renew_plan_btn: "Perpanjang Paket",

      // Upgrade Modal
      modal_upgrade_title: "Perpanjangan",
      modal_upgrade_subtitle: "Dapatkan akses penuh ke fitur AI dan otomasi tanpa batasan.",
      modal_select_plan: "1. Pilih Paket Langganan",
      modal_pro_title: "Pro Business",
      modal_pro_discount_badge: "Flat Payment Promo Terbatas",
      modal_pro_original_price: `Rp ${PRICING_CONFIG.proOriginalPrice}`,
      modal_pro_price: `Rp ${PRICING_CONFIG.proPrice}`,
      modal_pro_period: "/ bulan",
      modal_pro_feature_1: "Semua fitur AsKing Desktop 1 Akun",
      modal_pro_feature_2: "Otomasi AI Customer Agent & Chatbot",
      modal_pro_feature_3: "Integrasi WhatsApp & Visual Kanban Board",
      modal_advance_title: "Advance Business",
      modal_advance_price: PRICING_CONFIG.advancePrice,
      modal_payment_method: "2. Pilih Metode Pembayaran",
      modal_bca_title: "Transfer Bank BCA",
      modal_bca_acc_num: "No. Rekening",
      modal_bca_acc_name: "Atas Nama",
      modal_bca_copy_btn: "Salin",
      modal_bca_copied: "Tersalin!",
      modal_bca_note: "Pastikan nomor rekening (2631261801) dan nama akun bank (Ahmad Fadil) sudah benar sebelum melakukan transfer.",
      modal_qris_title: "QRIS Instan",
      modal_qris_coming_soon: "Segera Hadir",
      modal_confirm_btn: "Konfirmasi Pembayaran via WhatsApp",
      modal_qr_title: "Scan QR Code Konfirmasi",
      modal_qr_desc: "Silakan scan QR Code di bawah menggunakan kamera HP atau WhatsApp untuk mengirimkan konfirmasi pembayaran ke Admin AsKing:",
      modal_open_wa_btn: "Buka WhatsApp Langsung",
      modal_close_btn: "Tutup",
    },
  },

  en: {
    // 1. Navigation & Brand
    nav: {
      brand_name: "AsKing",
      tagline: "Customer Manager",
      solutions: "Features & Solutions",
      data_privacy: "Our Concern",
      app_showcase: "App Showcase",
      omnichannel: "Omnichannel",
      ai_assistant: "AI Assistant",
      pricing: "Pricing",
      download: "Download App",
      login: "Sign In",
      signup: "Get Started Free",
      profile: "My Profile",
      logout: "Sign Out",
      auth_bridge: "Desktop SSO",
    },

    // 2. Hero Section
    hero: {
      badge: "Local-First Customer Manager & AI Automation",
      headline_prefix: "One Tool to Manage",
      headline_highlight: "Customers & Messages",
      headline_suffix: "with Total Data Ownership",
      subtitle:
        "AsKing is a modern Customer Manager for Kanban ticket tracking, customer support automation, and marketer workflows. Your customer data remains 100% on your device (Local-First)—free from the privacy risks of traditional vendor cloud CRMs.",
      cta_primary: "Download AsKing Desktop",
      cta_secondary: "Explore Features",
      badge_local_data: "100% On-Device Data",
      badge_omnichannel: "WhatsApp • Telegram • Live Chat",
      badge_ai_agent: "24/7 AI Agent & Assistant",
      trusted_by_title: "Trusted by modern customer support & marketing teams",
    },

    // 3. Data Ownership & Privacy Comparison
    privacy: {
      tag: "Local-First Architecture",
      title: "Why On-Device Data Ownership Matters Most",
      subtitle:
        "Almost all CRMs store your sensitive customer records and conversations on their third-party cloud servers. AsKing transforms this with a Local-First architecture where data stays strictly in your hands.",
      cloud_crm_title: "Traditional Vendor Cloud CRMs",
      cloud_crm_desc:
        "Your chat histories, private customer contacts, and tickets reside on third-party cloud databases.",
      cloud_crm_points: [
        "Vulnerable to cloud data breaches & third-party server outages",
        "Vendors have technical access to inspect your customer databases",
        "Recurring heavy monthly storage subscription costs",
      ],
      asking_title: "AsKing Local-First Architecture",
      asking_desc:
        "All conversations, contacts, and tickets reside on your local device storage.",
      asking_points: [
        "100% Data Ownership: Confidential data never leaves your computer",
        "Absolute Privacy: AsKing servers never store or inspect your customer chats",
        "Full Backup & Restore: Export and archive your raw database whenever you want",
      ],
    },

    // 4. Features Bento Grid
    features: {
      tag: "Key Capabilities",
      title: "Complete Customer Management & Smart Automation",
      subtitle:
        "Boost customer support and marketing velocity with unified messaging channels, visual Kanban boards, and AI intelligence in one sleek interface.",

      // Card 1: Omnichannel
      omnichannel_title: "Omnichannel Message Channels",
      omnichannel_desc:
        "Connect WhatsApp, Telegram, and Live Chat Widget directly within a unified desktop window.",
      omnichannel_name_wa: "WhatsApp",
      omnichannel_name_tg: "Telegram",
      omnichannel_name_chat: "Live Chat Widget",
      omnichannel_desc_wa: "Integration WhatsApp",
      omnichannel_desc_tg: "Integration Telegram",
      omnichannel_desc_chat: "Coming Soon",
      omnichannel_status_wa: "Active",
      omnichannel_status_tg: "Coming Soon",
      omnichannel_status_chat: "Coming Soon",
      omnichannel_disclaimer:
        "AsKing is an independent application and is not affiliated, sponsored, or officially endorsed by WhatsApp (Meta Platforms Inc.) or Telegram (Telegram FZ-LLC).",

      // Card 2: Kanban & Tickets
      kanban_title: "Visual Kanban & Ticket Workflow",
      kanban_desc:
        "Track customer inquiries, service requests, priority levels, and SLA deadlines visually and systematically.",
      kanban_open: "Open",
      kanban_in_progress: "In Progress",
      kanban_resolved: "Resolved",
      kanban_priority_urgent: "Urgent",
      kanban_priority_high: "High",

      // Card 3: AsKing AI Assistant
      assistant_title: "AsKing AI Assistant Manager",
      assistant_desc:
        "An intelligent executive assistant that analyzes real-time chats, priority tickets, and schedules to provide strategic operational guidance.",
      assistant_prompt_sample: "Summarize priority tickets today & draft follow-ups",
      assistant_reply_sample: "Found 3 urgent onboarding tickets. WhatsApp confirmation drafts are ready for review.",

      // Card 4: AI Customer Agent 24/7
      agent_title: "Autonomous AI Customer Agent",
      agent_desc:
        "Automate customer service and marketing workflows grounded in your verified company knowledge base with automatic human handoff guardrails.",
      agent_badge: "Auto-Reply 24/7",
      agent_guardrail: "Guardrail & Knowledge",

      // Card 5: Smart Scheduler
      scheduler_title: "Smart Scheduled Broadcasts & Templates",
      scheduler_desc:
        "Schedule follow-ups, appointment reminders, and broadcast campaigns using customizable interactive templates.",
      scheduler_active_badge: "Active Schedules",
    },

    // 5. Interactive Demo / App Explorer
    demo: {
      tag: "UI Showcase & Explorer",
      title: "Explore Every Angle of AsKing Desktop",
      subtitle: "Experience real, high-resolution screenshots of AsKing's elegant, intuitive, and Local-First desktop experience.",
      zoom_preview: "Enlarge Screenshot",
      close_preview: "Close Preview",
      view_fullscreen: "Fullscreen View",
      route_label: "Desktop Application",
      module_counter: "Module {current} of {total}",
      feature_points_title: "Key Module Capabilities:",
      tabs: {
        dashboard: "Dashboard",
        messages: "Messages & Chat",
        tikets: "Kanban Tickets",
        customer_agent: "AI Customer Agent",
        channels: "Message Channels",
        scheduler: "Smart Scheduler",
        templates: "Message Templates",
        contacts: "Customer Contacts",
        backup: "Backup & Restore",
      },
      modules: {
        dashboard: {
          title: "Dashboard Overview & Operational Summary",
          tagline: "Daily monitoring center for tracking ticket priorities and AI-assisted priority analysis for tickets and messages.",
          badge: "Operations Overview",
          points: [
            "Overview of tickets due today and tomorrow for quick resolution",
            "Live connectivity status for connected WhatsApp and Telegram channels",
            "Quick access to all core modules and active subscription details",
          ],
        },
        messages: {
          title: "Unified Conversation Workspace",
          tagline: "Manage customer conversations across WhatsApp and Telegram in a single desktop interface.",
          badge: "Unified Chat",
          points: [
            "Single workspace to view and reply to WhatsApp and Telegram chats",
            "Flexible control to switch between automated replies and Human Mode",
            "Chat history stored securely in your computer's local database",
          ],
        },
        tikets: {
          title: "Kanban CRM Ticket Management",
          tagline: "Track and organize customer technical issues, demo requests, and service follow-ups.",
          badge: "CRM Tickets",
          points: [
            "Visual Kanban board with an option to toggle into structured table view",
            "Customizable categories, priority levels, and resolution deadlines",
            "Direct chat button to jump straight into the related customer conversation",
          ],
        },
        customer_agent: {
          title: "AI Customer Agent Configuration",
          tagline: "Configure automated assistance to answer customer inquiries based on your business guidelines.",
          badge: "AI Messaging",
          points: [
            "Customizable agent persona and official company knowledge base",
            "Automated tool execution for ticket logging, scheduling, and escalation",
            "Interactive live simulator playground to test responses before activating",
          ],
        },
        channels: {
          title: "Message Channel Connectivity",
          tagline: "Connect and monitor your business WhatsApp and Telegram accounts in one central hub.",
          badge: "Multi-Channel Hub",
          points: [
            "Convenient WhatsApp pairing via simple QR code scan",
            "Telegram integration using secure on-device session storage",
            "Real-time connection status monitoring for all linked channels",
          ],
        },
        scheduler: {
          title: "Broadcast & Message Scheduler",
          tagline: "Plan and schedule promotional broadcasts, appointment reminders, and follow-ups in advance.",
          badge: "Message Scheduler",
          points: [
            "Schedule broadcast messages across WhatsApp and Telegram recipients",
            "Flexible send timing for one-time blasts or recurring schedules",
            "Natural randomized delay intervals to ensure smooth and comfortable delivery",
          ],
        },
        templates: {
          title: "Quick Reply Message Templates",
          tagline: "Standardize frequent replies so your support team can respond to common questions faster.",
          badge: "Quick Replies",
          points: [
            "Dynamic placeholders for customer names and contact details",
            "Spintax word variation format for natural and varied message wording",
            "Quick copy and insert access directly while chatting with customers",
          ],
        },
        contacts: {
          title: "Customer Contact Directory",
          tagline: "Centralized customer contact list with category tags and communication channels.",
          badge: "Contact Book",
          points: [
            "Fast contact search by name, phone number, or assigned category tags",
            "Clear contact segmentation by WhatsApp or Telegram messaging channels",
            "Direct action button to start a new chat conversation immediately",
          ],
        },
        backup: {
          title: "Local Data Backup & Restore",
          tagline: "Manage full data backups independently with on-device file export and restore tools.",
          badge: "Local Storage",
          points: [
            "One-click export of chat records, tickets, and contacts to JSON files",
            "Effortless restore functionality when moving to a new computer",
            "Full control over your data with an on-demand database reset option",
          ],
        },
      },
    },

    // 6. Node Workflow Section
    integration: {
      tag: "Workflow Automation",
      title: "From Message Chat to Kanban Ticket",
      subtitle:
        "Customer requests a product demo → AI Customer Agent creates the Kanban ticket → Demo scheduled and confirmed in seconds.",
      node1_title: "Message Chat",
      node1_badge: "Inbound Chat",
      node2_title: "AI Customer Agent",
      node2_action: "AI executes automated ticket creation",
      node2_desc: "Detects demo request & registers to Kanban",
      node3_title: "Kanban Ticket Created",
      node3_badge: "Desktop Kanban Board",
      customer_label: "Customer",
      customer_msg:
          "Hi, we're interested in purchasing the AsKing Pro package for our team. Could we schedule a demo for tomorrow at 10 AM?",
      ai_reply:
        "Sure Mr. Abdullah. We have created your demo ticket (#TCK-1003) for tomorrow at 10:00 AM. Our team will be ready to assist you via Zoom meeting! 😊",
      ai_disclaimer:
        "AI responses are dynamic and may vary in each conversation.",
      ticket_id: "#TCK-1003",
      ticket_title: "Sales Team Live Onboarding Demo",
      ticket_category: "Support",
      ticket_priority: "Medium",
      ticket_date: "2026-08-25",
    },

    // 7. Testimonial
    testimonial: {
      quote:
        "\"Currently, data has become a high-value strategic asset vulnerable to diverse cyber threats and exploitation. Therefore, data privacy protection is a collective imperative demanding comprehensive mitigation to prevent breach incidents.\"",
      author: "Data Sovereignty & Security Imperative",
      role: "AsKing Local-First Privacy Standard",
    },

    // 8. Stats Banner
    stats: {
      stat1_value: "30%",
      stat1_title: "Third-Party Vendor Breaches",
      stat1_desc: "Global data breaches directly involving external cloud vendor access.",
      stat1_source: "Verizon DBIR 2025",

      stat2_value: "63%",
      stat2_title: "SaaS Cloud Data Exposure",
      stat2_desc: "Enterprises reporting sensitive customer data oversharing in SaaS tools.",
      stat2_source: "CSA State of SaaS Security 2025",

      stat3_value: "4x",
      stat3_title: "Supply-Chain Attack Surge",
      stat3_desc: "Increase in cyber attacks targeting third-party cloud ecosystems.",
      stat3_source: "IBM X-Force / IBM Think 2026",

      stat4_value: "$4.44M",
      stat4_title: "Average Data Breach Cost",
      stat4_desc: "Global average financial damage incurred per data breach incident.",
      stat4_source: "IBM Cost of a Data Breach 2025",
    },

    // 9. Pricing Section
    pricing: {
      tag: "Pricing & Plans",
      title: "Smart Investment for Maximum Team Productivity",
      subtitle:
        "All plans apply to 1 user account on 1 desktop device. Enjoy full data sovereignty without per-message fees.",
      billed_monthly: "/ month",
      custom_price: "Coming Soon",
      trial_badge: "15-Day Free Access",
      trial_title: "Free Trial",
      trial_price: "Rp 0",
      trial_period: "for 15 days",
      trial_desc:
        "Test and experience all core features of AsKing to streamline your customer workflows and automations.",
      trial_ai_quota_label: "50 AI Assistant Requests (Trial Quota)",
      trial_cta: "Start Free Trial",
      trial_features: [
        "1 Active WhatsApp Account",
        "Visual Kanban Board & Ticket Status Workflow",
        "Scheduled Broadcasts & Message Templates",
        "100% Local-First Architecture (Data On-Device)",
        "50 AI Assistant Requests / 15 Days (Limited Trial)",
        "Community & Documentation Support",
      ],

      pro_badge: "🌟 Most Popular",
      pro_discount_badge: "Flat Payment Limited Promo",
      pro_title: "Pro Business",
      pro_original_price: `Rp ${PRICING_CONFIG.proOriginalPrice}`,
      pro_price: `Rp ${PRICING_CONFIG.proPrice}`,
      pro_period: "/ month",
      pro_desc:
        "The complete, uncompromised solution for online stores, customer support teams, and active marketers.",
      pro_ai_quota_label: "1,000 AI Assistant & Agent Requests / Month",
      pro_cta: "Choose Pro Business",
      pro_features: [
        "1 Active WhatsApp Account + Telegram",
        "100% Local-First Database (0ms Latency)",
        "Visual Kanban Board & SLA Ticket Rules",
        "1,000 AI Assistant & Agent Requests / Month",
        "Autonomous 24/7 AI Customer Agent (Grounded Knowledge Base)",
        "Unlimited Scheduled Message Broadcasts",
        "Interactive Templates & Customer Tagging",
        "Regular Feature Updates & Standard Priority",
      ],

      advance_badge: "🚀 Coming Soon",
      advance_title: "Advance Business",
      advance_price: PRICING_CONFIG.advancePrice,
      advance_period: "Contact for Custom Setup",
      advance_desc:
        "Engineered for growing business teams and enterprises requiring advanced collaboration and internal integrations.",
      advance_ai_quota_label: "Custom Gemini Model & Custom API Key",
      advance_cta: "Join Waiting List",
      advance_features: [
        "All Pro Business Features Included",
        "Multi-user Team Collaboration (Coming Soon)",
        "Customise Kanban Workflow & Fields (Coming Soon)",
        "Internal Enterprise API Integration (Coming Soon)",
        "MCP Server for Internal AI Agent Integration (Coming Soon)",
        "Support Custom Gemini AI Models & Custom API Keys",
        "Company Onboarding & Direct Setup Support",
        "24/7 Dedicated Priority Support",
      ],
    },

    // 10. CTA & Download
    cta: {
      badge_verified: "Verified Desktop Application",
      title: "Experience the Power of AsKing Customer Manager",
      subtitle:
        "Accelerate customer support response times and protect your business data ownership starting today.",
      btn_download: "Download AsKing Desktop",
      btn_login: "Access Web Account",
      ms_store_desc: "Officially on Microsoft Store",
      status_ready: "Available",
      status_coming_soon: "Coming Soon",
      platforms_label: "Platform Support",
      platform_notice: "AsKing is currently available for Windows on Microsoft Store. macOS & Linux versions coming soon.",
      mac_btn: "macOS (Apple & Intel)",
      win_btn: "Windows (x64)",
      linux_btn: "Linux (AppImage/Deb)",
    },

    // 10. Footer
    footer: {
      description:
        "AsKing is a Local-First Customer Manager for Kanban ticket workflows, omnichannel messaging, and AI Customer Agent automation with 100% data ownership on your device.",
      section_product: "Product",
      section_features: "Features",
      section_legal: "Legal & Privacy",
      section_connect: "Connect",
      link_features: "Core Features",
      link_privacy: "Privacy Policy",
      link_terms: "Terms of Service",
      link_contact: "Contact Support",
      link_pricing: "Pricing Plans",
      copyright: "All Rights Reserved. AsKing Customer Manager.",
    },

    // 11. Auth Pages (Login & Signup)
    auth: {
      secure_badge: "🔐 Secure Member Access",
      login_title: "Welcome to AsKing",
      login_subtitle: "Sign in to sync your desktop app and manage your AsKing account.",
      signup_title: "Create your AsKing Account",
      signup_subtitle: "Start managing your customer workflows intelligently and securely with Local-First architecture.",
      email_label: "Email Address",
      email_placeholder: "name@company.com",
      password_label: "Password",
      password_placeholder: "••••••••",
      full_name_label: "Full Name",
      full_name_placeholder: "e.g. Ahmad Fadil",
      repeat_password_label: "Confirm Password",
      repeat_password_placeholder: "••••••••",
      btn_login: "Log In",
      btn_signup: "Create Account",
      logging_in: "Logging in...",
      creating_account: "Creating account...",
      no_account_text: "Don't have an account yet?",
      start_free_trial: "Start free trial",
      have_account_text: "Already have an account?",
      sign_in_link: "Sign in to your account",
      terms_agree_prefix: "By creating an account, you agree to our",
      terms_checkbox_prefix: "I have read and agree to",
      terms_checkbox_suffix: "of AsKing - Customer Manager.",
      terms_required_error: "You must agree to the Terms of Use and Privacy Policy before creating an account.",
      terms_link: "Terms of Use",
      and_word: "and",
      privacy_link: "Privacy Policy",
      email_verified_title: "Email Verified Successfully!",
      email_verified_desc: "Your email has been confirmed. Please enter your credentials below to log in.",
      verification_sent_title: "Verify your email",
      verification_sent_desc: "We sent an activation link to {email}. Please click the link in your email to activate your account.",
      next_steps_title: "Next steps:",
      next_step_1: "Check your inbox (or spam folder)",
      next_step_2: "Click on the confirmation button",
      next_step_3: "You will be redirected straight to your Profile",
      resend_email_btn: "Resend Confirmation Email",
      resend_cooldown: "Wait {seconds}s to resend",
      resend_success: "Verification email resent! Please check your inbox.",
      desktop_bridge_badge: "AsKing Desktop Authentication",
      desktop_bridge_title: "Connecting to AsKing Desktop App...",
      desktop_bridge_desc: "Please wait while we verify your credentials for desktop single sign-on.",
      desktop_bridge_success: "Authentication Dispatched",
      desktop_ready_title: "Ready on AsKing Desktop!",
      desktop_ready_desc: "Logged in as {user}. If your browser asks for permission, click \"Open AsKing\".",
      open_desktop_btn: "Open AsKing Desktop App",
      go_to_profile: "Go to Web Profile",
      login_required_badge: "Authentication Required",
      login_required_title: "Sign In to Continue",
      login_required_desc: "To connect your AsKing desktop application with your cloud account, please log in first.",
      login_with_email_btn: "Log In with Email",
      create_account_btn: "Create New Account",
      connection_failed_title: "Connection Failed",
      back_to_login: "Back to Login",
    },

    // 12. Profile Page
    profile: {
      workspace_badge: "AsKing Workspace",
      view_landing: "View Landing Page",
      sign_out: "Sign Out",
      verified_badge: "Verified Email",
      member_since: "Member since {date}",
      user_id: "ID",
      copied: "Copied!",
      explore_features: "Explore Features",
      personal_info_title: "Personal Profile",
      personal_info_desc: "Update your display name and contact identity",
      full_name_label: "Full Name",
      email_label: "Email Address",
      email_note: "Email address is verified.",
      save_changes: "Save Changes",
      saving: "Saving...",
      security_title: "Security & Password",
      security_desc: "Update your login password",
      new_password: "New Password",
      new_password_placeholder: "Minimum 6 characters",
      confirm_new_password: "Confirm New Password",
      confirm_password_placeholder: "Repeat new password",
      update_password: "Update Password",
      updating_password: "Updating...",
      loading_profile: "Loading your profile...",
      name_updated_success: "Name updated successfully!",
      password_updated_success: "Password changed successfully!",

      // Billing & Subscription
      billing_title: "Subscription & Plan Status",
      billing_desc: "Your active plan details, validity period, and AI request budget",
      plan_free_trial: "Free Trial (15 Days)",
      plan_pro_business: "Pro Business",
      plan_advance_business: "Advance Business",
      plan_status_active: "Active",
      plan_status_expired: "Expired",
      plan_started: "Activated On",
      plan_expires: "Expires On",
      plan_remaining_days: "{days} days left",
      plan_expired_badge: "Expired",
      plan_ai_budget: "AI Request Budget",
      plan_ai_budget_desc: "Maximum AI Assistant requests allocated for current cycle",
      upgrade_plan_btn: "Renewal",
      renew_plan_btn: "Renew Plan",

      // Upgrade Modal
      modal_upgrade_title: "Renewal",
      modal_upgrade_subtitle: "Unlock full AI automation, WhatsApp omnichannel, and unlimited workflows.",
      modal_select_plan: "1. Select Subscription Plan",
      modal_pro_title: "Pro Business",
      modal_pro_discount_badge: "Flat Payment Limited Promo",
      modal_pro_original_price: `Rp ${PRICING_CONFIG.proOriginalPrice}`,
      modal_pro_price: `Rp ${PRICING_CONFIG.proPrice}`,
      modal_pro_period: "/ month",
      modal_pro_feature_1: "All AsKing Desktop features on 1 Account",
      modal_pro_feature_2: "Autonomous AI Customer Agent & Chatbot",
      modal_pro_feature_3: "WhatsApp Integration & Visual Kanban Board",
      modal_advance_title: "Advance Business",
      modal_advance_price: PRICING_CONFIG.advancePrice,
      modal_payment_method: "2. Select Payment Method",
      modal_bca_title: "BCA Bank Transfer",
      modal_bca_acc_num: "Account Number",
      modal_bca_acc_name: "Account Holder",
      modal_bca_copy_btn: "Copy",
      modal_bca_copied: "Copied!",
      modal_bca_note: "Please verify that the account number (2631261801) and holder name (Ahmad Fadil) match exactly before transferring.",
      modal_qris_title: "Instant QRIS",
      modal_qris_coming_soon: "Coming Soon",
      modal_confirm_btn: "Confirm Payment via WhatsApp",
      modal_qr_title: "Scan QR Code for Confirmation",
      modal_qr_desc: "Scan the QR code below using your phone camera or WhatsApp to send payment proof directly to the AsKing Admin:",
      modal_open_wa_btn: "Open WhatsApp Directly",
      modal_close_btn: "Close",
    },
  },
};
