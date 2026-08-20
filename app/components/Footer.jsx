import { Mail, Phone } from "lucide-react";

export function ClauseFooterLogo({ className = "w-6 h-6" }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`relative flex items-center justify-center rounded-lg bg-[#18362B] text-[#B8F55C] ${className}`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      <span className="text-xl font-bold tracking-tight text-white">Clause</span>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#0A130E] text-[#8DA095] pt-16 pb-12 border-t border-[#16251D]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-[#18281F]">
          {/* Col 1: Brand & Contacts */}
          <div className="lg:col-span-2 space-y-4">
            <ClauseFooterLogo className="w-8 h-8" />
            <p className="text-sm text-[#7A9084] max-w-sm leading-relaxed pt-2">
              Next-generation contract lifecycle and team collaboration platform built for agile organizations.
            </p>
            <div className="space-y-2 pt-2 text-sm">
              <a
                href="mailto:support@clause.com"
                className="flex items-center gap-2.5 text-[#9CB0A4] hover:text-[#B8F55C] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#B8F55C]" />
                <span>support@clause.com</span>
              </a>
              <a
                href="tel:+15550000000"
                className="flex items-center gap-2.5 text-[#9CB0A4] hover:text-[#B8F55C] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#B8F55C]" />
                <span>+1 (555) 000-0000</span>
              </a>
            </div>
          </div>

          {/* Col 2: Solutions */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider mb-4">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Contract Management
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Collaboration
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-white transition-colors">
                  Security
                </a>
              </li>
              <li>
                <a href="#technology" className="hover:text-white transition-colors">
                  Technology
                </a>
              </li>
              <li>
                <a href="#workflows" className="hover:text-white transition-colors">
                  Workflows
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About us
                </a>
              </li>
              <li>
                <a href="#careers" className="hover:text-white transition-colors flex items-center gap-2">
                  <span>Careers</span>
                  <span className="text-[10px] bg-[#1A382C] text-[#B8F55C] px-1.5 py-0.5 rounded font-medium">
                    We&apos;re hiring
                  </span>
                </a>
              </li>
              <li>
                <a href="#legal" className="hover:text-white transition-colors">
                  Legal
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#press" className="hover:text-white transition-colors">
                  Press
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#docs" className="hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white transition-colors">
                  Privacy policy
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#667B70]">
          <div>
            © Copyright 2024 Clause Inc. All rights reserved.
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-5">
            {/* Twitter / X */}
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="text-[#8DA095] hover:text-[#B8F55C] transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-[#8DA095] hover:text-[#B8F55C] transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.45 1.45 0 0 0 1.45-1.45c0-.8-.66-1.46-1.45-1.46-.8 0-1.46.66-1.46 1.46 0 .8.66 1.45 1.46 1.45m1.39 9.74v-8.37H5.07v8.37h2.78z" />
              </svg>
            </a>

            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-[#8DA095] hover:text-[#B8F55C] transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* Dribbble */}
            <a href="https://dribbble.com" target="_blank" rel="noreferrer" aria-label="Dribbble" className="text-[#8DA095] hover:text-[#B8F55C] transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm10.198 10.844c-.391-.044-2.825-.308-5.59.395-.145-.333-.298-.671-.46-1.013 3.655-1.621 5.093-3.69 5.215-3.874.882 1.341 1.397 2.928 1.397 4.634 0 .341-.022.677-.062 1.008l-.5-.15zm-2.023-5.748c-.144.195-1.558 2.059-5.061 3.568-1.503-2.73-3.14-5.074-3.32-5.334 1.547-.843 3.329-1.33 5.223-1.33 1.157 0 2.26.236 3.265.666l-.107.43zm-10.231-2.651c.176.25 1.772 2.535 3.284 5.234-2.887 1.026-6.195 1.054-6.577 1.054-.038-.242-.057-.49-.057-.741 0-2.316.924-4.417 2.428-5.96l.922.413zm-7.144 7.643c.365 0 3.255-.021 6.071-.968.163.337.319.673.468 1.007-4.108 1.572-7.551 5.485-7.72 5.679-.446-1.464-.693-3.018-.693-4.628 0-.374.02-.743.058-1.107l1.816.017zm2.467 8.358c.177-.202 3.123-3.529 7.151-5.111 1.09 2.875 1.554 5.568 1.637 6.103-2.106 1.353-4.606 2.146-7.291 2.146-.531 0-1.051-.031-1.564-.09l.067-.048zm10.749 1.884c-.097-.577-.552-3.13-1.583-5.882 2.539-.738 4.773-.473 5.143-.424-.486 2.658-2.029 4.887-4.17 6.225l.61.081z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
