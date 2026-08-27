/**
 * Centralized Pricing & Support Configuration
 * Values are dynamically sourced from environment variables with robust fallbacks.
 */

export const PRICING_CONFIG = {
  // Pro Business Plan (Anchoring: Rp 199.000 -> Diskon 60% -> Rp 79.000)
  proOriginalPrice: process.env.NEXT_PUBLIC_PRICE_PRO_ORIGINAL || "199.000",
  proPrice: process.env.NEXT_PUBLIC_PRICE_PRO || "79.000",
  proDiscountPercent: process.env.NEXT_PUBLIC_PRICE_PRO_DISCOUNT || "60",
  proRawAmount: Number(process.env.NEXT_PUBLIC_PRICE_PRO_RAW || 79000),
  proBasePrice: 199000,
  proDiscountAmount: 120000,

  // Advance Business Plan
  advancePrice: process.env.NEXT_PUBLIC_PRICE_ADVANCE || "Coming Soon",

  // Support Contacts
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "6287769005244",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "asking@godiscus.com",
};

export default PRICING_CONFIG;
