import { body, param } from "express-validator";

const validator = {
    getPostById: [param("id").isNumeric().withMessage("Id must be a number")],
    createPost: [
        body("title")
            .notEmpty()
            .withMessage("Title was not provided")
            .bail()
            .isString()
            .withMessage("Title must be in string format")
            .bail()
            .isAlpha()
            .withMessage("Title must be in alphabetical characters only"),
        body("content")
            .notEmpty()
            .withMessage("Content was not provided")
            .bail()
            .isString()
            .withMessage("Content must be in string format"),
        body("user_id")
            .notEmpty()
            .withMessage("User ID was not provided")
            .bail()
            .isNumeric()
            .withMessage("User ID must be numberic"),
    ],
};

export default validator;
