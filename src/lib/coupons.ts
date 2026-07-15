import type { Coupon } from "@/generated/prisma/client";

/** Why a coupon can't be used right now, or null if it's valid. */
export function couponProblem(coupon: Coupon): string | null {
  if (!coupon.isActive) return "This coupon is no longer active.";
  if (coupon.expiresAt && coupon.expiresAt < new Date())
    return "This coupon has expired.";
  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses)
    return "This coupon has reached its usage limit.";
  return null;
}

export function discountedPrice(price: number, discountPercent: number) {
  return Math.max(Math.round((price * (100 - discountPercent)) / 100), 0);
}

/** Students must pay at least half of the payable amount up front. */
export function minimumFirstPayment(payable: number) {
  return Math.ceil(payable / 2);
}

export function normalizeCouponCode(code: string) {
  return code.trim().toUpperCase();
}
