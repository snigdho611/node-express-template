import { body, param } from "express-validator";

const validator = {
  getAllUsers: [],
  getUserById: [param("id").isNumeric().withMessage("Id must be a number")],
  createUser: [
    body("firstName")
      .notEmpty()
      .withMessage("firstName was not provided")
      .isString()
      .withMessage("firstName must be in string format"),
    body("lastName")
      .notEmpty()
      .withMessage("lastName was not provided")
      .isString()
      .withMessage("lastName must be in string format"),
    body("phone")
      .notEmpty()
      .withMessage("phone was not provided")
      .isString()
      .withMessage("phone must be in string format"),
    body("address")
      .notEmpty()
      .withMessage("address was not provided")
      .isString()
      .withMessage("address must be in string format"),
    body("type")
      .notEmpty()
      .withMessage("type was not provided")
      .isString()
      .withMessage("type must be in string format"),
  ],
};

export default validator;
