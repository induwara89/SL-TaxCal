"use server";

import { connectDB } from "@/lib/mongodb";
import { TaxSlab } from "@/lib/models/TaxSlab";

console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);

export interface TaxResult {
  grossSalary: number;
  totalTax: number;
  employeeEPF: number;
  netSalary: number;
  effectiveTaxRate: number;
  tierBreakdown: {
    minIncome: number;
    maxIncome: number;
    rate: number;
    taxAmount: number;
  }[];
}

export async function calculateTax(
  basicSalary: number,
  allowances: number,
  deductEPF: boolean
): Promise<TaxResult> {
  const basic = Math.max(0, Math.min(Number(basicSalary) || 0, 100_000_000));
  const allow = Math.max(0, Math.min(Number(allowances) || 0, 100_000_000));

  const grossSalary = basic + allow;
  const employeeEPF = deductEPF ? Math.round(basic * 0.08 * 100) / 100 : 0;

  await connectDB();
  const slabs = await TaxSlab.find().sort({ minIncome: 1 });

  let totalTax = 0;
  let remaining = grossSalary;
  const tierBreakdown = [];

  for (const slab of slabs) {
    if (remaining <= 0) break;
    if (grossSalary <= slab.minIncome) break;

    const taxableInTier = Math.min(
      slab.maxIncome - slab.minIncome,
      remaining,
      grossSalary - slab.minIncome
    );

    const taxAmount = Math.round(taxableInTier * (slab.rate / 100) * 100) / 100;

    tierBreakdown.push({
      minIncome: slab.minIncome,
      maxIncome: slab.maxIncome,
      rate: slab.rate,
      taxAmount,
    });

    totalTax += taxAmount;
    remaining -= taxableInTier;
  }

  totalTax = Math.round(totalTax * 100) / 100;
  const netSalary = Math.round((grossSalary - totalTax - employeeEPF) * 100) / 100;
  const effectiveTaxRate = grossSalary > 0
    ? Math.round((totalTax / grossSalary) * 10000) / 100
    : 0;

  return {
    grossSalary,
    totalTax,
    employeeEPF,
    netSalary,
    effectiveTaxRate,
    tierBreakdown,
  };
}