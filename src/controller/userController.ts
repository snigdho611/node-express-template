import { Request, Response } from "express";
import { MulterRequest } from "../interfaces/database";
import { success, failure } from "../utils/commonResponse";
import { HTTP_STATUS } from "../utils/httpStatus";
import { Result, ValidationError, validationResult } from "express-validator";
import { promises as fsPromises } from "fs";
import path from "path";

class userController {
  async getAll(req: Request, res: Response) {
    try {
      console.log("Request for getting all users received");
      let users: any;
      await fsPromises
        .readFile(path.resolve("./server/data/users.json"), "utf-8")
        .then((data) => {
          users = JSON.parse(data);
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
            .send(failure({ message: "An unexpected error occured" }));
        });
      return res.send(success({ message: "Successfully got data", data: users }));
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .send(failure({ message: "An unexpected error occured" }));
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      console.log("Request for getting one user received");
      const validatorResult: Result<ValidationError> = validationResult(req);
      if (!validatorResult.isEmpty()) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(
            failure({ message: "An unexpected error occured", error: validatorResult.array() })
          );
      }
      let foundUser: any;
      await fsPromises.readFile("./server/data/users.json", "utf-8").then((result) => {
        const users = JSON.parse(result);
        users.map((element: any) => {
          if (element.id === parseInt(req.params.id)) {
            foundUser = element
          }
        })
      });
      if (foundUser) {
        return res.send(success({ message: "Successfully got user", data: foundUser }));
      }
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .send(failure({ message: "An unexpected error occured" }));
    } catch (error) {
      console.log(error)
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .send(failure({ message: "An unexpected error occured" }));
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const validatorResult = validationResult(req);
      if (!validatorResult.isEmpty()) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure({ message: "The request failed validations", error: validatorResult.array() }));
      }
      console.log(validatorResult)
    } catch (error) {

    }
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
