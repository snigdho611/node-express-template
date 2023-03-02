import { Request } from "express";
import multer from "multer";
import path from "path";

const fileStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, callback: any) => {
    if (file) {
      if (
        req.originalUrl === "/admin/products/update-image" ||
        req.originalUrl === "/admin/products/add"
      ) {
        console.log("Uploading file...");
        // callback(null, path.join(__dirname, '../files/products'));
        callback(null, "server/files/");
      }
    } else {
      callback("No file is found", null);
    }
  },
  filename: (req: Request, file: Express.Multer.File, callback: any) => {
    if (file) {
      callback(
        null,
        file.originalname.split(".")[0].replace(/\ /g, "") +
          Date.now() +
          path.extname(file.originalname)
      );
      return;
    } else {
      callback("No file is found", null);
    }
  },
});

const checkImage = (req: Request, file: Express.Multer.File, callback: any) => {
  if (file) {
    callback(null, true);
  } else {
    callback("No file found", false);
  }
};

export const fileUploader = multer({
  storage: fileStorage,
  limits: { fieldSize: 30000 },
  fileFilter: checkImage,
});
