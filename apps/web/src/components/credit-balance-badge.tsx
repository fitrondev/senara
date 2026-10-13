"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Coins } from "lucide-react";

import { trpc } from "@/utils/trpc";

export function CreditBalanceBadge() {
  const { isSignedIn, isLoaded } = useUser();
  const { data } = useQuery({
    ...trpc.invitation.getMyCredit.queryOptions(),
    enabled: isLoaded && !!isSignedIn,
    staleTime: 30_000,
  });

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const credits = data?.creditBalance ?? 0;
  const isReseller = data?.role === "RESELLER";

  return (
    <Link
      href="/dashboard/reseller"
      className="group flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 transition-all hover:border-amber-500/50 hover:bg-amber-500/20 dark:text-amber-300"
      title={`Saldo: ${credits} Kredit (1 Kredit = Rp 1.000)${isReseller ? " · Klik untuk top-up kredit reseller" : ""}`}
    >
      <Coins className="size-3.5 text-amber-500 transition-transform group-hover:rotate-12 group-hover:scale-110" />
      <span className="font-mono">{credits}</span>
      <span className="hidden text-[11px] font-medium opacity-85 sm:inline">
        Kredit
      </span>
    </Link>
  );
}

