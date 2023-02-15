import { NextFunction, Request, Response } from "express";
import { IProduct, MulterRequest } from "../interfaces/database";
import { success, failure } from "../utils/commonResponse";
import { HTTP_STATUS } from "../utils/httpStatus";
import { Result, ValidationError, validationResult } from "express-validator";
import { promises as fsPromises } from "fs";
import path from "path";
import { User } from "../model/user";
import mongoose from "mongoose";
import usersJson from "../../server/data/users.json";

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
    } catch (error) {
      console.log(error);
      // next(error);
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .send(failure({ message: "An unexpected error occured" }));
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Request for getting all users received");
      console.log(mongoose.connection.readyState);
      if (mongoose.connection.readyState === 0) {
        return res.send(success({ message: "Successfully got data", data: usersJson }));
      }
      const result = await User.find({});
      return res.send(success({ message: "Successfully got data", data: result }));
    } catch (error) {
      // console.log(error);
      console.log(error);
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .send(failure({ message: "An unexpected error occured" }));
    }
  }
}
const UserController = new userController();
export default UserController;
