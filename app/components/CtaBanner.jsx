import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="py-16 bg-[#F8FAF7]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="rounded-3xl bg-[#142B21] border border-[#234235] px-8 py-12 sm:px-14 sm:py-16 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
          {/* Subtle glow background */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[350px] h-[250px] bg-[#B8F55C]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Title */}
          <div className="relative z-10 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Discover the full scale of <br className="hidden sm:inline" />
              <span className="relative inline-block px-0.5">
                <span className="relative z-10">Clause</span>
                <span className="absolute left-0 bottom-1 w-full h-2.5 bg-[#B8F55C] -z-0 rounded-xs opacity-90" />
              </span>{" "}
              capabilities
            </h2>
          </div>

          {/* Right Action Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
            <a
              href="/#pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-[#12281F] font-semibold text-sm shadow-xs hover:bg-[#F2F7F4] hover:shadow transition-all"
            >
              Contact Sales
            </a>
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#B8F55C] text-[#12281F] font-semibold text-sm shadow-xs hover:bg-[#A5E744] hover:shadow transition-all hover:scale-102"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
