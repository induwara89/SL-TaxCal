import mongoose from "mongoose";

const TaxSlabSchema = new mongoose.Schema({
  minIncome: { type: Number, required: true },
  maxIncome: { type: Number, required: true },
  rate: { type: Number, required: true },
});

export const TaxSlab = mongoose.models.TaxSlab || mongoose.model("TaxSlab", TaxSlabSchema);