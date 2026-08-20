import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata = {
  title: "Clause — One tool to manage contracts and your team",
  description: "Clause helps agile teams work faster, smarter, and more efficiently, delivering flexibility and data-driven insights to mitigate risk and ensure compliance.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} font-sans scroll-smooth`}>
      <body className="bg-[#F8FAF7] text-[#11231B] antialiased selection:bg-[#B8F55C] selection:text-[#11281F]">
        {children}
      </body>
    </html>
  );
}
