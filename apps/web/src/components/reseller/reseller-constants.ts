export interface CreditPackage {
  credits: number;
  name: string;
  totalPrice: number;
  pricePerCredit: number;
  discountBadge: string;
  recommendedFor: string;
  isPopular?: boolean;
}

export const CREDIT_COST_PER_INVITATION = 5; // 5 kredit per undangan
export const PRICE_PER_CREDIT = 1000; // 1 kredit = Rp 1.000

export const CREDIT_PACKAGES: readonly CreditPackage[] = [
  {
    credits: 5,
    name: "Trial (5 Kredit)",
    totalPrice: 5000,
    pricePerCredit: 1000,
    discountBadge: "1 Undangan",
    recommendedFor: "Uji coba 1 pesanan undangan pertama",
  },
  {
    credits: 25,
    name: "Starter (25 Kredit)",
    totalPrice: 25000,
    pricePerCredit: 1000,
    discountBadge: "5 Undangan",
    recommendedFor: "Freelancer & desainer pemula",
  },
  {
    credits: 50,
    name: "Pro (50 Kredit)",
    totalPrice: 50000,
    pricePerCredit: 1000,
    discountBadge: "10 Undangan",
    recommendedFor: "Vendor percetakan & WO lokal",
    isPopular: true,
  },
  {
    credits: 100,
    name: "Agency (100 Kredit)",
    totalPrice: 100000,
    pricePerCredit: 1000,
    discountBadge: "20 Undangan",
    recommendedFor: "Studio foto & agensi undangan",
  },
  {
    credits: 250,
    name: "Enterprise (250 Kredit)",
    totalPrice: 250000,
    pricePerCredit: 1000,
    discountBadge: "50 Undangan",
    recommendedFor: "Bisnis undangan skala besar",
  },
] as const;

export function resolveCostPerCredit(_monthlyVolume?: number): number {
  return PRICE_PER_CREDIT;
}

export function resolveCostPerInvitation(_monthlyVolume?: number): number {
  return CREDIT_COST_PER_INVITATION * PRICE_PER_CREDIT; // Rp 5.000
}
