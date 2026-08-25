/**
 * Centralized Pricing & Support Configuration
 * Values are dynamically sourced from environment variables with robust fallbacks.
 */

export const PRICING_CONFIG = {
  // Pro Business Plan
  proOriginalPrice: process.env.NEXT_PUBLIC_PRICE_PRO_ORIGINAL || "149.000",
  proPrice: process.env.NEXT_PUBLIC_PRICE_PRO || "74.500",
  proDiscountPercent: process.env.NEXT_PUBLIC_PRICE_PRO_DISCOUNT || "50",
  proRawAmount: Number(process.env.NEXT_PUBLIC_PRICE_PRO_RAW || 74500),

  // Advance Business Plan
  advancePrice: process.env.NEXT_PUBLIC_PRICE_ADVANCE || "Coming Soon",

  // Support Contacts
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "6287769005240",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@godiscus.com",
};

export default PRICING_CONFIG;
