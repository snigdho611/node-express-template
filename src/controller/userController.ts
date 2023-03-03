import { Request, Response } from "express";
import { success, failure } from "../utils/commonResponse";
import { HTTP_STATUS } from "../utils/httpStatus";
import { Result, ValidationError, validationResult } from "express-validator";
import { promises as fsPromises } from "fs";
import path from "path";
import { MulterRequest } from "src/interfaces/commmon";

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
      console.log("Request for creating one user received");
      const validatorResult: Result<ValidationError>  = validationResult(req);
      if (!validatorResult.isEmpty()) {
        return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(
          failure({
            message: "The request could not be validated",
            error: validatorResult.array()
          }));
      }
      await fsPromises.readFile("./server/data/users.json", "utf-8").then((result) => {
        const users = JSON.parse(result)
        const newUser = {
          id: users[users.length - 1].id + 1,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phone: req.body.phone,
          address: req.body.address,
          type: req.body.type,
        };
        users.push(newUser);
        fsPromises.writeFile("./server/data/users.json", JSON.stringify(users))
        return res
            .status(HTTP_STATUS.CREATED)
            .send(success({ message: "User added successfully", data: newUser }));
      }).catch((error) => {
        console.log(error);
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure({ message: "An unexpected error occured" }));
      });
    } catch (error) {
      console.log(error)
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .send(failure({ message: "An unexpected error occured" }));
    }
  }

  async uploadImage(req: MulterRequest, res: Response) {
    try {
      console.log("Request for uploading file was received")
      if (!req.file) {
        return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(
          failure({
            message: "Product Image is required.Only jpeg, jpg and png file is allowed!",
          })
        );
      }
      return res.status(HTTP_STATUS.ACCEPTED).send(success({ message: "File uploaded successfully", data: req.file}));
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .send(failure({ message: "An unexpected error occured" }));
    }
  }
}
const UserController = new userController();
export default UserController;
