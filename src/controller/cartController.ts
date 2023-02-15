import { Request, NextFunction, Response } from "express";
import { AuthRequest } from "../interfaces/commmon";
import { ICart, ILogin, IProduct, IUser } from "interfaces/database";

import { Product } from "../model/product";
import { success, failure } from "../utils/commonResponse";
import { HTTP_STATUS } from "../utils/httpStatus";
import { Result, ValidationError, validationResult } from "express-validator";
import Cart from "../model/cart";
import { Login } from "../model/login";
import path from "path";
import ejs from "ejs";
import { promisify } from "util";
import sendMail from "../config/mail";
const ejsRenderFile = ejs.renderFile;

class cartController {
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      //
      const validatorResult: Result<ValidationError> = validationResult(req);
      if (!validatorResult.isEmpty()) {
        return res
          .status(HTTP_STATUS.NOT_ACCEPTABLE)
          .send(failure({ message: "Invalid inputs", error: validatorResult.array() }));
      }
      const cart = await Cart.findOne({ userId: req.body.userId })
        .populate({ path: "itemList.productId" })
        .select("itemList total -_id");
      console.log(cart);
      return res.status(HTTP_STATUS.OK).send(success({ message: "Got cart successfully.", data: cart }));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async addProductToCart(req: Request, res: Response, next: NextFunction) {
    try {
      const validatorResult: Result<ValidationError> = validationResult(req);
      if (!validatorResult.isEmpty()) {
        return res
          .status(HTTP_STATUS.NOT_ACCEPTABLE)
          .send(failure({ message: "Invalid inputs", error: validatorResult.array() }));
      }
      const cart: ICart | null = await Cart.findOne({ userId: req.body.userId })
        .populate({ path: "itemList.productId" })
        .exec();
      const product: IProduct | null = await Product.findOne({ _id: req.body.productId });

      if (!product) {
        console.log("Product does not exist");
        return res
          .status(HTTP_STATUS.NOT_ACCEPTABLE)
          .send(failure({ message: "Product does not exist" }));
      }

      if (cart) {
        console.log("Cart exists");
        let added = false;
        for (let i = 0; i < cart.itemList.length; i++) {
          if (cart.itemList[i].productId._id.toString() === req.body.productId) {
            cart.itemList[i].quantity = cart.itemList[i].quantity + 1;
            added = true;
          }
        }
        // console.log(item);
        if (!added) {
          cart.itemList.push({ productId: req.body.productId, quantity: 1 });
        }
        cart.save();
        console.log("Product has been added to cart");
        return res
          .status(HTTP_STATUS.OK)
          .send(success({ message: "Cart exists, product has been added to cart", data: cart }));
      } else {
        console.log("Cart does not exist");
        const newCart = new Cart({ userId: req.body.userId, itemList: [{ productId: req.body.productId, quantity: 1 }] });
        newCart.save();
        console.log(newCart);
        return res
          .status(HTTP_STATUS.OK)
          .send(success({ message: "Cart has been created, product has been added to cart", data: newCart }));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async removeProductFromCart(req: Request, res: Response, next: NextFunction) {
    try {
      const validatorResult: Result<ValidationError> = validationResult(req);
      if (!validatorResult.isEmpty()) {
        return res
          .status(HTTP_STATUS.NOT_ACCEPTABLE)
          .send(failure({ message: "Invalid inputs", error: validatorResult.array() }));
      }
      const cart: ICart | null = await Cart.findOne({ userId: req.body.userId })
        .populate({ path: "itemList.productId" })
        .exec();
      const product: IProduct | null = await Product.findOne({ _id: req.body.productId });

      if (!product) {
        console.log("Product does not exist");
        return res
          .status(HTTP_STATUS.NOT_ACCEPTABLE)
          .send(failure({ message: "Product does not exist" }));
      }

      if (cart) {
        console.log("Cart exists");
        let removed = false;
        for (let i = 0; i < cart.itemList.length; i++) {
          if (cart.itemList[i].productId._id.toString() === req.body.productId) {
            if (cart.itemList[i].quantity <= 1) {
              cart.itemList.splice(i, 1);
              removed = true;
            } else {
              cart.itemList[i].quantity = cart.itemList[i].quantity - 1;
              removed = true;
            }
          }
        }

        if (!removed) {
          console.log("Product does not exist in cart");
          return res
            .status(HTTP_STATUS.NOT_ACCEPTABLE)
            .send(failure({ message: "Product does not exist in cart" }));
        }
        console.log(cart);
        cart.save();
        return res
          .status(HTTP_STATUS.OK)
          .send(success({ message: "Product has been removed from cart", data: cart }));
      } else {
        console.log("Cart does not exist");
        return res
          .status(HTTP_STATUS.NOT_ACCEPTABLE)
          .send(failure({ message: "Cart does not exist" }));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // Needs Refactoring
  // Send email when customer is checking out
  async sendCheckoutEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const validatorResult: Result<ValidationError> = validationResult(req);
      if (!validatorResult.isEmpty()) {
        return res
          .status(HTTP_STATUS.NOT_ACCEPTABLE)
          .send(failure({ message: "Invalid inputs", error: validatorResult.array() }));
      }

      // const cart = await Cart.findOne({ userId: req.body.userId }).populate("userId").exec();
      const login: ILogin | null = await Login.findOne({ _id: req.body.userId }).populate("userId").exec();
      // if (cart) {
      if (login) {
        const htmlStr = await ejsRenderFile(path.join(__dirname, "..", "mails", "Checkout.ejs"), {
          name: `${(login.userId as IUser).firstName} ${(login.userId as IUser).lastName}`,
        });

        sendMail({
          from: "ABC Store <mail@abcstore.com>",
          to: login.email,
          subject: "Thank you for purchasing",
          html: htmlStr,
        });
        return res.status(HTTP_STATUS.OK).send(success({ message: "Successfully requested for email" }));
      } else {
        return res.status(HTTP_STATUS.NOT_ACCEPTABLE).send(failure({ message: "Failed to find user" }));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async deleteCart(req: Request, res: Response, next: NextFunction) {
    try {
      //
      // const u
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

const CartController = new cartController();
export default CartController;
