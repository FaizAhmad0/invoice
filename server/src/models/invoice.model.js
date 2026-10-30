import mongoose from "mongoose";

const { Schema } = mongoose;

const invoiceSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    enrollmentId: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    amount: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    paymentId: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

invoiceSchema.index(
  { paymentId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      paymentId: { $type: "string" },
    },
  },
);

export default mongoose.model("Invoice", invoiceSchema);
