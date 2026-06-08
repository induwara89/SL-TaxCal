"use server";

import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { revalidatePath } from "next/cache";

const adapter = new PrismaBetterSqlite3({
  url: "file:./prisma/dev.db",
});

const prisma = new PrismaClient({ adapter });

export async function getSlabs() {
  return await prisma.taxSlab.findMany({
    orderBy: { minIncome: "asc" },
  });
}

export async function updateSlab(id: number, rate: number, minIncome: number, maxIncome: number) {
  await prisma.taxSlab.update({
    where: { id },
    data: { rate, minIncome, maxIncome },
  });
  revalidatePath("/admin");
}

export async function deleteSlab(id: number) {
  await prisma.taxSlab.delete({
    where: { id },
  });
  revalidatePath("/admin");
}

export async function addSlab(minIncome: number, maxIncome: number, rate: number) {
  await prisma.taxSlab.create({
    data: { minIncome, maxIncome, rate },
  });
  revalidatePath("/admin");
}