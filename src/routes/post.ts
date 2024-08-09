import express from "express";
import validator from "../middleware/validation";
const router = express.Router();
import PostController from "../controller/PostController";
// import { isAdmin } from "@middleware/authenticate";

router.get("/all", PostController.getAll);
router.get("/detail/:id", validator.getPostById, PostController.getById);
router.post(
    "/create",
    // isAdmin,
    validator.createPost,
    PostController.createUser
);
router.post("/file", PostController.uploadFile);

export default router;
