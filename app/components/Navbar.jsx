"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, User, LogOut } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function ClauseLogo({ className = "w-6 h-6" }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`relative flex items-center justify-center rounded-lg bg-[#12281F] text-[#B8F55C] ${className}`}>
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
      <span className="text-xl font-bold tracking-tight text-[#11231B]">Clause</span>
    </div>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [customersOpen, setCustomersOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
        setUser(currentUser);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (err) {
      console.error("Navbar auth sync error:", err);
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F8FAF7]/90 backdrop-blur-md border-b border-[#12281F]/5 transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center group">
          <ClauseLogo className="w-8 h-8 group-hover:scale-105 transition-transform" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-[#3D5247]">
          {/* Solutions Dropdown */}
          <div className="relative group">
            <button
              onClick={() => setSolutionsOpen(!solutionsOpen)}
              onMouseEnter={() => setSolutionsOpen(true)}
              className="flex items-center gap-1.5 hover:text-[#11231B] transition-colors py-2 cursor-pointer"
            >
              <span>Solutions</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${solutionsOpen ? "rotate-180" : ""}`} />
            </button>

            {solutionsOpen && (
              <div
                onMouseLeave={() => setSolutionsOpen(false)}
                className="absolute top-full left-0 mt-1 w-56 rounded-2xl bg-white p-3 shadow-xl border border-[#E3EBE4] animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <a href="/#features" className="block px-3 py-2 rounded-xl text-sm hover:bg-[#F2F7F3] text-[#11231B] font-medium transition-colors">
                  Contract Automation
                </a>
                <a href="/#features" className="block px-3 py-2 rounded-xl text-sm hover:bg-[#F2F7F3] text-[#11231B] font-medium transition-colors">
                  Workflow Analytics
                </a>
                <a href="/#integrations" className="block px-3 py-2 rounded-xl text-sm hover:bg-[#F2F7F3] text-[#11231B] font-medium transition-colors">
                  Integrations Hub
                </a>
              </div>
            )}
          </div>

          {/* Customers Dropdown */}
          <div className="relative group">
            <button
              onClick={() => setCustomersOpen(!customersOpen)}
              onMouseEnter={() => setCustomersOpen(true)}
              className="flex items-center gap-1.5 hover:text-[#11231B] transition-colors py-2 cursor-pointer"
            >
              <span>Customers</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${customersOpen ? "rotate-180" : ""}`} />
            </button>

            {customersOpen && (
              <div
                onMouseLeave={() => setCustomersOpen(false)}
                className="absolute top-full left-0 mt-1 w-56 rounded-2xl bg-white p-3 shadow-xl border border-[#E3EBE4] animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <a href="/#testimonials" className="block px-3 py-2 rounded-xl text-sm hover:bg-[#F2F7F3] text-[#11231B] font-medium transition-colors">
                  Enterprise Stories
                </a>
                <a href="/#testimonials" className="block px-3 py-2 rounded-xl text-sm hover:bg-[#F2F7F3] text-[#11231B] font-medium transition-colors">
                  Case Studies
                </a>
              </div>
            )}
          </div>

          {/* Pricing link */}
          <a href="/#pricing" className="hover:text-[#11231B] transition-colors py-2">
            Pricing
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Link
              href="/profile"
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#12281F] text-[#B8F55C] hover:bg-[#1C3B2E] text-xs font-bold transition-all shadow-xs border border-[#234235]"
            >
              <div className="w-5 h-5 rounded-full bg-[#B8F55C] text-[#12281F] flex items-center justify-center text-[10px] font-black">
                {(user.user_metadata?.full_name || user.email || "U").charAt(0).toUpperCase()}
              </div>
              <span className="max-w-[120px] truncate">
                {user.user_metadata?.full_name || "My Account"}
              </span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[15px] font-medium text-[#3D5247] hover:text-[#11231B] px-4 py-2 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-full bg-[#12281F] text-white shadow-sm hover:bg-[#1C3B2E] transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
              >
                Start Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#11231B] hover:bg-[#EAEFEA] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5EDE6] bg-white/95 backdrop-blur-lg px-6 py-6 space-y-4 shadow-xl">
          <a
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#11231B] py-2"
          >
            Solutions
          </a>
          <a
            href="/#testimonials"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#11231B] py-2"
          >
            Customers
          </a>
          <a
            href="/#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#11231B] py-2"
          >
            Pricing
          </a>
          <div className="pt-4 border-t border-[#E5EDE6] flex flex-col gap-3">
            {user ? (
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-[#12281F] text-[#B8F55C] text-sm font-bold shadow-md"
              >
                My Profile ({user.user_metadata?.full_name || user.email})
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-[#D5E0D6] text-sm font-semibold text-[#11231B]"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-[#12281F] text-white text-sm font-semibold shadow-md"
                >
                  Start Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
