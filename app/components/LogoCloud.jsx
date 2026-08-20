export default function LogoCloud() {
  return (
    <section className="border-y border-[#E2ECE4] bg-white/60 py-8">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Label */}
          <div className="text-sm font-medium text-[#566B60] whitespace-nowrap text-center lg:text-left">
            <span className="font-semibold text-[#11231B]">More than 25k</span> companies trust Clause
          </div>

          {/* Logo List */}
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-8 sm:gap-12 md:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
            {/* HubSpot */}
            <div className="flex items-center gap-2 text-[#2D3E35] hover:text-[#FF7A59] transition-colors cursor-pointer group">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M18.8 7.3c-.9 0-1.7.5-2.1 1.2L12.3 6V4.1c.7-.4 1.2-1.1 1.2-2.1C13.5.9 12.6 0 11.5 0S9.5.9 9.5 2c0 1 .5 1.7 1.2 2.1V6L6.3 8.5C5.9 7.8 5.1 7.3 4.2 7.3 2.4 7.3 1 8.7 1 10.5s1.4 3.2 3.2 3.2c.9 0 1.7-.5 2.1-1.2l4.4 2.5v1.9c-.7.4-1.2 1.1-1.2 2.1 0 1.1.9 2 2 2s2-.9 2-2c0-1-.5-1.7-1.2-2.1v-1.9l4.4-2.5c.4.7 1.2 1.2 2.1 1.2 1.8 0 3.2-1.4 3.2-3.2s-1.4-3.2-3.2-3.2z" />
              </svg>
              <span className="font-bold text-lg tracking-tight">HubSpot</span>
            </div>

            {/* Dropbox */}
            <div className="flex items-center gap-2 text-[#2D3E35] hover:text-[#0061FF] transition-colors cursor-pointer group">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M6 2L0 6.5 6 11l6-4.5L6 2zm12 0l-6 4.5 6 4.5 6-4.5L18 2zM0 15.5l6 4.5 6-4.5-6-4.5-6 4.5zm18-4.5l-6 4.5 6 4.5 6-4.5-6-4.5zm-6 5.5l-6 4.5 6 4.5 6-4.5-6-4.5z" />
              </svg>
              <span className="font-bold text-lg tracking-tight">Dropbox</span>
            </div>

            {/* Square */}
            <div className="flex items-center gap-2 text-[#2D3E35] hover:text-black transition-colors cursor-pointer group">
              <div className="w-5 h-5 border-2 border-current rounded flex items-center justify-center p-0.5">
                <div className="w-2 h-2 bg-current rounded-xs" />
              </div>
              <span className="font-bold text-lg tracking-tight">Square</span>
            </div>

            {/* Instacart */}
            <div className="flex items-center gap-2 text-[#2D3E35] hover:text-[#43B02A] transition-colors cursor-pointer group">
              <svg className="w-6 h-6 fill-current text-[#43B02A]" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5l-3.5-3.5 1.41-1.41L13 13.67l5.09-5.09L19.5 10 13 16.5z" fill="none" />
                <path d="M16.5 7.5c-.83-.83-2.17-.83-3 0l-7.5 7.5c-.83.83-.83 2.17 0 3 .83.83 2.17.83 3 0l7.5-7.5c.83-.83.83-2.17 0-3z" />
              </svg>
              <span className="font-bold text-lg tracking-tight">instacart</span>
            </div>

            {/* Grammarly */}
            <div className="flex items-center gap-2 text-[#2D3E35] hover:text-[#15C39A] transition-colors cursor-pointer group">
              <svg className="w-6 h-6 fill-current text-[#15C39A]" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 21.6c-5.3 0-9.6-4.3-9.6-9.6S6.7 2.4 12 2.4s9.6 4.3 9.6 9.6-4.3 9.6-9.6 9.6zm4.8-10.8h-4.8v2.4h2.4c-.6 1.4-2 2.4-3.6 2.4-2.2 0-4-1.8-4-4s1.8-4 4-4c1.1 0 2.1.4 2.8 1.2l1.7-1.7C14.2 6.8 13.2 6.4 12 6.4c-3.1 0-5.6 2.5-5.6 5.6s2.5 5.6 5.6 5.6c3 0 5.5-2.3 5.6-5.3v-1.1z" />
              </svg>
              <span className="font-semibold text-lg tracking-tight">grammarly</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
