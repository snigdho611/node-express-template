import express from "express";
import validator from "../middleware/validation";
const router = express.Router();
import PostController from "../controller/PostController";
import { isAdmin } from "../middleware/authenticate";
import { fileUploader } from "../middleware/files";

router.get("/all", PostController.getAll);
// router.get("/detail/:id", validator.getPostById, PostController.getUserById);
router.post(
    "/create",
    // isAdmin,
    validator.createPost,
    PostController.createUser
);
// router.post("/file", fileUploader.single("file"), PostController.uploadImage);

router.post("/test", (req, res) => {
    console.log(req.body);
});

export default router;
