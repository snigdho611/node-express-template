// const mongoose = require("mongoose");
import mongoose from "mongoose";
import { Product } from "./product";
import { User } from "./user";

const saleSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: User,
    },
    cart: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: Product,
        },
        quantity: Number,
        _id: false
    }],
    total: { type: Number },
    verified: { type: Boolean }
});

export const Sale = mongoose.model("Sale", saleSchema);