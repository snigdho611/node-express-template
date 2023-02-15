import { Request } from "express";
import { Document } from "mongoose";
import mongoose from "mongoose";

export interface IProduct extends Document {
    name: string;
    description: string;
    weight: string;
    type: string;
    image: string;
    price: number;
}

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    phone: string;
    address?: string;
    type: string;
    balance: number;
}

export interface ILogin extends Document {
    email: string;
    password: string;
    isAdmin?: boolean;
    isEmailVerified?: boolean;
    emailToken?: string | null;
    emailTokenExpire?: Date | null;
    passwordResetToken?: string | null;
    passwordResetExpire?: Date | null;
    userId: IUser | mongoose.Types.ObjectId;
}

export interface MulterRequest extends Request {
    file?: any;
}

export interface ICart extends Document {
    userId: IUser | mongoose.Types.ObjectId;
    itemList: {
        productId: IProduct | mongoose.Types.ObjectId;
        quantity: number;
    }[];
}

export interface ISale extends Document {
    customerId: IUser | mongoose.Types.ObjectId;
    products: {
        product: IProduct | mongoose.Types.ObjectId,
        quantity: number;
    }[];
    total: number;
    verified: boolean;
}