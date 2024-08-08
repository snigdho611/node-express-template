import { body, param } from "express-validator";

const validator = {
    getPostById: [param("id").isNumeric().withMessage("Id must be a number")],
    createPost: [
        body("title").optional().isString().withMessage("Title must be in string format"),
        body("content")
            .notEmpty()
            .withMessage("Content was not provided")
            .bail()
            .isString()
            .withMessage("Content must be in string format"),
        body("user_id")
            .optional()
            .not()
            .isString()
            .withMessage("User ID must not be in string format")
            .bail()
            .isNumeric()
            .withMessage("User ID must be a numeric value"),
    ],
};

export default validator;
