import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata = {
  title: "AsKing — Aplikasi Manajemen Pelanggan & Pesan dengan AI Customer Agent",
  description:
    "AsKing adalah Customer Manager modern untuk manajemen tiket Kanban, omnichannel messaging WhatsApp & Telegram, dan AI Customer Agent dengan privasi data 100% di perangkat Anda.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} font-sans scroll-smooth`}>
      <body className="bg-[#F8FAF7] text-[#11231B] antialiased selection:bg-[#B8F55C] selection:text-[#11281F]">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
