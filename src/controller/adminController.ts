import { NextFunction, Request, Response } from "express";
import { IProduct, MulterRequest } from "../interfaces/database";
import { Product } from "../model/product";
import { success, failure } from "../utils/commonResponse";
import { HTTP_STATUS } from "../utils/httpStatus";
import { Result, ValidationError, validationResult } from "express-validator";
import { promises as fsPromises } from "fs";
import path from "path";

class userController {
  async addProduct(req: MulterRequest, res: Response, next: NextFunction) {
    try {
      const validatorResult: Result<ValidationError> = validationResult(req);
      if (!req.file) {
        return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(
          failure({
            message: "Product Image is required.Only jpeg, jpg and png file is allowed!",
          })
        );
      }
      // console.log(validatorResult);
      if (!validatorResult.isEmpty()) {
        if (req.file) {
          await fsPromises.unlink(path.join(__dirname, "../files/products", req.file.filename));
          console.log({ error: "File was deleted due to other validation errors" });
        }
        // console.log(req.file);
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure({ message: "Invalid inputs", error: validatorResult.array() }));
      }
      const product: IProduct = new Product({
        name: req.body.name,
        price: parseInt(req.body.price),
        weight: req.body.weight,
        image: `\\${req.file.path}`,
        description: req.body.description,
        type: req.body.type,
      });
      await product.save((err, result) => {
        if (err) {
          console.log("Failed to add product");
          return res.status(HTTP_STATUS.OK).send(failure({ message: "Failed to add product" }));
        }
        console.log("Successfully added product");
        return res.status(HTTP_STATUS.OK).send(success({ message: "Successfully added product" }));
      });
    } catch (error) {
      console.log(error);
      // next(error);
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .send(failure({ message: "An unexpected error occured" }));
    }
  }

  async updateImage(req: MulterRequest, res: Response, next: NextFunction) {
    try {
      const validatorResult = validationResult(req);
      // if (!req.file) {
      //   return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(failure({ message: "Product Image is required.Only jpeg, jpg and png file is allowed!" }));
      // }
      console.log(req.body);
      console.log("Image format: ok");
      if (!validatorResult.isEmpty()) {
        if (req.file) {
          await fsPromises.unlink(path.join(__dirname, "../files/products", req.file.filename));
          console.log({ error: "File was deleted due to other validation errors" });
        }
        console.log("File removed for request containing other errors");
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure({ message: "Invalid inputs", error: validatorResult.array() }));
      }
      const product: IProduct | null = await Product.findById(req.body.productId).exec();
      if (product) {
        try {
          await fsPromises.unlink(path.join(__dirname, "..", product.image));
        } catch (error) {
          console.log("Product original image seems unavailable, unable to delete it.");
        }
        // \/home/snigdho611/Repositories/mern-superstore/backend/src
        product.image = `/${req.file.path}`;
        product.save();
        return res.status(HTTP_STATUS.OK).send(success({ message: "Updated image successully!" }));
      } else {
        await fsPromises.unlink(path.join(__dirname, "..", req.file.path));

        return res.status(HTTP_STATUS.OK).send(failure({ message: "Image update failed!" }));
      }
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }
}
const UserController = new userController();
export default UserController;
