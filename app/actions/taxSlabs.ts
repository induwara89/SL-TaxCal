"use server";

import { connectDB } from "@/lib/mongodb";
import { TaxSlab } from "@/lib/models/TaxSlab";
import { revalidatePath } from "next/cache";

export async function getSlabs() {
  await connectDB();
  const slabs = await TaxSlab.find().sort({ minIncome: 1 }).lean();
  return slabs.map((s: any) => ({
    id: s._id.toString(),
    minIncome: s.minIncome,
    maxIncome: s.maxIncome,
    rate: s.rate,
  }));
}

export async function updateSlab(id: string, rate: number, minIncome: number, maxIncome: number) {
  await connectDB();
  await TaxSlab.findByIdAndUpdate(id, { rate, minIncome, maxIncome });
  revalidatePath("/admin");
}

export async function deleteSlab(id: string) {
  await connectDB();
  await TaxSlab.findByIdAndDelete(id);
  revalidatePath("/admin");
}

export async function addSlab(minIncome: number, maxIncome: number, rate: number) {
  await connectDB();
  await TaxSlab.create({ minIncome, maxIncome, rate });
  revalidatePath("/admin");
}