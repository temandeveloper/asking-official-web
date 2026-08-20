import { ArrowRight } from "lucide-react";

export default function IntegrationSection() {
  const row1Apps = [
    {
      name: "Slack",
      color: "#4A154B",
      svg: (
        <svg className="w-7 h-7" viewBox="0 0 24 24">
          <path fill="#E01E5A" d="M6 15a2 2 0 1 1-2-2h2v2zm1 0a2 2 0 1 1 2 2v-2H7z" />
          <path fill="#36C5F0" d="M9 6a2 2 0 1 1 2-2v2H9zm0 1a2 2 0 1 1-2 2H9V7z" />
          <path fill="#2EB67D" d="M18 9a2 2 0 1 1 2 2h-2V9zm-1 0a2 2 0 1 1-2-2v2h2z" />
          <path fill="#ECB22E" d="M15 18a2 2 0 1 1-2 2v-2h2zm0-1a2 2 0 1 1 2-2h-2v2z" />
        </svg>
      ),
    },
    {
      name: "Notion",
      color: "#000000",
      svg: (
        <svg className="w-7 h-7 fill-black" viewBox="0 0 24 24">
          <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l11.459-.838c1.12-.093 1.306-.56.84-1.12L17.75.986C17.19.427 16.444.148 15.417.241L3.34 1.173C2.314 1.266 1.847 1.826 2.314 2.48l2.145 1.728zm.933 3.636v13.61c0 .932.467 1.305 1.493 1.212l13.14-.932c1.026-.093 1.306-.746 1.306-1.585V6.726c0-.84-.373-1.212-1.213-1.12L5.859 6.726c-.933.093-1.399.56-1.399 1.118h-.068zm11.745.839v10.533c0 .56-.28.746-.84.746h-.373l-5.69-8.483v8.017c0 .56-.373.746-.933.746h-1.026c-.56 0-.84-.28-.84-.746V8.956c0-.56.28-.746.84-.746h.373l5.69 8.39V8.682c0-.56.373-.746.933-.746h1.026c.56 0 .84.186.84.746z" />
        </svg>
      ),
    },
    {
      name: "Trello",
      color: "#0079BF",
      svg: (
        <svg className="w-7 h-7" viewBox="0 0 24 24">
          <rect width="24" height="24" rx="4" fill="#0079BF" />
          <rect x="4" y="4" width="6" height="12" rx="1.5" fill="#FFFFFF" />
          <rect x="14" y="4" width="6" height="8" rx="1.5" fill="#FFFFFF" />
        </svg>
      ),
    },
    {
      name: "PayPal",
      color: "#003087",
      svg: (
        <svg className="w-7 h-7" viewBox="0 0 24 24">
          <path fill="#003087" d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.39 5.468 0 5.986 0h7.46c2.57 0 4.578.543 5.676 1.815 1.01 1.17 1.34 2.82.932 4.675-.72 3.28-3.056 5.56-6.143 5.98-.316.043-.639.066-.967.066H9.863l-1.47 9.334a.641.641 0 0 1-.633.533h-.684z" />
          <path fill="#0079C1" d="M8.747 14.544l1.378-8.75a.641.641 0 0 1 .633-.533h4.637c2.142 0 3.815.452 4.73 1.512.842.975 1.117 2.35.777 3.896-.6 2.733-2.547 4.633-5.12 4.983-.263.036-.532.055-.806.055H10.06l-1.313 8.337z" />
        </svg>
      ),
    },
    {
      name: "Asana",
      color: "#F06A6A",
      svg: (
        <svg className="w-7 h-7" viewBox="0 0 24 24">
          <circle cx="12" cy="7.5" r="4.5" fill="#F06A6A" />
          <circle cx="6" cy="16.5" r="4.5" fill="#F06A6A" />
          <circle cx="18" cy="16.5" r="4.5" fill="#F06A6A" />
        </svg>
      ),
    },
    {
      name: "Google",
      color: "#4285F4",
      svg: (
        <svg className="w-7 h-7" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      ),
    },
    {
      name: "Basecamp",
      color: "#21B35C",
      svg: (
        <svg className="w-7 h-7" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="11" fill="#21B35C" />
          <path d="M12 6l-6 10h12L12 6z" fill="#FFFFFF" />
        </svg>
      ),
    },
    {
      name: "Cloudflare",
      color: "#F38020",
      svg: (
        <svg className="w-7 h-7" viewBox="0 0 24 24">
          <path fill="#F38020" d="M18.2 13.5c-.3-2.1-2.1-3.7-4.3-3.7-.8 0-1.5.2-2.1.6-.6-1.7-2.2-2.9-4.1-2.9-2.4 0-4.3 1.9-4.4 4.3-.8.2-1.4.9-1.4 1.8 0 1 .8 1.9 1.9 1.9h14.1c1.1 0 2-.9 2-2 0-.9-.7-1.7-1.7-1.9z" />
        </svg>
      ),
    },
  ];

  const row2Apps = [
    {
      name: "HubSpot",
      color: "#FF7A59",
      svg: (
        <svg className="w-7 h-7 fill-[#FF7A59]" viewBox="0 0 24 24">
          <path d="M18.8 7.3c-.9 0-1.7.5-2.1 1.2L12.3 6V4.1c.7-.4 1.2-1.1 1.2-2.1C13.5.9 12.6 0 11.5 0S9.5.9 9.5 2c0 1 .5 1.7 1.2 2.1V6L6.3 8.5C5.9 7.8 5.1 7.3 4.2 7.3 2.4 7.3 1 8.7 1 10.5s1.4 3.2 3.2 3.2c.9 0 1.7-.5 2.1-1.2l4.4 2.5v1.9c-.7.4-1.2 1.1-1.2 2.1 0 1.1.9 2 2 2s2-.9 2-2c0-1-.5-1.7-1.2-2.1v-1.9l4.4-2.5c.4.7 1.2 1.2 2.1 1.2 1.8 0 3.2-1.4 3.2-3.2s-1.4-3.2-3.2-3.2z" />
        </svg>
      ),
    },
    {
      name: "Linear",
      color: "#5E6AD2",
      svg: (
        <svg className="w-7 h-7 fill-[#5E6AD2]" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
        </svg>
      ),
    },
    {
      name: "Zapier",
      color: "#FF4A00",
      svg: (
        <svg className="w-7 h-7 fill-[#FF4A00]" viewBox="0 0 24 24">
          <path d="M13.5 0h-3v8.5H2v3h8.5V20h3v-8.5H22v-3h-8.5V0z" transform="rotate(45 12 12)" />
        </svg>
      ),
    },
    {
      name: "Zoom",
      color: "#2D8CFF",
      svg: (
        <svg className="w-7 h-7" viewBox="0 0 24 24">
          <rect width="24" height="24" rx="5" fill="#2D8CFF" />
          <path d="M5 8.5A1.5 1.5 0 0 1 6.5 7h7A1.5 1.5 0 0 1 15 8.5v7a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 5 15.5v-7zm11 1.88l3-2.14v7.52l-3-2.14v-3.24z" fill="#FFFFFF" />
        </svg>
      ),
    },
    {
      name: "Monday",
      color: "#FF3D57",
      svg: (
        <svg className="w-7 h-7" viewBox="0 0 24 24">
          <circle cx="6" cy="15" r="3" fill="#FFCC00" />
          <path d="M10 18a3 3 0 0 1 3-3h1a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3h-1a3 3 0 0 1-3-3v0z" fill="#FF3D57" />
          <path d="M16 12a3 3 0 0 1 3-3h1a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3h-1a3 3 0 0 1-3-3v0z" fill="#00CA72" />
        </svg>
      ),
    },
    {
      name: "Loom",
      color: "#625DF5",
      svg: (
        <svg className="w-7 h-7 fill-[#625DF5]" viewBox="0 0 24 24">
          <path d="M12 0a12 12 0 1 0 12 12A12 12 0 0 0 12 0zm0 18a6 6 0 1 1 6-6 6 6 0 0 1-6 6z" />
        </svg>
      ),
    },
    {
      name: "Shopify",
      color: "#96BF48",
      svg: (
        <svg className="w-7 h-7 fill-[#96BF48]" viewBox="0 0 24 24">
          <path d="M19.8 6.5l-3.2-1-3.6-3.8c-.3-.3-.8-.3-1.1 0L8.3 5.5l-3.2 1c-.5.2-.8.7-.7 1.2l2.4 13.8c.1.5.5.9 1 .9h8.4c.5 0 .9-.4 1-.9l2.4-13.8c.1-.5-.2-1-.6-1.2z" />
        </svg>
      ),
    },
    {
      name: "Figma",
      color: "#F24E1E",
      svg: (
        <svg className="w-7 h-7" viewBox="0 0 24 24">
          <path fill="#F24E1E" d="M8 2h4v5H8a2.5 2.5 0 0 1 0-5z" />
          <path fill="#FF7262" d="M12 2h4a2.5 2.5 0 0 1 0 5h-4V2z" />
          <path fill="#A259FF" d="M8 7h4v5H8a2.5 2.5 0 0 1 0-5z" />
          <path fill="#1ABCFE" d="M12 7h4a2.5 2.5 0 0 1 0 5h-4V7z" />
          <path fill="#0ACF83" d="M8 12h4v2.5a2.5 2.5 0 1 1-5 0A2.5 2.5 0 0 1 8 12z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="integrations" className="py-20 bg-[#F8FAF7]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="relative rounded-3xl bg-[#142B21] dark-grid px-6 py-16 sm:px-12 sm:py-20 overflow-hidden shadow-2xl border border-[#234235]">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#B8F55C]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header Content */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-white mb-6 backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-[#B8F55C]" />
              <span>Seamless integration</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
              Don&apos;t replace. Integrate.
            </h2>

            <p className="text-sm sm:text-base text-[#B0C4B8] leading-relaxed mb-6 max-w-lg">
              The integrations you know and love effortlessly connect to Clause for a more streamlined, comprehensive approach to contract workflows.
            </p>

            <a
              href="#all-integrations"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B8F55C] hover:text-white transition-colors group underline underline-offset-4"
            >
              <span>Explore integrations</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* App Logo Cards (2 Rows) */}
          <div className="relative z-10 space-y-4 max-w-4xl mx-auto">
            {/* Row 1 */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
              {row1Apps.map((app) => (
                <div
                  key={app.name}
                  title={app.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/95 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/40 hover:scale-110 hover:bg-white hover:shadow-xl transition-all duration-200 cursor-pointer"
                >
                  {app.svg}
                </div>
              ))}
            </div>

            {/* Row 2 */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
              {row2Apps.map((app) => (
                <div
                  key={app.name}
                  title={app.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/95 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/40 hover:scale-110 hover:bg-white hover:shadow-xl transition-all duration-200 cursor-pointer"
                >
                  {app.svg}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
