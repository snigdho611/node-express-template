import express from "express";
import validator from "../middleware/validation";
const router = express.Router();
import UserController from "../controller/userController";
import { isAdmin } from "../middleware/authenticate";
import { fileUploader } from "../middleware/files";

router.get("/get-users", UserController.getAll);
router.get("/get-users/:id", validator.getUserById, UserController.getUserById);
router.post("/create-user", validator.createUser, UserController.createUser)
router.post(
  "/file",
  isAdmin,
  fileUploader.single("file"),
  UserController.uploadImage
);


export default router;
