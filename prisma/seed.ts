import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI!;

const TaxSlabSchema = new mongoose.Schema({
  minIncome: { type: Number, required: true },
  maxIncome: { type: Number, required: true },
  rate: { type: Number, required: true },
});

const TaxSlab = mongoose.models.TaxSlab || mongoose.model("TaxSlab", TaxSlabSchema);

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB!");

  await TaxSlab.deleteMany({});

  await TaxSlab.insertMany([
    { minIncome: 0,       maxIncome: 100000,    rate: 0  },
    { minIncome: 100000,  maxIncome: 141667,    rate: 6  },
    { minIncome: 141667,  maxIncome: 183333,    rate: 12 },
    { minIncome: 183333,  maxIncome: 225000,    rate: 18 },
    { minIncome: 225000,  maxIncome: 266667,    rate: 24 },
    { minIncome: 266667,  maxIncome: 308333,    rate: 30 },
    { minIncome: 308333,  maxIncome: 999999999, rate: 36 },
  ]);

  console.log("✅ Tax slabs seeded successfully!");
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});