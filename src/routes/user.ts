import express from "express";
import validator from "../middleware/validation";
const router = express.Router();
import UserController from "../controller/userController";
import { checkAuth, isAdmin } from "../middleware/authenticate";
import { fileUploader } from "../middleware/files";

router.post(
  "/file",
  // checkAuth,
  // isAdmin,
  fileUploader.single("file"),
  UserController.uploadImage
);

router.get("/get-users", UserController.getAll);
router.get("/get-user/:id", validator.getUserById, UserController.getUserById);

export default router;
