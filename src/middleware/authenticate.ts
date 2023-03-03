import { NextFunction, Request, Response } from "express";
import { failure } from "../utils/commonResponse";
import { HTTP_STATUS } from "../utils/httpStatus";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.token) {
    next();
  } else {
    return res.status(HTTP_STATUS.FORBIDDEN).send(failure({ message: "Access is restricted" }));
  }
};
