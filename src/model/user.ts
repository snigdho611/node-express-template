import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: false,
    default: null,
  },
  type: {
    type: String,
    required: true,
    default: "regular",
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
});

export const User = mongoose.model("User", userSchema);