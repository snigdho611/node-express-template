import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../interfaces/commmon";

import jwt, { JwtPayload } from "jsonwebtoken";
import { failure } from "../utils/commonResponse";
import { HTTP_STATUS } from "../utils/httpStatus";

export const checkAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.get("authorization")) {
    try {
      const authToken: string | undefined = req.get("authorization");
      if (!authToken) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure({ message: "Authorization token not found." }));
      }
      const token: string = authToken && authToken.split(" ")[1];
      console.log(token, process.env.JWT_SECRET_KEY);
      const decodedData: string | JwtPayload = jwt.verify(
        token as string,
        process.env.JWT_SECRET_KEY as string
      );
      req.user = {
        _id: (decodedData as JwtPayload)._id,
        firstName: (decodedData as JwtPayload).firstName,
        lastName: (decodedData as JwtPayload).lastName,
        email: (decodedData as JwtPayload).email,
        isAdmin: (decodedData as JwtPayload).isAdmin,
      };
      next();
    } catch (error: any) {
      console.log(error);
      return res.status(HTTP_STATUS.FORBIDDEN).send(failure({ message: error.message }));
    }
  } else {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .send(failure({ message: "Request is not authorized" }));
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(HTTP_STATUS.FORBIDDEN).send(failure({ message: "Access is restricted" }));
  }
};
