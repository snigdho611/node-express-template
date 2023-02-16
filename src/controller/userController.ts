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
  async getAll(req: Request, res: Response) {
    try {
      console.log("Request for getting all users received");
      return res.send(success({ message: "Successfully got data", data: usersJson }));
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .send(failure({ message: "An unexpected error occured" }));
    }
  }

  async getUserById(req: Request, res: Response) {
    //
    try {
      const validatorResult: Result<ValidationError> = validationResult(req);
      if (!validatorResult.isEmpty()) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(
            failure({ message: "An unexpected error occured", error: validatorResult.array() })
          );
      }
      // const users = fsPromises.readFile(usersJson);
      const result = usersJson.filter((user) => user.id === parseInt(req.params.id))[0];
      if (result) {
        return res.send(success({ message: "Successfully got data", data: result }));
      }
    } catch (error) {
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .send(failure({ message: "An unexpected error occured" }));
    }
    // if(validatorResult.isEmpty())
    // console.log(validatorResult);
  }

  async createUser(req: Request, res: Response) {
    //
  }

  async updateUserById(req: Request, res: Response) {
    //
  }

  async deleteUserById(req: Request, res: Response) {
    //
  }

  async uploadImage(req: MulterRequest, res: Response) {
    try {
      const validatorResult: Result<ValidationError> = validationResult(req);
      if (!req.file) {
        return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(
          failure({
            message: "Product Image is required.Only jpeg, jpg and png file is allowed!",
          })
        );
      }
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
}
const UserController = new userController();
export default UserController;
