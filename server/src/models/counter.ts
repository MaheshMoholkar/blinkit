import mongoose from "mongoose";

const couterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  sequence_value: { type: Number, default: 0 },
});

export const Counter = mongoose.model("Counter", couterSchema);
