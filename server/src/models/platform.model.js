import mongoose from "mongoose";

const { Schema } = mongoose;

const platformSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Platform = mongoose.model("Platform", platformSchema);

export default Platform;
