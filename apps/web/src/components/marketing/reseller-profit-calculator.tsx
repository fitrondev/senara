"use client";

import { useState } from "react";
import { Calculator, Coins, TrendingUp } from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@senara/ui/components/card";
import { Label } from "@senara/ui/components/label";
import { Slider } from "@senara/ui/components/slider";

import { formatCurrency } from "@/lib/format";
import {
  CREDIT_PACKAGES,
  resolveCostPerCredit,
  resolveCostPerInvitation,
} from "@/components/reseller/reseller-constants";

export { CREDIT_PACKAGES, resolveCostPerCredit, resolveCostPerInvitation };

export function ResellerProfitCalculator() {
  const [sellingPrice, setSellingPrice] = useState<number>(175000);
  const [monthlySales, setMonthlySales] = useState<number>(15);

  const costPerInvitation = resolveCostPerInvitation();
  const totalRevenue = sellingPrice * monthlySales;
  const totalCost = costPerInvitation * monthlySales;
  const netProfit = Math.max(0, totalRevenue - totalCost);
  const profitMargin =
    totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  return (
    <Card className="overflow-hidden border-2 border-primary/20 shadow-lg">
      <CardHeader className="border-b bg-primary/5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Calculator className="size-5" />
            </div>
            <div>
              <CardTitle className="font-serif text-xl">
                Kalkulator Interaktif &ldquo;Hitung Untungmu&rdquo;
              </CardTitle>
              <p className="text-muted-foreground text-xs">
                Geser slider untuk mensimulasikan potensi penghasilan bulanan bisnis
                undangan Anda.
              </p>
            </div>
          </div>
          <Badge className="bg-emerald-600 text-white text-xs">
            Margin ~{profitMargin}%
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-8 p-6 lg:grid-cols-12">
        {/* Slider Input */}
        <div className="flex flex-col justify-center gap-6 lg:col-span-7">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="font-semibold text-foreground text-xs sm:text-sm">
                1. Harga Jual Anda ke Klien (per Undangan)
              </Label>
              <Badge variant="outline" className="font-bold font-mono text-primary text-sm">
                {formatCurrency(sellingPrice)}
              </Badge>
            </div>
            <Slider
              min={75000}
              max={500000}
              step={5000}
              value={[sellingPrice]}
              onValueChange={(val) => {
                const next = Array.isArray(val) ? val[0] : val;
                if (typeof next === "number") setSellingPrice(next);
              }}
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Rp 75.000</span>
              <span>Pasaran umum: Rp 150rb – Rp 250rb</span>
              <span>Rp 500.000</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="font-semibold text-foreground text-xs sm:text-sm">
                2. Jumlah Undangan Terbit per Bulan
              </Label>
              <Badge variant="outline" className="font-bold font-mono text-primary text-sm">
                {monthlySales} Undangan / bln
              </Badge>
            </div>
            <Slider
              min={1}
              max={60}
              step={1}
              value={[monthlySales]}
              onValueChange={(val) => {
                const next = Array.isArray(val) ? val[0] : val;
                if (typeof next === "number") setMonthlySales(next);
              }}
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>1 klien/bln</span>
              <span>Modal kredit: {formatCurrency(costPerInvitation)} (5 kredit) / undangan</span>
              <span>60 klien/bln</span>
            </div>
          </div>
        </div>

        {/* Kartu Hasil Perhitungan */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border bg-muted/30 p-5 lg:col-span-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Omzet Kotor Bulanan</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(totalRevenue)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Modal Kredit ({monthlySales} × {formatCurrency(costPerInvitation)})
              </span>
              <span className="font-medium text-muted-foreground">
                - {formatCurrency(totalCost)}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="flex items-center gap-1.5 text-emerald-700 text-xs dark:text-emerald-400">
              <TrendingUp className="size-4" />
              <span className="font-semibold">Estimasi Keuntungan Bersih / Bulan</span>
            </div>
            <p className="mt-1 font-serif font-bold text-2xl text-emerald-700 sm:text-3xl dark:text-emerald-300">
              {formatCurrency(netProfit)}
            </p>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
              <Coins className="size-3 text-amber-500" />
              <span>
                Untung bersih{" "}
                <strong>{formatCurrency(sellingPrice - costPerInvitation)}</strong> per
                1 klien!
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

