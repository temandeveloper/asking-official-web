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

  // Pro+ Business one-time plan
  proPlusOriginalPrice: process.env.NEXT_PUBLIC_PRICE_PRO_PLUS_ORIGINAL || "2.990.000",
  proPlusPrice: process.env.NEXT_PUBLIC_PRICE_PRO_PLUS || "499.000",
  proPlusDiscountPercent: process.env.NEXT_PUBLIC_PRICE_PRO_PLUS_DISCOUNT || "83",
  proPlusRawAmount: Number(process.env.NEXT_PUBLIC_PRICE_PRO_PLUS_RAW || 499000),
  proPlusPromoLimit: process.env.NEXT_PUBLIC_PRICE_PRO_PLUS_PROMO_LIMIT || "50 orang pertama",

  // Legacy alias kept for profile/operator compatibility until entitlement migration.
  advancePrice: process.env.NEXT_PUBLIC_PRICE_ADVANCE || "Coming Soon",

  // Support Contacts
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "6287769005244",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "asking@godiscus.com",

  // AI Credit Top-Up Packages
  aiCreditPackages: [
    {
      id: "starter",
      nameId: "Paket Starter",
      nameEn: "Starter Pack",
      credits: 1000,
      price: "25.000",
      rawAmount: 25000,
      popular: false,
      badgeId: "Paling Terjangkau",
      badgeEn: "Most Affordable",
      descId: "Estimasi melayani ~800 s/d 1.200 chat customer",
      descEn: "Estimated to handle ~800 - 1,200 customer chats",
    },
    {
      id: "growth",
      nameId: "Paket Hemat",
      nameEn: "Growth Pack",
      credits: 2500,
      price: "50.000",
      rawAmount: 50000,
      popular: true,
      badgeId: "Paling Populer ⭐",
      badgeEn: "Most Popular ⭐",
      descId: "Estimasi melayani ~2.000 s/d 3.000 chat customer",
      descEn: "Estimated to handle ~2,000 - 3,000 customer chats",
    },
    {
      id: "pro",
      nameId: "Paket Bisnis",
      nameEn: "Business Pack",
      credits: 6000,
      price: "100.000",
      rawAmount: 100000,
      popular: false,
      badgeId: "Volume Tinggi",
      badgeEn: "High Volume",
      descId: "Estimasi melayani ~5.000 s/d 7.500 chat customer",
      descEn: "Estimated to handle ~5,000 - 7,500 customer chats",
    },
  ],
};

export default PRICING_CONFIG;
