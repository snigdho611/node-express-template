import { Request } from "express";
import multer from "multer";
import path from "path";

const fileStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, callback: any) => {
    if (file) {
      if (
        req.originalUrl === "/users/file"
      ) {
        console.log("Uploading file...");
        callback(null, "server/files/");
      } else {
        callback("URL mismatch", null)
      }
    } else {
      callback("No file is found", null);
    }
  },
  filename: (req: Request, file: Express.Multer.File, callback: any) => {
    if (file) {
      callback(
        null,
        file.originalname.split(".")[0].replace(/\ /g, "") + "_" +
        Date.now() +
        path.extname(file.originalname)
      );
      return;
    } else {
      callback("No file is found", null);
    }
  },
});

const checkFile = (req: Request, file: Express.Multer.File, callback: any) => {
  if (file) {
    switch (file.mimetype) {
      case ("text/plain"): {
        callback(null, true);
        break;
      }
      default: {
        callback("File extension can only be in .txt", false);
      }
    }
  } else {
    callback("No file found", false);
  }
};

export const fileUploader = multer({
  storage: fileStorage,
  limits: { fieldSize: 1 },
  fileFilter: checkFile,
});
