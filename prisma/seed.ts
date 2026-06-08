import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: "file:./prisma/dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.taxSlab.deleteMany();

  await prisma.taxSlab.createMany({
    data: [
      { minIncome: 0,       maxIncome: 100000,    rate: 0  },
      { minIncome: 100000,  maxIncome: 141667,    rate: 6  },
      { minIncome: 141667,  maxIncome: 183333,    rate: 12 },
      { minIncome: 183333,  maxIncome: 225000,    rate: 18 },
      { minIncome: 225000,  maxIncome: 266667,    rate: 24 },
      { minIncome: 266667,  maxIncome: 308333,    rate: 30 },
      { minIncome: 308333,  maxIncome: 999999999, rate: 36 },
    ],
  });

  console.log("✅ Tax slabs seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });