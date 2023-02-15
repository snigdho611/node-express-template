import express from "express";
const router = express.Router();
import UserController from "../controller/adminController";
import validator from "../middleware/validation";
import { checkAuth, isAdmin } from "../middleware/authenticate";
import { fileUploader } from "../middleware/files";

router.post(
  "/file",
  checkAuth,
  isAdmin,
  fileUploader.single("productImage"),
  validator.addProduct,
  UserController.addProduct
);

router.post("/get-users", checkAuth, isAdmin, validator.addProduct, UserController.getAll);

export default router;
