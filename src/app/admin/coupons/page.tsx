export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { NewCouponButton, CouponRowActions } from "./CouponActions";
import type { Coupon } from "@/generated/prisma/client";

function couponState(coupon: Coupon) {
  if (!coupon.isActive)
    return { label: "Inactive", badge: "bg-neutral-100 text-neutral-500" };
  if (coupon.expiresAt && coupon.expiresAt < new Date())
    return { label: "Expired", badge: "bg-red-100 text-red-700" };
  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses)
    return { label: "Exhausted", badge: "bg-amber-100 text-amber-700" };
  return { label: "Active", badge: "bg-green-100 text-green-700" };
}

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">
            Coupons
          </h1>
          <p className="mt-1 text-neutral-500">
            Discount codes students can apply at checkout.
          </p>
        </div>
        <NewCouponButton />
      </div>

      <Card className="mt-8 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Code</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Discount</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Usage</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Expires</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Status</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => {
              const state = couponState(coupon);
              return (
                <tr
                  key={coupon.id}
                  className="border-b border-neutral-50 hover:bg-neutral-50"
                >
                  <td className="px-5 py-3">
                    <div className="font-mono text-sm font-semibold tracking-wide text-neutral-900">
                      {coupon.code}
                    </div>
                    {coupon.description && (
                      <div className="mt-0.5 max-w-56 truncate text-xs text-neutral-400">
                        {coupon.description}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-bold text-primary-700">
                      {coupon.discountPercent}% OFF
                    </span>
                  </td>
                  <td className="px-5 py-3 tabular-nums text-neutral-700">
                    {coupon.usedCount}
                    <span className="text-neutral-400">
                      {" "}
                      / {coupon.maxUses ?? "∞"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-neutral-500">
                    {coupon.expiresAt
                      ? coupon.expiresAt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Never"}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${state.badge}`}
                    >
                      {state.label}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <CouponRowActions coupon={coupon} />
                  </td>
                </tr>
              );
            })}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-neutral-400">
                  No coupons yet. Create your first one to run a discount
                  campaign.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  );
}
