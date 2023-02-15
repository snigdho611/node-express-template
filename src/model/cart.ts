// const mongoose = require("mongoose");
import mongoose from "mongoose";
import { Product } from "./product";

const itemEntry = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: Product,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  itemList: [itemEntry],
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
