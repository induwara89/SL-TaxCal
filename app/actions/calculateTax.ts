"use server";

import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: "file:./prisma/dev.db",
});

const prisma = new PrismaClient({ adapter });

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

  // Sanitize inputs
  const basic = Math.max(0, Math.min(Number(basicSalary) || 0, 100_000_000));
  const allow = Math.max(0, Math.min(Number(allowances) || 0, 100_000_000));

  const grossSalary = basic + allow;

  // EPF calculation (8% of basic salary only)
  const employeeEPF = deductEPF ? Math.round(basic * 0.08 * 100) / 100 : 0;

  // Fetch tax slabs from database
  const slabs = await prisma.taxSlab.findMany({
    orderBy: { minIncome: "asc" },
  });

  // Progressive tax calculation
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